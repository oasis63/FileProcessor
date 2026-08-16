# FileProcessor — System Architecture Document

## Overview

FileProcessor is built as a decoupled, micro-service architecture consisting of a Next.js 15 SSR/Client frontend and a high-throughput Go REST backend orchestrating native PDF/Image transformation utilities (`pdfcpu`, `Ghostscript`, `ImageMagick`, `Poppler`).

```text
User Browser
    │
    ▼
Next.js Frontend (App Router, Tailwind CSS, TypeScript)
    │
    ▼ REST API
Go Backend Server (Chi Router, Rate Limiter, Magic Byte Validation)
    │
    ├── Job Manager & File Storage Manager
    │
    ▼ Bounded Go Channel Queue
Worker Pool
    ├── PDF Workers (pdfcpu, gs, pdftoppm)
    └── Image Workers (magick CLI & codecs)
```

## Modular Processor Engine

Processing logic is divided into two distinct domains:
1. `PDFProcessor`: Handles compression (Ghostscript presets), target size binary search, merging (pdfcpu), splitting, rotating, protection (AES encryption), and page-to-image conversions (pdftoppm).
2. `ImageProcessor`: Handles compression, bisection target byte search, resizing (geometry bounding), cropping, and format conversions (JPG ↔ PNG ↔ WebP ↔ HEIC).

## Security & File Lifecycle

1. **Input Validation**: HTTP sniffing (`http.DetectContentType`) + magic byte validation to prevent MIME spoofing.
2. **Path & Shell Isolation**: Filename sanitization via strict regex matching; command execution uses explicit `exec.CommandContext` argument vectors.
3. **Retention Policy**: Auto-cleanup background ticker purges temp files after 60 minutes.
