import type { ChatSession, Message } from '@/types/chat'

const HOUR = 1000 * 60 * 60
const MIN = 1000 * 60
const DAY = HOUR * 24

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
    id: 'session-4',
    title: 'Habit stacking',
    bookId: 'book-1',
    bookTitle: 'Atomic Habits',
    lastMessage: 'Give me an example of stacking a new habit onto coffee.',
    messageCount: 4,
    updatedAt: new Date(Date.now() - 2 * HOUR).toISOString(),
  },
  {
    id: 'session-5',
    title: 'Identity-based habits',
    bookId: 'book-1',
    bookTitle: 'Atomic Habits',
    lastMessage: 'How is this different from outcome-based goals?',
    messageCount: 4,
    updatedAt: new Date(Date.now() - 2 * DAY).toISOString(),
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
  'session-4': [
    {
      id: 'msg-8',
      sessionId: 'session-4',
      role: 'user',
      content: 'What is habit stacking?',
      status: 'sent',
      createdAt: new Date(Date.now() - 2.3 * HOUR).toISOString(),
    },
    {
      id: 'msg-9',
      sessionId: 'session-4',
      role: 'assistant',
      content:
        'Habit stacking pairs a new habit with an existing one, using the formula "After [current habit], I will [new habit]." It works because you\'re using an already-automatic behavior as the trigger for the new one, instead of relying on willpower or motivation.',
      status: 'sent',
      createdAt: new Date(Date.now() - 2.2 * HOUR).toISOString(),
    },
    {
      id: 'msg-10',
      sessionId: 'session-4',
      role: 'user',
      content: 'Give me an example of stacking a new habit onto coffee.',
      status: 'sent',
      createdAt: new Date(Date.now() - 2 * HOUR).toISOString(),
    },
  ],
  'session-5': [
    {
      id: 'msg-11',
      sessionId: 'session-5',
      role: 'user',
      content: 'What does the book mean by identity-based habits?',
      status: 'sent',
      createdAt: new Date(Date.now() - 2.2 * DAY).toISOString(),
    },
    {
      id: 'msg-12',
      sessionId: 'session-5',
      role: 'assistant',
      content:
        'Identity-based habits focus on who you wish to become rather than what you want to achieve. Instead of "I want to read more," you aim to become "a reader." Each small action is treated as a vote for that identity, which makes the habit more durable over time than chasing an outcome.',
      status: 'sent',
      createdAt: new Date(Date.now() - 2.1 * DAY).toISOString(),
    },
    {
      id: 'msg-13',
      sessionId: 'session-5',
      role: 'user',
      content: 'How is this different from outcome-based goals?',
      status: 'sent',
      createdAt: new Date(Date.now() - 2 * DAY).toISOString(),
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

// Will become: axios.get<ChatSession[]>('/chat/sessions')
export function getAllSessions(): ChatSession[] {
  return [...sessions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

// Will become: axios.get<ChatSession[]>(`/books/${bookId}/sessions`)
export function getSessionsForBook(bookId: string): ChatSession[] {
  return sessions
    .filter((s) => s.bookId === bookId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

// Used by the Dashboard's "Recent Conversations" widget — spans all books.
// Will become: axios.get<ChatSession[]>('/chat/sessions/recent')
export function getRecentSessions(limit = 3): ChatSession[] {
  return getAllSessions().slice(0, limit)
}

// Will become: axios.get<Message[]>(`/chat/sessions/${sessionId}/messages`)
export function getMessagesForSession(sessionId: string): Message[] {
  return messagesBySession[sessionId] ?? []
}

// Will become: axios.get<{ count: number }>('/chat/sessions/active-count')
export function getActiveSessionCount(): number {
  return sessions.length
}