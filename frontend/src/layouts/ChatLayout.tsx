import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllSessions, getMessagesForSession } from '@/services/mockChatSessions'
import { buildChatSessionPath } from '@/routes/paths'
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

interface ChatLayoutProps {
  initialSessionId?: string
}

function ChatLayout({ initialSessionId }: ChatLayoutProps) {
  const navigate = useNavigate()
  const [sessions] = useState(getAllSessions())
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    initialSessionId ?? sessions[0]?.id ?? null
  )
  const [messages, setMessages] = useState<Message[]>(
    activeSessionId ? getMessagesForSession(activeSessionId) : []
  )
  const [isSessionSidebarOpen, setIsSessionSidebarOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (initialSessionId) {
      setActiveSessionId(initialSessionId)
      setMessages(getMessagesForSession(initialSessionId))
      setIsTyping(false)
    }
  }, [initialSessionId])

  const activeSession = sessions.find((s) => s.id === activeSessionId)

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id)
    setMessages(getMessagesForSession(id))
    setIsTyping(false)
    navigate(buildChatSessionPath(id))
  }

  const handleNewChat = () => {
    // TEMPORARY — UI-only "new chat" for this phase. Real implementation
    // (later phase) calls POST /chat/sessions, prepends the returned
    // session to the list, and navigates to it the same way.
    setActiveSessionId(null)
    setMessages([])
    setIsTyping(false)
    setIsSessionSidebarOpen(false)
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
          onMenuClick={() => setIsSessionSidebarOpen(true)}
        />
        <MessageList
          messages={messages}
          isTyping={isTyping}
          bookTitle={activeSession?.bookTitle}
          suggestions={SUGGESTED_PROMPTS}
          onSuggestionClick={handleSend}
        />
        <MessageComposer onSend={handleSend} disabled={!activeSessionId || isTyping} />
      </div>
    </div>
  )
}

export default ChatLayout