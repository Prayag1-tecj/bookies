import type { Book } from '@/types/book'

const HOUR = 1000 * 60 * 60
const DAY = HOUR * 24

const books: Book[] = [
  {
    id: 'book-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverColorClass: 'bg-violet-500/15 text-violet-400',
    pageCount: 320,
    uploadedAt: new Date(Date.now() - 2 * HOUR).toISOString(),
    fileType: 'PDF',
    status: 'ready',
    questionCount: 34,
  },
  {
    id: 'book-2',
    title: 'Deep Work',
    author: 'Cal Newport',
    coverColorClass: 'bg-emerald-500/15 text-emerald-400',
    pageCount: 296,
    uploadedAt: new Date(Date.now() - 1 * DAY).toISOString(),
    fileType: 'EPUB',
    status: 'ready',
    questionCount: 19,
  },
  {
    id: 'book-3',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    coverColorClass: 'bg-amber-500/15 text-amber-400',
    pageCount: 499,
    uploadedAt: new Date(Date.now() - 3 * DAY).toISOString(),
    fileType: 'PDF',
    status: 'ready',
    questionCount: 52,
  },
  {
    id: 'book-4',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas, Andrew Hunt',
    coverColorClass: 'bg-sky-500/15 text-sky-400',
    pageCount: 352,
    uploadedAt: new Date(Date.now() - 6 * DAY).toISOString(),
    fileType: 'PDF',
    status: 'processing',
    questionCount: 0,
  },
  {
    id: 'book-5',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    coverColorClass: 'bg-rose-500/15 text-rose-400',
    pageCount: 443,
    uploadedAt: new Date(Date.now() - 9 * DAY).toISOString(),
    fileType: 'EPUB',
    status: 'failed',
    questionCount: 0,
  },
]

// Will become: axios.get<Book[]>('/books').then(res => res.data)
export function getAllBooks(): Book[] {
  return books
}

export function getRecentBooks(limit = 4): Book[] {
  return [...books]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, limit)
}