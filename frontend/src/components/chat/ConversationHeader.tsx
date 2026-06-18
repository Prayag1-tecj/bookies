import { Menu, BookOpen } from 'lucide-react'
import type { ChatSession } from '@/types/chat'

interface ConversationHeaderProps {
  session: ChatSession | undefined
  onMenuClick: () => void
}

function ConversationHeader({ session, onMenuClick }: ConversationHeaderProps) {
  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-surface-border px-4">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-400 transition-colors duration-150 hover:bg-surface-subtle hover:text-gray-100 lg:hidden"
        aria-label="Open sessions"
      >
        <Menu className="h-5 w-5" />
      </button>

      {session ? (
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-brand-600/15 text-brand-400">
            <BookOpen className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-100">{session.title}</p>
            <p className="truncate text-xs text-gray-500">{session.bookTitle}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm font-medium text-gray-400">Select a conversation</p>
      )}
    </header>
  )
}

export default ConversationHeader