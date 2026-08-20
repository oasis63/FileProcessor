package image

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/fileprocessor/backend/internal/models"
	"github.com/fileprocessor/backend/internal/storage"
)

type ImageProcessor struct {
	storage *storage.StorageManager
}

func NewImageProcessor(sm *storage.StorageManager) *ImageProcessor {
	return &ImageProcessor{storage: sm}
}

func (ip *ImageProcessor) Process(ctx context.Context, job *models.Job) (*models.FileMetadata, error) {
	if len(job.InputFiles) == 0 {
		return nil, fmt.Errorf("no input files provided")
	}

	inputFile := job.InputFiles[0]

	switch job.ToolID {
	case "compress-image":
		return ip.Compress(ctx, inputFile, job.Options)
	case "target-size-image":
		return ip.TargetSize(ctx, inputFile, job.Options)
	case "resize-image":
		return ip.Resize(ctx, inputFile, job.Options)
	case "crop-image":
		return ip.Crop(ctx, inputFile, job.Options)
	case "convert-image":
		return ip.ConvertFormat(ctx, inputFile, job.Options)
	case "remove-image-metadata":
		return ip.RemoveMetadata(ctx, inputFile)
	case "image-to-pdf":
		return ip.ImageToPDF(ctx, job.InputFiles, job.Options)
	default:
		return nil, fmt.Errorf("unsupported image tool: %s", job.ToolID)
	}
}

func getSafeExtension(path string) string {
	ext := strings.ToLower(filepath.Ext(path))
	if ext == "" || ext == "." {
		return ".jpg"
	}
	if ext == ".jpeg" {
		return ".jpg"
	}
	return ext
}

// Compress reduces image quality and strips EXIF metadata.
func (ip *ImageProcessor) Compress(ctx context.Context, input models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	quality := 75
	if q, ok := options["quality"].(float64); ok && q > 0 {
		quality = int(q)
	}

	ext := getSafeExtension(input.StoredPath)
	outPath, err := ip.storage.CreateTempFile("compressed", ext)
	if err != nil {
		return nil, err
	}

	cmd := exec.CommandContext(ctx, "magick", input.StoredPath, "-strip", "-quality", strconv.Itoa(quality), outPath)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("ImageMagick compression failed: %v, output: %s", err, string(output))
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: "compressed_" + input.OriginalName,
		StoredPath:  outPath,
		MimeType:    input.MimeType,
		SizeBytes:   fi.Size(),
	}, nil
}

// TargetSize performs bounded binary/bisection search to meet user target byte size.
func (ip *ImageProcessor) TargetSize(ctx context.Context, input models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	targetBytes := int64(1024 * 1024) // Default 1MB
	if tb, ok := options["targetBytes"].(float64); ok && tb > 0 {
		targetBytes = int64(tb)
	}

	ext := getSafeExtension(input.StoredPath)
	bestPath := ""
	var bestSize int64 = 0

	lowQ := 10
	highQ := 95
	maxIter := 5

	for iter := 0; iter < maxIter; iter++ {
		midQ := (lowQ + highQ) / 2
		tempPath, err := ip.storage.CreateTempFile(fmt.Sprintf("target_q%d", midQ), ext)
		if err != nil {
			break
		}

		cmd := exec.CommandContext(ctx, "magick", input.StoredPath, "-strip", "-quality", strconv.Itoa(midQ), tempPath)
		if err := cmd.Run(); err != nil {
			os.Remove(tempPath)
			break
		}

		fi, err := os.Stat(tempPath)
		if err != nil {
			os.Remove(tempPath)
			break
		}

		currSize := fi.Size()
		if bestPath == "" || (currSize <= targetBytes && currSize > bestSize) || (bestSize > targetBytes && currSize < bestSize) {
			if bestPath != "" {
				os.Remove(bestPath)
			}
			bestPath = tempPath
			bestSize = currSize
		} else {
			os.Remove(tempPath)
		}

		if currSize > targetBytes {
			highQ = midQ - 1
		} else {
			lowQ = midQ + 1
		}

		if lowQ > highQ {
			break
		}
	}

	if bestPath == "" {
		return ip.Compress(ctx, input, options)
	}

	return &models.FileMetadata{
		ID:           filepath.Base(bestPath),
		OriginalName: "optimized_" + input.OriginalName,
		StoredPath:  bestPath,
		MimeType:    input.MimeType,
		SizeBytes:   bestSize,
	}, nil
}

// Resize changes image width/height while maintaining aspect ratio.
func (ip *ImageProcessor) Resize(ctx context.Context, input models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	width := 1920
	if w, ok := options["width"].(float64); ok && w > 0 {
		width = int(w)
	}
	height := 1080
	if h, ok := options["height"].(float64); ok && h > 0 {
		height = int(h)
	}

	geometry := fmt.Sprintf("%dx%d", width, height)
	ext := getSafeExtension(input.StoredPath)
	outPath, err := ip.storage.CreateTempFile("resized", ext)
	if err != nil {
		return nil, err
	}

	cmd := exec.CommandContext(ctx, "magick", input.StoredPath, "-resize", geometry, outPath)
	if output, err := cmd.CombinedOutput(); err != nil {
		return nil, fmt.Errorf("resize failed: %v, log: %s", err, string(output))
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: "resized_" + input.OriginalName,
		StoredPath:  outPath,
		MimeType:    input.MimeType,
		SizeBytes:   fi.Size(),
	}, nil
}

// Crop extracts rectangular slice.
func (ip *ImageProcessor) Crop(ctx context.Context, input models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	width := 800
	if w, ok := options["width"].(float64); ok && w > 0 {
		width = int(w)
	}
	height := 600
	if h, ok := options["height"].(float64); ok && h > 0 {
		height = int(h)
	}
	x := 0
	if xv, ok := options["x"].(float64); ok {
		x = int(xv)
	}
	y := 0
	if yv, ok := options["y"].(float64); ok {
		y = int(yv)
	}

	geometry := fmt.Sprintf("%dx%d+%d+%d", width, height, x, y)
	ext := getSafeExtension(input.StoredPath)
	outPath, err := ip.storage.CreateTempFile("cropped", ext)
	if err != nil {
		return nil, err
	}

	cmd := exec.CommandContext(ctx, "magick", input.StoredPath, "-crop", geometry, outPath)
	if output, err := cmd.CombinedOutput(); err != nil {
		return nil, fmt.Errorf("crop failed: %v, log: %s", err, string(output))
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: "cropped_" + input.OriginalName,
		StoredPath:  outPath,
		MimeType:    input.MimeType,
		SizeBytes:   fi.Size(),
	}, nil
}

// ConvertFormat handles format switching (JPG, PNG, WEBP, HEIC).
func (ip *ImageProcessor) ConvertFormat(ctx context.Context, input models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	targetFormat := "webp"
	if fmtStr, ok := options["targetFormat"].(string); ok && fmtStr != "" {
		targetFormat = strings.ToLower(fmtStr)
	}
	switch targetFormat {
	case "jpg", "jpeg":
		targetFormat = "jpg"
	case "png", "webp":
	default:
		return nil, fmt.Errorf("unsupported target format: %s", targetFormat)
	}

	targetExt := "." + targetFormat
	outPath, err := ip.storage.CreateTempFile("converted", targetExt)
	if err != nil {
		return nil, err
	}

	cmd := exec.CommandContext(ctx, "magick", input.StoredPath, outPath)
	if output, err := cmd.CombinedOutput(); err != nil {
		return nil, fmt.Errorf("image format conversion failed: %v, output: %s", err, string(output))
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	mimeType := "image/" + targetFormat
	if targetFormat == "jpg" {
		mimeType = "image/jpeg"
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: strings.TrimSuffix(input.OriginalName, filepath.Ext(input.OriginalName)) + targetExt,
		StoredPath:  outPath,
		MimeType:    mimeType,
		SizeBytes:   fi.Size(),
	}, nil
}

// RemoveMetadata strips EXIF/IPTC tags.
func (ip *ImageProcessor) RemoveMetadata(ctx context.Context, input models.FileMetadata) (*models.FileMetadata, error) {
	ext := getSafeExtension(input.StoredPath)
	outPath, err := ip.storage.CreateTempFile("clean", ext)
	if err != nil {
		return nil, err
	}

	cmd := exec.CommandContext(ctx, "magick", input.StoredPath, "-strip", outPath)
	if output, err := cmd.CombinedOutput(); err != nil {
		return nil, fmt.Errorf("strip metadata failed: %v, log: %s", err, string(output))
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: "clean_" + input.OriginalName,
		StoredPath:  outPath,
		MimeType:    input.MimeType,
		SizeBytes:   fi.Size(),
	}, nil
}

// ImageToPDF combines single or multiple images into a unified PDF.
func (ip *ImageProcessor) ImageToPDF(ctx context.Context, inputs []models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	outPath, err := ip.storage.CreateTempFile("doc", ".pdf")
	if err != nil {
		return nil, err
	}

	args := make([]string, 0, len(inputs)+2)
	for _, in := range inputs {
		args = append(args, in.StoredPath)
	}
	args = append(args, outPath)

	cmd := exec.CommandContext(ctx, "magick", args...)
	if output, err := cmd.CombinedOutput(); err != nil {
		return nil, fmt.Errorf("Image to PDF failed: %v, output: %s", err, string(output))
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: "converted_document.pdf",
		StoredPath:  outPath,
		MimeType:    "application/pdf",
		SizeBytes:   fi.Size(),
	}, nil
}
