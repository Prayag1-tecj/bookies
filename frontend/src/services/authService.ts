import api, { storeToken, clearToken, getStoredToken } from './api'
import type { User } from '@/types/auth'

// ─── Backend response shapes ─────────────────────────────────────────────────

interface TokenResponse {
  access: string
  refresh: string
}

// From GET /api/auth/profile/ via ProfileSerializer
interface ProfileResponse {
  id: number
  username: string
  email: string
  plan: string
  books_uploaded: number
  questions_today: number
  storage_used_mb: number
}

// ─── Transform ───────────────────────────────────────────────────────────────

function profileToUser(profile: ProfileResponse): User {
  return {
    id: String(profile.id),
    name: profile.username,
    email: profile.email,
    joinedAt: new Date().toISOString(), // not in API response — use current time
  }
}

// ─── Fetch profile after any login ───────────────────────────────────────────

async function fetchProfile(): Promise<User> {
  const { data } = await api.get<ProfileResponse>('/api/auth/profile/')
  return profileToUser(data)
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

// IMPORTANT: Backend login uses `username`, not `email`.
// SimpleJWT's TokenObtainPairView authenticates on the username field.
// We send the email value the user typed as `username` here, which works
// only if the user registered with a username matching their email — or
// if the backend is configured to accept email as username.
// The cleanest UX fix is to make the register step store email as username,
// so login-by-email works transparently. Both register and login do this below.

export async function loginRequest(credentials: {
  email: string
  password: string
}): Promise<User> {
  const { data } = await api.post<TokenResponse>('/api/auth/login/', {
    username: credentials.email, // send email value in username field
    password: credentials.password,
  })
  storeToken(data.access)
  return fetchProfile()
}

export async function registerRequest(credentials: {
  name: string
  email: string
  password: string
}): Promise<User> {
  // Step 1: Register — returns { message: "User registered successfully" }, no token
  await api.post('/api/auth/register/', {
    username: credentials.email, // use email as username for login-by-email to work
    email: credentials.email,
    password: credentials.password,
  })

  // Step 2: Immediately log in to get the token
  const { data } = await api.post<TokenResponse>('/api/auth/login/', {
    username: credentials.email,
    password: credentials.password,
  })
  storeToken(data.access)

  // Step 3: Fetch profile to get full user data
  const user = await fetchProfile()

  // Use the display name from the register form since the backend
  // stores username (email) not the full name. Store it separately
  // for UI display only — it's not persisted to the backend yet.
  return { ...user, name: credentials.name }
}

export function logoutRequest(): void {
  clearToken()
}

// Called on app startup — restore session if token is still valid
export async function restoreSession(): Promise<User | null> {
  const token = getStoredToken()
  if (!token) return null

  // Check expiry from JWT payload without a library
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      clearToken()
      return null
    }
  } catch {
    clearToken()
    return null
  }

  // Token looks valid — fetch real profile to confirm and get user data
  try {
    return await fetchProfile()
  } catch {
    clearToken()
    return null
  }
}

// Exported for Settings page usage stats
export async function fetchProfileData(): Promise<ProfileResponse> {
  const { data } = await api.get<ProfileResponse>('/api/auth/profile/')
  return data
}