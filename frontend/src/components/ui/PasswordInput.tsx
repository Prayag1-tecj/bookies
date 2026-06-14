import { useState, forwardRef, type InputHTMLAttributes } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import Input from './Input'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <Input
        id={id}
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        label={label}
        error={error}
        icon={<Lock className="h-4 w-4" />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-gray-500 transition-colors hover:text-gray-300"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        {...props}
      />
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput