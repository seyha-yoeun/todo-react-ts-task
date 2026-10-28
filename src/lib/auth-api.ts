import type { AuthResponse, AuthUser, LoginCredentials, SignupCredentials } from '../types/auth.ts'
import { apiRequest } from './api.ts'
import { clearTokens, getRefreshToken, setAccessToken, setRefreshToken } from './auth-token.ts'

const AUTH_BASE = '/v1/auth'

/** Saves the token pair returned by login/signup/refresh. */
function storeSession(response: AuthResponse): AuthResponse {
  setAccessToken(response.accessToken)
  setRefreshToken(response.refreshToken)
  return response
}

/** POST /v1/auth/signup — registers a new account and stores the session */
export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>(`${AUTH_BASE}/signup`, {
    method: 'POST',
    body: credentials,
  })
  return storeSession(response)
}

/** POST /v1/auth/login — authenticates the user and stores the session */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>(`${AUTH_BASE}/login`, {
    method: 'POST',
    body: credentials,
  })
  return storeSession(response)
}

/** GET /v1/auth/me — returns the current authenticated user */
export async function fetchMe(signal?: AbortSignal): Promise<AuthUser> {
  return apiRequest<AuthUser>(`${AUTH_BASE}/me`, { signal })
}

/**
 * POST /v1/auth/logout — clears local tokens right away, then asks the
 * backend to revoke the session so the tokens stop working server-side too.
 */
export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken()
  clearTokens()
  if (!refreshToken) return
  try {
    await apiRequest<void>(`${AUTH_BASE}/logout`, {
      method: 'POST',
      body: { refreshToken },
    })
  } catch {
    // Already signed out locally; the tokens will expire on their own.
  }
}
