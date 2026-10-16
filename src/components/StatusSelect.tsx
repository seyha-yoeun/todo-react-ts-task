import { isTodoStatus, STATUSES } from '../types/todo.ts'
import type { TodoStatus } from '../types/todo.ts'
import { STATUS_ACCENT_CLASSES } from '../lib/utils.ts'
import { ChevronDownIcon } from './icons.tsx'

interface StatusSelectProps {
  value: TodoStatus
  onChange: (status: TodoStatus) => void
  label: string
  size?: 'sm' | 'md'
  className?: string
}

export const StatusSelect = ({
  value,
  onChange,
  label,
  size = 'sm',
  className = '',
}: StatusSelectProps) => {
  const sizing = size === 'md' ? 'py-3 pl-3.5 pr-8 text-sm' : 'py-1.5 pl-3 pr-7 text-xs'

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={value}
        onChange={(event) => {
          const next = event.target.value
          if (isTodoStatus(next)) onChange(next)
        }}
        aria-label={label}
        className={`w-full cursor-pointer appearance-none rounded-full border font-semibold outline-none transition focus:ring-2 focus:ring-indigo-500/30 ${sizing} ${STATUS_ACCENT_CLASSES[value]}`}
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 opacity-70" />
    </div>
  )
}
