import { FileMetadata, Job, Tool } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://fileprocessor-cav6.onrender.com/api/v1';

export async function getTools(): Promise<Tool[]> {
  try {
    const res = await fetch(`${API_BASE}/tools`);
    if (!res.ok) throw new Error('Failed to fetch tools');
    const data = await res.json();
    return data.tools || [];
  } catch (err) {
    console.error('getTools error:', err);
    return [];
  }
}

export async function uploadFiles(files: File[]): Promise<FileMetadata[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('file', file));

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'File upload failed');
  }

  const data = await res.json();
  return data.files;
}

export async function createJob(toolId: string, files: FileMetadata[], options: Record<string, any> = {}): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toolId, files, options }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create job');
  }

  return res.json();
}

export async function getJobStatus(jobId: string): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`);
  if (!res.ok) throw new Error('Failed to fetch job status');
  return res.json();
}

export function getDownloadUrl(jobId: string): string {
  return `${API_BASE}/jobs/${jobId}/download`;
}
