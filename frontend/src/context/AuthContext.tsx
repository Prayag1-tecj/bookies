import { createContext, useState, useEffect, type ReactNode } from 'react'
import type { AuthContextType, AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth'
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  restoreSession,
} from '@/services/authService'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // true on startup while we validate the stored token
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState)

  // On mount: validate stored token and restore session
  // isLoading stays true until this resolves — ProtectedRoute
  // shows a loading screen instead of redirecting prematurely
  useEffect(() => {
    restoreSession()
      .then((user) => {
        setState({ user, isAuthenticated: user !== null, isLoading: false })
      })
      .catch(() => {
        setState({ user: null, isAuthenticated: false, isLoading: false })
      })
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await loginRequest(credentials)
      setState({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error // re-throw so LoginPage can catch and show error
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await registerRequest(credentials)
      setState({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error // re-throw so RegisterPage can catch and show error
    }
  }

  const logout = () => {
    logoutRequest()
    setState({ user: null, isAuthenticated: false, isLoading: false })
  }

  const value: AuthContextType = { ...state, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}