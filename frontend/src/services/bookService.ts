import api from './api'
import type { Book, BookStatus } from '@/types/book'

// ─── Backend response shapes ──────────────────────────────────────────────────

interface BookListResponse {
  id: number
  title: string
  file_type: string
  file_size_mb: number
  status: string
  created_at: string
}

interface BookUploadResponse {
  id: number
  title: string
  file: string
  file_type: string
  file_size_mb: number
  status: string
}

// ─── Deterministic cover color ────────────────────────────────────────────────

const COVER_COLORS = [
  'bg-violet-500/15 text-violet-400',
  'bg-emerald-500/15 text-emerald-400',
  'bg-amber-500/15 text-amber-400',
  'bg-sky-500/15 text-sky-400',
  'bg-rose-500/15 text-rose-400',
  'bg-indigo-500/15 text-indigo-400',
  'bg-teal-500/15 text-teal-400',
  'bg-orange-500/15 text-orange-400',
]

function coverColor(id: number): string {
  return COVER_COLORS[id % COVER_COLORS.length]
}

// ─── Transform ────────────────────────────────────────────────────────────────

function transformBook(raw: BookListResponse | BookUploadResponse): Book {
  return {
    id: String(raw.id),
    title: raw.title,
    fileType: raw.file_type as Book['fileType'],
    fileSizeMb: raw.file_size_mb,
    status: raw.status.toLowerCase() as BookStatus,
    uploadedAt: 'created_at' in raw ? raw.created_at : new Date().toISOString(),
    coverColorClass: coverColor(raw.id),
  }
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function fetchBooks(): Promise<Book[]> {
  const { data } = await api.get<BookListResponse[]>('/api/books/')
  return data.map(transformBook)
}

export async function uploadBook(file: File): Promise<Book> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', file.name.replace(/\.[^/.]+$/, ''))
  const { data } = await api.post<BookUploadResponse>('/api/books/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return transformBook(data)
}

export async function deleteBook(bookId: string): Promise<void> {
  await api.delete(`/api/books/${bookId}/delete/`)
}

// Used by BookWorkspaceLayout during Phase B/C transition
export function findBookById(books: Book[], id: string): Book | undefined {
  return books.find((b) => b.id === id)
}