import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: ReactNode
  error?: string
  rightElement?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, rightElement, id, className = '', ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-300">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </span>
          )}
          <input
            id={id}
            ref={ref}
            className={`w-full rounded-lg border bg-surface-subtle py-2.5 text-sm text-gray-100 placeholder:text-gray-500 transition-colors duration-150 focus:outline-none focus:ring-2 ${
              icon ? 'pl-10' : 'pl-3'
            } ${rightElement ? 'pr-10' : 'pr-3'} ${
              error
                ? 'border-red-500/50 focus:ring-red-500/30'
                : 'border-surface-border focus:border-brand-500 focus:ring-brand-500/40'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</span>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400 animate-fade-in">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input