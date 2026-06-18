import type { ChatSession } from '@/types/chat'

const HOUR = 1000 * 60 * 60
const MIN = 1000 * 60

const sessions: ChatSession[] = [
  {
    id: 'session-1',
    bookId: 'book-1',
    title: 'Building better habits',
    bookTitle: 'Atomic Habits',
    lastMessage: 'How can I apply the 2-minute rule to reading more?',
    messageCount: 12,
    updatedAt: new Date(Date.now() - 15 * MIN).toISOString(),
  },
  {
    id: 'session-2',
    bookId: 'book-2',
    title: 'Focus and distraction',
    bookTitle: 'Deep Work',
    lastMessage: 'What does the author say about shallow work?',
    messageCount: 8,
    updatedAt: new Date(Date.now() - 4 * HOUR).toISOString(),
  },
  {
    id: 'session-3',
    bookId: 'book-3',
    title: 'Cognitive biases overview',
    bookTitle: 'Thinking, Fast and Slow',
    lastMessage: 'Summarize the difference between System 1 and System 2.',
    messageCount: 21,
    updatedAt: new Date(Date.now() - 26 * HOUR).toISOString(),
  },
]

// Will become: axios.get<ChatSession[]>('/chat/sessions').then(res => res.data)
export function getAllSessions(): ChatSession[] {
  return sessions
}

export function getRecentSessions(limit = 3): ChatSession[] {
  return [...sessions]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
}

// Will become: axios.get<{ count: number }>('/chat/sessions/active-count')
export function getActiveSessionCount(): number {
  return sessions.length
}

