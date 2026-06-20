import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getBookById } from '@/services/mockBooks'
import { getSessionsForBook, getMessagesForSession } from '@/services/mockChatSessions'
import { buildBookWorkspacePath, buildBookWorkspaceSessionPath, ROUTES } from '@/routes/paths'
import type { Message } from '@/types/chat'
import SessionSidebar from '@/components/chat/SessionSidebar'
import ConversationHeader from '@/components/chat/ConversationHeader'
import MessageList from '@/components/chat/MessageList'
import MessageComposer from '@/components/chat/MessageComposer'

const SUGGESTED_PROMPTS = [
  'Summarize the key ideas',
  'What are the main takeaways?',
  'Explain this in simple terms',
  'How can I apply this in my life?',
]

const MOCK_REPLY_DELAY_MS = 1200

interface BookWorkspaceLayoutProps {
  bookId: string
  initialSessionId?: string
}

function BookWorkspaceLayout({ bookId, initialSessionId }: BookWorkspaceLayoutProps) {
  const navigate = useNavigate()
  const book = getBookById(bookId)

  const [sessions, setSessions] = useState(() => getSessionsForBook(bookId))
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    initialSessionId ?? sessions[0]?.id ?? null
  )
  const [messages, setMessages] = useState<Message[]>(
    activeSessionId ? getMessagesForSession(activeSessionId) : []
  )
  const [isSessionSidebarOpen, setIsSessionSidebarOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Reset everything when navigating between different book workspaces.
  useEffect(() => {
    const bookSessions = getSessionsForBook(bookId)
    setSessions(bookSessions)
    const nextActiveId = initialSessionId ?? bookSessions[0]?.id ?? null
    setActiveSessionId(nextActiveId)
    setMessages(nextActiveId ? getMessagesForSession(nextActiveId) : [])
    setIsTyping(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  // Sync to a session id arriving from the URL (e.g. clicking a Dashboard
  // "Recent Conversations" link while already inside a workspace).
  useEffect(() => {
    if (initialSessionId) {
      setActiveSessionId(initialSessionId)
      setMessages(getMessagesForSession(initialSessionId))
      setIsTyping(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSessionId])

  if (!book) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-surface-border bg-surface-elevated p-6 text-center">
        <p className="text-sm font-medium text-gray-200">Book not found</p>
        <p className="mt-1 text-xs text-gray-500">This book may have been removed.</p>
        <Link
          to={ROUTES.BOOKS}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-500"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Library
        </Link>
      </div>
    )
  }

  const activeSession = sessions.find((s) => s.id === activeSessionId)

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id)
    setMessages(getMessagesForSession(id))
    setIsTyping(false)
    navigate(buildBookWorkspaceSessionPath(bookId, id))
  }

  const handleNewChat = () => {
    // TEMPORARY — UI-only "new chat" for this phase. Real implementation
    // (later phase) calls POST /books/:bookId/sessions, prepends the
    // returned session to the list, and navigates to it the same way.
    setActiveSessionId(null)
    setMessages([])
    setIsTyping(false)
    setIsSessionSidebarOpen(false)
    navigate(buildBookWorkspacePath(bookId))
  }

  const handleSend = (text: string) => {
    if (!activeSessionId) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sessionId: activeSessionId,
      role: 'user',
      content: text,
      status: 'sent',
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // TEMPORARY mock reply — will be replaced by a real
    // POST /chat/sessions/:id/messages call. isTyping mirrors the
    // "waiting for the response to start" state a real request has, and
    // the eventual response can transition through a 'streaming' status
    // on this same message shape as tokens arrive — no UI changes needed.
    setTimeout(() => {
      const mockReply: Message = {
        id: `msg-${Date.now() + 1}`,
        sessionId: activeSessionId,
        role: 'assistant',
        content:
          'This is a placeholder response — real AI answers will appear here once the backend is connected.',
        status: 'sent',
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, mockReply])
      setIsTyping(false)
    }, MOCK_REPLY_DELAY_MS)
  }

  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-surface-border bg-surface-elevated">
      <SessionSidebar
        bookTitle={book.title}
        sessions={sessions}
        activeSessionId={activeSessionId}
        isOpen={isSessionSidebarOpen}
        onClose={() => setIsSessionSidebarOpen(false)}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <ConversationHeader
          session={activeSession}
          bookTitle={book.title}
          onMenuClick={() => setIsSessionSidebarOpen(true)}
        />
        <MessageList
          messages={messages}
          isTyping={isTyping}
          bookTitle={book.title}
          suggestions={SUGGESTED_PROMPTS}
          onSuggestionClick={handleSend}
        />
        <MessageComposer onSend={handleSend} disabled={!activeSessionId || isTyping} />
      </div>
    </div>
  )
}

export default BookWorkspaceLayout