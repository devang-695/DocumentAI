export const allowedTypes = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "text/markdown",
] as const;

export type AllowedFileType = (typeof allowedTypes)[number];

export function isAllowedFileType(fileType: string): fileType is AllowedFileType {
  return allowedTypes.some((allowedType): boolean => allowedType === fileType);
}

export function formatFileSize(bytes?: number): string {
  if (bytes === undefined) {
    return "N/A";
  }

  if (bytes < 1024) {
    return `${bytes} bytes`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
