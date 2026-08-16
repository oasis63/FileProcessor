# FileProcessor — API Documentation

## Base URL

`/api/v1`

## Endpoints

### 1. Health Check
`GET /health`

**Response:**
```json
{
  "status": "healthy",
  "service": "fileprocessor-api",
  "timestamp": "2026-08-17T02:00:00Z"
}
```

### 2. List Available Tools
`GET /tools`

**Response:**
```json
{
  "tools": [
    {
      "id": "compress-pdf",
      "name": "Compress PDF",
      "category": "PDF",
      "description": "Reduce PDF file size while preserving quality",
      "supportedInputFormats": ["pdf"],
      "supportedOutputFormats": ["pdf"]
    }
  ]
}
```

### 3. File Upload
`POST /upload` (multipart/form-data)

**Request:** `file` or `files` binary attachment.

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "id": "uuid-v4",
      "originalName": "document.pdf",
      "mimeType": "application/pdf",
      "sizeBytes": 2048500
    }
  ]
}
```

### 4. Create Processing Job
`POST /jobs`

**Payload:**
```json
{
  "toolId": "compress-pdf",
  "files": [...],
  "options": {
    "preset": "ebook",
    "targetBytes": 2097152
  }
}
```

### 5. Get Job Status & Progress
`GET /jobs/:id`

### 6. Download Result Output
`GET /jobs/:id/download`
Returns direct attachment file stream.
