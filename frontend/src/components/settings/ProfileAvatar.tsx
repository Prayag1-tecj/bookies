interface ProfileAvatarProps {
  name: string
  size?: 'md' | 'lg'
}

function ProfileAvatar({ name, size = 'lg' }: ProfileAvatarProps) {
  const sizeClasses = size === 'lg' ? 'h-16 w-16 text-xl' : 'h-10 w-10 text-sm'

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full bg-brand-600 font-semibold text-white ${sizeClasses}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default ProfileAvatar