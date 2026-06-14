import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface SectionContainerProps {
  title: string
  actionLabel?: string
  actionTo?: string
  children: ReactNode
}

function SectionContainer({ title, actionLabel, actionTo, children }: SectionContainerProps) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-elevated p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {actionLabel && actionTo && (
          <Link
            to={actionTo}
            className="text-xs font-medium text-brand-400 transition-colors hover:text-brand-300"
          >
            {actionLabel}
          </Link>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default SectionContainer