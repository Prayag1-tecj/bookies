import type { Message } from '@/types/chat'

interface MessageBubbleProps {
  message: Message
  isUser: boolean
}

function MessageBubble({ message, isUser }: MessageBubbleProps) {
  return (
    <div
      className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
        isUser
          ? 'bg-brand-600 text-white'
          : 'bg-surface-elevated text-gray-100 border border-surface-border'
      }`}
    >
      {message.content}
      {/* Future streaming indicator — unused while all mock messages are
          'sent'. Once responses stream token-by-token, status 'streaming'
          renders this blinking cursor with no component changes needed. */}
      {message.status === 'streaming' && (
        <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse-cursor bg-current align-middle" />
      )}
    </div>
  )
}

export default MessageBubble