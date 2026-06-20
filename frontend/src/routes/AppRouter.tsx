import { createBrowserRouter } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import BooksPage from '@/pages/books/BooksPage'
import BookWorkspacePage from '@/pages/books/BookWorkspacePage'
import SettingsPage from '@/pages/settings/SettingsPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { ROUTES } from './paths'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.BOOKS, element: <BooksPage /> },
          { path: ROUTES.BOOK_WORKSPACE, element: <BookWorkspacePage /> },
          { path: ROUTES.BOOK_WORKSPACE_SESSION, element: <BookWorkspacePage /> },
          { path: ROUTES.SETTINGS, element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])