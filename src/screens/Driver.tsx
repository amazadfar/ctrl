import { setLevel, setNote } from '../actions'
import { BackButton, GrowingTextarea, Section } from '../components/Parts'
import { Volume } from '../components/Volume'
import { cx, levelLabel } from '../format'
import { haptic } from '../haptics'
import { useNav } from '../nav'
import { levelOf, useData } from '../store'
import { LEVELS } from '../types'

/** One driver up close: its scale in your words, where it's set, and why. */
export function DriverScreen({ id }: { id: string }) {
  const data = useData()
  const nav = useNav()
  const driver = data.drivers.find((d) => d.id === id)
  if (!driver) return null

  const level = levelOf(data, id)
  const engaged = data.active
  const setByMode = engaged?.drivers.some((d) => d.driverId === id)
  const returnTo = engaged?.returnTo?.[id] ?? 3

  return (
    <div className="screen">
      <header className="topbar">
        <BackButton label="CTRL" />
        <button className="link" onClick={() => nav.push({ name: 'scale', kind: 'drivers', id })}>
          Edit words
        </button>
      </header>
      <h1 className="title">{driver.name.trim() || 'Untitled'}</h1>
      {engaged && setByMode && (
        <p className="lede">
          {engaged.modeName} set this. It goes back to {levelLabel(driver.labels, returnTo).toLowerCase()} when you check in.
        </p>
      )}

      <p className="detail-level">{levelLabel(driver.labels, level)}</p>
      <Volume name={driver.name} labels={driver.labels} value={level} size="large" onChange={(l) => setLevel(id, l)} />

      <div className="level-list" role="radiogroup" aria-label={`${driver.name} level`}>
        {LEVELS.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={l === level}
            className={cx('level-option', l === level && 'is-set')}
            onClick={() => {
              haptic()
              setLevel(id, l)
            }}
          >
            <span className="level-meter" aria-hidden="true">
              <span style={{ width: `${l * 20}%` }} />
            </span>
            {levelLabel(driver.labels, l)}
          </button>
        ))}
      </div>

      <Section title="Why this level, right now">
        <GrowingTextarea
          value={data.notes[id] ?? ''}
          placeholder="What this level means for you today"
          label="Why this level, right now"
          onChange={(note) => setNote(id, note)}
        />
      </Section>
    </div>
  )
}
