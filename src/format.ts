import type { Changed, Helped, Level } from './types'

export const DURATIONS = [15, 30, 60, 120, 240]

export const CHANGED_LABEL: Record<Changed, string> = { no: 'No', little: 'A little', yes: 'Yes' }
export const HELPED_LABEL: Record<Helped, string> = { worse: 'Worse', same: 'No change', better: 'Better' }

export function cx(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(' ')
}

export function levelLabel(labels: string[], level: Level): string {
  return labels[level - 1]?.trim() || String(level)
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

export function formatMinutes(minutes: number): string {
  return minutes < 60 ? `${minutes}m` : `${minutes / 60}h`
}

export function formatTime(t: number): string {
  return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDay(t: number): string {
  const day = new Date(t).toDateString()
  const now = new Date()
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  if (day === now.toDateString()) return 'Today'
  if (day === yesterday.toDateString()) return 'Yesterday'
  return new Date(t).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
}
