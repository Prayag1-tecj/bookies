export type BookStatus = 'ready' | 'processing' | 'failed'

export interface Book {
  id: string
  title: string
  author: string
  coverColorClass: string
  pageCount: number
  uploadedAt: string
  fileType: 'PDF' | 'EPUB'
  status: BookStatus
  questionCount: number
}