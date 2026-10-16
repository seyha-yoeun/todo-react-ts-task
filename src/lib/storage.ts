import type { Todo, UserProfile } from '../types/todo.ts'
import { DEFAULT_PROFILE, isTodoStatus } from '../types/todo.ts'

export const TODOS_STORAGE_KEY = 'taskflow.todos.v1'
export const PROFILE_STORAGE_KEY = 'taskflow.profile.v1'

/** Read and parse a value from localStorage, falling back safely on any error. */
export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key)
    if (stored === null) return fallback
    return JSON.parse(stored) as T
  } catch (error) {
    console.warn(`[storage] Could not read "${key}" from localStorage.`, error)
    return fallback
  }
}

/** Serialize a value to localStorage, swallowing quota/security errors. */
export function saveJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`[storage] Could not write "${key}" to localStorage.`, error)
  }
}

/** Load persisted todos, dropping any malformed entries instead of crashing. */
export function loadTodos(): Todo[] {
  const raw = loadJSON<unknown>(TODOS_STORAGE_KEY, [])
  if (!Array.isArray(raw)) return []

  const todos: Todo[] = []
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) continue
    const record = entry as Record<string, unknown>
    if (typeof record.id !== 'string' || record.id === '') continue
    if (typeof record.title !== 'string' || record.title.trim() === '') continue

    todos.push({
      id: record.id,
      title: record.title,
      status: isTodoStatus(record.status) ? record.status : 'To Do',
      starred: record.starred === true,
      createdAt: typeof record.createdAt === 'number' ? record.createdAt : Date.now(),
    })
  }
  return todos
}

/** Load the persisted profile, filling in defaults for missing fields. */
export function loadProfile(): UserProfile {
  const raw = loadJSON<unknown>(PROFILE_STORAGE_KEY, null)
  if (typeof raw !== 'object' || raw === null) return { ...DEFAULT_PROFILE }

  const record = raw as Record<string, unknown>
  return {
    name:
      typeof record.name === 'string' && record.name.trim() !== ''
        ? record.name.trim()
        : DEFAULT_PROFILE.name,
    email: typeof record.email === 'string' ? record.email : DEFAULT_PROFILE.email,
    avatarColor:
      typeof record.avatarColor === 'string' ? record.avatarColor : DEFAULT_PROFILE.avatarColor,
  }
}
