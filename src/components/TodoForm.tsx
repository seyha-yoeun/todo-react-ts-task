import { useState } from 'react'
import type { FormEvent } from 'react'
import type { TodoStatus } from '../types/todo.ts'
import { PlusIcon } from './icons.tsx'
import { StatusSelect } from './StatusSelect.tsx'

interface TodoFormProps {
  onAdd: (title: string, status: TodoStatus) => void
}

const MAX_TITLE_LENGTH = 120

export const TodoForm = ({ onAdd }: TodoFormProps) => {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<TodoStatus>('To Do')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = title.trim()

    if (trimmed === '') {
      setError('Enter a task title before adding it.')
      return
    }
    if (trimmed.length > MAX_TITLE_LENGTH) {
      setError(`Titles can be at most ${MAX_TITLE_LENGTH} characters.`)
      return
    }

    onAdd(trimmed, status)
    setTitle('')
    setError(null)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="sr-only">Add a task</h2>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <label htmlFor="new-todo-title" className="sr-only">
            Task title
          </label>
          <input
            id="new-todo-title"
            type="text"
            value={title}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="What needs to get done?"
            aria-invalid={error !== null}
            aria-describedby={error !== null ? 'new-todo-error' : undefined}
            onChange={(event) => {
              setTitle(event.target.value)
              if (error !== null) setError(null)
            }}
            className={`w-full rounded-xl border px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 ${
              error !== null
                ? 'border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-500/20'
                : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-500/25'
            }`}
          />
        </div>

        <div className="flex items-center gap-2.5">
          <StatusSelect
            value={status}
            onChange={setStatus}
            label="Initial status for the new task"
            size="md"
            className="flex-1 sm:flex-none"
          />
          <button
            type="submit"
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:flex-none"
          >
            <PlusIcon className="h-4 w-4" strokeWidth={2.4} />
            Add task
          </button>
        </div>
      </form>

      {error !== null && (
        <p id="new-todo-error" className="mt-2 text-xs text-rose-600">
          {error}
        </p>
      )}
    </section>
  )
}
