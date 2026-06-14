import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import type { ChatSession } from '@/types/chat'
import { buildChatSessionPath } from '@/routes/paths'
import { formatRelativeTime } from '@/utils/formatDate'

interface RecentSessionCardProps {
  session: ChatSession
}

function RecentSessionCard({ session }: RecentSessionCardProps) {
  return (
    <Link
      to={buildChatSessionPath(session.id)}
      className="group flex items-start gap-3 rounded-lg border border-surface-border p-3 transition-colors duration-150 hover:border-brand-500/40 hover:bg-surface-subtle"
    >
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-brand-600/15 text-brand-400 transition-transform duration-150 group-hover:scale-105">
        <MessageSquare className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-gray-100">{session.title}</p>
          <span className="flex-shrink-0 text-xs text-gray-500">
            {formatRelativeTime(session.updatedAt)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-gray-500">{session.bookTitle}</p>
        <p className="mt-1 truncate text-xs text-gray-400">{session.lastMessage}</p>
      </div>
    </Link>
  )
}

export default RecentSessionCard