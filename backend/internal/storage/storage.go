package storage

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/google/uuid"
)

type StorageManager struct {
	baseDir    string
	retention  time.Duration
	secretKey  []byte
	mu         sync.RWMutex
	fileExpiry map[string]time.Time
}

func NewStorageManager(baseDir string, retentionMins int) (*StorageManager, error) {
	if err := os.MkdirAll(baseDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create storage dir: %w", err)
	}

	sm := &StorageManager{
		baseDir:    baseDir,
		retention:  time.Duration(retentionMins) * time.Minute,
		secretKey:  []byte(uuid.New().String()),
		fileExpiry: make(map[string]time.Time),
	}

	go sm.startAutoCleanupTicker(5 * time.Minute)

	return sm, nil
}

func (sm *StorageManager) SaveUploadedFile(r io.Reader, filename string) (string, string, int64, error) {
	fileID := uuid.New().String()
	ext := filepath.Ext(filename)
	storedName := fmt.Sprintf("%s%s", fileID, ext)
	targetPath := filepath.Join(sm.baseDir, storedName)

	out, err := os.Create(targetPath)
	if err != nil {
		return "", "", 0, err
	}
	defer out.Close()

	nBytes, err := io.Copy(out, r)
	if err != nil {
		os.Remove(targetPath)
		return "", "", 0, err
	}

	sm.mu.Lock()
	sm.fileExpiry[targetPath] = time.Now().Add(sm.retention)
	sm.mu.Unlock()

	return fileID, targetPath, nBytes, nil
}

func (sm *StorageManager) CreateTempFile(prefix, ext string) (string, error) {
	fileID := uuid.New().String()
	storedName := fmt.Sprintf("%s_%s%s", prefix, fileID, ext)
	targetPath := filepath.Join(sm.baseDir, storedName)

	sm.mu.Lock()
	sm.fileExpiry[targetPath] = time.Now().Add(sm.retention)
	sm.mu.Unlock()

	return targetPath, nil
}

func (sm *StorageManager) GetFilePath(storedName string) (string, error) {
	cleanName := filepath.Base(storedName)
	targetPath := filepath.Join(sm.baseDir, cleanName)
	if _, err := os.Stat(targetPath); os.IsNotExist(err) {
		return "", fmt.Errorf("file not found")
	}
	return targetPath, nil
}

func (sm *StorageManager) GenerateDownloadToken(fileID string, expiryMinutes int) string {
	expiresAt := time.Now().Add(time.Duration(expiryMinutes) * time.Minute).Unix()
	msg := fmt.Sprintf("%s:%d", fileID, expiresAt)

	h := hmac.New(sha256.New, sm.secretKey)
	h.Write([]byte(msg))
	sig := hex.EncodeToString(h.Sum(nil))

	return fmt.Sprintf("%s.%d.%s", fileID, expiresAt, sig)
}

func (sm *StorageManager) VerifyDownloadToken(token string) (string, bool) {
	var fileID string
	var expiresAt int64
	var sig string

	_, err := fmt.Sscanf(token, "%s.%d.%s", &fileID, &expiresAt, &sig)
	if err != nil {
		return "", false
	}

	// Simple validation
	if time.Now().Unix() > expiresAt {
		return "", false
	}

	return fileID, true
}

func (sm *StorageManager) DeleteFile(path string) error {
	sm.mu.Lock()
	delete(sm.fileExpiry, path)
	sm.mu.Unlock()
	return os.Remove(path)
}

func (sm *StorageManager) startAutoCleanupTicker(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for range ticker.C {
		sm.cleanupExpiredFiles()
	}
}

func (sm *StorageManager) cleanupExpiredFiles() {
	sm.mu.Lock()
	defer sm.mu.Unlock()

	now := time.Now()
	for path, expiry := range sm.fileExpiry {
		if now.After(expiry) {
			os.Remove(path)
			delete(sm.fileExpiry, path)
		}
	}
}
