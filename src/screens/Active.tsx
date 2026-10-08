import { useState } from 'react'
import { discardSession, setReading } from '../actions'
import { SignalRow } from '../components/Meter'
import { BackButton, DriverView, RuleView } from '../components/Parts'
import { cx, formatClock, formatTime, levelLabel } from '../format'
import { useNow } from '../hooks'
import { useNav } from '../nav'
import { useData } from '../store'

export function ActiveScreen() {
  const data = useData()
  const nav = useNav()
  const now = useNow()
  const [editingState, setEditingState] = useState(false)
  const session = data.active

  if (!session) {
    return (
      <div className="screen">
        <header className="topbar">
          <BackButton label="Modes" />
        </header>
        <p className="hint">No mode is engaged.</p>
      </div>
    )
  }

  const left = session.endsAt - now
  const done = left <= 0
  const named = session.readings.every((r) => r.before)

  const discard = () => {
    if (!confirm('Discard this session? Nothing will be saved.')) return
    nav.reset({ name: 'modes' })
    discardSession()
  }

  return (
    <>
      <div className="screen has-actionbar">
        <header className="topbar">
          <BackButton label="Modes" />
          <button className="link danger" onClick={discard}>
            Discard
          </button>
        </header>
        <p className="status">
          <span className="pulse" />
          Engaged
        </p>
        <h1 className="title">{session.modeName}</h1>
        <p className={cx('countdown', done && 'is-done')}>{formatClock(left)}</p>
        <p className="countdown-sub">
          {done ? "Time's up. Check in while it's fresh." : `left · until ${formatTime(session.endsAt)}`}
        </p>

        {session.readings.length > 0 && (
          <>
            <h2 className="eyebrow section-label">Right now</h2>
            {named && !editingState ? (
              <button className="state-summary" onClick={() => setEditingState(true)}>
                {session.readings.map((r) => `${r.name} ${levelLabel(r.labels, r.before!).toLowerCase()}`).join(' · ')}
                <span className="link small">Edit</span>
              </button>
            ) : (
              <>
                <p className="hint tight">Name what's happening. Naming it is part of the work.</p>
                <div className="signals">
                  {session.readings.map((r) => (
                    <SignalRow
                      key={r.signalId}
                      name={r.name}
                      labels={r.labels}
                      value={r.before}
                      onChange={(level) => setReading(r.signalId, 'before', level)}
                    />
                  ))}
                </div>
                {named && (
                  <button className="link small" onClick={() => setEditingState(false)}>
                    Done
                  </button>
                )}
              </>
            )}
          </>
        )}

        {session.rules.length > 0 && (
          <>
            <h2 className="eyebrow section-label">Rules</h2>
            <div className="rules">
              {session.rules.map((rule, i) => (
                <RuleView key={i} rule={rule} large />
              ))}
            </div>
          </>
        )}

        {session.drivers.length > 0 && (
          <>
            <h2 className="eyebrow section-label">Drivers</h2>
            {session.drivers.map((d) => (
              <DriverView key={d.driverId} name={d.name} labels={d.labels} level={d.level} note={d.note} />
            ))}
          </>
        )}
      </div>

      <div className="actionbar">
        <div className="actionbar-inner">
          <button className={cx('btn', done ? 'btn-primary' : 'btn-secondary')} onClick={() => nav.push({ name: 'checkin' })}>
            {done ? 'Check in' : 'End & check in'}
          </button>
        </div>
      </div>
    </>
  )
}
