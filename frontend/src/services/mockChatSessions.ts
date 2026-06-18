import type { ChatSession, Message } from '@/types/chat'

const HOUR = 1000 * 60 * 60
const MIN = 1000 * 60

const sessions: ChatSession[] = [
  {
    id: 'session-1',
    title: 'Building better habits',
    bookId: 'book-1',
    bookTitle: 'Atomic Habits',
    lastMessage: 'How can I apply the 2-minute rule to reading more?',
    messageCount: 6,
    updatedAt: new Date(Date.now() - 15 * MIN).toISOString(),
  },
  {
    id: 'session-2',
    title: 'Focus and distraction',
    bookId: 'book-2',
    bookTitle: 'Deep Work',
    lastMessage: 'What does the author say about shallow work?',
    messageCount: 4,
    updatedAt: new Date(Date.now() - 4 * HOUR).toISOString(),
  },
  {
    id: 'session-3',
    title: 'Cognitive biases overview',
    bookId: 'book-3',
    bookTitle: 'Thinking, Fast and Slow',
    lastMessage: 'Summarize the difference between System 1 and System 2.',
    messageCount: 8,
    updatedAt: new Date(Date.now() - 26 * HOUR).toISOString(),
  },
]

const messagesBySession: Record<string, Message[]> = {
  'session-1': [
    {
      id: 'msg-1',
      sessionId: 'session-1',
      role: 'user',
      content: 'What is the 2-minute rule mentioned in the book?',
      status: 'sent',
      createdAt: new Date(Date.now() - 40 * MIN).toISOString(),
    },
    {
      id: 'msg-2',
      sessionId: 'session-1',
      role: 'assistant',
      content:
        'The 2-minute rule states that any new habit should take less than two minutes to do at the start. The idea is to make a habit so easy that you can\'t say no — like "read one page" instead of "read for an hour." This lowers the barrier to starting, which is usually the hardest part.',
      status: 'sent',
      createdAt: new Date(Date.now() - 38 * MIN).toISOString(),
    },
    {
      id: 'msg-3',
      sessionId: 'session-1',
      role: 'user',
      content: 'How can I apply the 2-minute rule to reading more?',
      status: 'sent',
      createdAt: new Date(Date.now() - 15 * MIN).toISOString(),
    },
  ],
  'session-2': [
    {
      id: 'msg-4',
      sessionId: 'session-2',
      role: 'user',
      content: 'What does the author mean by "deep work"?',
      status: 'sent',
      createdAt: new Date(Date.now() - 4.2 * HOUR).toISOString(),
    },
    {
      id: 'msg-5',
      sessionId: 'session-2',
      role: 'assistant',
      content:
        'Deep work is defined as professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate.',
      status: 'sent',
      createdAt: new Date(Date.now() - 4.1 * HOUR).toISOString(),
    },
  ],
  'session-3': [
    {
      id: 'msg-6',
      sessionId: 'session-3',
      role: 'user',
      content: 'Summarize the difference between System 1 and System 2.',
      status: 'sent',
      createdAt: new Date(Date.now() - 26 * HOUR).toISOString(),
    },
    {
      id: 'msg-7',
      sessionId: 'session-3',
      role: 'assistant',
      content:
        'System 1 is fast, automatic, and intuitive — it handles snap judgments and everyday decisions with little effort. System 2 is slow, deliberate, and effortful — it kicks in for complex reasoning, like solving a math problem. Most of our daily thinking runs on System 1, which is efficient but prone to biases.',
      status: 'sent',
      createdAt: new Date(Date.now() - 25.9 * HOUR).toISOString(),
    },
  ],
}

// Will become: axios.get<ChatSession[]>('/chat/sessions').then(res => res.data)
export function getAllSessions(): ChatSession[] {
  return [...sessions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

// Will become: axios.get<Message[]>(`/chat/sessions/${sessionId}/messages`)
export function getMessagesForSession(sessionId: string): Message[] {
  return messagesBySession[sessionId] ?? []
}