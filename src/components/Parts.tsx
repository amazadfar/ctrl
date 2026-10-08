import { useLayoutEffect, useRef } from 'react'
import { cx, levelLabel } from '../format'
import { haptic } from '../haptics'
import { useNav } from '../nav'
import type { Level, Rule } from '../types'
import { Dial } from './Dial'
import { ChevronLeftIcon } from './Icons'

export function BackButton({ label }: { label: string }) {
  const nav = useNav()
  return (
    <button className="back" onClick={() => nav.back()}>
      <ChevronLeftIcon />
      {label}
    </button>
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

export function DriverView({ name, labels, level, note }: { name: string; labels: string[]; level: Level; note: string }) {
  return (
    <div className="driver">
      <div className="driver-head">
        <span className="driver-name">{name}</span>
        <span className="driver-value">{levelLabel(labels, level)}</span>
      </div>
      <Dial value={level} labels={labels} label={name} />
      {note && <p className="driver-note">{note}</p>}
    </div>
  )
}

export function RuleView({ rule, large }: { rule: Rule; large?: boolean }) {
  return (
    <div className={cx('rule', large && 'is-large')}>
      <p className="rule-line">
        <span className="rule-key">If</span>
        <span>{rule.cue || '…'}</span>
      </p>
      <p className="rule-line">
        <span className="rule-key">Then</span>
        <span>{rule.action || '…'}</span>
      </p>
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
