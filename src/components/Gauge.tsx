import { useRef, type KeyboardEvent, type MouseEvent } from 'react'
import { cx, levelLabel } from '../format'
import { haptic } from '../haptics'
import { LEVELS, type Level } from '../types'

// Geometry in viewBox units. The dial sweeps 240° clockwise from lower left (150°) to lower right (390°),
// like an engine gauge; level 3 points straight up.
const W = 120
const H = 92
const CX = 60
const CY = 54
const R = 44
const START = 150
const angle = (level: Level) => START + (level - 1) * 60

function point(deg: number, r: number): [number, number] {
  const rad = (deg * Math.PI) / 180
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)]
}

function arc(from: number, to: number, r: number): string {
  const [x1, y1] = point(from, r)
  const [x2, y2] = point(to, r)
  return `M ${x1} ${y1} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`
}

function Needle({ level, className }: { level: Level; className: string }) {
  const [x, y] = point(angle(level), R - 10)
  return <line className={className} x1={CX} y1={CY} x2={x} y2={y} />
}

interface GaugeProps {
  name: string
  labels: string[]
  value?: Level
  /** A grey needle for comparison, e.g. where you started. */
  ghost?: Level
  /** Omit for a read-only gauge. Tapping the current level clears it. */
  onChange?: (level: Level | undefined) => void
}

/** A state signal: an engine-style gauge with a white needle. White always means "what you observe". */
export function Gauge({ name, labels, value, ghost, onChange }: GaugeProps) {
  const svg = useRef<SVGSVGElement>(null)
  const readout = value ? levelLabel(labels, value) : '- -'

  const set = (level: Level | undefined) => {
    haptic()
    onChange?.(level)
  }

  const onClick = (e: MouseEvent<SVGSVGElement>) => {
    if (!onChange) return
    const rect = svg.current!.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W - CX
    const y = ((e.clientY - rect.top) / rect.height) * H - CY
    let deg = (Math.atan2(y, x) * 180) / Math.PI
    if (deg < 0) deg += 360
    if (deg < 90) deg += 360 // now 90–450, with the dial running 150–390
    if (deg < 125 || deg > 415) return // the open gap at the bottom
    const level = Math.min(5, Math.max(1, Math.round((deg - START) / 60) + 1)) as Level
    set(level === value ? undefined : level)
  }

  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    const step: Record<string, number> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }
    if (!(e.key in step)) return
    e.preventDefault()
    set(Math.min(5, Math.max(1, (value ?? 3) + (value ? step[e.key] : 0))) as Level)
  }

  const description = `${name}: ${value ? levelLabel(labels, value) : 'not read'}${ghost ? `, was ${levelLabel(labels, ghost)}` : ''}`

  return (
    <div className={cx('gauge', onChange && 'is-editable', !value && 'is-unset')}>
      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        role={onChange ? 'slider' : 'img'}
        aria-label={onChange ? name : description}
        aria-valuemin={onChange ? 1 : undefined}
        aria-valuemax={onChange ? 5 : undefined}
        aria-valuenow={onChange ? value : undefined}
        aria-valuetext={onChange ? readout : undefined}
        tabIndex={onChange ? 0 : undefined}
        onClick={onClick}
        onMouseDown={(e) => e.preventDefault()} // a tap reads the gauge; keyboard focus stays for keyboard users
        onKeyDown={onChange ? onKeyDown : undefined}
      >
        <path className="gauge-arc" d={arc(START, START + 240, R)} />
        {value && value > 1 && <path className="gauge-value" d={arc(START, angle(value), R)} />}
        {LEVELS.map((level) => {
          const [x1, y1] = point(angle(level), R - 7)
          const [x2, y2] = point(angle(level), R)
          return <line key={level} className="gauge-tick" x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
        {ghost && <Needle level={ghost} className="gauge-ghost" />}
        {value && <Needle level={value} className="gauge-needle" />}
        <circle className="gauge-hub" cx={CX} cy={CY} r={3.5} />
        <rect className="gauge-box" x={29} y={72} width={62} height={18} rx={2} />
        <text className="gauge-readout" x={CX} y={84.6}>
          {readout}
        </text>
      </svg>
      <span className="gauge-name">{name}</span>
    </div>
  )
}
