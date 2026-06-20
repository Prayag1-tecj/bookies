import { MessageSquare } from 'lucide-react'
import type { ChatSession } from '@/types/chat'
import { formatRelativeTime } from '@/utils/formatDate'

interface SessionListItemProps {
  session: ChatSession
  isActive: boolean
  onClick: () => void
}

function SessionListItem({ session, isActive, onClick }: SessionListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ${
        isActive
          ? 'bg-brand-600/15 text-brand-400'
          : 'text-gray-300 hover:bg-surface-elevated hover:text-gray-100'
      }`}
    >
      <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{session.title}</p>
          <span className="flex-shrink-0 text-xs text-gray-500">
            {formatRelativeTime(session.updatedAt)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-gray-500">{session.lastMessage}</p>
      </div>
    </button>
  )
}

export default SessionListItem