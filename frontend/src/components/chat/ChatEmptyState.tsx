import { Sparkles } from 'lucide-react'

interface ChatEmptyStateProps {
  bookTitle?: string
  suggestions: string[]
  onSuggestionClick: (text: string) => void
}

function ChatEmptyState({ bookTitle, suggestions, onSuggestionClick }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600/15 text-brand-400">
        <Sparkles className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-gray-100">
        {bookTitle ? `Ask anything about ${bookTitle}` : 'Start a new conversation'}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500">
        Your AI mentor has read the book and is ready to help you understand it deeper.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="rounded-full border border-surface-border px-3.5 py-1.5 text-xs font-medium text-gray-300 transition-colors duration-150 hover:border-brand-500/40 hover:bg-surface-subtle hover:text-gray-100"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChatEmptyState