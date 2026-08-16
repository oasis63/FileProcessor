package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port              string
	StorageDir        string
	PDFWorkers        int
	ImageWorkers      int
	MaxConcurrentJobs int
	MaxFileSizeMB     int64
	FileRetentionMins int
}

func LoadConfig() *Config {
	return &Config{
		Port:              getEnv("PORT", "8080"),
		StorageDir:        getEnv("STORAGE_DIR", "/tmp/fileprocessor_storage"),
		PDFWorkers:        getEnvInt("PDF_WORKERS", 4),
		ImageWorkers:      getEnvInt("IMAGE_WORKERS", 8),
		MaxConcurrentJobs: getEnvInt("MAX_CONCURRENT_JOBS", 12),
		MaxFileSizeMB:     int64(getEnvInt("MAX_FILE_SIZE_MB", 100)),
		FileRetentionMins: getEnvInt("FILE_RETENTION_MINS", 60),
	}
}

func getEnv(key, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	if valStr, ok := os.LookupEnv(key); ok {
		if val, err := strconv.Atoi(valStr); err == nil {
			return val
		}
	}
	return defaultVal
}
