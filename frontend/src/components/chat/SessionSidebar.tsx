import { Link } from 'react-router-dom'
import { Plus, ArrowLeft } from 'lucide-react'
import type { ChatSession } from '@/types/chat'
import { ROUTES } from '@/routes/paths'
import SessionListItem from './SessionListItem'

interface SessionSidebarProps {
  bookTitle: string
  sessions: ChatSession[]
  activeSessionId: string | null
  isOpen: boolean
  onClose: () => void
  onSelectSession: (id: string) => void
  onNewChat: () => void
}

function SessionSidebar({
  bookTitle,
  sessions,
  activeSessionId,
  isOpen,
  onClose,
  onSelectSession,
  onNewChat,
}: SessionSidebarProps) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 animate-fade-in lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-shrink-0 flex-col border-r border-surface-border bg-surface-subtle transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-shrink-0 border-b border-surface-border p-3">
          <Link
            to={ROUTES.BOOKS}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors duration-150 hover:text-gray-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Library
          </Link>
          <h2 className="mt-2 truncate text-sm font-semibold text-gray-100">{bookTitle}</h2>
        </div>

        <div className="flex-shrink-0 p-3">
          <button
            onClick={onNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-surface-border px-3 py-2.5 text-sm font-medium text-gray-200 transition-colors duration-150 hover:bg-surface-elevated active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
          <p className="px-3 pb-1.5 pt-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Sessions
          </p>
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <SessionListItem
                key={session.id}
                session={session}
                isActive={session.id === activeSessionId}
                onClick={() => {
                  onSelectSession(session.id)
                  onClose()
                }}
              />
            ))
          ) : (
            <p className="px-3 py-2 text-xs text-gray-500">
              No sessions yet. Start a new chat to begin.
            </p>
          )}
        </div>
      </aside>
    </>
  )
}

export default SessionSidebar