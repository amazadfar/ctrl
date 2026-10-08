import { Fragment, useLayoutEffect, useRef, type ReactNode } from 'react'
import { cx } from '../format'
import { haptic } from '../haptics'
import { useNav } from '../nav'
import type { Level, Rule } from '../types'
import { ChevronLeftIcon } from './Icons'
import { Tape } from './Tape'

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

export interface StripDriver {
  driverId: string
  name: string
  labels: string[]
  level: Level
  note: string
}

/** Read-only drivers: tapes side by side like channel strips, with what each level means underneath. */
export function DriverStrip({ drivers }: { drivers: StripDriver[] }) {
  const notes = drivers.filter((d) => d.note.trim())
  return (
    <>
      <div className="strip">
        {drivers.map((d) => (
          <div className="strip-col" key={d.driverId}>
            <Tape value={d.level} labels={d.labels} name={d.name} />
            <span className="strip-name">{d.name}</span>
          </div>
        ))}
      </div>
      {notes.length > 0 && (
        <dl className="notes">
          {notes.map((d) => (
            <Fragment key={d.driverId}>
              <dt>{d.name}</dt>
              <dd>{d.note}</dd>
            </Fragment>
          ))}
        </dl>
      )}
    </>
  )
}

/** Rules read like a flight-deck procedure: the condition in white, the action to take in cyan. */
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
