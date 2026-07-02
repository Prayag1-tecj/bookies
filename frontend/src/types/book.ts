export type BookStatus = 'ready' | 'processing' | 'failed' | 'uploaded'

export interface Book {
  id: string
  title: string
  fileType: 'PDF' | 'EPUB' | 'TXT' | 'DOCX'
  fileSizeMb: number
  status: BookStatus
  uploadedAt: string
  coverColorClass: string
}