package models

import (
	"time"
)

type JobStatus string

const (
	StatusPending    JobStatus = "PENDING"
	StatusProcessing JobStatus = "PROCESSING"
	StatusCompleted  JobStatus = "COMPLETED"
	StatusFailed     JobStatus = "FAILED"
)

type JobOptions map[string]interface{}

type FileMetadata struct {
	ID          string `json:"id"`
	OriginalName string `json:"originalName"`
	StoredPath  string `json:"-"`
	MimeType    string `json:"mimeType"`
	SizeBytes   int64  `json:"sizeBytes"`
}

type Job struct {
	ID           string                 `json:"id"`
	ToolID       string                 `json:"toolId"`
	Status       JobStatus              `json:"status"`
	InputFiles   []FileMetadata         `json:"inputFiles"`
	OutputFile   *FileMetadata          `json:"outputFile,omitempty"`
	Options      JobOptions             `json:"options"`
	Progress     int                    `json:"progress"` // 0 to 100
	Error        *JobError              `json:"error,omitempty"`
	OriginalSize int64                  `json:"originalSize"`
	ProcessedSize int64                 `json:"processedSize"`
	SavingsPct   float64                `json:"savingsPct"`
	CreatedAt    time.Time              `json:"createdAt"`
	CompletedAt  *time.Time             `json:"completedAt,omitempty"`
}

type JobError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ToolCategory string

const (
	CategoryPDF   ToolCategory = "PDF"
	CategoryImage ToolCategory = "IMAGE"
)

type Tool struct {
	ID                   string       `json:"id"`
	Name                 string       `json:"name"`
	Category             ToolCategory `json:"category"`
	Description          string       `json:"description"`
	SupportedInputFormats []string     `json:"supportedInputFormats"`
	SupportedOutputFormats []string    `json:"supportedOutputFormats"`
}
