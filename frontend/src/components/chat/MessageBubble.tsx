import type { Message } from '@/types/chat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
          : 'border border-surface-border bg-surface-elevated text-gray-100'
      }`}
    >
      {isUser ? (
        <p>{message.content}</p>
      ) : (
        <div
          className="
            prose
            prose-sm
            prose-invert
            max-w-none

            prose-headings:text-white
            prose-p:text-gray-100
            prose-strong:text-white
            prose-li:text-gray-100
            prose-code:text-yellow-300
            prose-pre:bg-surface
          "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      )}

      {message.status === 'streaming' && (
        <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse-cursor bg-current align-middle" />
      )}
    </div>
  )
}

export default MessageBubble