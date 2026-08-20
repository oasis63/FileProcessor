package security

import (
	"os"
	"path/filepath"
	"testing"
)

func TestSafeExtension(t *testing.T) {
	if SafeExtension("pdf") != ".pdf" {
		t.Fatalf("expected .pdf")
	}
	if SafeExtension("../../../etc/passwd") != ".bin" {
		t.Fatalf("traversal must be rejected")
	}
	if SafeExtension(".MP3") != ".mp3" {
		t.Fatalf("expected lowercase .mp3")
	}
}

func TestSniffPDFAndJPEG(t *testing.T) {
	dir := t.TempDir()
	pdfPath := filepath.Join(dir, "a.pdf")
	if err := os.WriteFile(pdfPath, []byte("%PDF-1.4\n%..."), 0644); err != nil {
		t.Fatal(err)
	}
	mime, err := ValidateMagicBytes(pdfPath, []string{"pdf"})
	if err != nil {
		t.Fatal(err)
	}
	if mime != "application/pdf" {
		t.Fatalf("got %s", mime)
	}

	binPath := filepath.Join(dir, "evil.bin")
	if err := os.WriteFile(binPath, []byte("not a real file"), 0644); err != nil {
		t.Fatal(err)
	}
	if _, err := ValidateMagicBytes(binPath, []string{"pdf", "jpg"}); err == nil {
		t.Fatal("expected rejection of spoofed content")
	}
}
