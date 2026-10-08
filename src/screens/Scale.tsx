import { deleteScale, updateScale, type ScaleKind } from '../actions'
import { BackButton } from '../components/Parts'
import { useNav } from '../nav'
import { useData } from '../store'
import { LEVELS } from '../types'

export function ScaleScreen({ kind, id }: { kind: ScaleKind; id: string }) {
  const data = useData()
  const nav = useNav()
  const scale = data[kind].find((s) => s.id === id)
  if (!scale) return null

  const noun = kind === 'signals' ? 'signal' : 'driver'
  const usedBy = kind === 'drivers' ? data.modes.filter((m) => m.drivers.some((md) => md.driverId === id)) : []

  const setLabel = (index: number, value: string) =>
    updateScale(kind, id, (s) => ({
      ...s,
      labels: LEVELS.map((level, i) => (i === index ? value : (s.labels[level - 1] ?? ''))),
    }))

  const remove = () => {
    if (!confirm(`Delete “${scale.name.trim() || 'Untitled'}”?`)) return
    nav.back()
    deleteScale(kind, id)
  }

  return (
    <div className="screen">
      <header className="topbar">
        <BackButton label="Settings" />
      </header>
      <input
        className="title-input"
        value={scale.name}
        placeholder={kind === 'signals' ? 'Signal name' : 'Driver name'}
        aria-label="Name"
        onChange={(e) => updateScale(kind, id, (s) => ({ ...s, name: e.target.value }))}
      />

      <h2 className="eyebrow section-label">Scale · lowest to highest</h2>
      <div className="scale">
        {LEVELS.map((level, i) => (
          <label className="scale-row" key={level}>
            <span className="scale-num">{level}</span>
            <input
              className="input"
              value={scale.labels[i] ?? ''}
              placeholder={String(level)}
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

      {usedBy.length > 0 ? (
        <p className="hint">
          Used by {usedBy.map((m) => m.name.trim() || 'Untitled').join(', ')}. Remove it there to delete it.
        </p>
      ) : (
        <button className="text-btn danger section-label" onClick={remove}>
          Delete {noun}
        </button>
      )}
    </div>
  )
}
