package security

import (
	"bytes"
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
	ErrFileTooLarge      = errors.New("file size exceeds maximum permitted threshold")
	ErrUnsupportedFormat = errors.New("unsupported file format")
	ErrInvalidFileName   = errors.New("invalid file name")
)

var unsafeFilenameRegex = regexp.MustCompile(`[^a-zA-Z0-9_\-\.]`)
var safeExtRegex = regexp.MustCompile(`^\.[a-z0-9]{1,8}$`)

func SafeExtension(ext string) string {
	ext = strings.ToLower(strings.TrimSpace(ext))
	if !strings.HasPrefix(ext, ".") {
		ext = "." + ext
	}
	if !safeExtRegex.MatchString(ext) {
		return ".bin"
	}
	return ext
}

func ValidateMagicBytes(filePath string, allowedFormats []string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	buffer := make([]byte, 512)
	n, err := file.Read(buffer)
	if err != nil && err != io.EOF {
		return "", err
	}
	buffer = buffer[:n]

	detected := sniffContent(buffer)
	allowed := make(map[string]struct{}, len(allowedFormats))
	for _, f := range allowedFormats {
		allowed[strings.ToLower(f)] = struct{}{}
	}

	if matchesAllowed(detected, allowed) {
		return detected, nil
	}

	return detected, fmt.Errorf("%w: detected %s, expected one of %v", ErrUnsupportedFormat, detected, allowedFormats)
}

func sniffContent(buffer []byte) string {
	if len(buffer) == 0 {
		return "application/octet-stream"
	}
	if bytes.HasPrefix(buffer, []byte("%PDF-")) {
		return "application/pdf"
	}
	if len(buffer) >= 3 && buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF {
		return "image/jpeg"
	}
	if bytes.HasPrefix(buffer, []byte{0x89, 'P', 'N', 'G', '\r', '\n', 0x1a, '\n'}) {
		return "image/png"
	}
	if len(buffer) >= 12 && bytes.Equal(buffer[:4], []byte("RIFF")) && bytes.Equal(buffer[8:12], []byte("WEBP")) {
		return "image/webp"
	}
	if len(buffer) >= 12 && bytes.Equal(buffer[4:8], []byte("ftyp")) {
		brand := strings.ToLower(string(buffer[8:min(12, len(buffer))]))
		switch {
		case strings.HasPrefix(brand, "heic"), strings.HasPrefix(brand, "heif"), strings.HasPrefix(brand, "mif1"), strings.HasPrefix(brand, "msf1"):
			return "image/heic"
		case strings.HasPrefix(brand, "qt"):
			return "video/quicktime"
		default:
			return "video/mp4"
		}
	}
	if bytes.HasPrefix(buffer, []byte{0x1A, 0x45, 0xDF, 0xA3}) {
		return "video/x-matroska"
	}
	if bytes.HasPrefix(buffer, []byte("FLV")) {
		return "video/x-flv"
	}
	if bytes.HasPrefix(buffer, []byte("OggS")) {
		return "audio/ogg"
	}
	if bytes.HasPrefix(buffer, []byte("fLaC")) {
		return "audio/flac"
	}
	if bytes.HasPrefix(buffer, []byte("ID3")) || (len(buffer) >= 2 && buffer[0] == 0xFF && buffer[1]&0xE0 == 0xE0) {
		return "audio/mpeg"
	}
	if len(buffer) >= 12 && bytes.Equal(buffer[:4], []byte("RIFF")) && bytes.Equal(buffer[8:12], []byte("WAVE")) {
		return "audio/wav"
	}

	return http.DetectContentType(buffer)
}

func matchesAllowed(detected string, allowed map[string]struct{}) bool {
	check := func(keys ...string) bool {
		for _, k := range keys {
			if _, ok := allowed[k]; ok {
				return true
			}
		}
		return false
	}

	switch detected {
	case "application/pdf":
		return check("pdf")
	case "image/jpeg":
		return check("jpg", "jpeg")
	case "image/png":
		return check("png")
	case "image/webp":
		return check("webp")
	case "image/heic", "image/heif":
		return check("heic", "heif")
	case "video/mp4":
		return check("mp4", "m4v", "3gp")
	case "video/quicktime":
		return check("mov", "qt")
	case "video/x-matroska":
		return check("mkv", "webm")
	case "video/webm":
		return check("webm", "mkv")
	case "video/x-flv":
		return check("flv")
	case "video/x-msvideo", "video/avi":
		return check("avi")
	case "audio/mpeg":
		return check("mp3")
	case "audio/wav", "audio/x-wav", "audio/wave":
		return check("wav")
	case "audio/aac", "audio/mp4":
		return check("aac", "m4a")
	case "audio/ogg":
		return check("ogg")
	case "audio/flac":
		return check("flac")
	default:
		if strings.HasPrefix(detected, "video/") {
			return check("mp4", "mov", "avi", "mkv", "webm", "flv", "wmv", "3gp")
		}
		if strings.HasPrefix(detected, "audio/") {
			return check("mp3", "wav", "aac", "m4a", "ogg", "flac")
		}
		if strings.HasPrefix(detected, "image/") {
			return check("jpg", "jpeg", "png", "webp", "heic")
		}
		return false
	}
}

func SanitizeFilename(name string) string {
	base := filepath.Base(name)
	base = strings.ReplaceAll(base, " ", "_")
	cleaned := unsafeFilenameRegex.ReplaceAllString(base, "_")
	if cleaned == "" || cleaned == "." || cleaned == ".." {
		return "unnamed_file.bin"
	}
	return cleaned
}
