export const STATUSES = ['To Do', 'In Progress', 'Done'] as const

export type TodoStatus = (typeof STATUSES)[number]

export type TodoFilter = 'All' | TodoStatus

export interface Todo {
  id: string
  title: string
  status: TodoStatus
  starred: boolean
  createdAt: number
}

export interface TodoStats {
  total: number
  todo: number
  inProgress: number
  done: number
  starred: number
}

export interface UserProfile {
  name: string
  email: string
  avatarColor: string
}

export interface AvatarColor {
  id: string
  label: string
  swatch: string
}

export const AVATAR_COLORS: AvatarColor[] = [
  { id: 'indigo', label: 'Indigo', swatch: 'bg-indigo-500' },
  { id: 'sky', label: 'Sky', swatch: 'bg-sky-500' },
  { id: 'teal', label: 'Teal', swatch: 'bg-teal-500' },
  { id: 'emerald', label: 'Emerald', swatch: 'bg-emerald-500' },
  { id: 'amber', label: 'Amber', swatch: 'bg-amber-500' },
  { id: 'rose', label: 'Rose', swatch: 'bg-rose-500' },
  { id: 'violet', label: 'Violet', swatch: 'bg-violet-500' },
]

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Guest',
  email: '',
  avatarColor: 'indigo',
}

export const isTodoStatus = (value: unknown): value is TodoStatus =>
  typeof value === 'string' && (STATUSES as readonly string[]).includes(value)
