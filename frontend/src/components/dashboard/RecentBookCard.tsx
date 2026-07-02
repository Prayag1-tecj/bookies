import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import type { Book } from '@/types/book'
import { buildBookWorkspacePath } from '@/routes/paths'
import { formatRelativeTime } from '@/utils/formatDate'

interface RecentBookCardProps {
  book: Book
}

function RecentBookCard({ book }: RecentBookCardProps) {
  return (
    <Link
      to={buildBookWorkspacePath(book.id)}
      className="group flex items-center gap-3 rounded-lg border border-surface-border p-3 transition-colors duration-150 hover:border-brand-500/40 hover:bg-surface-subtle"
    >
      <span
        className={`flex h-11 w-9 flex-shrink-0 items-center justify-center rounded-md ${book.coverColorClass} transition-transform duration-150 group-hover:scale-105`}
      >
        <BookOpen className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-100">{book.title}</p>
        <p className="truncate text-xs text-gray-500">{book.fileType} · {book.fileSizeMb.toFixed(1)} MB</p>
      </div>

      <span className="flex-shrink-0 text-xs text-gray-500">
        {formatRelativeTime(book.uploadedAt)}
      </span>
    </Link>
  )
}

export default RecentBookCard