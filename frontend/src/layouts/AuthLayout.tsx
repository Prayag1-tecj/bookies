import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md animate-fade-in">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout