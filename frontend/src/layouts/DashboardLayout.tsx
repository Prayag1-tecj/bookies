import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-surface text-gray-100">
      {/* Sidebar placeholder — will become <Sidebar /> in a future phase */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-surface-border bg-surface-subtle md:block">
        <div className="p-4 text-sm text-gray-400">Sidebar placeholder</div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar placeholder — will become <Topbar /> in a future phase */}
        <header className="flex h-14 flex-shrink-0 items-center border-b border-surface-border px-6">
          <div className="text-sm text-gray-400">Topbar placeholder</div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout