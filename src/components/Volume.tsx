import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { cx, levelLabel } from '../format'
import { haptic } from '../haptics'
import type { Level } from '../types'
import { SpeakerIcon, SpeakerLoudIcon } from './Icons'

/** Where the thumb sits for a level: 0 is the left end, 1 the right end. */
const positionOf = (level: Level) => (level - 1) / 4
/** The level a thumb position settles on. */
const levelAt = (position: number) => (Math.round(position * 4) + 1) as Level

// The thumb's width; keep in step with --thumb-w in styles.css.
const THUMB = 38

interface VolumeProps {
  value: Level
  labels: string[]
  name: string
  /** Omit for a read-only bar. */
  onChange?: (level: Level) => void
}

interface Gesture {
  x: number
  y: number
  dragging: boolean
}

/**
 * A driver, drawn like the iOS Settings volume slider: a thin track with a filled part, a white
 * capsule thumb and speaker glyphs at each end. Drag the thumb or tap the track; it follows your
 * finger smoothly and settles on the nearest of the five levels when you let go.
 */
export function Volume({ value, labels, name, onChange }: VolumeProps) {
  const area = useRef<HTMLDivElement>(null)
  const gesture = useRef<Gesture | null>(null)
  const [held, setHeld] = useState(false)
  const [live, setLive] = useState<number | null>(null)

  const position = live ?? positionOf(value)

  const positionAt = (clientX: number) => {
    const rect = area.current!.getBoundingClientRect()
    return Math.min(1, Math.max(0, (clientX - rect.left - THUMB / 2) / (rect.width - THUMB)))
  }

  const set = (level: Level) => {
    if (level === value) return
    haptic()
    onChange?.(level)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!onChange) return
    gesture.current = { x: e.clientX, y: e.clientY, dragging: false }
    setHeld(true)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g) return
    if (!g.dragging) {
      // Vertical swipes scroll the page; only a sideways drag moves the thumb.
      const dx = Math.abs(e.clientX - g.x)
      if (dx < 4 || dx < Math.abs(e.clientY - g.y)) return
      g.dragging = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    const p = positionAt(e.clientX)
    setLive(p)
    set(levelAt(p))
  }

  const release = () => {
    gesture.current = null
    setHeld(false)
    setLive(null)
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    const rect = area.current?.getBoundingClientRect()
    // A tap on the track moves the thumb there; taps on the speaker glyphs do nothing.
    if (g && !g.dragging && rect && e.clientX >= rect.left && e.clientX <= rect.right) set(levelAt(positionAt(e.clientX)))
    release()
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
      className={cx('volume', !onChange && 'is-readonly', held && 'is-held', live !== null && 'is-dragging')}
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
      onPointerUp={onPointerUp}
      onPointerCancel={release}
      onKeyDown={onChange ? onKeyDown : undefined}
    >
      {onChange && <SpeakerIcon />}
      <div className="volume-area" ref={area}>
        <div className="volume-track" />
        <div className="volume-fill" style={{ width: `calc(${position} * (100% - var(--thumb-w)) + var(--thumb-w) / 2)` }} />
        <div className="volume-thumb" style={{ left: `calc(${position} * (100% - var(--thumb-w)))` }} />
      </div>
      {onChange && <SpeakerLoudIcon />}
    </div>
  )
}

/** A mode's fingerprint: its driver levels as three tiny sliders. */
export function Signature({ levels }: { levels: Level[] }) {
  return (
    <svg className="signature" viewBox="0 0 36 36" aria-hidden="true">
      {[0, 1, 2].map((i) => {
        const y = 9.5 + i * 8.5
        const level = levels[i]
        const cx = level ? 7 + positionOf(level) * 22 : 0
        return (
          <g key={i}>
            <rect className="sig-track" x={3} y={y - 1.25} width={30} height={2.5} rx={1.25} />
            {level && (
              <>
                <rect className="sig-fill" x={3} y={y - 1.25} width={cx - 3} height={2.5} rx={1.25} />
                <circle className="sig-thumb" cx={cx} cy={y} r={3} />
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}
