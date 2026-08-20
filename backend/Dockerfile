FROM golang:alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/server/main.go

FROM alpine:latest

RUN apk add --no-cache \
    ffmpeg \
    imagemagick \
    imagemagick-jpeg \
    imagemagick-webp \
    imagemagick-heic \
    imagemagick-pdf \
    imagemagick-tiff \
    imagemagick-jp2 \
    imagemagick-svg \
    libjpeg-turbo \
    libwebp \
    libheif \
    libheif-plugins-all \
    ghostscript \
    poppler-utils \
    zip \
    ca-certificates \
    tzdata

WORKDIR /app
COPY --from=builder /app/server /app/server

ENV PORT=8080
ENV STORAGE_DIR=/tmp/fileprocessor_storage
ENV PDF_WORKERS=4
ENV IMAGE_WORKERS=8

EXPOSE 8080

CMD ["/app/server"]
