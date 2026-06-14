import { createContext, useState, type ReactNode } from 'react'
import type {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '@/types/auth'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Temporary mock user — will be replaced by real API response in a later phase
const MOCK_USER: User = {
  id: 'user-1',
  name: 'Demo User',
  email: 'demo@bookies.app',
}

const MOCK_NETWORK_DELAY = 600

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState)

  // Mock login — will become an axios call to /auth/login later.
  // The signature (params in, Promise<void> out) will not change.
  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    await new Promise((resolve) => setTimeout(resolve, MOCK_NETWORK_DELAY))

    setState({
      user: { ...MOCK_USER, email: credentials.email },
      isAuthenticated: true,
      isLoading: false,
    })
  }

  // Mock register — will become an axios call to /auth/register later.
  const register = async (credentials: RegisterCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    await new Promise((resolve) => setTimeout(resolve, MOCK_NETWORK_DELAY))

    setState({
      user: {
        id: 'user-1',
        name: credentials.name,
        email: credentials.email,
      },
      isAuthenticated: true,
      isLoading: false,
    })
  }

  // Mock logout — will also clear stored JWT later.
  const logout = () => {
    setState(initialState)
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}