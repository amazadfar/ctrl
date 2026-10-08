import type { ReactNode } from 'react'

function Icon({ size = 24, children }: { size?: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const ChevronLeftIcon = () => (
  <Icon size={22}>
    <path d="M15 5l-7 7 7 7" />
  </Icon>
)

export const ChevronRightIcon = () => (
  <span className="chev">
    <Icon size={18}>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  </span>
)

export const PlusIcon = () => (
  <Icon size={20}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)

export const HistoryIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
)

export const SettingsIcon = () => (
  <Icon>
    <path d="M4 7h16M4 17h16" />
    <circle cx="9" cy="7" r="2.4" fill="var(--bg)" />
    <circle cx="15" cy="17" r="2.4" fill="var(--bg)" />
  </Icon>
)
