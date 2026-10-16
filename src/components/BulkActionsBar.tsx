import { useState } from 'react'
import type { TodoStatus } from '../types/todo.ts'
import { CheckIcon, TrashIcon, XIcon } from './icons.tsx'

interface BulkActionsBarProps {
  count: number
  onMarkStatus: (status: TodoStatus) => void
  onDelete: () => void
  onClearSelection: () => void
}

const BULK_BUTTON_CLASS =
  'rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400'

export const BulkActionsBar = ({
  count,
  onMarkStatus,
  onDelete,
  onClearSelection,
}: BulkActionsBarProps) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  if (count === 0) return null

  const plural = count === 1 ? 'task' : 'tasks'

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
      <div className="animate-rise pointer-events-auto w-full max-w-3xl rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-2xl shadow-slate-900/30 ring-1 ring-slate-700/60">
        {isConfirmingDelete ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium">
              Delete {count} selected {plural}? This can't be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onDelete()
                  setIsConfirmingDelete(false)
                }}
                className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold transition hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
              >
                Yes, delete
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className={BULK_BUTTON_CLASS}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold">
                {count}
              </span>
              <p className="text-sm font-medium">
                {count} {plural} selected
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onMarkStatus('To Do')}
                className={BULK_BUTTON_CLASS}
              >
                Mark To Do
              </button>
              <button
                type="button"
                onClick={() => onMarkStatus('In Progress')}
                className={BULK_BUTTON_CLASS}
              >
                Mark In Progress
              </button>
              <button
                type="button"
                onClick={() => onMarkStatus('Done')}
                className={`${BULK_BUTTON_CLASS} flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500`}
              >
                <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
                Mark Done
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className={`${BULK_BUTTON_CLASS} flex items-center gap-1.5 bg-rose-600/90 hover:bg-rose-600`}
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Delete
              </button>
              <button
                type="button"
                onClick={onClearSelection}
                aria-label="Clear selection"
                className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
