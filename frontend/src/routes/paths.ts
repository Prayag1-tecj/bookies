export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  BOOKS: '/books',
  BOOK_WORKSPACE: '/books/:bookId/chat',
  BOOK_WORKSPACE_SESSION: '/books/:bookId/chat/:sessionId',
  SETTINGS: '/settings',
} as const

export const buildBookWorkspacePath = (bookId: string) => `/books/${bookId}/chat`

export const buildBookWorkspaceSessionPath = (bookId: string, sessionId: string) =>
  `/books/${bookId}/chat/${sessionId}`