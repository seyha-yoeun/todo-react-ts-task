import type { AuthResponse, AuthUser, LoginCredentials, SignupCredentials } from '../types/auth.ts'
import { apiRequest } from './api.ts'
import { clearAccessToken, setAccessToken } from './auth-token.ts'

const AUTH_BASE = '/v1/auth'

/** POST /v1/auth/signup — registers new account and stores access token in memory */
export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>(`${AUTH_BASE}/signup`, {
    method: 'POST',
    body: credentials,
  })
  if (response?.accessToken) {
    setAccessToken(response.accessToken)
  }
  return response
}

/** POST /v1/auth/login — authenticates user and stores access token in memory */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>(`${AUTH_BASE}/login`, {
    method: 'POST',
    body: credentials,
  })
  if (response?.accessToken) {
    setAccessToken(response.accessToken)
  }
  return response
}

/** GET /v1/auth/me — returns current authenticated user */
export async function fetchMe(signal?: AbortSignal): Promise<AuthUser> {
  return apiRequest<AuthUser>(`${AUTH_BASE}/me`, { signal })
}

/** Logs out by resetting in-memory access token */
export function logout(): void {
  clearAccessToken()
}
