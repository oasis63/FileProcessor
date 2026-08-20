package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/fileprocessor/backend/internal/config"
	"github.com/fileprocessor/backend/internal/jobs"
	"github.com/fileprocessor/backend/internal/models"
	"github.com/fileprocessor/backend/internal/security"
	"github.com/fileprocessor/backend/internal/storage"
	"github.com/go-chi/chi/v5"
)

type APIHandler struct {
	cfg     *config.Config
	storage *storage.StorageManager
	jobMgr  *jobs.JobManager
}

func NewAPIHandler(cfg *config.Config, sm *storage.StorageManager, jm *jobs.JobManager) *APIHandler {
	return &APIHandler{
		cfg:     cfg,
		storage: sm,
		jobMgr:  jm,
	}
}

func (h *APIHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	respondJSON(w, http.StatusOK, map[string]interface{}{
		"status":    "healthy",
		"service":   "fileprocessor-api",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

func (h *APIHandler) ListTools(w http.ResponseWriter, r *http.Request) {
	tools := []models.Tool{
		{ID: "compress-pdf", Name: "Compress PDF", Category: models.CategoryPDF, Description: "Reduce PDF size while preserving quality", SupportedInputFormats: []string{"pdf"}, SupportedOutputFormats: []string{"pdf"}},
		{ID: "target-size-pdf", Name: "Compress PDF to Target Size", Category: models.CategoryPDF, Description: "Intelligently shrink PDF to hit specific MB target", SupportedInputFormats: []string{"pdf"}, SupportedOutputFormats: []string{"pdf"}},
		{ID: "merge-pdf", Name: "Merge PDF", Category: models.CategoryPDF, Description: "Combine multiple PDF documents into one unified file", SupportedInputFormats: []string{"pdf"}, SupportedOutputFormats: []string{"pdf"}},
		{ID: "split-pdf", Name: "Split PDF", Category: models.CategoryPDF, Description: "Extract pages into separate PDF files", SupportedInputFormats: []string{"pdf"}, SupportedOutputFormats: []string{"zip"}},
		{ID: "rotate-pdf", Name: "Rotate PDF", Category: models.CategoryPDF, Description: "Rotate PDF pages 90, 180, or 270 degrees", SupportedInputFormats: []string{"pdf"}, SupportedOutputFormats: []string{"pdf"}},
		{ID: "pdf-to-jpg", Name: "PDF to JPG", Category: models.CategoryPDF, Description: "Convert PDF pages into high-resolution JPG images", SupportedInputFormats: []string{"pdf"}, SupportedOutputFormats: []string{"zip"}},
		{ID: "protect-pdf", Name: "Protect PDF", Category: models.CategoryPDF, Description: "Encrypt PDF with password protection", SupportedInputFormats: []string{"pdf"}, SupportedOutputFormats: []string{"pdf"}},
		{ID: "remove-pdf-metadata", Name: "Remove PDF Metadata", Category: models.CategoryPDF, Description: "Strip author, title, and tracking metadata from PDF", SupportedInputFormats: []string{"pdf"}, SupportedOutputFormats: []string{"pdf"}},
		{ID: "compress-image", Name: "Compress Image", Category: models.CategoryImage, Description: "Shrink image file size with zero visible loss", SupportedInputFormats: []string{"jpg", "jpeg", "png", "webp", "heic"}, SupportedOutputFormats: []string{"jpg", "png", "webp"}},
		{ID: "target-size-image", Name: "Compress Image to Target Size", Category: models.CategoryImage, Description: "Compress image down to exact target KB or MB", SupportedInputFormats: []string{"jpg", "jpeg", "png", "webp"}, SupportedOutputFormats: []string{"jpg", "png", "webp"}},
		{ID: "resize-image", Name: "Resize Image", Category: models.CategoryImage, Description: "Change image dimensions while preserving aspect ratio", SupportedInputFormats: []string{"jpg", "jpeg", "png", "webp"}, SupportedOutputFormats: []string{"jpg", "png", "webp"}},
		{ID: "crop-image", Name: "Crop Image", Category: models.CategoryImage, Description: "Crop rectangular areas from images", SupportedInputFormats: []string{"jpg", "jpeg", "png", "webp"}, SupportedOutputFormats: []string{"jpg", "png", "webp"}},
		{ID: "convert-image", Name: "Convert Image Format", Category: models.CategoryImage, Description: "Convert between JPG, PNG, WebP, HEIC formats", SupportedInputFormats: []string{"jpg", "jpeg", "png", "webp", "heic"}, SupportedOutputFormats: []string{"jpg", "png", "webp"}},
		{ID: "remove-image-metadata", Name: "Remove Image Metadata", Category: models.CategoryImage, Description: "Strip EXIF, GPS location, and camera data from images", SupportedInputFormats: []string{"jpg", "jpeg", "png", "webp", "heic"}, SupportedOutputFormats: []string{"jpg", "png", "webp"}},
		{ID: "image-to-pdf", Name: "Image to PDF", Category: models.CategoryImage, Description: "Convert JPG, PNG, WebP images into a single PDF", SupportedInputFormats: []string{"jpg", "jpeg", "png", "webp"}, SupportedOutputFormats: []string{"pdf"}},
		{ID: "video-to-audio", Name: "Video to Audio", Category: models.CategoryMedia, Description: "Extract high-quality audio or MP3 from video files", SupportedInputFormats: []string{"mp4", "mov", "avi", "mkv", "webm", "flv", "wmv", "3gp"}, SupportedOutputFormats: []string{"mp3", "wav", "aac", "m4a", "flac", "ogg"}},
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{"tools": tools})
}

func (h *APIHandler) UploadFile(w http.ResponseWriter, r *http.Request) {
	maxBytes := h.cfg.MaxFileSizeMB * 1024 * 1024
	r.Body = http.MaxBytesReader(w, r.Body, maxBytes*5+1024*1024)

	if err := r.ParseMultipartForm(maxBytes); err != nil {
		respondError(w, http.StatusRequestEntityTooLarge, "UPLOAD_FAILED", "Upload exceeds maximum allowed size")
		return
	}

	files := r.MultipartForm.File["file"]
	if len(files) == 0 {
		files = r.MultipartForm.File["files"]
	}
	if len(files) == 0 {
		respondError(w, http.StatusBadRequest, "NO_FILES", "No files provided in request")
		return
	}

	var uploadedMetas []models.FileMetadata
	allowedFormats := []string{"pdf", "jpg", "jpeg", "png", "webp", "heic", "mp4", "mov", "avi", "mkv", "webm", "flv", "wmv", "3gp", "mp3", "wav", "aac", "m4a", "ogg", "flac"}

	for _, fileHeader := range files {
		if fileHeader.Size > 0 && fileHeader.Size > maxBytes {
			respondError(w, http.StatusRequestEntityTooLarge, "FILE_TOO_LARGE", fmt.Sprintf("File exceeds %d MB limit", h.cfg.MaxFileSizeMB))
			return
		}

		src, err := fileHeader.Open()
		if err != nil {
			respondError(w, http.StatusInternalServerError, "FILE_OPEN_ERROR", "Could not read uploaded file")
			return
		}

		sanitizedName := security.SanitizeFilename(fileHeader.Filename)
		fileID, storedPath, size, err := h.storage.SaveUploadedFile(src, sanitizedName, maxBytes)
		src.Close()
		if err != nil {
			respondError(w, http.StatusBadRequest, "STORAGE_ERROR", err.Error())
			return
		}

		mimeType, err := security.ValidateMagicBytes(storedPath, allowedFormats)
		if err != nil {
			_ = h.storage.DeleteFile(storedPath)
			respondError(w, http.StatusBadRequest, "INVALID_FILE", err.Error())
			return
		}

		uploadedMetas = append(uploadedMetas, models.FileMetadata{
			ID:           fileID,
			OriginalName: sanitizedName,
			StoredPath:  storedPath,
			MimeType:    mimeType,
			SizeBytes:   size,
		})
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"files":   uploadedMetas,
	})
}

type CreateJobPayload struct {
	ToolID  string                `json:"toolId"`
	Files   []models.FileMetadata `json:"files"`
	Options models.JobOptions     `json:"options"`
}

func (h *APIHandler) CreateJob(w http.ResponseWriter, r *http.Request) {
	var payload CreateJobPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		respondError(w, http.StatusBadRequest, "INVALID_JSON", "Invalid request body")
		return
	}

	if payload.ToolID == "" || len(payload.Files) == 0 {
		respondError(w, http.StatusBadRequest, "INVALID_JOB", "toolId and files are required")
		return
	}

	if !jobs.IsKnownTool(payload.ToolID) {
		respondError(w, http.StatusBadRequest, "UNKNOWN_TOOL", "Unknown toolId")
		return
	}

	// Resolve StoredPath for each input file from storage manager using file ID
	for i := range payload.Files {
		if payload.Files[i].StoredPath == "" {
			storedPath, err := h.storage.GetFilePathByID(payload.Files[i].ID)
			if err != nil {
				respondError(w, http.StatusBadRequest, "FILE_NOT_FOUND", fmt.Sprintf("File %s not found on storage server", payload.Files[i].ID))
				return
			}
			payload.Files[i].StoredPath = storedPath
		}
	}

	job, err := h.jobMgr.CreateJob(payload.ToolID, payload.Files, payload.Options)
	if err != nil {
		respondError(w, http.StatusInternalServerError, "JOB_CREATION_FAILED", err.Error())
		return
	}

	respondJSON(w, http.StatusAccepted, job)
}

func (h *APIHandler) GetJob(w http.ResponseWriter, r *http.Request) {
	jobID := chi.URLParam(r, "id")
	job, exists := h.jobMgr.GetJob(jobID)
	if !exists {
		respondError(w, http.StatusNotFound, "JOB_NOT_FOUND", "No job found with specified ID")
		return
	}

	respondJSON(w, http.StatusOK, job)
}

func (h *APIHandler) DownloadResult(w http.ResponseWriter, r *http.Request) {
	jobID := chi.URLParam(r, "id")
	job, exists := h.jobMgr.GetJob(jobID)
	if !exists || job.Status != models.StatusCompleted || job.OutputFile == nil {
		respondError(w, http.StatusNotFound, "RESULT_NOT_FOUND", "Job output not available for download")
		return
	}

	outPath := job.OutputFile.StoredPath
	file, err := os.Open(outPath)
	if err != nil {
		respondError(w, http.StatusNotFound, "FILE_MISSING", "Processed output file was expired or deleted")
		return
	}
	defer file.Close()

	fileName := security.SanitizeFilename(job.OutputFile.OriginalName)
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileName))
	w.Header().Set("Content-Type", job.OutputFile.MimeType)
	w.Header().Set("Content-Length", fmt.Sprintf("%d", job.OutputFile.SizeBytes))

	http.ServeContent(w, r, fileName, time.Now(), file)
}

func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func respondError(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": false,
		"error": map[string]string{
			"code":    code,
			"message": message,
		},
	})
}
