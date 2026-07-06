import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { fetchBooks, findBookById } from '@/services/bookService'
import { fetchSessionsForBook, createSession } from '@/services/sessionService'
import { fetchMessages, askQuestion } from '@/services/messageService'
import {
  buildBookWorkspaceSessionPath,
  ROUTES,
} from '@/routes/paths'
import type { Book } from '@/types/book'
import type { ChatSession, Message } from '@/types/chat'
import SessionSidebar from '@/components/chat/SessionSidebar'
import ConversationHeader from '@/components/chat/ConversationHeader'
import MessageList from '@/components/chat/MessageList'
import MessageComposer from '@/components/chat/MessageComposer'
import Spinner from '@/components/ui/Spinner'
import ErrorBanner from '@/components/ui/ErrorBanner'

const SUGGESTED_PROMPTS = [
  'Summarize the key ideas',
  'What are the main takeaways?',
  'Explain this in simple terms',
  'How can I apply this in my life?',
]

interface BookWorkspaceLayoutProps {
  bookId: string
  initialSessionId?: string
}

function BookWorkspaceLayout({ bookId, initialSessionId }: BookWorkspaceLayoutProps) {
  const navigate = useNavigate()

  const [book, setBook] = useState<Book | undefined>(undefined)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isSessionSidebarOpen, setIsSessionSidebarOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [workspaceError, setWorkspaceError] = useState<string | null>(null)
  const [messagesError, setMessagesError] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)

  const loadMessages = useCallback(async (sessionId: string) => {
    setIsLoadingMessages(true)
    setMessagesError(null)
    try {
      const msgs = await fetchMessages(sessionId)
      setMessages(msgs)
    } catch {
      setMessagesError('Failed to load messages.')
    } finally {
      setIsLoadingMessages(false)
    }
  }, [])

  const loadWorkspace = useCallback(async () => {
    setIsLoadingWorkspace(true)
    setWorkspaceError(null)
    try {
      const allBooks = await fetchBooks()
      const found = findBookById(allBooks, bookId)
      setBook(found)

      if (!found) {
        setIsLoadingWorkspace(false)
        return
      }

      const bookSessions = await fetchSessionsForBook(bookId, allBooks)
      setSessions(bookSessions)

      const startId = initialSessionId ?? bookSessions[0]?.id ?? null
      setActiveSessionId(startId)

      if (startId) {
        await loadMessages(startId)
      } else {
        setMessages([])
      }
    } catch {
      setWorkspaceError('Failed to load the workspace. Please try again.')
    } finally {
      setIsLoadingWorkspace(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  useEffect(() => {
    loadWorkspace()
  }, [loadWorkspace])

  // Sync when URL session param changes while workspace is already mounted
  useEffect(() => {
    if (!initialSessionId || initialSessionId === activeSessionId) return
    setActiveSessionId(initialSessionId)
    loadMessages(initialSessionId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSessionId])

  const handleSelectSession = async (id: string) => {
    setActiveSessionId(id)
    setMessages([])
    setSendError(null)
    setIsSessionSidebarOpen(false)
    navigate(buildBookWorkspaceSessionPath(bookId, id))
    await loadMessages(id)
  }

  const handleNewChat = async () => {
    if (!book) return
    setIsSessionSidebarOpen(false)
    try {
      const newSession = await createSession(bookId, 'New Chat')
      newSession.bookTitle = book.title
      setSessions((prev) => [newSession, ...prev])
      setActiveSessionId(newSession.id)
      setMessages([])
      setSendError(null)
      navigate(buildBookWorkspaceSessionPath(bookId, newSession.id))
    } catch {
      setWorkspaceError('Failed to create a new chat session.')
    }
  }

  const handleSend = async (text: string) => {
    if (!activeSessionId) return
    setSendError(null)

    const tempUserMsg: Message = {
      id: `temp-user-${Date.now()}`,
      sessionId: activeSessionId,
      role: 'user',
      content: text,
      status: 'sent',
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempUserMsg])
    setIsTyping(true)

    try {
      const answer = await askQuestion(activeSessionId, text)

      // Backend auto-renames "New Chat" sessions to the first question
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId && s.title === 'New Chat'
            ? { ...s, title: text.slice(0, 100) }
            : s
        )
      )

      const assistantMsg: Message = {
        id: `temp-ai-${Date.now()}`,
        sessionId: activeSessionId,
        role: 'assistant',
        content: answer,
        status: 'sent',
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err: unknown) {
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id))
      const axiosErr = err as {
        response?: { status: number }
      }
      if (axiosErr?.response?.status === 403) {
        setSendError('Daily question limit reached. Resets at midnight.')
      } else if (!axiosErr?.response) {
        setSendError('Cannot reach the server. Check your connection.')
      } else {
        setSendError('Failed to get a response. Please try again.')
      }
    } finally {
      setIsTyping(false)
    }
  }

  // ── Render states ───────────────────────────────────────────────────────────

  if (isLoadingWorkspace) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-surface-border bg-surface-elevated">
        <Spinner size="lg" />
      </div>
    )
  }

  if (workspaceError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-surface-border bg-surface-elevated p-6">
        <ErrorBanner message={workspaceError} onRetry={loadWorkspace} />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-surface-border bg-surface-elevated p-6 text-center">
        <p className="text-sm font-medium text-gray-200">Book not found</p>
        <p className="mt-1 text-xs text-gray-500">
          This book may have been removed.
        </p>
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

        {isLoadingMessages ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {(messagesError || sendError) && (
              <div className="px-4 pt-4">
                <ErrorBanner
                  message={(messagesError ?? sendError)!}
                  onRetry={
                    messagesError
                      ? () => activeSessionId && loadMessages(activeSessionId)
                      : undefined
                  }
                />
              </div>
            )}
            <MessageList
              messages={messages}
              isTyping={isTyping}
              bookTitle={book.title}
              suggestions={SUGGESTED_PROMPTS}
              onSuggestionClick={handleSend}
            />
          </>
        )}

        <MessageComposer
          onSend={handleSend}
          disabled={!activeSessionId || isTyping || isLoadingMessages}
        />
      </div>
    </div>
  )
}

export default BookWorkspaceLayout
