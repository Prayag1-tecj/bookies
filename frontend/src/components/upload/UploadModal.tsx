import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { validateFile } from '@/utils/fileValidation'
import { uploadBook } from '@/services/bookService'
import type { Book } from '@/types/book'
import DropZone from './DropZone'
import UploadFileItem, { type StagedFile } from './UploadFileItem'
import Button from '@/components/ui/Button'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: (book: Book) => void
}

function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([])

  const isProcessing = stagedFiles.some((f) => f.status === 'uploading' || f.status === 'processing')
  const hasCompletedUploads = stagedFiles.length > 0 && stagedFiles.every((f) => f.status === 'success')

  useEffect(() => {
    if (!isOpen || !hasCompletedUploads) return

    const timeout = window.setTimeout(() => {
      setStagedFiles([])
      onClose()
    }, 1100)

    return () => window.clearTimeout(timeout)
  }, [hasCompletedUploads, isOpen, onClose])

  if (!isOpen) return null

  const startUpload = (staged: StagedFile) => {
    setStagedFiles((prev) =>
      prev.map((f) =>
        f.id === staged.id
          ? { ...f, status: 'uploading', progress: 0, errorMessage: undefined }
          : f
      )
    )

    uploadBook(staged.file, (progress) => {
      const boundedProgress = Math.min(progress, 100)
      setStagedFiles((prev) =>
        prev.map((f) =>
          f.id === staged.id
            ? {
                ...f,
                status: boundedProgress >= 100 ? 'processing' : 'uploading',
                progress: boundedProgress,
              }
            : f
        )
      )
    })
      .then((newBook) => {
        setStagedFiles((prev) =>
          prev.map((f) => (f.id === staged.id ? { ...f, status: 'success', progress: 100 } : f))
        )
        onUploadSuccess(newBook)
      })
      .catch((err) => {
        let errorMessage = 'Something went wrong while preparing your book. Please try again.'
        if (err?.response?.status === 400) {
          const data = err.response.data
          errorMessage = data?.error ?? errorMessage
        } else if (err?.code === 'ECONNABORTED') {
          errorMessage = 'Processing is taking longer than expected. Refresh your library before trying again.'
        } else if (!err?.response) {
          errorMessage = 'Cannot reach the server. Check your connection and try again.'
        }
        setStagedFiles((prev) =>
          prev.map((f) =>
            f.id === staged.id ? { ...f, status: 'error', errorMessage } : f
          )
        )
      })
  }

  const handleFilesSelected = (files: File[]) => {
    if (isProcessing) return

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
    if (isProcessing) return
    const target = stagedFiles.find((f) => f.id === id)
    if (target) startUpload(target)
  }

  const handleRemove = (id: string) => {
    if (isProcessing) return
    setStagedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleClose = () => {
    if (isProcessing) return
    setStagedFiles([])
    onClose()
  }

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
            disabled={isProcessing}
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-surface-subtle hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <DropZone onFilesSelected={handleFilesSelected} disabled={isProcessing || hasCompletedUploads} />
        </div>

        {stagedFiles.length > 0 && (
          <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
            {stagedFiles.map((staged) => (
              <UploadFileItem
                key={staged.id}
                staged={staged}
                onRemove={handleRemove}
                onRetry={handleRetry}
                disabled={isProcessing || hasCompletedUploads}
              />
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : hasCompletedUploads ? 'Ready to chat!' : 'Done'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UploadModal
