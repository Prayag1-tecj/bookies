import { BookOpen, MessageSquare, Sparkles, BookMarked, MessageCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/routes/paths'
import { getRecentBooks } from '@/services/mockBooks'
import { getRecentSessions } from '@/services/mockSessions'
import { getUsageStats } from '@/services/mockUsage'
import StatCard from '@/components/ui/StatCard'
import SectionContainer from '@/components/ui/SectionContainer'
import EmptyState from '@/components/ui/EmptyState'
import RecentBookCard from '@/components/dashboard/RecentBookCard'
import RecentSessionCard from '@/components/dashboard/RecentSessionCard'

function DashboardPage() {
  const { user } = useAuth()
  const usage = getUsageStats()
  const recentBooks = getRecentBooks(4)
  const recentSessions = getRecentSessions(3)

  const remainingQuestions = usage.questionsLimit - usage.questionsToday

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-white">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Here's what's happening with your library today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Books Used"
          value={`${usage.booksUsed} / ${usage.booksLimit}`}
          icon={BookOpen}
          progress={{ value: usage.booksUsed, max: usage.booksLimit }}
          helperText={`${usage.booksLimit - usage.booksUsed} slots remaining`}
        />
        <StatCard
          label="Questions Used Today"
          value={`${usage.questionsToday} / ${usage.questionsLimit}`}
          icon={MessageSquare}
          progress={{ value: usage.questionsToday, max: usage.questionsLimit }}
          helperText="Resets daily at midnight"
        />
        <StatCard
          label="Remaining Usage"
          value={remainingQuestions}
          icon={Sparkles}
          helperText="Questions left for today"
        />
      </div>

      {/* Recent sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionContainer title="Recent Books" actionLabel="View all" actionTo={ROUTES.BOOKS}>
          {recentBooks.length > 0 ? (
            <div className="space-y-2">
              {recentBooks.map((book) => (
                <RecentBookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookMarked}
              title="No books yet"
              description="Upload your first book to start chatting with your AI mentor about it."
              actionLabel="Upload a book"
              actionTo={ROUTES.BOOKS}
            />
          )}
        </SectionContainer>

        <SectionContainer title="Recent Sessions" actionLabel="View all" actionTo={ROUTES.CHAT}>
          {recentSessions.length > 0 ? (
            <div className="space-y-2">
              {recentSessions.map((session) => (
                <RecentSessionCard key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="No chat sessions yet"
              description="Start a conversation with one of your books to see it here."
              actionLabel="Start chatting"
              actionTo={ROUTES.CHAT}
            />
          )}
        </SectionContainer>
      </div>
    </div>
  )
}

export default DashboardPage