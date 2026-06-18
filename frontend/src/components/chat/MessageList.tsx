import { useEffect, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import type { Message } from '@/types/chat'
import MessageBubble from './MessageBubble'
import EmptyState from '@/components/ui/EmptyState'

interface MessageListProps {
  messages: Message[]
}

function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the latest message. This same ref/effect pattern will
  // keep the view pinned to the bottom as streamed tokens arrive later.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          icon={MessageCircle}
          title="No messages yet"
          description="Ask a question about this book to get started."
        />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
      {/* NOTE: for very long histories, this is the spot to introduce
          virtualization (e.g. react-window) or paginated loading instead
          of rendering every message at once. Not needed for current mock
          conversation lengths. */}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

export default MessageList