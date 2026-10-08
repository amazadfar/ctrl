import { createMode } from '../actions'
import { HistoryIcon, PlusIcon, SettingsIcon } from '../components/Icons'
import { Fma } from '../components/Parts'
import { Signature } from '../components/Tape'
import { formatClock, formatMinutes, formatTime } from '../format'
import { useNow } from '../hooks'
import { useNav } from '../nav'
import { useData } from '../store'
import type { Session } from '../types'

/** Always-on status, like the annunciator strip on a flight deck: standby, or what's engaged. */
function StatusBar({ session }: { session?: Session }) {
  const nav = useNav()
  const now = useNow()
  if (!session) {
    return (
      <Fma
        label="No mode engaged"
        cells={[
          { text: 'Standby', tone: 'dim' },
          { text: '- -', tone: 'dim' },
          { text: formatTime(now), tone: 'dim' },
        ]}
      />
    )
  }
  const left = session.endsAt - now
  return (
    <Fma
      label={`${session.modeName} engaged. Open it.`}
      onClick={() => nav.push({ name: 'active' })}
      cells={[
        { text: session.modeName, tone: 'green' },
        left > 0 ? { text: formatClock(left) } : { text: "Time's up", tone: 'amber' },
        { text: 'Open' },
      ]}
    />
  )
}

export function ModesScreen() {
  const data = useData()
  const nav = useNav()
  const driverName = (id: string) => data.drivers.find((d) => d.id === id)?.name ?? 'Driver'

  return (
    <div className="screen">
      <header className="masthead">
        <span className="wordmark">CTRL</span>
        <span className="topbar-actions">
          <button className="icon-btn" aria-label="History" onClick={() => nav.push({ name: 'history' })}>
            <HistoryIcon />
          </button>
          <button className="icon-btn" aria-label="Settings" onClick={() => nav.push({ name: 'settings' })}>
            <SettingsIcon />
          </button>
        </span>
      </header>

      <StatusBar session={data.active} />

      {data.modes.length === 0 && <p className="empty">No modes yet. Make one for the next thing that matters.</p>}

      <ul className="modes">
        {data.modes.map((mode) => {
          const names = mode.drivers.map((md) => driverName(md.driverId).toLowerCase()).join(', ')
          return (
            <li key={mode.id}>
              <button className="mode-row" onClick={() => nav.push({ name: 'mode', id: mode.id })}>
                <Signature levels={mode.drivers.map((md) => md.level)} />
                <span className="mode-main">
                  <span className="mode-name">{mode.name.trim() || 'Untitled'}</span>
                  {names && <span className="mode-sub">{names.charAt(0).toUpperCase() + names.slice(1)}</span>}
                </span>
                <span className="mode-dur">{formatMinutes(mode.minutes)}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <button className="add-btn" onClick={() => nav.push({ name: 'edit', id: createMode() })}>
        <PlusIcon />
        New mode
      </button>
    </div>
  )
}
