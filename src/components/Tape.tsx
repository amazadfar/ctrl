import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { cx, levelLabel } from '../format'
import { haptic } from '../haptics'
import { LEVELS, type Level } from '../types'

/** Height of a level on a tape, as a fraction from the bottom. */
const at = (level: Level) => (level - 1) / 4
const clamp = (n: number) => Math.min(5, Math.max(1, n)) as Level

interface TapeProps {
  value: Level
  labels: string[]
  name: string
  /** Omit for a read-only tape. */
  onChange?: (level: Level) => void
}

/**
 * A driver: a vertical tape with a magenta bug, like the selected-speed bug on a flight display.
 * Magenta always means "a target you set". Editable tapes drag like a fader.
 */
export function Tape({ value, labels, name, onChange }: TapeProps) {
  const track = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  const levelAt = (clientY: number): Level => {
    const rect = track.current!.getBoundingClientRect()
    return clamp(Math.round((1 - (clientY - rect.top) / rect.height) * 4) + 1)
  }

  const set = (level: Level) => {
    if (level === value) return
    haptic()
    onChange?.(level)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!onChange) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = true
    setIsDragging(true)
    set(levelAt(e.clientY))
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) set(levelAt(e.clientY))
  }

  const stop = () => {
    dragging.current = false
    setIsDragging(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }
    if (e.key in step) set(clamp(value + step[e.key]))
    else if (e.key === 'Home') set(1)
    else if (e.key === 'End') set(5)
    else return
    e.preventDefault()
  }

  return (
    <div className="tape-unit">
      <span className="tape-readout">{levelLabel(labels, value)}</span>
      <div
        className={cx('tape', onChange && 'is-editable', isDragging && 'is-dragging')}
        role="slider"
        aria-orientation="vertical"
        aria-label={name}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={value}
        aria-valuetext={levelLabel(labels, value)}
        aria-readonly={onChange ? undefined : true}
        tabIndex={onChange ? 0 : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        onKeyDown={onChange ? onKeyDown : undefined}
      >
        <div className="tape-track" ref={track}>
          <span className="tape-spine" />
          <span className="tape-fill" style={{ height: `${at(value) * 100}%` }} />
          {LEVELS.map((level) => (
            <span key={level} className={cx('tape-tick', level === value && 'is-set')} style={{ bottom: `${at(level) * 100}%` }} />
          ))}
          <svg className="tape-bug" style={{ bottom: `${at(value) * 100}%` }} viewBox="0 0 16 12" aria-hidden="true">
            <path d="M0 0H9L15 6L9 12H0V8.5H5.5V3.5H0Z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

/** A mode's fingerprint: its driver levels as three tiny tapes. */
export function Signature({ levels }: { levels: Level[] }) {
  return (
    <svg className="signature" viewBox="0 0 36 36" aria-hidden="true">
      {[0, 1, 2].map((i) => {
        const x = 6 + i * 12
        const level = levels[i]
        const y = level ? 32 - at(level) * 28 : 0
        return (
          <g key={i}>
            <line className={cx('sig-spine', !level && 'is-empty')} x1={x} y1={4} x2={x} y2={32} />
            {level && <line className="sig-bug" x1={x - 5} y1={y} x2={x + 5} y2={y} />}
          </g>
        )
      })}
    </svg>
  )
}
