import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  helperText?: string
  progress?: { value: number; max: number }
}

function StatCard({ label, value, icon: Icon, helperText, progress }: StatCardProps) {
  const percent = progress ? Math.min(100, Math.round((progress.value / progress.max) * 100)) : null

  return (
    <div className="group rounded-xl border border-surface-border bg-surface-elevated p-5 transition-colors duration-150 hover:border-surface-border/80">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold text-white">{value}</p>
        </div>
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600/15 text-brand-400 transition-transform duration-150 group-hover:scale-105">
          <Icon className="h-4 w-4" />
        </span>
      </div>

      {percent !== null && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-border">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {helperText && <p className="mt-3 text-xs text-gray-500">{helperText}</p>}
    </div>
  )
}

export default StatCard