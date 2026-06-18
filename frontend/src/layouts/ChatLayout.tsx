import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllSessions, getMessagesForSession } from '@/services/mockChatSessions'
import { buildChatSessionPath } from '@/routes/paths'
import type { Message } from '@/types/chat'
import SessionSidebar from '@/components/chat/SessionSidebar'
import ConversationHeader from '@/components/chat/ConversationHeader'
import MessageList from '@/components/chat/MessageList'
import MessageComposer from '@/components/chat/MessageComposer'

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

  useEffect(() => {
    if (initialSessionId) {
      setActiveSessionId(initialSessionId)
      setMessages(getMessagesForSession(initialSessionId))
    }
  }, [initialSessionId])

  const activeSession = sessions.find((s) => s.id === activeSessionId)

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id)
    setMessages(getMessagesForSession(id))
    navigate(buildChatSessionPath(id))
  }

  const handleNewChat = () => {
    // TEMPORARY — UI-only "new chat" for this phase. Real implementation
    // (later phase) calls POST /chat/sessions, prepends the returned
    // session to the list, and navigates to it the same way.
    setActiveSessionId(null)
    setMessages([])
    setIsSessionSidebarOpen(false)
  }

  const handleSend = (text: string) => {
    if (!activeSessionId) return

    // TEMPORARY mock send — appends a local user message plus a canned
    // assistant reply. Will be replaced by POST /chat/sessions/:id/messages,
    // with the real response replacing the mock reply below. MessageBubble
    // and MessageList require no changes when this happens.
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sessionId: activeSessionId,
      role: 'user',
      content: text,
      status: 'sent',
      createdAt: new Date().toISOString(),
    }

    const mockReply: Message = {
      id: `msg-${Date.now() + 1}`,
      sessionId: activeSessionId,
      role: 'assistant',
      content:
        "This is a placeholder response — real AI answers will appear here once the backend is connected.",
      status: 'sent',
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage, mockReply])
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
        <MessageList messages={messages} />
        <MessageComposer onSend={handleSend} disabled={!activeSessionId} />
      </div>
    </div>
  )
}

export default ChatLayout