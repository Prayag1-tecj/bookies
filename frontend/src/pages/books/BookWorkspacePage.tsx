import { useParams } from 'react-router-dom'
import BookWorkspaceLayout from '@/layouts/BookWorkspaceLayout'

function BookWorkspacePage() {
  const { bookId, sessionId } = useParams<{ bookId: string; sessionId?: string }>()

  if (!bookId) return null

  return (
    <div className="h-[calc(100vh-5.5rem)] md:h-[calc(100vh-6.5rem)]">
      <BookWorkspaceLayout bookId={bookId} initialSessionId={sessionId} />
    </div>
  )
}

export default BookWorkspacePage