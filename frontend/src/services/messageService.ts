import api from './api'
import type { Message } from '@/types/chat'

interface MessageResponse {
  role: 'USER' | 'AI'
  content: string
  created_at: string
}

interface AskResponse {
  answer: string
}

function transformMessage(
  raw: MessageResponse,
  sessionId: string,
  index: number
): Message {
  return {
    id: `msg-${sessionId}-${index}`,
    sessionId,
    role: raw.role === 'USER' ? 'user' : 'assistant',
    content: raw.content,
    status: 'sent',
    createdAt: raw.created_at,
  }
}

export async function fetchMessages(sessionId: string): Promise<Message[]> {
  const { data } = await api.get<MessageResponse[]>(
    `/api/chat/history/${sessionId}/`
  )
  return data.map((msg, i) => transformMessage(msg, sessionId, i))
}

export async function askQuestion(
  sessionId: string,
  question: string
): Promise<string> {
  const { data } = await api.post<AskResponse>('/api/chat/ask/', {
    session_id: Number(sessionId),
    question,
  })
  return data.answer
}