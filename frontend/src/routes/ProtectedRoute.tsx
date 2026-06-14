import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from './paths'

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  // While auth state is being determined (e.g. validating a stored JWT on
  // app load), avoid redirecting prematurely — show a simple loading state.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}

export default ProtectedRoute