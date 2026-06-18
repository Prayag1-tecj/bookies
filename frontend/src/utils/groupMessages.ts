import type { Message } from '@/types/chat'

export interface MessageGroupData {
  role: Message['role']
  messages: Message[]
}

// Splits a flat message list into consecutive-same-sender groups, so the
// UI can render one avatar + one timestamp per group instead of per message.
export function groupMessages(messages: Message[]): MessageGroupData[] {
  const groups: MessageGroupData[] = []

  for (const message of messages) {
    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.role === message.role) {
      lastGroup.messages.push(message)
    } else {
      groups.push({ role: message.role, messages: [message] })
    }
  }

  return groups
}