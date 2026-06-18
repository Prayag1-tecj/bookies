import { Sparkles } from 'lucide-react'

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-600/15 text-brand-400">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface-elevated px-4 py-3">
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  )
}

export default TypingIndicator