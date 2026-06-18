export interface ChatSession {
  id: string
  title: string
  bookId: string
  bookTitle: string
  lastMessage: string
  messageCount: number
  updatedAt: string
}

export type MessageRole = 'user' | 'assistant'
export type MessageStatus = 'sent' | 'streaming' | 'error'

export interface Message {
  id: string
  sessionId: string
  role: MessageRole
  content: string
  status: MessageStatus
  createdAt: string
}