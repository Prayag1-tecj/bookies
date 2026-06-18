import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, MessageSquare, Sparkles, MessageCircle, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/routes/paths'
import { getUsageStats } from '@/services/mockUsage'
import { getActiveSessionCount } from '@/services/mockSessions'
import SectionContainer from '@/components/ui/SectionContainer'
import StatCard from '@/components/ui/StatCard'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ProfileAvatar from '@/components/settings/ProfileAvatar'
import ProfileField from '@/components/settings/ProfileField'
import ToggleSwitch from '@/components/settings/ToggleSwitch'

function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const usage = getUsageStats()
  const activeSessionCount = getActiveSessionCount()
  const remainingQuestions = usage.questionsLimit - usage.questionsToday

  // UI-only preferences for this phase — not persisted anywhere yet.
  // Will move into a UserPreferencesContext or backend-synced settings
  // once that exists; ToggleSwitch itself requires no changes.
  const [darkTheme, setDarkTheme] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const joinDateLabel = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '—'

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    // TEMPORARY — UI only per this phase's scope. Real implementation will
    // call axios.delete('/users/me'), then logout(), then redirect to
    // /login. No destructive action happens here yet.
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsDeleting(false)
    setIsDeleteDialogOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage your profile, usage, and preferences.
        </p>
      </div>

      {/* Profile Information */}
      <SectionContainer title="Profile Information">
        <div className="flex items-center gap-4 pb-4">
          <ProfileAvatar name={user?.name ?? 'Guest'} />
          <div>
            <p className="text-base font-semibold text-gray-100">{user?.name ?? 'Guest'}</p>
            <p className="text-sm text-gray-500">{user?.email ?? ''}</p>
          </div>
        </div>
        <ProfileField label="Full name" value={user?.name ?? '—'} />
        <ProfileField label="Email address" value={user?.email ?? '—'} />
        <ProfileField label="Member since" value={joinDateLabel} />
      </SectionContainer>

      {/* Account Information */}
      <SectionContainer title="Account Information">
        <ProfileField label="Account ID" value={user?.id ?? '—'} />
        <ProfileField label="Plan" value="Free Tier" />
        <ProfileField label="Status" value="Active" />
      </SectionContainer>

      {/* Usage Statistics */}
      <SectionContainer title="Usage Statistics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label="Books Uploaded"
            value={`${usage.booksUsed} / ${usage.booksLimit}`}
            icon={BookOpen}
            progress={{ value: usage.booksUsed, max: usage.booksLimit }}
          />
          <StatCard
            label="Daily Questions Used"
            value={`${usage.questionsToday} / ${usage.questionsLimit}`}
            icon={MessageSquare}
            progress={{ value: usage.questionsToday, max: usage.questionsLimit }}
          />
          <StatCard
            label="Remaining Questions"
            value={remainingQuestions}
            icon={Sparkles}
            helperText="Resets daily at midnight"
          />
          <StatCard
            label="Active Chat Sessions"
            value={activeSessionCount}
            icon={MessageCircle}
          />
        </div>
      </SectionContainer>

      {/* Application Preferences */}
      <SectionContainer title="Application Preferences">
        <ToggleSwitch
          label="Dark theme"
          description="Use a dark color scheme across the app"
          checked={darkTheme}
          onChange={setDarkTheme}
        />
        <ToggleSwitch
          label="Email notifications"
          description="Get notified about usage limits and updates"
          checked={notifications}
          onChange={setNotifications}
        />
      </SectionContainer>

      {/* Danger Zone */}
      <SectionContainer title="Danger Zone">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:border-b sm:border-surface-border sm:pb-4">
          <div>
            <p className="text-sm font-medium text-gray-100">Log out</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Sign out of your account on this device.
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="sm:w-auto">
            Log out
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
          <div>
            <p className="text-sm font-medium text-red-400">Delete account</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="bg-red-600 hover:bg-red-500 sm:w-auto"
          >
            <AlertTriangle className="h-4 w-4" />
            Delete account
          </Button>
        </div>
      </SectionContainer>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete your account?"
        message="This will permanently delete your account, all uploaded books, and all chat history. This action cannot be undone."
        confirmLabel="Delete account"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  )
}

export default SettingsPage