import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Todo, TodoStatus } from '../types/todo.ts'
import { PencilIcon, StarIcon, TrashIcon } from './icons.tsx'
import { StatusSelect } from './StatusSelect.tsx'

interface TodoItemProps {
  todo: Todo
  isSelected: boolean
  isEditing: boolean
  onToggleSelected: (id: string) => void
  onToggleStar: (id: string) => void
  onChangeStatus: (id: string, status: TodoStatus) => void
  onSubmitEdit: (id: string, title: string, status: TodoStatus) => void
  onDelete: (id: string) => void
  onStartEditing: (id: string) => void
  onStopEditing: () => void
}

const ICON_BUTTON_CLASS =
  'rounded-lg p-1.5 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'

export const TodoItem = ({
  todo,
  isSelected,
  isEditing,
  onToggleSelected,
  onToggleStar,
  onChangeStatus,
  onSubmitEdit,
  onDelete,
  onStartEditing,
  onStopEditing,
}: TodoItemProps) => {
  const isDone = todo.status === 'Done'
  const addedLabel = new Date(todo.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  return (
    <li
      className={`flex flex-wrap items-start gap-3 rounded-2xl border bg-white p-4 shadow-sm transition ${
        isSelected
          ? 'border-indigo-300 ring-1 ring-indigo-200'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelected(todo.id)}
        aria-label={`Select "${todo.title}"`}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
      />

      {isEditing ? (
        <EditForm todo={todo} onSubmit={onSubmitEdit} onCancel={onStopEditing} />
      ) : (
        <>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-medium break-words ${
                isDone ? 'text-slate-400 line-through' : 'text-slate-800'
              }`}
            >
              {todo.title}
            </p>
            <p className="mt-1 text-xs text-slate-400">Added {addedLabel}</p>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleStar(todo.id)}
              aria-pressed={todo.starred}
              aria-label={todo.starred ? `Remove star from "${todo.title}"` : `Star "${todo.title}"`}
              className={`${ICON_BUTTON_CLASS} ${
                todo.starred
                  ? 'text-amber-400 hover:bg-amber-50'
                  : 'text-slate-300 hover:bg-slate-100 hover:text-amber-400'
              }`}
            >
              <StarIcon className="h-4.5 w-4.5" fill={todo.starred ? 'currentColor' : 'none'} />
            </button>

            <StatusSelect
              value={todo.status}
              onChange={(status) => onChangeStatus(todo.id, status)}
              label={`Status for "${todo.title}"`}
            />

            <button
              type="button"
              onClick={() => onStartEditing(todo.id)}
              aria-label={`Edit "${todo.title}"`}
              className={`${ICON_BUTTON_CLASS} text-slate-400 hover:bg-slate-100 hover:text-slate-700`}
            >
              <PencilIcon className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(todo.id)}
              aria-label={`Delete "${todo.title}"`}
              className={`${ICON_BUTTON_CLASS} text-slate-400 hover:bg-rose-50 hover:text-rose-600`}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </li>
  )
}

interface EditFormProps {
  todo: Todo
  onSubmit: (id: string, title: string, status: TodoStatus) => void
  onCancel: () => void
}

const EditForm = ({ todo, onSubmit, onCancel }: EditFormProps) => {
  const [title, setTitle] = useState(todo.title)
  const [status, setStatus] = useState<TodoStatus>(todo.status)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const input = inputRef.current
    if (input === null) return
    input.focus()
    input.select()
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = title.trim()
    if (trimmed === '') return
    onSubmit(todo.id, trimmed, status)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center"
    >
      <input
        ref={inputRef}
        type="text"
        value={title}
        maxLength={120}
        aria-label="Edit task title"
        onKeyDown={(event) => {
          if (event.key === 'Escape') onCancel()
        }}
        onChange={(event) => setTitle(event.target.value)}
        className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 focus:outline-none"
      />
      <div className="flex items-center gap-2">
        <StatusSelect value={status} onChange={setStatus} label="Edit task status" />
        <button
          type="submit"
          disabled={title.trim() === ''}
          className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
