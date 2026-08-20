let pendingFiles: File[] = [];

export function setPendingFiles(files: File[]) {
  pendingFiles = files.slice();
}

export function takePendingFiles(): File[] {
  const files = pendingFiles;
  pendingFiles = [];
  return files;
}
