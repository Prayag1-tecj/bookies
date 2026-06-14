import { useAuth } from '@/hooks/useAuth'

function DashboardPage() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()

  return (
    <div>
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-400">
        Placeholder — usage stats, recent books, and recent sessions will live here.
      </p>

      {/* TEMPORARY — auth context test, will be removed in a later phase */}
      <div className="mt-6 rounded-lg border border-surface-border bg-surface-elevated p-4 text-sm">
        <p className="text-gray-400">Auth context test:</p>
        <p className="mt-1">
          isAuthenticated: <span className="font-mono">{String(isAuthenticated)}</span>
        </p>
        <p>
          isLoading: <span className="font-mono">{String(isLoading)}</span>
        </p>
        <p>
          user: <span className="font-mono">{user ? JSON.stringify(user) : 'null'}</span>
        </p>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => login({ email: 'test@bookies.app', password: 'password' })}
            className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-500"
          >
            Mock Login
          </button>
          <button
            onClick={logout}
            className="rounded-md border border-surface-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface-subtle"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage