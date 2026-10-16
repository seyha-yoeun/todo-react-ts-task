import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const iconBase = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const StarIcon = (props: IconProps) => (
  <svg {...iconBase} {...props} aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

export const TrashIcon = (props: IconProps) => (
  <svg {...iconBase} {...props} aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
)

export const PencilIcon = (props: IconProps) => (
  <svg {...iconBase} {...props} aria-hidden="true">
    <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
)

export const PlusIcon = (props: IconProps) => (
  <svg {...iconBase} {...props} aria-hidden="true">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
)

export const SearchIcon = (props: IconProps) => (
  <svg {...iconBase} {...props} aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

export const XIcon = (props: IconProps) => (
  <svg {...iconBase} {...props} aria-hidden="true">
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
)

export const CheckIcon = (props: IconProps) => (
  <svg {...iconBase} {...props} aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export const ChevronDownIcon = (props: IconProps) => (
  <svg {...iconBase} {...props} aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export const UserIcon = (props: IconProps) => (
  <svg {...iconBase} {...props} aria-hidden="true">
    <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const ClipboardListIcon = (props: IconProps) => (
  <svg {...iconBase} {...props} aria-hidden="true">
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
)
