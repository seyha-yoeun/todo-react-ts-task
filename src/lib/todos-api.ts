import type { Todo, TodoStatus } from '../types/todo.ts'
import { apiRequest } from './api.ts'

const BASE = '/v1/todo'

export interface TodosQuery {
  /** 'All' or a concrete status; 'All' is simply omitted when calling the API. */
  status: TodoStatus | 'All'
  /** Case-insensitive title search. */
  search: string
}

/** GET /v1/todo — already filtered, searched, and sorted by the backend. */
export function fetchTodos(
  { status, search }: TodosQuery,
  signal?: AbortSignal,
): Promise<Todo[]> {
  const params = new URLSearchParams()
  if (status !== 'All') params.set('status', status)
  const query = search.trim()
  if (query !== '') params.set('q', query)

  const suffix = params.size > 0 ? `?${params.toString()}` : ''
  return apiRequest<Todo[]>(`${BASE}${suffix}`, { signal })
}

/** POST /v1/todo */
export function createTodo(title: string, status: TodoStatus): Promise<Todo> {
  return apiRequest<Todo>(BASE, { method: 'POST', body: { title, status } })
}

/** PATCH /v1/todo/:id — send concrete values, `starred` is not a toggle. */
export function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, 'title' | 'status' | 'starred'>>,
): Promise<Todo> {
  return apiRequest<Todo>(`${BASE}/${id}`, { method: 'PATCH', body: patch })
}

/** DELETE /v1/todo/:id */
export function deleteTodo(id: string): Promise<void> {
  return apiRequest<void>(`${BASE}/${id}`, { method: 'DELETE' })
}

/** PATCH /v1/todo/bulk/status */
export function bulkUpdateTodoStatus(ids: string[], status: TodoStatus): Promise<Todo[]> {
  return apiRequest<Todo[]>(`${BASE}/bulk/status`, {
    method: 'PATCH',
    body: { ids, status },
  })
}

/** DELETE /v1/todo/bulk */
export function bulkDeleteTodos(ids: string[]): Promise<void> {
  return apiRequest<void>(`${BASE}/bulk`, { method: 'DELETE', body: { ids } })
}

/** GET /v1/todo/stats */
export function fetchTodoStats(signal?: AbortSignal): Promise<{
  total: number
  todo: number
  inProgress: number
  done: number
  starred: number
}> {
  return apiRequest(`${BASE}/stats`, { signal })
}
