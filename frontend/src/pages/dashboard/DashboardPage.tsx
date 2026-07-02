import { useState, useEffect } from 'react'
import {
  BookOpen,
  MessageSquare,
  Sparkles,
  BookMarked,
  MessageCircle,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/routes/paths'
import { fetchBooks } from '@/services/bookService'
import { fetchAllSessions } from '@/services/sessionService'
import { fetchProfileData } from '@/services/authService'
import type { Book } from '@/types/book'
import type { ChatSession } from '@/types/chat'
import StatCard from '@/components/ui/StatCard'
import SectionContainer from '@/components/ui/SectionContainer'
import EmptyState from '@/components/ui/EmptyState'
import RecentBookCard from '@/components/dashboard/RecentBookCard'
import RecentSessionCard from '@/components/dashboard/RecentSessionCard'
import Spinner from '@/components/ui/Spinner'

const BOOKS_LIMIT = 3
const QUESTIONS_LIMIT = 50

function DashboardPage() {
  const { user } = useAuth()

  const [books, setBooks] = useState<Book[]>([])
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [questionsToday, setQuestionsToday] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchBooks(), fetchProfileData()])
      .then(([fetchedBooks, profile]) => {
        setBooks(fetchedBooks)
        setQuestionsToday(profile.questions_today)
        return fetchAllSessions(fetchedBooks)
      })
      .then(setSessions)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const recentBooks = [...books]
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )
    .slice(0, 4)

  const recentSessions = sessions.slice(0, 3)
  const remainingQuestions = Math.max(0, QUESTIONS_LIMIT - questionsToday)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Here's what's happening with your library today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Books Used"
          value={isLoading ? '—' : `${books.length} / ${BOOKS_LIMIT}`}
          icon={BookOpen}
          progress={
            isLoading ? undefined : { value: books.length, max: BOOKS_LIMIT }
          }
          helperText={
            isLoading
              ? undefined
              : `${BOOKS_LIMIT - books.length} slots remaining`
          }
        />
        <StatCard
          label="Questions Used Today"
          value={isLoading ? '—' : `${questionsToday} / ${QUESTIONS_LIMIT}`}
          icon={MessageSquare}
          progress={
            isLoading
              ? undefined
              : { value: questionsToday, max: QUESTIONS_LIMIT }
          }
          helperText="Resets daily at midnight"
        />
        <StatCard
          label="Remaining Usage"
          value={isLoading ? '—' : remainingQuestions}
          icon={Sparkles}
          helperText="Questions left for today"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionContainer
          title="Recent Books"
          actionLabel="View all"
          actionTo={ROUTES.BOOKS}
        >
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          ) : recentBooks.length > 0 ? (
            <div className="space-y-2">
              {recentBooks.map((book) => (
                <RecentBookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookMarked}
              title="No books yet"
              description="Upload your first book to start chatting with your AI mentor."
              actionLabel="Upload a book"
              actionTo={ROUTES.BOOKS}
            />
          )}
        </SectionContainer>

        <SectionContainer
          title="Recent Conversations"
          actionLabel="Browse books"
          actionTo={ROUTES.BOOKS}
        >
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          ) : recentSessions.length > 0 ? (
            <div className="space-y-2">
              {recentSessions.map((session) => (
                <RecentSessionCard key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="No conversations yet"
              description="Open a book and start chatting to see it here."
              actionLabel="Browse books"
              actionTo={ROUTES.BOOKS}
            />
          )}
        </SectionContainer>
      </div>
    </div>
  )
}

export default DashboardPage