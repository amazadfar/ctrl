import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { cx, levelLabel } from '../format'
import { haptic } from '../haptics'
import type { Level } from '../types'

/** How full the bar is at a level: level 1 is a sliver, level 5 is full. */
const fill = (level: Level) => level / 5
/** The level a fill position settles on. */
const levelAt = (position: number) => Math.min(5, Math.max(1, Math.round(position * 5))) as Level

interface VolumeProps {
  value: Level
  labels: string[]
  name: string
  size?: 'large'
  /** Omit for a read-only bar. */
  onChange?: (level: Level) => void
}

interface Gesture {
  x: number
  y: number
  from: number
  dragging: boolean
}

/**
 * A driver, drawn like the iOS volume slider: a pill that thickens under your finger and moves with
 * it from wherever you start (it doesn't jump to the touch point), stretches at the ends, and
 * settles on the nearest of the five levels when you let go.
 */
export function Volume({ value, labels, name, size, onChange }: VolumeProps) {
  const track = useRef<HTMLDivElement>(null)
  const gesture = useRef<Gesture | null>(null)
  const [held, setHeld] = useState(false)
  const [live, setLive] = useState<number | null>(null)
  const [stretch, setStretch] = useState<{ amount: number; origin: 'left' | 'right' } | null>(null)

  const position = live ?? fill(value)

  const set = (level: Level) => {
    if (level === value) return
    haptic()
    onChange?.(level)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!onChange) return
    gesture.current = { x: e.clientX, y: e.clientY, from: fill(value), dragging: false }
    setHeld(true)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g) return
    const dx = e.clientX - g.x
    if (!g.dragging) {
      // Vertical swipes scroll the page; only a sideways drag moves the bar.
      if (Math.abs(dx) < 4 || Math.abs(dx) < Math.abs(e.clientY - g.y)) return
      g.dragging = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    const raw = g.from + dx / track.current!.getBoundingClientRect().width
    const clamped = Math.min(1, Math.max(0, raw))
    const over = raw - clamped
    setStretch(over === 0 ? null : { amount: Math.min(0.06, Math.abs(over) * 0.2), origin: over > 0 ? 'left' : 'right' })
    setLive(clamped)
    set(levelAt(clamped))
  }

  const release = () => {
    gesture.current = null
    setHeld(false)
    setLive(null)
    setStretch(null)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }
    if (e.key in step) set(Math.min(5, Math.max(1, value + step[e.key])) as Level)
    else if (e.key === 'Home') set(1)
    else if (e.key === 'End') set(5)
    else return
    e.preventDefault()
  }

  return (
    <div
      className={cx(
        'volume',
        size && `is-${size}`,
        !onChange && 'is-readonly',
        held && 'is-held',
        live !== null && 'is-dragging',
      )}
      role="slider"
      aria-label={name}
      aria-valuemin={1}
      aria-valuemax={5}
      aria-valuenow={value}
      aria-valuetext={levelLabel(labels, value)}
      aria-readonly={onChange ? undefined : true}
      tabIndex={onChange ? 0 : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      onKeyDown={onChange ? onKeyDown : undefined}
    >
      <div
        className="volume-track"
        ref={track}
        style={stretch ? { transform: `scaleX(${1 + stretch.amount})`, transformOrigin: stretch.origin } : undefined}
      >
        <div className="volume-fill" style={{ width: `${position * 100}%` }} />
      </div>
    </div>
  )
}

/** A mode's fingerprint: its driver levels as three tiny volume bars. */
export function Signature({ levels }: { levels: Level[] }) {
  return (
    <svg className="signature" viewBox="0 0 36 36" aria-hidden="true">
      {[0, 1, 2].map((i) => {
        const y = 8 + i * 9
        const level = levels[i]
        return (
          <g key={i}>
            <rect className="sig-track" x={3} y={y} width={30} height={4} rx={2} />
            {level && <rect className="sig-fill" x={3} y={y} width={30 * fill(level)} height={4} rx={2} />}
          </g>
        )
      })}
    </svg>
  )
}
