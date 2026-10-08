import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { cx, levelLabel } from '../format'
import { haptic } from '../haptics'
import { LEVELS, type Level } from '../types'

interface DialProps {
  value: Level
  labels: string[]
  label: string
  /** Omit for a compact read-only dial. */
  onChange?: (level: Level) => void
}

const position = (level: Level) => `${((level - 1) / 4) * 100}%`
const clamp = (n: number) => Math.min(5, Math.max(1, n)) as Level

/** A five-notch slider for drivers: the thing you set. */
export function Dial({ value, labels, label, onChange }: DialProps) {
  const rail = useRef<HTMLDivElement>(null)
  const start = useRef<{ x: number; y: number } | null>(null)
  const dragging = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  const levelAt = (clientX: number): Level => {
    const rect = rail.current!.getBoundingClientRect()
    return clamp(Math.round(((clientX - rect.left) / rect.width) * 4) + 1)
  }

  const set = (level: Level) => {
    if (level === value) return
    haptic()
    onChange?.(level)
  }

  const stop = () => {
    start.current = null
    dragging.current = false
    setIsDragging(false)
  }

  // Only a horizontal drag or a tap changes the level, so scrolling past a dial never does.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (onChange) start.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return
    if (!dragging.current) {
      const dx = Math.abs(e.clientX - start.current.x)
      const dy = Math.abs(e.clientY - start.current.y)
      if (dx < 6 || dx < dy) return
      dragging.current = true
      setIsDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    set(levelAt(e.clientX))
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (start.current && !dragging.current) set(levelAt(e.clientX))
    stop()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }
    if (e.key in step) set(clamp(value + step[e.key]))
    else if (e.key === 'Home') set(1)
    else if (e.key === 'End') set(5)
    else return
    e.preventDefault()
  }

  return (
    <div
      className={cx('dial', !onChange && 'is-readonly', isDragging && 'is-dragging')}
      role="slider"
      tabIndex={onChange ? 0 : -1}
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={5}
      aria-valuenow={value}
      aria-valuetext={levelLabel(labels, value)}
      aria-readonly={onChange ? undefined : true}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={stop}
      onKeyDown={onChange ? onKeyDown : undefined}
    >
      <div className="dial-rail" ref={rail}>
        <div className="dial-fill" style={{ width: position(value) }} />
        {LEVELS.map((level) => (
          <span key={level} className="dial-notch" style={{ left: position(level) }} />
        ))}
        <span className="dial-knob" style={{ left: position(value) }} />
      </div>
    </div>
  )
}
