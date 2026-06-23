import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/routes/paths'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
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

    try {
      await login({ email, password })
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 401 || status === 400) {
          setGeneralError('Invalid email or password. Please try again.')
        } else if (status === 0 || !err.response) {
          setGeneralError('Cannot reach the server. Check your connection.')
        } else {
          setGeneralError('Something went wrong. Please try again.')
        }
      } else {
        setGeneralError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className="rounded-xl border border-surface-border bg-surface-elevated p-8 shadow-xl shadow-black/20">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-white">Welcome back</h1>
        <p className="mt-1.5 text-sm text-gray-400">Sign in to continue to your library</p>
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
        <PasswordInput
          id="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <Button type="submit" fullWidth isLoading={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-brand-400 transition-colors hover:text-brand-300">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default LoginPage