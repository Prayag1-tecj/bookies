import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/routes/paths'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import Button from '@/components/ui/Button'

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function RegisterPage() {
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    const newErrors: FormErrors = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    // TEMPORARY mock error path — replaced by real API error handling
    // (e.g. "email already registered") once Axios + backend auth is
    // integrated. The `generalError` UI below will not need to change.
    if (email.toLowerCase() === 'taken@bookies.app') {
      setGeneralError('An account with this email already exists.')
      return
    }

    await register({ name, email, password })
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="rounded-xl border border-surface-border bg-surface-elevated p-8 shadow-xl shadow-black/20">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-white">Create your account</h1>
        <p className="mt-1.5 text-sm text-gray-400">
          Start exploring your books with AI
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
          id="name"
          type="text"
          label="Full name"
          placeholder="Jane Doe"
          icon={<User className="h-4 w-4" />}
          error={errors.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />

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
          autoComplete="new-password"
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          placeholder="••••••••"
          error={errors.confirmPassword}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage