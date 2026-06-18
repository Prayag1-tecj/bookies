import { useState } from 'react'
import { Upload, BookMarked } from 'lucide-react'
import { getAllBooks } from '@/services/mockBooks'
import type { Book } from '@/types/book'
import BookCard from '@/components/books/BookCard'
import SearchInput from '@/components/ui/SearchInput'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

function BooksPage() {
  const [books] = useState<Book[]>(getAllBooks())
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    // TEMPORARY — UI only per Phase F9 scope. Real deletion (axios.delete +
    // removing from state/refetching) is wired in a later backend-integration
    // phase. For now we just simulate a brief delay and close the dialog.
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsDeleting(false)
    setBookToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">My Books</h1>
          <p className="mt-1 text-sm text-gray-400">
            {books.length} {books.length === 1 ? 'book' : 'books'} in your library
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput placeholder="Search books..." />
          <Button className="whitespace-nowrap">
            <Upload className="h-4 w-4" />
            Upload Book
          </Button>
        </div>
      </div>

      {/* Books grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onDeleteClick={setBookToDelete} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookMarked}
          title="No books yet"
          description="Upload your first book to start chatting with your AI mentor about it."
          actionLabel="Upload a book"
          actionTo="#"
        />
      )}

      <ConfirmDialog
        isOpen={bookToDelete !== null}
        title="Delete this book?"
        message={
          bookToDelete
            ? `"${bookToDelete.title}" and all associated chat sessions will be permanently removed. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBookToDelete(null)}
      />
    </div>
  )
}

export default BooksPage