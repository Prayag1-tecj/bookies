interface ToggleSwitchProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleSwitch({ label, description, checked, onChange }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between border-b border-surface-border py-3 last:border-b-0">
      <div className="min-w-0 pr-4">
        <p className="text-sm font-medium text-gray-100">{label}</p>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>

      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-brand-600' : 'bg-surface-border'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

export default ToggleSwitch