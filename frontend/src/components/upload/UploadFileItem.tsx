import { FileText, CheckCircle2, XCircle, X, RotateCcw, LoaderCircle } from 'lucide-react'
import { formatFileSize } from '@/utils/formatFileSize'

export type UploadStatus = 'pending' | 'uploading' | 'processing' | 'success' | 'error'

export interface StagedFile {
  id: string
  file: File
  status: UploadStatus
  progress: number
  errorMessage?: string
}

interface UploadFileItemProps {
  staged: StagedFile
  onRemove: (id: string) => void
  onRetry: (id: string) => void
  disabled?: boolean
}

function UploadFileItem({ staged, onRemove, onRetry, disabled = false }: UploadFileItemProps) {
  const { file, status, progress, errorMessage } = staged
  const isBusy = status === 'uploading' || status === 'processing'

  return (
    <div className="flex items-center gap-3 rounded-lg border border-surface-border bg-surface-subtle p-3 animate-fade-in">
      <span
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${
          status === 'error' ? 'bg-red-500/15 text-red-400' : 'bg-brand-600/15 text-brand-400'
        }`}
      >
        <FileText className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-gray-100">{file.name}</p>
          <span className="flex-shrink-0 text-xs text-gray-500">
            {formatFileSize(file.size)}
          </span>
        </div>

        {status === 'uploading' && (
          <>
            <div className="mt-2 flex items-center justify-between gap-2 text-xs">
              <span className="text-brand-300">Uploading file...</span>
              <span className="text-gray-500">{progress}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-border">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}

        {status === 'processing' && (
          <>
            <p className="mt-1 text-xs text-brand-300">Processing your book...</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-border">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-500/80" />
            </div>
          </>
        )}

        {status === 'error' && (
          <p className="mt-1 text-xs text-red-400">{errorMessage}</p>
        )}

        {status === 'success' && (
          <p className="mt-1 text-xs text-emerald-400">Ready to chat!</p>
        )}
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5">
        {isBusy && <LoaderCircle className="h-4 w-4 animate-spin text-brand-400" />}
        {status === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        {status === 'error' && (
          <>
            <XCircle className="h-4 w-4 text-red-400" />
            <button
              onClick={() => onRetry(staged.id)}
              disabled={disabled}
              className="rounded-md p-1 text-gray-500 transition-colors hover:bg-surface-elevated hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Retry upload"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </>
        )}
        {!disabled && (status === 'pending' || status === 'error') && (
          <button
            onClick={() => onRemove(staged.id)}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-surface-elevated hover:text-gray-200"
            aria-label="Remove file"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default UploadFileItem
