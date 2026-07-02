import { useState, useEffect, useCallback } from 'react'
import { Upload, BookMarked } from 'lucide-react'
import { fetchBooks, deleteBook } from '@/services/bookService'
import type { Book } from '@/types/book'
import BookCard from '@/components/books/BookCard'
import SearchInput from '@/components/ui/SearchInput'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import UploadModal from '@/components/upload/UploadModal'
import Spinner from '@/components/ui/Spinner'
import ErrorBanner from '@/components/ui/ErrorBanner'

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const loadBooks = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchBooks()
      setBooks(data)
    } catch {
      setError('Failed to load your books. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadBooks() }, [loadBooks])

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return
    setIsDeleting(true)
    try {
      await deleteBook(bookToDelete.id)
      setBooks((prev) => prev.filter((b) => b.id !== bookToDelete.id))
      setBookToDelete(null)
    } catch {
      setError('Failed to delete the book. Please try again.')
      setBookToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUploadSuccess = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">My Books</h1>
          <p className="mt-1 text-sm text-gray-400">
            {isLoading
              ? 'Loading...'
              : `${books.length} ${books.length === 1 ? 'book' : 'books'} in your library`}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput placeholder="Search books..." />
          <Button className="whitespace-nowrap" onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="h-4 w-4" />
            Upload Book
          </Button>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadBooks} />}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onDeleteClick={setBookToDelete} />
          ))}
        </div>
      ) : !error ? (
        <EmptyState
          icon={BookMarked}
          title="No books yet"
          description="Upload your first book to start chatting with your AI mentor about it."
          actionLabel="Upload a book"
          actionTo="#"
        />
      ) : null}

      <ConfirmDialog
        isOpen={bookToDelete !== null}
        title="Delete this book?"
        message={
          bookToDelete
            ? `"${bookToDelete.title}" and all associated chat sessions will be permanently removed.`
            : ''
        }
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBookToDelete(null)}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  )
}

export default BooksPage