import { BookOpen, MessageSquare, Trash2, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Book } from '@/types/book'
import { buildBookWorkspacePath } from '@/routes/paths'
import { formatRelativeTime } from '@/utils/formatDate'
import Badge from '@/components/ui/Badge'

interface BookCardProps {
  book: Book
  onDeleteClick: (book: Book) => void
}

function BookCard({ book, onDeleteClick }: BookCardProps) {
  const statusConfig = {
    ready: { variant: 'success' as const, label: 'Ready' },
    processing: { variant: 'warning' as const, label: 'Processing' },
    failed: { variant: 'danger' as const, label: 'Failed' },
  }[book.status]

  return (
    <div className="group flex flex-col rounded-xl border border-surface-border bg-surface-elevated p-4 transition-colors duration-150 hover:border-surface-border/80">
      <div className="flex items-start justify-between">
        <span
          className={`flex h-14 w-11 flex-shrink-0 items-center justify-center rounded-md ${book.coverColorClass} transition-transform duration-150 group-hover:scale-105`}
        >
          <BookOpen className="h-5 w-5" />
        </span>
        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
      </div>

      <div className="mt-3 min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-gray-100">{book.title}</h3>
        <p className="truncate text-xs text-gray-500">{book.author}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {book.fileType}
        </span>
        <span>{book.pageCount} pages</span>
        <span>{formatRelativeTime(book.uploadedAt)}</span>
      </div>

      <div className="mt-1.5 text-xs text-gray-500">
        {book.questionCount > 0
          ? `${book.questionCount} questions asked`
          : 'No questions yet'}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-surface-border pt-3">
        <Link
          to={buildBookWorkspacePath(book.id)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
            book.status === 'ready'
              ? 'bg-brand-600 text-white hover:bg-brand-500'
              : 'pointer-events-none bg-surface-border text-gray-500'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Open Chat
        </Link>
        <button
          onClick={() => onDeleteClick(book)}
          className="flex items-center justify-center rounded-lg border border-surface-border p-1.5 text-gray-500 transition-colors duration-150 hover:border-red-500/40 hover:text-red-400"
          aria-label={`Delete ${book.title}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default BookCard