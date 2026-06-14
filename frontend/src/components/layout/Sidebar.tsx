import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/hooks/useAuth'
import { navItems } from './navItems'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth()

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 animate-fade-in md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-shrink-0 flex-col border-r border-surface-border bg-surface-subtle transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo area */}
        <div className="flex h-14 flex-shrink-0 items-center border-b border-surface-border px-4">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-brand-600/15 text-brand-400'
                      : 'text-gray-400 hover:bg-surface-elevated hover:text-gray-100'
                  }`
                }
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* User area + Logout */}
        <div className="flex-shrink-0 border-t border-surface-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-100">
                {user?.name ?? 'Guest'}
              </p>
              <p className="truncate text-xs text-gray-500">{user?.email ?? ''}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors duration-150 hover:bg-surface-elevated hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar