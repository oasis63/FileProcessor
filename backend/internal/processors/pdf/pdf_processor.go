package pdf

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
	"github.com/pdfcpu/pdfcpu/pkg/api"
	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/model"
)

type PDFProcessor struct {
	storage *storage.StorageManager
}

func NewPDFProcessor(sm *storage.StorageManager) *PDFProcessor {
	return &PDFProcessor{storage: sm}
}

func (pp *PDFProcessor) Process(ctx context.Context, job *models.Job) (*models.FileMetadata, error) {
	if len(job.InputFiles) == 0 {
		return nil, fmt.Errorf("no input files provided")
	}

	inputFile := job.InputFiles[0]

	switch job.ToolID {
	case "compress-pdf":
		return pp.Compress(ctx, inputFile, job.Options)
	case "target-size-pdf":
		return pp.TargetSize(ctx, inputFile, job.Options)
	case "merge-pdf":
		return pp.Merge(ctx, job.InputFiles)
	case "split-pdf":
		return pp.Split(ctx, inputFile)
	case "rotate-pdf":
		return pp.Rotate(ctx, inputFile, job.Options)
	case "pdf-to-jpg":
		return pp.PDFToJPG(ctx, inputFile)
	case "protect-pdf":
		return pp.Protect(ctx, inputFile, job.Options)
	case "remove-pdf-metadata":
		return pp.RemoveMetadata(ctx, inputFile)
	case "extract-pdf-pages":
		return pp.ExtractPages(ctx, inputFile, job.Options)
	case "delete-pdf-pages":
		return pp.DeletePages(ctx, inputFile, job.Options)
	default:
		return nil, fmt.Errorf("unsupported pdf tool: %s", job.ToolID)
	}
}

// Compress uses Ghostscript with resolution settings.
func (pp *PDFProcessor) Compress(ctx context.Context, input models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	preset := "/ebook" // Default ebook (~150 dpi)
	if p, ok := options["preset"].(string); ok {
		switch p {
		case "screen":
			preset = "/screen"
		case "ebook":
			preset = "/ebook"
		case "printer":
			preset = "/printer"
		}
	}

	outPath, err := pp.storage.CreateTempFile("compressed", ".pdf")
	if err != nil {
		return nil, err
	}

	// gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=preset -dNOPAUSE -dQUIET -dBATCH -sOutputFile=outPath inputPath
	cmd := exec.CommandContext(ctx, "gs",
		"-sDEVICE=pdfwrite",
		"-dCompatibilityLevel=1.4",
		fmt.Sprintf("-dPDFSETTINGS=%s", preset),
		"-dNOPAUSE",
		"-dQUIET",
		"-dBATCH",
		fmt.Sprintf("-sOutputFile=%s", outPath),
		input.StoredPath,
	)

	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("ghostscript compression failed: %v, log: %s", err, string(output))
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: "compressed_" + input.OriginalName,
		StoredPath:  outPath,
		MimeType:    "application/pdf",
		SizeBytes:   fi.Size(),
	}, nil
}

// TargetSize evaluates pdfsettings presets to get under target size.
func (pp *PDFProcessor) TargetSize(ctx context.Context, input models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	targetBytes := int64(2 * 1024 * 1024) // Default 2MB
	if tb, ok := options["targetBytes"].(float64); ok && tb > 0 {
		targetBytes = int64(tb)
	}

	presets := []string{"/printer", "/ebook", "/screen"}
	var bestPath string
	var bestSize int64

	for _, preset := range presets {
		tempOptions := models.JobOptions{"preset": strings.TrimPrefix(preset, "/")}
		res, err := pp.Compress(ctx, input, tempOptions)
		if err != nil {
			continue
		}

		if bestPath == "" || (res.SizeBytes <= targetBytes && res.SizeBytes > bestSize) || (bestSize > targetBytes && res.SizeBytes < bestSize) {
			if bestPath != "" {
				os.Remove(bestPath)
			}
			bestPath = res.StoredPath
			bestSize = res.SizeBytes
		} else {
			os.Remove(res.StoredPath)
		}

		if res.SizeBytes <= targetBytes {
			break
		}
	}

	if bestPath == "" {
		return pp.Compress(ctx, input, options)
	}

	return &models.FileMetadata{
		ID:           filepath.Base(bestPath),
		OriginalName: "target_" + input.OriginalName,
		StoredPath:  bestPath,
		MimeType:    "application/pdf",
		SizeBytes:   bestSize,
	}, nil
}

// Merge combines multiple PDF files into one using pdfcpu.
func (pp *PDFProcessor) Merge(ctx context.Context, inputs []models.FileMetadata) (*models.FileMetadata, error) {
	if len(inputs) < 2 {
		return nil, fmt.Errorf("merge requires at least 2 input files")
	}

	inFiles := make([]string, len(inputs))
	for i, in := range inputs {
		inFiles[i] = in.StoredPath
	}

	outPath, err := pp.storage.CreateTempFile("merged", ".pdf")
	if err != nil {
		return nil, err
	}

	conf := model.NewDefaultConfiguration()
	if err := api.MergeCreateFile(inFiles, outPath, false, conf); err != nil {
		return nil, fmt.Errorf("pdfcpu merge failed: %w", err)
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: "merged_document.pdf",
		StoredPath:  outPath,
		MimeType:    "application/pdf",
		SizeBytes:   fi.Size(),
	}, nil
}

// Split divides a PDF into single page files (returns a zip or first page in V1).
func (pp *PDFProcessor) Split(ctx context.Context, input models.FileMetadata) (*models.FileMetadata, error) {
	outDir, err := os.MkdirTemp("", "pdf_split_*")
	if err != nil {
		return nil, err
	}
	defer os.RemoveAll(outDir)

	conf := model.NewDefaultConfiguration()
	if err := api.SplitFile(input.StoredPath, outDir, 1, conf); err != nil {
		return nil, fmt.Errorf("pdfcpu split failed: %w", err)
	}

	// Zip the split files
	zipPath, err := pp.storage.CreateTempFile("split", ".zip")
	if err != nil {
		return nil, err
	}

	cmd := exec.CommandContext(ctx, "zip", "-j", zipPath, filepath.Join(outDir, "*.pdf"))
	if output, err := cmd.CombinedOutput(); err != nil {
		// Fallback to simple file zip or tar if zip CLI absent
		cmd = exec.CommandContext(ctx, "tar", "-czf", zipPath, "-C", outDir, ".")
		if errTar := cmd.Run(); errTar != nil {
			return nil, fmt.Errorf("zip creation failed: %v, log: %s", err, string(output))
		}
	}

	fi, err := os.Stat(zipPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(zipPath),
		OriginalName: "split_pages.zip",
		StoredPath:  zipPath,
		MimeType:    "application/zip",
		SizeBytes:   fi.Size(),
	}, nil
}

// Rotate changes PDF page rotation (90, 180, 270 degrees).
func (pp *PDFProcessor) Rotate(ctx context.Context, input models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	degrees := 90
	if d, ok := options["degrees"].(float64); ok {
		degrees = int(d)
	}

	outPath, err := pp.storage.CreateTempFile("rotated", ".pdf")
	if err != nil {
		return nil, err
	}

	conf := model.NewDefaultConfiguration()
	if err := api.RotateFile(input.StoredPath, outPath, degrees, nil, conf); err != nil {
		return nil, fmt.Errorf("pdfcpu rotate failed: %w", err)
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: "rotated_" + input.OriginalName,
		StoredPath:  outPath,
		MimeType:    "application/pdf",
		SizeBytes:   fi.Size(),
	}, nil
}

// PDFToJPG converts PDF pages into high quality JPEG images using pdftoppm.
func (pp *PDFProcessor) PDFToJPG(ctx context.Context, input models.FileMetadata) (*models.FileMetadata, error) {
	outDir, err := os.MkdirTemp("", "pdf_jpg_*")
	if err != nil {
		return nil, err
	}
	defer os.RemoveAll(outDir)

	outPrefix := filepath.Join(outDir, "page")
	cmd := exec.CommandContext(ctx, "pdftoppm", "-jpeg", "-r", "150", input.StoredPath, outPrefix)
	if output, err := cmd.CombinedOutput(); err != nil {
		return nil, fmt.Errorf("pdftoppm failed: %v, log: %s", err, string(output))
	}

	zipPath, err := pp.storage.CreateTempFile("pdf_images", ".zip")
	if err != nil {
		return nil, err
	}

	cmd = exec.CommandContext(ctx, "zip", "-j", zipPath, filepath.Join(outDir, "*.jpg"))
	if output, err := cmd.CombinedOutput(); err != nil {
		cmd = exec.CommandContext(ctx, "tar", "-czf", zipPath, "-C", outDir, ".")
		if errTar := cmd.Run(); errTar != nil {
			return nil, fmt.Errorf("zip creation failed: %v, log: %s", err, string(output))
		}
	}

	fi, err := os.Stat(zipPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(zipPath),
		OriginalName: "pdf_pages_jpg.zip",
		StoredPath:  zipPath,
		MimeType:    "application/zip",
		SizeBytes:   fi.Size(),
	}, nil
}

// Protect encrypts a PDF with owner and user passwords using pdfcpu.
func (pp *PDFProcessor) Protect(ctx context.Context, input models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	password := "123456"
	if p, ok := options["password"].(string); ok && p != "" {
		password = p
	}

	outPath, err := pp.storage.CreateTempFile("protected", ".pdf")
	if err != nil {
		return nil, err
	}

	conf := model.NewDefaultConfiguration()
	conf.UserPW = password
	conf.OwnerPW = password

	if err := api.EncryptFile(input.StoredPath, outPath, conf); err != nil {
		return nil, fmt.Errorf("pdfcpu protect failed: %w", err)
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: "protected_" + input.OriginalName,
		StoredPath:  outPath,
		MimeType:    "application/pdf",
		SizeBytes:   fi.Size(),
	}, nil
}

// RemoveMetadata strips title, author, producer tags.
func (pp *PDFProcessor) RemoveMetadata(ctx context.Context, input models.FileMetadata) (*models.FileMetadata, error) {
	outPath, err := pp.storage.CreateTempFile("clean", ".pdf")
	if err != nil {
		return nil, err
	}

	cmd := exec.CommandContext(ctx, "gs",
		"-sDEVICE=pdfwrite",
		"-dCompatibilityLevel=1.4",
		"-dNOPAUSE",
		"-dQUIET",
		"-dBATCH",
		fmt.Sprintf("-sOutputFile=%s", outPath),
		input.StoredPath,
	)

	if output, err := cmd.CombinedOutput(); err != nil {
		return nil, fmt.Errorf("remove metadata failed: %v, log: %s", err, string(output))
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: "clean_" + input.OriginalName,
		StoredPath:  outPath,
		MimeType:    "application/pdf",
		SizeBytes:   fi.Size(),
	}, nil
}

// ExtractPages extracts a specific list of pages (e.g. "1,3-5").
func (pp *PDFProcessor) ExtractPages(ctx context.Context, input models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	pages := "1"
	if p, ok := options["pages"].(string); ok && p != "" {
		pages = p
	}

	outPath, err := pp.storage.CreateTempFile("extracted", ".pdf")
	if err != nil {
		return nil, err
	}

	conf := model.NewDefaultConfiguration()
	selectedPages := []string{pages}

	if err := api.ExtractPagesFile(input.StoredPath, outPath, selectedPages, conf); err != nil {
		return nil, fmt.Errorf("extract pages failed: %w", err)
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: "extracted_" + input.OriginalName,
		StoredPath:  outPath,
		MimeType:    "application/pdf",
		SizeBytes:   fi.Size(),
	}, nil
}

// DeletePages removes specified pages (e.g. "2,4").
func (pp *PDFProcessor) DeletePages(ctx context.Context, input models.FileMetadata, options models.JobOptions) (*models.FileMetadata, error) {
	pages := "1"
	if p, ok := options["pages"].(string); ok && p != "" {
		pages = p
	}

	outPath, err := pp.storage.CreateTempFile("trimmed", ".pdf")
	if err != nil {
		return nil, err
	}

	conf := model.NewDefaultConfiguration()
	pagesToRemove := []string{pages}

	if err := api.RemovePagesFile(input.StoredPath, outPath, pagesToRemove, conf); err != nil {
		return nil, fmt.Errorf("delete pages failed: %w", err)
	}

	fi, err := os.Stat(outPath)
	if err != nil {
		return nil, err
	}

	return &models.FileMetadata{
		ID:           filepath.Base(outPath),
		OriginalName: "modified_" + input.OriginalName,
		StoredPath:  outPath,
		MimeType:    "application/pdf",
		SizeBytes:   fi.Size(),
	}, nil
}

var _ = strconv.Itoa
