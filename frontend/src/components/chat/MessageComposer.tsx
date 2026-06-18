import { useState, useRef, type KeyboardEvent } from 'react'
import { SendHorizontal } from 'lucide-react'

interface MessageComposerProps {
  onSend: (text: string) => void
  disabled?: boolean
}

function MessageComposer({ onSend, disabled = false }: MessageComposerProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }

  return (
    <div className="flex-shrink-0 border-t border-surface-border p-4">
      <div className="flex items-end gap-2 rounded-xl border border-surface-border bg-surface-subtle p-2 transition-colors duration-150 focus-within:border-brand-500">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about this book..."
          rows={1}
          disabled={disabled}
          className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white transition-all duration-150 hover:bg-brand-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-surface-border disabled:text-gray-500"
          aria-label="Send message"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500">
        Press Enter to send, Shift + Enter for a new line
      </p>
    </div>
  )
}

export default MessageComposer