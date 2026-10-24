import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { AuthUser, LoginCredentials, SignupCredentials } from '../types/auth.ts'
import * as authApi from '../lib/auth-api.ts'
import { ApiError } from '../lib/api.ts'

interface Value {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  logout: () => void
  clearError: () => void
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<Value | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.login(credentials)
      setUser(response.user)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Login failed. Please check your credentials.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (credentials: SignupCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.signup(credentials)
      setUser(response.user)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Sign up failed. Please try again.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
    setError(null)
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      authApi.logout()
      setUser(null)
      setError('Your session has expired. Please sign in again.')
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  const refreshMe = useCallback(async () => {
    try {
      const currentUser = await authApi.fetchMe()
      setUser(currentUser)
    } catch {
      logout()
    }
  }, [logout])

  const value = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
    refreshMe,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): Value {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
