import type { AvatarColor, TodoStatus } from '../types/todo.ts'
import { AVATAR_COLORS } from '../types/todo.ts'

export function createId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch {
    // Unavailable in some non-secure contexts; fall through to the ID below.
  }
  return `todo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function getAvatarColor(id: string): AvatarColor {
  return AVATAR_COLORS.find((color) => color.id === id) ?? AVATAR_COLORS[0]
}

export const STATUS_ACCENT_CLASSES: Record<TodoStatus, string> = {
  'To Do': 'border-amber-200 bg-amber-50 text-amber-700',
  'In Progress': 'border-blue-200 bg-blue-50 text-blue-700',
  Done: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

export const STATUS_DOT_CLASSES: Record<TodoStatus, string> = {
  'To Do': 'bg-amber-400',
  'In Progress': 'bg-blue-400',
  Done: 'bg-emerald-400',
}
