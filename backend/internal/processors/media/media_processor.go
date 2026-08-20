package media

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/fileprocessor/backend/internal/models"
	"github.com/fileprocessor/backend/internal/storage"
	"github.com/google/uuid"
)

type MediaProcessor struct {
	storage *storage.StorageManager
}

func NewMediaProcessor(sm *storage.StorageManager) *MediaProcessor {
	return &MediaProcessor{storage: sm}
}

func (mp *MediaProcessor) Process(ctx context.Context, job *models.Job) (*models.FileMetadata, error) {
	if len(job.InputFiles) == 0 {
		return nil, fmt.Errorf("no input files provided")
	}

	switch job.ToolID {
	case "video-to-audio", "extract-audio":
		return mp.ExtractAudio(ctx, job.InputFiles[0], job.Options)
	default:
		return nil, fmt.Errorf("unsupported media tool ID: %s", job.ToolID)
	}
}

func getFFmpegBinaryPath() (string, error) {
	if custom := os.Getenv("FFMPEG_PATH"); custom != "" {
		if _, err := os.Stat(custom); err == nil {
			return custom, nil
		}
	}

	if path, err := exec.LookPath("ffmpeg"); err == nil {
		return path, nil
	}

	candidates := []string{
		"/usr/bin/ffmpeg",
		"/usr/local/bin/ffmpeg",
		"/opt/homebrew/bin/ffmpeg",
		"/usr/bin/local/ffmpeg",
	}

	for _, cand := range candidates {
		if _, err := os.Stat(cand); err == nil {
			return cand, nil
		}
	}

	return "", fmt.Errorf("ffmpeg binary not found in system PATH or common locations. Please install ffmpeg on your server")
}

func (mp *MediaProcessor) ExtractAudio(ctx context.Context, input models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	ffmpegBin, err := getFFmpegBinaryPath()
	if err != nil {
		return nil, err
	}

	outputFormat := "mp3"
	if fmtOpt, ok := options["outputFormat"].(string); ok && fmtOpt != "" {
		outputFormat = strings.ToLower(fmtOpt)
	}

	bitrate := "192k"
	if brOpt, ok := options["bitrate"].(string); ok && brOpt != "" {
		bitrate = strings.ToLower(brOpt)
	}

	startTime := ""
	if stOpt, ok := options["startTime"].(string); ok && stOpt != "" {
		startTime = strings.TrimSpace(stOpt)
	}

	endTime := ""
	if etOpt, ok := options["endTime"].(string); ok && etOpt != "" {
		endTime = strings.TrimSpace(etOpt)
	}

	outPath, err := mp.storage.CreateTempFile("audio_out", "."+outputFormat)
	if err != nil {
		return nil, fmt.Errorf("failed to create output temp file: %w", err)
	}

	args := []string{"-y"}

	if startTime != "" {
		args = append(args, "-ss", startTime)
	}
	if endTime != "" {
		args = append(args, "-to", endTime)
	}

	args = append(args, "-i", input.StoredPath, "-vn")

	if bitrate == "copy" {
		args = append(args, "-c:a", "copy")
	} else {
		switch outputFormat {
		case "mp3":
			args = append(args, "-c:a", "libmp3lame")
		case "wav":
			args = append(args, "-c:a", "pcm_s16le")
		case "aac", "m4a":
			args = append(args, "-c:a", "aac")
		case "flac":
			args = append(args, "-c:a", "flac")
		case "ogg":
			args = append(args, "-c:a", "libvorbis")
		}

		if bitrate != "" && outputFormat != "wav" && outputFormat != "flac" {
			args = append(args, "-b:a", bitrate)
		}
	}

	args = append(args, outPath)

	cmd := exec.CommandContext(ctx, ffmpegBin, args...)
	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		os.Remove(outPath)
		return nil, fmt.Errorf("ffmpeg audio extraction failed: %w | %s", err, stderr.String())
	}

	stat, err := os.Stat(outPath)
	if err != nil {
		return nil, fmt.Errorf("failed to stat output audio file: %w", err)
	}

	baseName := strings.TrimSuffix(input.OriginalName, filepath.Ext(input.OriginalName))
	outFilename := fmt.Sprintf("%s.%s", baseName, outputFormat)

	mimeType := getMimeTypeForFormat(outputFormat)

	return &models.FileMetadata{
		ID:           uuid.New().String(),
		OriginalName: outFilename,
		StoredPath:  outPath,
		MimeType:    mimeType,
		SizeBytes:   stat.Size(),
	}, nil
}

func getMimeTypeForFormat(format string) string {
	switch format {
	case "mp3":
		return "audio/mpeg"
	case "wav":
		return "audio/wav"
	case "aac":
		return "audio/aac"
	case "m4a":
		return "audio/mp4"
	case "flac":
		return "audio/flac"
	case "ogg":
		return "audio/ogg"
	default:
		return "audio/mpeg"
	}
}
