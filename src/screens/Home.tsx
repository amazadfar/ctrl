import { createMode, setLevel } from '../actions'
import { ChevronRightIcon, HistoryIcon, PlusIcon, SettingsIcon } from '../components/Icons'
import { Fma, Section } from '../components/Parts'
import { Signature, Volume } from '../components/Volume'
import { cx, formatClock, formatMinutes, formatTime, levelLabel } from '../format'
import { useNow } from '../hooks'
import { useNav } from '../nav'
import { levelOf, useData } from '../store'
import type { Data } from '../types'

/** Always-on status, like the annunciator strip on a flight deck: free, or what's engaged. */
function StatusBar({ data }: { data: Data }) {
  const nav = useNav()
  const now = useNow()
  const session = data.active
  if (!session) {
    return (
      <Fma
        label="Free mode"
        cells={[
          { text: 'Free' },
          { text: `${data.drivers.length} drivers`, tone: 'dim' },
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

/** The first page: a volume bar for every driver. Modes are optional presets underneath. */
export function HomeScreen() {
  const data = useData()
  const nav = useNav()
  const engaged = data.active
  const inMode = new Set(engaged?.drivers.map((d) => d.driverId))

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

      <StatusBar data={data} />

      {data.drivers.length === 0 ? (
        <p className="empty">No drivers yet. Add some in Settings.</p>
      ) : (
        <div className="desk">
          {data.drivers.map((driver) => {
            const level = levelOf(data, driver.id)
            const note = data.notes[driver.id]?.trim()
            return (
              <div key={driver.id} className={cx('bar-row', engaged && !inMode.has(driver.id) && 'is-dim')}>
                <div className="bar-head">
                  <button className="bar-name" onClick={() => nav.push({ name: 'driver', id: driver.id })}>
                    {driver.name.trim() || 'Untitled'}
                    <ChevronRightIcon />
                  </button>
                  <span className="bar-level">{levelLabel(driver.labels, level)}</span>
                </div>
                <Volume name={driver.name} labels={driver.labels} value={level} onChange={(l) => setLevel(driver.id, l)} />
                {note && <p className="bar-note">{note}</p>}
              </div>
            )
          })}
        </div>
      )}

      <Section title="Modes" aside="optional presets">
        <div className="presets">
          {data.modes.map((mode) => (
            <button
              key={mode.id}
              className={cx('preset', engaged?.modeId === mode.id && 'is-engaged')}
              onClick={() => nav.push({ name: 'mode', id: mode.id })}
            >
              <Signature levels={mode.drivers.map((md) => md.level)} />
              <span className="preset-text">
                <span className="preset-name">{mode.name.trim() || 'Untitled'}</span>
                <span className="preset-dur">{formatMinutes(mode.minutes)}</span>
              </span>
            </button>
          ))}
        </div>
        <button className="add-btn" onClick={() => nav.push({ name: 'edit', id: createMode() })}>
          <PlusIcon />
          New mode
        </button>
      </Section>
    </div>
  )
}
