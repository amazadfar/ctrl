import { startSession } from '../actions'
import { BackButton, DriverView, RuleView } from '../components/Parts'
import { formatMinutes } from '../format'
import { haptic } from '../haptics'
import { useNav } from '../nav'
import { useData } from '../store'

/** The five-second screen: review the mode, engage it. Editing lives elsewhere. */
export function ModeScreen({ id }: { id: string }) {
  const data = useData()
  const nav = useNav()
  const mode = data.modes.find((m) => m.id === id)
  if (!mode) return null

  const rules = mode.rules.filter((r) => r.cue.trim() || r.action.trim())

  const engage = () => {
    haptic()
    startSession(mode)
    nav.reset({ name: 'modes' }, { name: 'active' })
  }

  return (
    <>
      <div className="screen has-actionbar">
        <header className="topbar">
          <BackButton label="Modes" />
          <button className="link" onClick={() => nav.push({ name: 'edit', id })}>
            Edit
          </button>
        </header>
        <h1 className="title">{mode.name.trim() || 'Untitled'}</h1>

        {mode.drivers.length > 0 && (
          <>
            <h2 className="eyebrow section-label">Drivers</h2>
            {mode.drivers.map((md) => {
              const driver = data.drivers.find((d) => d.id === md.driverId)
              return (
                <DriverView
                  key={md.driverId}
                  name={driver?.name ?? 'Missing driver'}
                  labels={driver?.labels ?? []}
                  level={md.level}
                  note={md.note.trim()}
                />
              )
            })}
          </>
        )}

        {rules.length > 0 && (
          <>
            <h2 className="eyebrow section-label">Rules</h2>
            <div className="rules">
              {rules.map((rule, i) => (
                <RuleView key={i} rule={rule} />
              ))}
            </div>
          </>
        )}

        {mode.drivers.length === 0 && rules.length === 0 && (
          <p className="hint">Nothing set yet. Tap Edit to choose drivers and write rules.</p>
        )}
      </div>

      <div className="actionbar">
        <div className="actionbar-inner">
          {data.active ? (
            <button className="btn btn-secondary" onClick={() => nav.push({ name: 'active' })}>
              {data.active.modeName} is engaged
            </button>
          ) : (
            <button className="btn btn-primary" onClick={engage}>
              Engage · {formatMinutes(mode.minutes)}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
