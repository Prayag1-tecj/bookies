import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/routes/paths'

function LoginPage() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleMockLogin = async () => {
    await login({ email: 'test@bookies.app', password: 'password' })
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="rounded-xl border border-surface-border bg-surface-elevated p-8 text-center">
      <h1 className="text-xl font-semibold">Login Page</h1>
      <p className="mt-2 text-sm text-gray-400">
        Placeholder — UI coming in a future phase.
      </p>

      {/* TEMPORARY — protected route test, will be removed when real Login UI is built */}
      <button
        onClick={handleMockLogin}
        disabled={isLoading}
        className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Mock Login & Continue'}
      </button>
    </div>
  )
}

export default LoginPage