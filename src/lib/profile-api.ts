import type { UserProfile } from '../types/todo.ts'
import { apiRequest } from './api.ts'

const BASE = '/v1/profile'

/** GET /v1/profile — returns frontend defaults until the profile is saved. */
export function fetchProfile(signal?: AbortSignal): Promise<UserProfile> {
  return apiRequest<UserProfile>(BASE, { signal })
}

/** PUT /v1/profile — creates the row on first save, updates after. */
export function saveProfile(profile: UserProfile): Promise<UserProfile> {
  return apiRequest<UserProfile>(BASE, { method: 'PUT', body: profile })
}
