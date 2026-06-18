import { useEffect, useRef } from 'react'
import type { Message } from '@/types/chat'
import { groupMessages } from '@/utils/groupMessages'
import MessageGroup from './MessageGroup'
import TypingIndicator from './TypingIndicator'
import ChatEmptyState from './ChatEmptyState'

interface MessageListProps {
  messages: Message[]
  isTyping: boolean
  bookTitle?: string
  suggestions: string[]
  onSuggestionClick: (text: string) => void
}

function MessageList({
  messages,
  isTyping,
  bookTitle,
  suggestions,
  onSuggestionClick,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new messages and whenever the typing indicator
  // appears/disappears — this same mechanism keeps the view pinned to
  // the bottom as streamed tokens arrive later.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  if (messages.length === 0 && !isTyping) {
    return (
      <ChatEmptyState
        bookTitle={bookTitle}
        suggestions={suggestions}
        onSuggestionClick={onSuggestionClick}
      />
    )
  }

  const groups = groupMessages(messages)

  return (
    <div className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
      {/* NOTE: for very long histories, this is the spot to introduce
          virtualization (e.g. react-window) or paginated loading instead
          of rendering every message at once. Not needed for current mock
          conversation lengths. */}
      {groups.map((group, index) => (
        <MessageGroup key={`${group.role}-${index}-${group.messages[0].id}`} group={group} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}

export default MessageList