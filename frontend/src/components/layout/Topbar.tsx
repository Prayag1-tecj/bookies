import { Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface TopbarProps {
  onMenuClick: () => void
}

function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-surface-border px-4 md:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-400 transition-colors duration-150 hover:bg-surface-subtle hover:text-gray-100 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Spacer to push the avatar right on desktop where there's no hamburger */}
      <div className="hidden md:block" />

      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-elevated text-sm font-semibold text-gray-200">
        {user?.name?.charAt(0).toUpperCase() ?? '?'}
      </div>
    </header>
  )
}

export default Topbar