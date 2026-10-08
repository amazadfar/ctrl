import { newId, setData } from './store'
import type { Changed, Data, Helped, Level, Mode, Scale, Session } from './types'

export type ScaleKind = 'signals' | 'drivers'

function replaceById<T extends { id: string }>(items: T[], id: string, update: (item: T) => T): T[] {
  return items.map((item) => (item.id === id ? update(item) : item))
}

function withScales(d: Data, kind: ScaleKind, scales: Scale[]): Data {
  return kind === 'signals' ? { ...d, signals: scales } : { ...d, drivers: scales }
}

export function updateMode(id: string, update: (mode: Mode) => Mode) {
  setData((d) => ({ ...d, modes: replaceById(d.modes, id, update) }))
}

export function createMode(): string {
  const id = newId()
  setData((d) => {
    const first = d.drivers[0]
    const mode: Mode = {
      id,
      name: '',
      minutes: 60,
      drivers: first ? [{ driverId: first.id, level: 3, note: '' }] : [],
      rules: [{ cue: '', action: '' }],
    }
    return { ...d, modes: [...d.modes, mode] }
  })
  return id
}

export function deleteMode(id: string) {
  setData((d) => ({ ...d, modes: d.modes.filter((m) => m.id !== id) }))
}

export function startSession(mode: Mode) {
  setData((d) => {
    const startedAt = Date.now()
    const driver = (id: string) => d.drivers.find((s) => s.id === id)
    const active: Session = {
      id: newId(),
      modeId: mode.id,
      modeName: mode.name.trim() || 'Untitled',
      startedAt,
      endsAt: startedAt + mode.minutes * 60_000,
      drivers: mode.drivers.map((md) => ({
        ...md,
        note: md.note.trim(),
        name: driver(md.driverId)?.name ?? 'Driver',
        labels: driver(md.driverId)?.labels ?? [],
      })),
      rules: mode.rules.filter((r) => r.cue.trim() || r.action.trim()),
      readings: d.signals.map((s) => ({ signalId: s.id, name: s.name, labels: s.labels })),
    }
    return { ...d, active }
  })
}

export function setReading(signalId: string, when: 'before' | 'after', level: Level | undefined) {
  setData((d) => {
    if (!d.active) return d
    const readings = d.active.readings.map((r) =>
      r.signalId !== signalId ? r : when === 'before' ? { ...r, before: level } : { ...r, after: level },
    )
    return { ...d, active: { ...d.active, readings } }
  })
}

export function finishSession(result: { changed?: Changed; helped?: Helped; note: string }) {
  setData((d) => {
    if (!d.active) return d
    const session: Session = {
      ...d.active,
      endedAt: Math.min(Date.now(), d.active.endsAt),
      changed: result.changed,
      helped: result.helped,
      note: result.note.trim() || undefined,
    }
    return { ...d, active: undefined, sessions: [session, ...d.sessions] }
  })
}

export function discardSession() {
  setData((d) => ({ ...d, active: undefined }))
}

export function deleteSession(id: string) {
  setData((d) => ({ ...d, sessions: d.sessions.filter((s) => s.id !== id) }))
}

export function updateScale(kind: ScaleKind, id: string, update: (scale: Scale) => Scale) {
  setData((d) => withScales(d, kind, replaceById(d[kind], id, update)))
}

export function createScale(kind: ScaleKind): string {
  const id = newId()
  setData((d) => withScales(d, kind, [...d[kind], { id, name: '', labels: ['', '', '', '', ''] }]))
  return id
}

export function deleteScale(kind: ScaleKind, id: string) {
  setData((d) => withScales(d, kind, d[kind].filter((s) => s.id !== id)))
}

export function replaceData(next: Data) {
  setData(() => next)
}
