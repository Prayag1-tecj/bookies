import { Outlet } from 'react-router-dom'
import Logo from '@/components/ui/Logo'

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout