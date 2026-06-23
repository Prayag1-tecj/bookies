import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
      <p className="flex-1 text-sm text-red-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorBanner