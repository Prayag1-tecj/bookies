import api from './api'
import type { ChatSession } from '@/types/chat'
import type { Book } from '@/types/book'

interface SessionListItem {
  id: number
  title: string
  book_id: number
  created_at: string
}

interface SessionCreateResponse {
  id: number
  title: string
  book_id: number
}

function transformSession(raw: SessionListItem, books: Book[]): ChatSession {
  const book = books.find((b) => b.id === String(raw.book_id))
  return {
    id: String(raw.id),
    bookId: String(raw.book_id),
    bookTitle: book?.title ?? '',
    title: raw.title,
    updatedAt: raw.created_at,
  }
}

export async function fetchAllSessions(books: Book[]): Promise<ChatSession[]> {
  const { data } = await api.get<SessionListItem[]>('/api/chat/sessions/')
  return data.map((s) => transformSession(s, books))
}

export async function fetchSessionsForBook(
  bookId: string,
  books: Book[]
): Promise<ChatSession[]> {
  const all = await fetchAllSessions(books)
  return all.filter((s) => s.bookId === bookId)
}

export async function createSession(
  bookId: string,
  title = 'New Chat'
): Promise<ChatSession> {
  const { data } = await api.post<SessionCreateResponse>(
    '/api/chat/sessions/create/',
    { book_id: Number(bookId), title }
  )
  return {
    id: String(data.id),
    bookId: String(data.book_id),
    bookTitle: '',
    title: data.title,
    updatedAt: new Date().toISOString(),
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  await api.delete(`/api/chat/sessions/${sessionId}/`)
}