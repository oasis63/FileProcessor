# FileProcessor

> **The fastest and easiest place on the internet to solve any PDF or image problem.**

FileProcessor is an online utility platform engineered with Next.js 15, React 19, TypeScript, Tailwind CSS, and a high-performance Go processing engine.

---

## Features

- **PDF Engine**: Compress PDF, Target Size Optimization (< 2 MB), Merge PDF, Split PDF, Extract/Delete Pages, Rotate, PDF → JPG, Protect PDF, Remove Metadata.
- **Image Engine**: Compress Image, Target Image Size (< 500 KB), Resize Image (Presets & Custom), Crop, JPG ↔ PNG ↔ WebP ↔ HEIC conversions, Remove Metadata, Image → PDF.
- **Media Engine**: Video to Audio conversion (MP4/MOV/MKV → MP3/WAV/AAC/M4A/FLAC/OGG), Bitrate Control, Direct Stream Copy, Timestamp Audio Clipping.
- **Target Size Optimizer**: Bisection search strategy to reach target file byte limits automatically.
- **Privacy & Security**: Zero permanent file retention, automatic temp file destruction, magic byte validation, path & command injection protection.
- **Modern UI/UX**: Dark & Light mode support, responsive drag & drop file upload, comparative savings badges (`Saved 78%`), and workflow next actions.

---

## Quick Start (Local Development)

### Prerequisites

- [Go 1.22+](https://golang.org)
- [Node.js 20+](https://nodejs.org)
- Installed dependencies: `FFmpeg`, `ImageMagick (v7)`, `Ghostscript`, `Poppler (pdftoppm)`

### 1. Start Go Backend Server

```bash
cd backend
go run ./cmd/server/main.go
# Listens at http://localhost:8080
```

### 2. Start Frontend Next.js App

```bash
cd frontend
npm run dev
# Listens at http://localhost:3000
```

---

## Docker Compose Setup

Run the entire full-stack application inside isolated containers:

```bash
docker compose up --build
```

Access the application at [http://localhost:3000](http://localhost:3000).

---

## Documentation

- [Architecture Overview](docs/architecture.md)
- [REST API Specifications](docs/api.md)
