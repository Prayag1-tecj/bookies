import { useState } from 'react'
import { X } from 'lucide-react'
import { validateFile } from '@/utils/fileValidation'
import { simulateUpload } from '@/services/mockUpload'
import DropZone from './DropZone'
import UploadFileItem, { type StagedFile } from './UploadFileItem'
import Button from '@/components/ui/Button'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([])

  if (!isOpen) return null

  const startUpload = (staged: StagedFile) => {
    setStagedFiles((prev) =>
      prev.map((f) => (f.id === staged.id ? { ...f, status: 'uploading', progress: 0 } : f))
    )

    simulateUpload(staged.file, (percent) => {
      setStagedFiles((prev) =>
        prev.map((f) => (f.id === staged.id ? { ...f, progress: percent } : f))
      )
    })
      .then(() => {
        setStagedFiles((prev) =>
          prev.map((f) => (f.id === staged.id ? { ...f, status: 'success' } : f))
        )
        // TODO: once backend exists, refetch/append to the books list here
        // so BooksPage's grid reflects the new book without a manual reload.
      })
      .catch((err: Error) => {
        setStagedFiles((prev) =>
          prev.map((f) =>
            f.id === staged.id
              ? { ...f, status: 'error', errorMessage: err.message }
              : f
          )
        )
      })
  }

  const handleFilesSelected = (files: File[]) => {
    const newStaged: StagedFile[] = files.map((file) => {
      const validation = validateFile(file)
      return {
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        status: validation.isValid ? 'pending' : 'error',
        progress: 0,
        errorMessage: validation.isValid ? undefined : validation.error,
      }
    })

    setStagedFiles((prev) => [...prev, ...newStaged])

    newStaged.filter((f) => f.status === 'pending').forEach(startUpload)
  }

  const handleRetry = (id: string) => {
    const target = stagedFiles.find((f) => f.id === id)
    if (target) startUpload(target)
  }

  const handleRemove = (id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleClose = () => {
    setStagedFiles([])
    onClose()
  }

  const isAnyUploading = stagedFiles.some((f) => f.status === 'uploading')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-surface-border bg-surface-elevated p-6 shadow-xl shadow-black/30 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Upload Books</h2>
          <button
            onClick={handleClose}
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-surface-subtle hover:text-gray-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <DropZone onFilesSelected={handleFilesSelected} />
        </div>

        {stagedFiles.length > 0 && (
          <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
            {stagedFiles.map((staged) => (
              <UploadFileItem
                key={staged.id}
                staged={staged}
                onRemove={handleRemove}
                onRetry={handleRetry}
              />
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose} disabled={isAnyUploading}>
            {isAnyUploading ? 'Uploading...' : 'Done'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UploadModal