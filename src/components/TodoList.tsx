import type { Todo, TodoStatus } from '../types/todo.ts'
import { TodoItem } from './TodoItem.tsx'
import { ClipboardListIcon, SearchIcon } from './icons.tsx'

interface TodoListProps {
  todos: Todo[]
  selectedIds: ReadonlySet<string>
  editingId: string | null
  hasAnyTodos: boolean
  onToggleSelected: (id: string) => void
  onToggleStar: (id: string) => void
  onChangeStatus: (id: string, status: TodoStatus) => void
  onSubmitEdit: (id: string, title: string, status: TodoStatus) => void
  onDelete: (id: string) => void
  onStartEditing: (id: string) => void
  onStopEditing: () => void
  onClearFilters: () => void
}

export const TodoList = ({
  todos,
  selectedIds,
  editingId,
  hasAnyTodos,
  onToggleSelected,
  onToggleStar,
  onChangeStatus,
  onSubmitEdit,
  onDelete,
  onStartEditing,
  onStopEditing,
  onClearFilters,
}: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          {hasAnyTodos ? (
            <SearchIcon className="h-6 w-6" />
          ) : (
            <ClipboardListIcon className="h-6 w-6" />
          )}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-700">
            {hasAnyTodos ? 'No tasks match your filters' : 'No tasks yet'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {hasAnyTodos
              ? 'Try a different search term or switch status tabs.'
              : 'Add your first task above and start checking things off.'}
          </p>
        </div>
        {hasAnyTodos && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
          >
            Clear search &amp; filters
          </button>
        )}
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isSelected={selectedIds.has(todo.id)}
          isEditing={editingId === todo.id}
          onToggleSelected={onToggleSelected}
          onToggleStar={onToggleStar}
          onChangeStatus={onChangeStatus}
          onSubmitEdit={onSubmitEdit}
          onDelete={onDelete}
          onStartEditing={onStartEditing}
          onStopEditing={onStopEditing}
        />
      ))}
    </ul>
  )
}
