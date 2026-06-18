import { Search } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        className="w-full rounded-lg border border-surface-border bg-surface-subtle py-2 pl-9 pr-3 text-sm text-gray-100 placeholder:text-gray-500 transition-colors duration-150 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
        {...props}
      />
    </div>
  )
}

export default SearchInput