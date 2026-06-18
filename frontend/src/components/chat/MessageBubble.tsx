import { Sparkles, User } from 'lucide-react'
import type { Message } from '@/types/chat'

interface MessageBubbleProps {
  message: Message
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-surface-border text-gray-300' : 'bg-brand-600/15 text-brand-400'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </span>

      <div
        className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-brand-600 text-white'
            : 'bg-surface-elevated text-gray-100 border border-surface-border'
        }`}
      >
        {message.content}
        {/* Future streaming indicator — currently unused since all mock
            messages have status 'sent'. Once responses stream token-by-token,
            a status of 'streaming' renders this blinking cursor. */}
        {message.status === 'streaming' && (
          <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse-cursor bg-current align-middle" />
        )}
      </div>
    </div>
  )
}

export default MessageBubble