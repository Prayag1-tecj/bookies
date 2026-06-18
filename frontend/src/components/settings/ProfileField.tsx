interface ProfileFieldProps {
  label: string
  value: string
}

function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-surface-border py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-100">{value}</span>
    </div>
  )
}

export default ProfileField