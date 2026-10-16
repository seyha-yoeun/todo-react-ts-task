import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import type { Todo, TodoFilter, TodoStatus, UserProfile } from './types/todo.ts'
import {
  PROFILE_STORAGE_KEY,
  TODOS_STORAGE_KEY,
  loadProfile,
  loadTodos,
  saveJSON,
} from './lib/storage.ts'
import { STATUS_DOT_CLASSES, createId } from './lib/utils.ts'
import { Header } from './components/Header.tsx'
import { ProfileModal } from './components/ProfileModal.tsx'
import { TodoForm } from './components/TodoForm.tsx'
import { TodoFilters } from './components/TodoFilters.tsx'
import { TodoList } from './components/TodoList.tsx'
import { BulkActionsBar } from './components/BulkActionsBar.tsx'

type TodoAction =
  | { type: 'add'; todo: Todo }
  | { type: 'update'; id: string; patch: Partial<Pick<Todo, 'title' | 'status' | 'starred'>> }
  | { type: 'toggleStar'; id: string }
  | { type: 'delete'; id: string }
  | { type: 'bulkDelete'; ids: string[] }
  | { type: 'bulkStatus'; ids: string[]; status: TodoStatus }

const todoReducer = (todos: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case 'add':
      return [action.todo, ...todos]
    case 'update':
      return todos.map((todo) => (todo.id === action.id ? { ...todo, ...action.patch } : todo))
    case 'toggleStar':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, starred: !todo.starred } : todo,
      )
    case 'delete':
      return todos.filter((todo) => todo.id !== action.id)
    case 'bulkDelete': {
      const idsToRemove = new Set(action.ids)
      return todos.filter((todo) => !idsToRemove.has(todo.id))
    }
    case 'bulkStatus': {
      const idsToUpdate = new Set(action.ids)
      return todos.map((todo) =>
        idsToUpdate.has(todo.id) ? { ...todo, status: action.status } : todo,
      )
    }
  }
}

interface StatTileProps {
  label: string
  value: number
  dotClass?: string
  sub?: string
}

const StatTile = ({ label, value, dotClass, sub }: StatTileProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-2">
      {dotClass !== undefined && <span className={`h-2 w-2 rounded-full ${dotClass}`} />}
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
    </div>
    <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    {sub !== undefined && <p className="mt-0.5 text-xs font-medium text-amber-500">{sub}</p>}
  </div>
)

const App = () => {
  const [todos, dispatch] = useReducer(todoReducer, undefined, loadTodos)
  const [profile, setProfile] = useState<UserProfile>(loadProfile)
  const [filter, setFilter] = useState<TodoFilter>('All')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    saveJSON(TODOS_STORAGE_KEY, todos)
  }, [todos])

  useEffect(() => {
    saveJSON(PROFILE_STORAGE_KEY, profile)
  }, [profile])

  const stats = useMemo(() => {
    const next = { total: todos.length, todo: 0, inProgress: 0, done: 0, starred: 0 }
    for (const todo of todos) {
      if (todo.status === 'To Do') next.todo += 1
      else if (todo.status === 'In Progress') next.inProgress += 1
      else next.done += 1
      if (todo.starred) next.starred += 1
    }
    return next
  }, [todos])

  const visibleTodos = useMemo(() => {
    const query = search.trim().toLowerCase()
    return todos
      .filter((todo) => filter === 'All' || todo.status === filter)
      .filter((todo) => query === '' || todo.title.toLowerCase().includes(query))
      .sort((a, b) => {
        if (a.starred !== b.starred) return a.starred ? -1 : 1
        return b.createdAt - a.createdAt
      })
  }, [todos, filter, search])

  // Count only ids that still exist, so deleted tasks never linger in the bulk bar.
  const selectedCount = useMemo(() => {
    let count = 0
    for (const todo of todos) {
      if (selectedIds.has(todo.id)) count += 1
    }
    return count
  }, [todos, selectedIds])

  const allVisibleSelected =
    visibleTodos.length > 0 && visibleTodos.every((todo) => selectedIds.has(todo.id))

  const openProfile = useCallback(() => setIsProfileOpen(true), [])
  const closeProfile = useCallback(() => setIsProfileOpen(false), [])

  const addTodo = (title: string, status: TodoStatus) => {
    dispatch({
      type: 'add',
      todo: { id: createId(), title, status, starred: false, createdAt: Date.now() },
    })
  }

  const toggleStar = (id: string) => {
    dispatch({ type: 'toggleStar', id })
  }

  const changeStatus = (id: string, status: TodoStatus) => {
    dispatch({ type: 'update', id, patch: { status } })
  }

  const submitEdit = (id: string, title: string, status: TodoStatus) => {
    dispatch({ type: 'update', id, patch: { title, status } })
    setEditingId(null)
  }

  const deleteTodo = (id: string) => {
    dispatch({ type: 'delete', id })
    setEditingId((current) => (current === id ? null : current))
  }

  const toggleSelected = (id: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAllVisible = () => {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (allVisibleSelected) {
        for (const todo of visibleTodos) next.delete(todo.id)
      } else {
        for (const todo of visibleTodos) next.add(todo.id)
      }
      return next
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  const bulkUpdateStatus = (status: TodoStatus) => {
    const ids = todos.filter((todo) => selectedIds.has(todo.id)).map((todo) => todo.id)
    dispatch({ type: 'bulkStatus', ids, status })
    setSelectedIds(new Set())
    setEditingId((current) => (current !== null && ids.includes(current) ? null : current))
  }

  const bulkDelete = () => {
    const ids = todos.filter((todo) => selectedIds.has(todo.id)).map((todo) => todo.id)
    dispatch({ type: 'bulkDelete', ids })
    setSelectedIds(new Set())
    setEditingId((current) => (current !== null && ids.includes(current) ? null : current))
  }

  const clearFilters = () => {
    setFilter('All')
    setSearch('')
  }

  const startEditing = (id: string) => setEditingId(id)
  const stopEditing = () => setEditingId(null)

  const saveProfile = (nextProfile: UserProfile) => {
    setProfile(nextProfile)
    setIsProfileOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-8 sm:px-6 lg:py-12">
        <Header profile={profile} onEditProfile={openProfile} />

        <section aria-label="Task summary" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="Total"
            value={stats.total}
            sub={stats.starred > 0 ? `★ ${stats.starred} starred` : undefined}
          />
          <StatTile label="To Do" value={stats.todo} dotClass={STATUS_DOT_CLASSES['To Do']} />
          <StatTile
            label="In Progress"
            value={stats.inProgress}
            dotClass={STATUS_DOT_CLASSES['In Progress']}
          />
          <StatTile label="Done" value={stats.done} dotClass={STATUS_DOT_CLASSES.Done} />
        </section>

        <TodoForm onAdd={addTodo} />

        <TodoFilters
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={setFilter}
          stats={stats}
          visibleCount={visibleTodos.length}
          allVisibleSelected={allVisibleSelected}
          onToggleSelectAll={toggleSelectAllVisible}
        />

        <TodoList
          todos={visibleTodos}
          selectedIds={selectedIds}
          editingId={editingId}
          hasAnyTodos={todos.length > 0}
          onToggleSelected={toggleSelected}
          onToggleStar={toggleStar}
          onChangeStatus={changeStatus}
          onSubmitEdit={submitEdit}
          onDelete={deleteTodo}
          onStartEditing={startEditing}
          onStopEditing={stopEditing}
          onClearFilters={clearFilters}
        />

        <BulkActionsBar
          count={selectedCount}
          onMarkStatus={bulkUpdateStatus}
          onDelete={bulkDelete}
          onClearSelection={clearSelection}
        />

        {isProfileOpen && (
          <ProfileModal profile={profile} onSave={saveProfile} onClose={closeProfile} />
        )}
      </div>
    </div>
  )
}

export default App
