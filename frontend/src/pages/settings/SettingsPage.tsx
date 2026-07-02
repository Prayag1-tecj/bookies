import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, MessageSquare, Sparkles, HardDrive, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/routes/paths'
import { fetchProfileData } from '@/services/authService'
import SectionContainer from '@/components/ui/SectionContainer'
import StatCard from '@/components/ui/StatCard'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Spinner from '@/components/ui/Spinner'
import ErrorBanner from '@/components/ui/ErrorBanner'
import ProfileAvatar from '@/components/settings/ProfileAvatar'
import ProfileField from '@/components/settings/ProfileField'
import ToggleSwitch from '@/components/settings/ToggleSwitch'

const BOOKS_LIMIT = 3
const QUESTIONS_LIMIT = 50

interface ProfileData {
  booksUploaded: number
  questionsToday: number
  storageUsedMb: number
  plan: string
}

function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)

  const [darkTheme, setDarkTheme] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchProfileData()
      .then((data) => {
        setProfileData({
          booksUploaded: data.books_uploaded,
          questionsToday: data.questions_today,
          storageUsedMb: data.storage_used_mb,
          plan: data.plan,
        })
      })
      .catch(() => setProfileError('Failed to load usage data.'))
      .finally(() => setIsLoadingProfile(false))
  }, [])

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    // No backend endpoint for account deletion yet.
    // When added: call axios.delete('/api/auth/me/'), then logout()
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsDeleting(false)
    setIsDeleteDialogOpen(false)
  }

  const remainingQuestions = profileData
    ? Math.max(0, QUESTIONS_LIMIT - profileData.questionsToday)
    : null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage your profile, usage, and preferences.
        </p>
      </div>

      <SectionContainer title="Profile Information">
        <div className="flex items-center gap-4 pb-4">
          <ProfileAvatar name={user?.name ?? 'User'} />
          <div>
            <p className="text-base font-semibold text-gray-100">
              {user?.name ?? 'User'}
            </p>
            <p className="text-sm text-gray-500">{user?.email ?? ''}</p>
          </div>
        </div>
        <ProfileField label="Display name" value={user?.name ?? '—'} />
        <ProfileField label="Email address" value={user?.email ?? '—'} />
      </SectionContainer>

      <SectionContainer title="Account Information">
        <ProfileField label="Account ID" value={user?.id ?? '—'} />
        <ProfileField
          label="Plan"
          value={
            profileData
              ? profileData.plan === 'FREE'
                ? 'Free Tier'
                : 'Premium'
              : '—'
          }
        />
        <ProfileField label="Status" value="Active" />
      </SectionContainer>

      <SectionContainer title="Usage Statistics">
        {isLoadingProfile ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : profileError ? (
          <ErrorBanner message={profileError} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              label="Books Uploaded"
              value={`${profileData!.booksUploaded} / ${BOOKS_LIMIT}`}
              icon={BookOpen}
              progress={{ value: profileData!.booksUploaded, max: BOOKS_LIMIT }}
            />
            <StatCard
              label="Questions Used Today"
              value={`${profileData!.questionsToday} / ${QUESTIONS_LIMIT}`}
              icon={MessageSquare}
              progress={{
                value: profileData!.questionsToday,
                max: QUESTIONS_LIMIT,
              }}
              helperText="Resets daily at midnight"
            />
            <StatCard
              label="Remaining Questions"
              value={remainingQuestions ?? '—'}
              icon={Sparkles}
              helperText="Questions left for today"
            />
            <StatCard
              label="Storage Used"
              value={`${profileData!.storageUsedMb.toFixed(1)} MB`}
              icon={HardDrive}
            />
          </div>
        )}
      </SectionContainer>

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