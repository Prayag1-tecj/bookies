import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 text-lg font-semibold text-white">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
        <BookOpen className="h-5 w-5" />
      </span>
      Bookies
    </Link>
  )
}

export default Logo