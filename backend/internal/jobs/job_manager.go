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
	"github.com/fileprocessor/backend/internal/processors/pdf"
	"github.com/fileprocessor/backend/internal/storage"
	"github.com/google/uuid"
)

type JobManager struct {
	cfg            *config.Config
	storage        *storage.StorageManager
	pdfProc        *pdf.PDFProcessor
	imageProc      *image.ImageProcessor
	mu             sync.RWMutex
	jobs           map[string]*models.Job
	pdfJobQueue    chan string
	imageJobQueue  chan string
}

func NewJobManager(cfg *config.Config, sm *storage.StorageManager) *JobManager {
	jm := &JobManager{
		cfg:           cfg,
		storage:       sm,
		pdfProc:       pdf.NewPDFProcessor(sm),
		imageProc:     image.NewImageProcessor(sm),
		jobs:          make(map[string]*models.Job),
		pdfJobQueue:   make(chan string, 500),
		imageJobQueue: make(chan string, 500),
	}

	jm.startWorkers()
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

	// Route job to appropriate queue
	category := getToolCategory(toolID)
	if category == models.CategoryPDF {
		jm.pdfJobQueue <- jobID
	} else {
		jm.imageJobQueue <- jobID
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
}

func (jm *JobManager) workerLoop(workerID int, category models.ToolCategory, queue chan string) {
	for jobID := range queue {
		jm.processJob(workerID, category, jobID)
	}
}

func (jm *JobManager) processJob(workerID int, category models.ToolCategory, jobID string) {
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

	if category == models.CategoryPDF {
		output, err = jm.pdfProc.Process(ctx, job)
	} else {
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

func getToolCategory(toolID string) models.ToolCategory {
	switch toolID {
	case "compress-pdf", "target-size-pdf", "merge-pdf", "split-pdf", "rotate-pdf",
		"pdf-to-jpg", "protect-pdf", "remove-pdf-metadata", "extract-pdf-pages", "delete-pdf-pages":
		return models.CategoryPDF
	default:
		return models.CategoryImage
	}
}
