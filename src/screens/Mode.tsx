import { startSession } from '../actions'
import { BackButton, DriverList, RuleView, Section } from '../components/Parts'
import { formatDuration } from '../format'
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
  const drivers = mode.drivers.map((md) => {
    const driver = data.drivers.find((d) => d.id === md.driverId)
    return { ...md, name: driver?.name ?? 'Missing driver', labels: driver?.labels ?? [] }
  })

  const engage = () => {
    haptic()
    startSession(mode)
    nav.reset({ name: 'home' }, { name: 'active' })
  }

  return (
    <>
      <div className="screen has-actionbar">
        <header className="topbar">
          <BackButton label="CTRL" />
          <button className="link" onClick={() => nav.push({ name: 'edit', id })}>
            Edit
          </button>
        </header>
        <h1 className="title">{mode.name.trim() || 'Untitled'}</h1>
        <p className="lede">
          Runs for {formatDuration(mode.minutes)}. Engaging sets these drivers on your desk; they go back when you
          check in.
        </p>

        {drivers.length > 0 && (
          <Section title="Drivers">
            <DriverList drivers={drivers} />
          </Section>
        )}

        {rules.length > 0 && (
          <Section title="Rules">
            <div className="rules">
              {rules.map((rule, i) => (
                <RuleView key={i} rule={rule} />
              ))}
            </div>
          </Section>
        )}

        {drivers.length === 0 && rules.length === 0 && (
          <p className="empty">Nothing set yet. Edit this mode to choose drivers and write rules.</p>
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
              Engage
            </button>
          )}
        </div>
      </div>
    </>
  )
}
