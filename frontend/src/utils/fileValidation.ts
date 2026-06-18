export const ACCEPTED_FILE_TYPES = ['.pdf', '.epub', '.docx', '.txt']
export const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/epub+zip',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export interface FileValidationResult {
  isValid: boolean
  error?: string
}

export function validateFile(file: File): FileValidationResult {
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()

  if (!ACCEPTED_FILE_TYPES.includes(extension)) {
    return {
      isValid: false,
      error: `Unsupported file type. Accepted: ${ACCEPTED_FILE_TYPES.join(', ')}`,
    }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File exceeds the 10MB size limit`,
    }
  }

  return { isValid: true }
}