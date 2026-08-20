'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, AlertCircle, FileText, Image as ImageIcon, Video, Headphones } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  disabled?: boolean;
}

export function FileDropzone({
  accept = '*/*',
  multiple = false,
  maxSizeMB = 100,
  files,
  onFilesSelected,
  onRemoveFile,
  disabled = false,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const validateAndAddFiles = (incomingFiles: FileList | File[]) => {
    setErrorMsg(null);
    const valid: File[] = [];
    const maxBytes = maxSizeMB * 1024 * 1024;

    Array.from(incomingFiles).forEach((file) => {
      if (file.size > maxBytes) {
        setErrorMsg(`"${file.name}" exceeds the maximum ${maxSizeMB} MB size limit.`);
        return;
      }
      valid.push(file);
    });

    if (valid.length > 0) {
      if (multiple) {
        onFilesSelected([...files, ...valid]);
      } else {
        onFilesSelected([valid[0]]);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (file.type.includes('image')) return <ImageIcon className="w-6 h-6 text-brand-600" />;
    if (file.type.includes('video') || /\.(mp4|mov|avi|mkv|webm|flv|wmv|3gp)$/i.test(file.name)) return <Video className="w-6 h-6 text-purple-500" />;
    if (file.type.includes('audio') || /\.(mp3|wav|aac|m4a|ogg|flac)$/i.test(file.name)) return <Headphones className="w-6 h-6 text-emerald-500" />;
    return <File className="w-6 h-6 text-gray-400" />;
  };

  return (
    <div className="w-full space-y-4">
      {/* Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative group cursor-pointer border border-dashed rounded-md p-8 sm:p-11 text-center ${
          isDragOver
            ? 'border-brand-500 bg-brand-50 dark:bg-night dark:border-brand-400'
            : 'border-paper-line dark:border-night-border hover:border-brand-500 bg-paper-raised dark:bg-night-raised'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-md bg-brand-50 dark:bg-night text-brand-700 dark:text-brand-300 border border-paper-line dark:border-night-border flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <p className="text-base font-semibold text-ink dark:text-paper">
              Drop a file here, or <span className="text-brand-700 dark:text-brand-300 underline underline-offset-2">browse</span>
            </p>
            <p className="text-sm text-ink-muted dark:text-paper/60 mt-1">
              PDF, JPG, PNG, WebP, MP4, MOV, MKV — up to {maxSizeMB} MB
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* File List / Cards */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Selected File{files.length > 1 ? 's' : ''} ({files.length})
          </p>
          <div className="grid grid-cols-1 gap-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
              >
                <div className="flex items-center space-x-3 truncate">
                  {getFileIcon(file)}
                  <div className="truncate">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(idx);
                  }}
                  disabled={disabled}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
