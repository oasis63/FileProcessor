package security

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var (
	ErrFileTooLarge     = errors.New("file size exceeds maximum permitted threshold")
	ErrUnsupportedFormat = errors.New("unsupported file format")
	ErrInvalidFileName  = errors.New("invalid file name")
)

// Match any character that is NOT alphanumeric, underscore, hyphen, or dot
var unsafeFilenameRegex = regexp.MustCompile(`[^a-zA-Z0-9_\-\.]`)

// ValidateMagicBytes verifies the actual binary content of a file using HTTP sniff.
func ValidateMagicBytes(filePath string, allowedFormats []string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	// Read first 512 bytes
	buffer := make([]byte, 512)
	n, err := file.Read(buffer)
	if err != nil && err != io.EOF {
		return "", err
	}

	contentType := http.DetectContentType(buffer[:n])

	// Custom PDF check if needed
	if strings.HasPrefix(string(buffer[:n]), "%PDF-") {
		contentType = "application/pdf"
	}

	matched := false
	for _, fmtStr := range allowedFormats {
		switch strings.ToLower(fmtStr) {
		case "pdf":
			if contentType == "application/pdf" {
				matched = true
			}
		case "jpg", "jpeg":
			if contentType == "image/jpeg" {
				matched = true
			}
		case "png":
			if contentType == "image/png" {
				matched = true
			}
		case "webp":
			if contentType == "image/webp" {
				matched = true
			}
		case "heic":
			if contentType == "image/heic" || contentType == "image/heif" || strings.Contains(contentType, "octet-stream") {
				matched = true
			}
		}
	}

	if !matched {
		return contentType, fmt.Errorf("%w: detected %s, expected one of %v", ErrUnsupportedFormat, contentType, allowedFormats)
	}

	return contentType, nil
}

// SanitizeFilename prevents path traversal and shell injection while preserving extensions.
func SanitizeFilename(name string) string {
	base := filepath.Base(name)
	base = strings.ReplaceAll(base, " ", "_")
	cleaned := unsafeFilenameRegex.ReplaceAllString(base, "_")
	if cleaned == "" || cleaned == "." || cleaned == ".." {
		return "unnamed_file.bin"
	}
	return cleaned
}
