/** Base URL for the backend API. Falls back to Vite's `/api` proxy in dev. */
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  signal?: AbortSignal
}

import { clearAccessToken, getAccessToken } from './auth-token.ts'

/**
 * Thin fetch wrapper: JSON in, JSON out, with backend validation
 * messages surfaced as `ApiError`.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  const token = getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'Could not reach the server. Is the backend running?')
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAccessToken()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:unauthorized'))
      }
    }
    throw new ApiError(response.status, await errorMessage(response))
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

/** Extracts a readable message from the backend error payload. */
async function errorMessage(response: Response): Promise<string> {
  try {
    const payload: unknown = await response.json()
    if (typeof payload === 'object' && payload !== null && 'message' in payload) {
      const { message } = payload as { message: unknown }
      if (Array.isArray(message)) return message.join(', ')
      if (typeof message === 'string') return message
    }
  } catch {
    // Body was not JSON — fall through to the generic message.
  }
  return `Request failed (${response.status}).`
}
