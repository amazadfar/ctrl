import { useState } from 'react'
import { deleteScale, updateScale, type ScaleKind } from '../actions'
import { Gauge } from '../components/Gauge'
import { BackButton, Section } from '../components/Parts'
import { Volume } from '../components/Volume'
import { useNav } from '../nav'
import { useData } from '../store'
import { LEVELS, type Level } from '../types'

export function ScaleScreen({ kind, id }: { kind: ScaleKind; id: string }) {
  const data = useData()
  const nav = useNav()
  const [preview, setPreview] = useState<Level>(3)
  const scale = data[kind].find((s) => s.id === id)
  if (!scale) return null

  const noun = kind === 'signals' ? 'signal' : 'driver'
  const usedBy = kind === 'drivers' ? data.modes.filter((m) => m.drivers.some((md) => md.driverId === id)) : []
  const name = scale.name.trim() || 'Untitled'

  const setLabel = (index: number, value: string) =>
    updateScale(kind, id, (s) => ({
      ...s,
      labels: LEVELS.map((level, i) => (i === index ? value : (s.labels[level - 1] ?? ''))),
    }))

  const remove = () => {
    if (!confirm(`Delete “${name}”?`)) return
    nav.back()
    deleteScale(kind, id)
  }

  return (
    <div className="screen">
      <header className="topbar">
        <BackButton label="Back" />
      </header>
      <input
        className="title-input"
        value={scale.name}
        placeholder={kind === 'signals' ? 'Name this signal' : 'Name this driver'}
        aria-label="Name"
        onChange={(e) => updateScale(kind, id, (s) => ({ ...s, name: e.target.value }))}
      />

      <div className="scale-preview">
        {kind === 'signals' ? (
          <Gauge name={name} labels={scale.labels} value={preview} onChange={(level) => level && setPreview(level)} />
        ) : (
          <Volume name={name} labels={scale.labels} value={preview} size="large" onChange={setPreview} />
        )}
      </div>

      <Section title="Scale" aside="lowest to highest">
        <div className="scale">
          {LEVELS.map((level, i) => (
            <label className="scale-row" key={level}>
              <span className="scale-num">{level}</span>
              <input
                className="input"
                value={scale.labels[i] ?? ''}
                placeholder={`Word for level ${level}`}
                onFocus={() => setPreview(level)}
                onChange={(e) => setLabel(i, e.target.value)}
              />
            </label>
          ))}
        </div>
        <p className="hint">
          {kind === 'drivers'
            ? "Make 5 feel like too much. You're choosing the right level, not the highest one."
            : 'Describe what you notice, not what you want.'}
        </p>
      </Section>

      {usedBy.length > 0 ? (
        <p className="hint">
          Used by {usedBy.map((m) => m.name.trim() || 'Untitled').join(', ')}. Remove it there to delete it.
        </p>
      ) : (
        <button className="text-btn is-caution delete-btn" onClick={remove}>
          Delete {noun}
        </button>
      )}
    </div>
  )
}
