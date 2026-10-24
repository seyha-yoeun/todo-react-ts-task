/**
 * In-memory token management — no tokens are written to localStorage.
 */
let memoryAccessToken: string | null = null

export function getAccessToken(): string | null {
  return memoryAccessToken
}

export function setAccessToken(token: string | null): void {
  memoryAccessToken = token
}

export function clearAccessToken(): void {
  memoryAccessToken = null
}
