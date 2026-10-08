import { createMode } from '../actions'
import { ChevronRightIcon, HistoryIcon, PlusIcon, SettingsIcon } from '../components/Icons'
import { formatClock, levelLabel } from '../format'
import { useNow } from '../hooks'
import { useNav } from '../nav'
import { useData } from '../store'
import type { Level, Session } from '../types'

function ActiveBanner({ session }: { session: Session }) {
  const nav = useNav()
  const left = session.endsAt - useNow()
  return (
    <button className="banner" onClick={() => nav.push({ name: 'active' })}>
      <span className="row-main">
        <span className="row-title">
          <span className="pulse" />
          {session.modeName}
        </span>
        <span className="row-sub banner-sub">{left > 0 ? `${formatClock(left)} left` : "Time's up · check in"}</span>
      </span>
      <ChevronRightIcon />
    </button>
  )
}

export function ModesScreen() {
  const data = useData()
  const nav = useNav()

  const summary = (driverId: string, level: Level) => {
    const driver = data.drivers.find((d) => d.id === driverId)
    return driver ? `${driver.name} ${levelLabel(driver.labels, level).toLowerCase()}` : ''
  }

  return (
    <div className="screen">
      <header className="topbar">
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

      {data.active && <ActiveBanner session={data.active} />}

      <h2 className="eyebrow section-label">Modes</h2>
      <div className="list">
        {data.modes.map((mode) => (
          <button key={mode.id} className="row" onClick={() => nav.push({ name: 'mode', id: mode.id })}>
            <span className="row-main">
              <span className="row-title">{mode.name.trim() || 'Untitled'}</span>
              <span className="row-sub">{mode.drivers.map((md) => summary(md.driverId, md.level)).join(' · ')}</span>
            </span>
            <ChevronRightIcon />
          </button>
        ))}
        <button className="row row-add" onClick={() => nav.push({ name: 'edit', id: createMode() })}>
          <PlusIcon />
          New mode
        </button>
      </div>
    </div>
  )
}
