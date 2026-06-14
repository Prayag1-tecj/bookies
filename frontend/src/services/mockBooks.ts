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
  },
  {
    id: 'book-2',
    title: 'Deep Work',
    author: 'Cal Newport',
    coverColorClass: 'bg-emerald-500/15 text-emerald-400',
    pageCount: 296,
    uploadedAt: new Date(Date.now() - 1 * DAY).toISOString(),
  },
  {
    id: 'book-3',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    coverColorClass: 'bg-amber-500/15 text-amber-400',
    pageCount: 499,
    uploadedAt: new Date(Date.now() - 3 * DAY).toISOString(),
  },
  {
    id: 'book-4',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas, Andrew Hunt',
    coverColorClass: 'bg-sky-500/15 text-sky-400',
    pageCount: 352,
    uploadedAt: new Date(Date.now() - 6 * DAY).toISOString(),
  },
]

// Will become: axios.get<Book[]>('/books').then(res => res.data)
export function getAllBooks(): Book[] {
  return books
}

// Will eventually be a backend query param (?sort=recent&limit=4)
export function getRecentBooks(limit = 4): Book[] {
  return [...books]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, limit)
}