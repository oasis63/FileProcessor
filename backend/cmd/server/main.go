package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/fileprocessor/backend/internal/api"
	"github.com/fileprocessor/backend/internal/config"
	"github.com/fileprocessor/backend/internal/jobs"
	"github.com/fileprocessor/backend/internal/storage"
)

func main() {
	cfg := config.LoadConfig()

	log.Printf("Starting FileProcessor Go Backend Server on port %s...", cfg.Port)

	sm, err := storage.NewStorageManager(cfg.StorageDir, cfg.FileRetentionMins)
	if err != nil {
		log.Fatalf("Fatal: storage manager failed to initialize: %v", err)
	}

	jobMgr := jobs.NewJobManager(cfg, sm)
	handler := api.NewAPIHandler(cfg, sm, jobMgr)
	router := api.NewRouter(handler)

	serverAddr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Server listening at http://localhost%s", serverAddr)

	if err := http.ListenAndServe(serverAddr, router); err != nil {
		log.Fatalf("Server stopped: %v", err)
		os.Exit(1)
	}
}
