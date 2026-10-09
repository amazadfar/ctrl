export type Level = 1 | 2 | 3 | 4 | 5
export const LEVELS: readonly Level[] = [1, 2, 3, 4, 5]

/**
 * A named 1–5 scale with a word for each level, lowest first.
 * Signals are observed (your state); drivers are chosen (what a mode sets).
 */
export interface Scale {
  id: string
  name: string
  labels: string[]
}

export interface ModeDriver {
  driverId: string
  level: Level
  /** What this level means in this mode, in your words. */
  note: string
}

/** An implementation intention: if `cue` happens, then I do `action`. */
export interface Rule {
  cue: string
  action: string
}

export interface Mode {
  id: string
  name: string
  drivers: ModeDriver[]
  rules: Rule[]
  minutes: number
}

/** Sessions copy names and labels so later edits don't rewrite history. */
export interface SessionDriver extends ModeDriver {
  name: string
  labels: string[]
}

export interface Reading {
  signalId: string
  name: string
  labels: string[]
  before?: Level
  after?: Level
}

export type Changed = 'no' | 'little' | 'yes'
export type Helped = 'worse' | 'same' | 'better'

export interface Session {
  id: string
  modeId: string
  modeName: string
  startedAt: number
  endsAt: number
  endedAt?: number
  drivers: SessionDriver[]
  rules: Rule[]
  readings: Reading[]
  changed?: Changed
  helped?: Helped
  note?: string
  /** Desk levels from before this mode was engaged; the desk returns to them when it ends. */
  returnTo?: Record<string, Level>
}

export interface Data {
  version: 1
  signals: Scale[]
  drivers: Scale[]
  /** The desk (free mode): where every driver is set right now. Missing means the middle. */
  levels: Record<string, Level>
  /** Why each driver is at its level right now, in your words. */
  notes: Record<string, string>
  modes: Mode[]
  /** Finished sessions, newest first. */
  sessions: Session[]
  active?: Session
}

export const MAX_DRIVERS = 3
export const MAX_RULES = 2
