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

/** Speaker glyphs for the ends of a volume slider, as in iOS Settings. */
const SPEAKER = 'M2 9h3l4.4-3.6c.5-.4 1.1-.1 1.1.5v12.2c0 .6-.6.9-1.1.5L5 15H2a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z'

export const SpeakerIcon = () => (
  <svg className="speaker" width={13} height={22} viewBox="0 0 13 24" aria-hidden="true">
    <path d={SPEAKER} fill="currentColor" />
  </svg>
)

export const SpeakerLoudIcon = () => (
  <svg className="speaker" width={25} height={22} viewBox="0 0 27 24" aria-hidden="true">
    <path d={SPEAKER} fill="currentColor" />
    <path
      d="M14 9.2a4 4 0 0 1 0 5.6M17 6.8a7.5 7.5 0 0 1 0 10.4M20 4.4a11 11 0 0 1 0 15.2"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
    />
  </svg>
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
