export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  BOOKS: '/books',
  CHAT: '/chat',
  CHAT_SESSION: '/chat/:sessionId',
  SETTINGS: '/settings',
} as const

export const buildChatSessionPath = (sessionId: string) => `/chat/${sessionId}`