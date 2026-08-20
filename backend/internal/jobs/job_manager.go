package jobs

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/fileprocessor/backend/internal/config"
	"github.com/fileprocessor/backend/internal/models"
	"github.com/fileprocessor/backend/internal/processors/image"
	"github.com/fileprocessor/backend/internal/processors/media"
	"github.com/fileprocessor/backend/internal/processors/pdf"
	"github.com/fileprocessor/backend/internal/storage"
	"github.com/google/uuid"
)

type JobManager struct {
	cfg            *config.Config
	storage        *storage.StorageManager
	pdfProc        *pdf.PDFProcessor
	imageProc      *image.ImageProcessor
	mediaProc      *media.MediaProcessor
	mu             sync.RWMutex
	jobs           map[string]*models.Job
	pdfJobQueue    chan string
	imageJobQueue  chan string
	mediaJobQueue  chan string
	concurrency    chan struct{}
}

func NewJobManager(cfg *config.Config, sm *storage.StorageManager) *JobManager {
	maxConc := cfg.MaxConcurrentJobs
	if maxConc < 1 {
		maxConc = 1
	}
	jm := &JobManager{
		cfg:           cfg,
		storage:       sm,
		pdfProc:       pdf.NewPDFProcessor(sm),
		imageProc:     image.NewImageProcessor(sm),
		mediaProc:     media.NewMediaProcessor(sm),
		jobs:          make(map[string]*models.Job),
		pdfJobQueue:   make(chan string, 500),
		imageJobQueue: make(chan string, 500),
		mediaJobQueue: make(chan string, 500),
		concurrency:   make(chan struct{}, maxConc),
	}

	jm.startWorkers()
	jm.startJobGC()
	return jm
}

func (jm *JobManager) CreateJob(toolID string, files []models.FileMetadata, options models.JobOptions) (*models.Job, error) {
	jobID := uuid.New().String()

	var totalOriginal int64 = 0
	for _, f := range files {
		totalOriginal += f.SizeBytes
	}

	job := &models.Job{
		ID:           jobID,
		ToolID:       toolID,
		Status:       models.StatusPending,
		InputFiles:   files,
		Options:      options,
		Progress:     0,
		OriginalSize: totalOriginal,
		CreatedAt:    time.Now(),
	}

	jm.mu.Lock()
	jm.jobs[jobID] = job
	jm.mu.Unlock()

	category := getToolCategory(toolID)
	var queue chan string
	switch category {
	case models.CategoryPDF:
		queue = jm.pdfJobQueue
	case models.CategoryMedia:
		queue = jm.mediaJobQueue
	default:
		queue = jm.imageJobQueue
	}

	select {
	case queue <- jobID:
	default:
		jm.mu.Lock()
		delete(jm.jobs, jobID)
		jm.mu.Unlock()
		return nil, fmt.Errorf("processing queue is full, try again shortly")
	}

	return job, nil
}

func (jm *JobManager) GetJob(jobID string) (*models.Job, bool) {
	jm.mu.RLock()
	defer jm.mu.RUnlock()
	job, exists := jm.jobs[jobID]
	return job, exists
}

func (jm *JobManager) startWorkers() {
	// Start PDF Worker Pool
	for i := 0; i < jm.cfg.PDFWorkers; i++ {
		go jm.workerLoop(i, models.CategoryPDF, jm.pdfJobQueue)
	}

	// Start Image Worker Pool
	for i := 0; i < jm.cfg.ImageWorkers; i++ {
		go jm.workerLoop(i, models.CategoryImage, jm.imageJobQueue)
	}

	// Start Media Worker Pool
	for i := 0; i < jm.cfg.MediaWorkers; i++ {
		go jm.workerLoop(i, models.CategoryMedia, jm.mediaJobQueue)
	}
}

func (jm *JobManager) workerLoop(workerID int, category models.ToolCategory, queue chan string) {
	for jobID := range queue {
		jm.processJob(workerID, category, jobID)
	}
}

func (jm *JobManager) processJob(workerID int, category models.ToolCategory, jobID string) {
	jm.concurrency <- struct{}{}
	defer func() { <-jm.concurrency }()

	jm.mu.Lock()
	job, exists := jm.jobs[jobID]
	if !exists {
		jm.mu.Unlock()
		return
	}
	job.Status = models.StatusProcessing
	job.Progress = 20
	jm.mu.Unlock()

	startTime := time.Now()

	// 5-minute maximum timeout per processing job
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	var output *models.FileMetadata
	var err error

	switch category {
	case models.CategoryPDF:
		output, err = jm.pdfProc.Process(ctx, job)
	case models.CategoryMedia:
		output, err = jm.mediaProc.Process(ctx, job)
	default:
		output, err = jm.imageProc.Process(ctx, job)
	}

	duration := time.Since(startTime)

	jm.mu.Lock()
	defer jm.mu.Unlock()

	completedAt := time.Now()
	job.CompletedAt = &completedAt

	if err != nil {
		job.Status = models.StatusFailed
		job.Error = &models.JobError{
			Code:    "PROCESSING_FAILED",
			Message: fmt.Sprintf("Processing failed: %v", err),
		}
		log.Printf("[Worker %d] Job %s (%s) FAILED after %v: %v", workerID, jobID, job.ToolID, duration, err)
		return
	}

	job.Status = models.StatusCompleted
	job.Progress = 100
	job.OutputFile = output
	job.ProcessedSize = output.SizeBytes

	if job.OriginalSize > 0 {
		saved := float64(job.OriginalSize - job.ProcessedSize)
		job.SavingsPct = (saved / float64(job.OriginalSize)) * 100
		if job.SavingsPct < 0 {
			job.SavingsPct = 0
		}
	}

	log.Printf("[Worker %d] Job %s (%s) COMPLETED in %v | Orig: %d B, Processed: %d B (Saved %.1f%%)",
		workerID, jobID, job.ToolID, duration, job.OriginalSize, job.ProcessedSize, job.SavingsPct)
}

func (jm *JobManager) startJobGC() {
	go func() {
		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()
		retention := time.Duration(jm.cfg.FileRetentionMins) * time.Minute
		if retention <= 0 {
			retention = time.Hour
		}
		for range ticker.C {
			cutoff := time.Now().Add(-retention)
			jm.mu.Lock()
			for id, job := range jm.jobs {
				if job.CreatedAt.Before(cutoff) {
					delete(jm.jobs, id)
				}
			}
			jm.mu.Unlock()
		}
	}()
}

func IsKnownTool(toolID string) bool {
	switch toolID {
	case "compress-pdf", "target-size-pdf", "merge-pdf", "split-pdf", "rotate-pdf",
		"pdf-to-jpg", "protect-pdf", "remove-pdf-metadata", "extract-pdf-pages", "delete-pdf-pages",
		"compress-image", "target-size-image", "resize-image", "crop-image", "convert-image",
		"remove-image-metadata", "image-to-pdf",
		"video-to-audio", "extract-audio":
		return true
	default:
		return false
	}
}

func getToolCategory(toolID string) models.ToolCategory {
	switch toolID {
	case "compress-pdf", "target-size-pdf", "merge-pdf", "split-pdf", "rotate-pdf",
		"pdf-to-jpg", "protect-pdf", "remove-pdf-metadata", "extract-pdf-pages", "delete-pdf-pages":
		return models.CategoryPDF
	case "video-to-audio", "extract-audio":
		return models.CategoryMedia
	default:
		return models.CategoryImage
	}
}
