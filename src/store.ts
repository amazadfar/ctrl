import { useSyncExternalStore } from 'react'
import { defaultData } from './defaults'
import type { Data, Level } from './types'

const KEY = 'ctrl.data'

export function isData(value: unknown): value is Data {
  const d = value as Data | null
  return !!d && d.version === 1 && [d.signals, d.drivers, d.modes, d.sessions].every((x) => Array.isArray(x))
}

/** Fills in fields added after the first release, so older saved data and backups still load. */
export function normalize(d: Data): Data {
  return { ...d, levels: d.levels ?? {}, notes: d.notes ?? {} }
}

/** Where a driver sits on the desk; untouched drivers start in the middle. */
export function levelOf(d: Data, driverId: string): Level {
  return d.levels[driverId] ?? 3
}

function load(): Data {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
  } catch {
    return defaultData()
  }
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw)
      if (isData(parsed)) return normalize(parsed)
    } catch {
      // Unreadable JSON: handled below.
    }
    // Set aside whatever was there rather than silently overwriting it with defaults.
    try {
      localStorage.setItem(`${KEY}.unreadable`, raw)
    } catch {
      // Nothing more we can do.
    }
  }
  return defaultData()
}

let data = load()
const listeners = new Set<() => void>()

export function getData(): Data {
  return data
}

export function setData(update: (d: Data) => Data): void {
  data = update(data)
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // Storage full or blocked: keep working in memory.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useData(): Data {
  return useSyncExternalStore(subscribe, getData)
}

export function newId(): string {
  // Not crypto.randomUUID: it only exists in secure contexts, and the LAN dev server is plain http.
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
