import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
}

function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-surface-border py-10 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-subtle text-gray-500">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-medium text-gray-200">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-gray-500">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-4 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-500"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

export default EmptyState