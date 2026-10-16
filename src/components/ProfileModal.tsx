import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../types/todo.ts'
import { AVATAR_COLORS } from '../types/todo.ts'
import { getAvatarColor, getInitials } from '../lib/utils.ts'
import { XIcon } from './icons.tsx'

interface ProfileModalProps {
  profile: UserProfile
  onSave: (profile: UserProfile) => void
  onClose: () => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME_LENGTH = 40

interface FieldErrors {
  name?: string
  email?: string
}

const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-500/20'
      : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-500/25'
  }`

export const ProfileModal = ({ profile, onSave, onClose }: ProfileModalProps) => {
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [avatarColor, setAvatarColor] = useState(profile.avatarColor)
  const [errors, setErrors] = useState<FieldErrors>({})
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    if (panel === null) return

    const focusableSelector =
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => !element.hasAttribute('disabled'),
      )

    panel.querySelector<HTMLElement>('input')?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const nextErrors: FieldErrors = {}

    if (trimmedName === '') {
      nextErrors.name = 'Please enter a name.'
    } else if (trimmedName.length > MAX_NAME_LENGTH) {
      nextErrors.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`
    }

    if (trimmedEmail !== '' && !EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    setErrors(nextErrors)
    if (nextErrors.name !== undefined || nextErrors.email !== undefined) return

    onSave({ name: trimmedName, email: trimmedEmail, avatarColor })
  }

  const previewColor = getAvatarColor(avatarColor)
  const trimmedName = name.trim()
  const trimmedEmail = email.trim()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="presentation"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="animate-fade absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="animate-rise relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="profile-modal-title" className="text-lg font-semibold text-slate-900">
              Edit profile
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Your details are stored locally on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile dialog"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white shadow-md ${previewColor.swatch}`}
          >
            {getInitials(name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {trimmedName !== '' ? trimmedName : 'Your name'}
            </p>
            <p className="truncate text-xs text-slate-500">
              {trimmedEmail !== '' ? trimmedEmail : 'No email added yet'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              maxLength={60}
              autoComplete="name"
              aria-invalid={errors.name !== undefined}
              onChange={(event) => {
                setName(event.target.value)
                if (errors.name !== undefined) setErrors((previous) => ({ ...previous, name: undefined }))
              }}
              className={inputClass(errors.name !== undefined)}
            />
            {errors.name !== undefined && (
              <p className="mt-1.5 text-xs text-rose-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={errors.email !== undefined}
              onChange={(event) => {
                setEmail(event.target.value)
                if (errors.email !== undefined)
                  setErrors((previous) => ({ ...previous, email: undefined }))
              }}
              className={inputClass(errors.email !== undefined)}
            />
            {errors.email !== undefined && (
              <p className="mt-1.5 text-xs text-rose-600">{errors.email}</p>
            )}
          </div>

          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-slate-700">Avatar color</legend>
            <div className="flex flex-wrap gap-2.5">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setAvatarColor(color.id)}
                  aria-label={color.label}
                  aria-pressed={avatarColor === color.id}
                  className={`h-8 w-8 rounded-full transition ${color.swatch} ${
                    avatarColor === color.id ? 'ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </fieldset>

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
