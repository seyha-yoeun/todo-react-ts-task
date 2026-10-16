import type { TodoFilter, TodoStats } from '../types/todo.ts'
import { SearchIcon, XIcon } from './icons.tsx'

interface TodoFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  filter: TodoFilter
  onFilterChange: (filter: TodoFilter) => void
  stats: TodoStats
  visibleCount: number
  allVisibleSelected: boolean
  onToggleSelectAll: () => void
}

const FILTERS: TodoFilter[] = ['All', 'To Do', 'In Progress', 'Done']

export const TodoFilters = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  stats,
  visibleCount,
  allVisibleSelected,
  onToggleSelectAll,
}: TodoFiltersProps) => {
  const counts: Record<TodoFilter, number> = {
    All: stats.total,
    'To Do': stats.todo,
    'In Progress': stats.inProgress,
    Done: stats.done,
  }

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <label htmlFor="todo-search" className="sr-only">
          Search tasks
        </label>
        <input
          id="todo-search"
          type="text"
          value={search}
          placeholder="Search tasks..."
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-9 pl-10 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 focus:outline-none"
        />
        {search !== '' && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
          {FILTERS.map((filterOption) => {
            const isActive = filterOption === filter
            return (
              <button
                key={filterOption}
                type="button"
                aria-pressed={isActive}
                onClick={() => onFilterChange(filterOption)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {filterOption}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {counts[filterOption]}
                </span>
              </button>
            )
          })}
        </div>

        <label
          className={`flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm ${
            visibleCount === 0 ? 'opacity-50' : 'cursor-pointer'
          }`}
        >
          <input
            type="checkbox"
            checked={allVisibleSelected}
            disabled={visibleCount === 0}
            onChange={onToggleSelectAll}
            aria-label="Select all visible tasks"
            className="h-4 w-4 accent-indigo-600"
          />
          <span>Select all{visibleCount > 0 ? ` (${visibleCount})` : ''}</span>
        </label>
      </div>
    </section>
  )
}
