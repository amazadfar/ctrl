import { cx, levelLabel } from '../format'
import { haptic } from '../haptics'
import { LEVELS, type Level } from '../types'

interface MeterProps {
  value?: Level
  label: string
  labels: string[]
  /** Omit for a read-only meter. Tapping the current level clears it. */
  onChange?: (level: Level | undefined) => void
}

/** Five dots for state signals: the thing you observe. */
export function Meter({ value, label, labels, onChange }: MeterProps) {
  const dot = (level: Level) => <span className={cx('meter-dot', value !== undefined && level <= value && 'is-on')} />

  if (!onChange) {
    return (
      <span className="meter is-readonly" role="img" aria-label={`${label}: ${value ? levelLabel(labels, value) : 'not named'}`}>
        {LEVELS.map((level) => (
          <span key={level}>{dot(level)}</span>
        ))}
      </span>
    )
  }

  return (
    <span className="meter" role="radiogroup" aria-label={label}>
      {LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          role="radio"
          aria-checked={value === level}
          aria-label={levelLabel(labels, level)}
          className="meter-hit"
          onClick={() => {
            haptic()
            onChange(value === level ? undefined : level)
          }}
        >
          {dot(level)}
        </button>
      ))}
    </span>
  )
}

interface SignalRowProps extends Omit<MeterProps, 'label'> {
  name: string
  hint?: string
}

export function SignalRow({ name, labels, value, hint, onChange }: SignalRowProps) {
  return (
    <div className="signal">
      <div className="signal-text">
        <span className="signal-name">{name}</span>
        <span className={cx('signal-value', !value && 'is-empty')}>{value ? levelLabel(labels, value) : '—'}</span>
        {hint && <span className="signal-hint">{hint}</span>}
      </div>
      <Meter value={value} label={name} labels={labels} onChange={onChange} />
    </div>
  )
}
