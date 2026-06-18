import { useRef, useState, type DragEvent, type ChangeEvent } from 'react'
import { UploadCloud } from 'lucide-react'
import { ACCEPTED_FILE_TYPES } from '@/utils/fileValidation'

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void
}

function DropZone({ onFilesSelected }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length) onFilesSelected(files)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length) onFilesSelected(files)
    e.target.value = '' // allow re-selecting the same file later
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-150 ${
        isDragging
          ? 'border-brand-500 bg-brand-600/10'
          : 'border-surface-border hover:border-brand-500/40 hover:bg-surface-subtle'
      }`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-150 ${
          isDragging ? 'bg-brand-600/20 text-brand-400' : 'bg-surface-subtle text-gray-400'
        }`}
      >
        <UploadCloud className="h-6 w-6" />
      </span>
      <p className="mt-3 text-sm font-medium text-gray-200">
        Drag & drop files here, or click to browse
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Supports {ACCEPTED_FILE_TYPES.join(', ').toUpperCase()} — up to 10MB each
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_FILE_TYPES.join(',')}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}

export default DropZone