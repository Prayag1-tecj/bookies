import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/routes/paths'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface FormErrors {
  email?: string
  password?: string
}

function LoginPage() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    const newErrors: FormErrors = {}
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    // TEMPORARY mock error path — replaced by real API error handling
    // once Axios + backend auth is integrated. The `generalError` UI
    // below will not need to change.
    if (password === 'wrongpassword') {
      setGeneralError('Invalid email or password. Please try again.')
      return
    }

    await login({ email, password })
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="rounded-xl border border-surface-border bg-surface-elevated p-8 shadow-xl shadow-black/20">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-white">Welcome back</h1>
        <p className="mt-1.5 text-sm text-gray-400">
          Sign in to continue to your library
        </p>
      </div>

      {generalError && (
        <div className="mt-6 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400 animate-shake">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          error={errors.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-500 transition-colors hover:text-gray-300"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Don&apos;t have an account?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default LoginPage