export type ToolCategory = 'PDF' | 'IMAGE';

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  supportedInputFormats: string[];
  supportedOutputFormats: string[];
}

export interface FileMetadata {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface JobError {
  code: string;
  message: string;
}

export interface Job {
  id: string;
  toolId: string;
  status: JobStatus;
  inputFiles: FileMetadata[];
  outputFile?: FileMetadata;
  options: Record<string, any>;
  progress: number;
  error?: JobError;
  originalSize: number;
  processedSize: number;
  savingsPct: number;
  createdAt: string;
  completedAt?: string;
}
