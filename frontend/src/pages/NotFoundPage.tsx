import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface text-gray-100">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-sm text-gray-400">This page doesn't exist.</p>
      <Link
        to={ROUTES.DASHBOARD}
        className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}

export default NotFoundPage