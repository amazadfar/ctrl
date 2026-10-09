import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { cx, levelLabel } from '../format'
import { haptic } from '../haptics'
import { useNav } from '../nav'
import type { Level, Rule } from '../types'
import { ChevronLeftIcon } from './Icons'
import { Volume } from './Volume'

export function BackButton({ label }: { label: string }) {
  const nav = useNav()
  return (
    <button className="back" onClick={() => nav.back()}>
      <ChevronLeftIcon />
      {label}
    </button>
  )
}

export function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="section">
      <h2 className="section-title">
        <span>{title}</span>
        {aside && <span className="section-aside">{aside}</span>}
      </h2>
      {children}
    </section>
  )
}

interface GrowingTextareaProps {
  value: string
  placeholder?: string
  label?: string
  onChange: (value: string) => void
}

export function GrowingTextarea({ value, placeholder, label, onChange }: GrowingTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight + 2}px`
  }, [value])
  return (
    <textarea
      ref={ref}
      className="field"
      rows={1}
      value={value}
      placeholder={placeholder}
      aria-label={label ?? placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export interface ListedDriver {
  driverId: string
  name: string
  labels: string[]
  level: Level
  note: string
}

/** Read-only drivers: each one's volume bar, its level in words, and what that level means here. */
export function DriverList({ drivers }: { drivers: ListedDriver[] }) {
  return (
    <div className="desk">
      {drivers.map((d) => (
        <div className="bar-row" key={d.driverId}>
          <div className="bar-head">
            <span className="bar-name">{d.name}</span>
            <span className="bar-level">{levelLabel(d.labels, d.level)}</span>
          </div>
          <Volume value={d.level} labels={d.labels} name={d.name} />
          {d.note.trim() && <p className="bar-note">{d.note}</p>}
        </div>
      ))}
    </div>
  )
}

/** Rules read like a flight-deck procedure: the condition in white, the action to take in the tint. */
export function RuleView({ rule, large }: { rule: Rule; large?: boolean }) {
  return (
    <div className={cx('rule', large && 'is-large')}>
      <p className="rule-cue">
        <span className="rule-if">If</span> {rule.cue || '…'}
      </p>
      <p className="rule-action">{rule.action || '…'}</p>
    </div>
  )
}

export interface FmaCell {
  text: string
  tone?: 'green' | 'amber' | 'dim'
  /** Draws the box a flight deck shows around a newly engaged mode. */
  boxed?: boolean
}

/** A flight-mode annunciator: the strip above a pilot's main display that says what's engaged. */
export function Fma({ cells, onClick, label }: { cells: FmaCell[]; onClick?: () => void; label?: string }) {
  const content = cells.map((cell, i) => (
    <span key={i} className={cx('fma-cell', cell.tone && `is-${cell.tone}`, cell.boxed && 'is-boxed')}>
      {cell.text}
    </span>
  ))
  return onClick ? (
    <button className="fma is-button" onClick={onClick} aria-label={label}>
      {content}
    </button>
  ) : (
    <div className="fma" role="status" aria-label={label}>
      {content}
    </div>
  )
}

interface ChoiceProps<K extends string> {
  options: Record<K, string>
  value?: K
  label: string
  onChange: (value: K | undefined) => void
}

export function Choice<K extends string>({ options, value, label, onChange }: ChoiceProps<K>) {
  return (
    <div className="choice" role="radiogroup" aria-label={label}>
      {(Object.keys(options) as K[]).map((key) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={value === key}
          className={cx('choice-btn', value === key && 'is-selected')}
          onClick={() => {
            haptic()
            onChange(value === key ? undefined : key)
          }}
        >
          {options[key]}
        </button>
      ))}
    </div>
  )
}
