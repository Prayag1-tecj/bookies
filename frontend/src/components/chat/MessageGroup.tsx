import { Sparkles, User } from 'lucide-react'
import type { MessageGroupData } from '@/utils/groupMessages'
import { formatTime } from '@/utils/formatDate'
import MessageBubble from './MessageBubble'

interface MessageGroupProps {
  group: MessageGroupData
}

function MessageGroup({ group }: MessageGroupProps) {
  const isUser = group.role === 'user'
  const lastMessage = group.messages[group.messages.length - 1]

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-surface-border text-gray-300' : 'bg-brand-600/15 text-brand-400'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </span>

      <div className={`flex max-w-[75%] flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        {group.messages.map((message) => (
          <MessageBubble key={message.id} message={message} isUser={isUser} />
        ))}
        <span className="px-1 text-xs text-gray-500">{formatTime(lastMessage.createdAt)}</span>
      </div>
    </div>
  )
}

export default MessageGroup