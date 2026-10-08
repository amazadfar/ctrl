import { BackButton } from '../components/Parts'
import { cx, formatDay, formatTime, HELPED_LABEL } from '../format'
import { useNav } from '../nav'
import { useData } from '../store'
import type { Session } from '../types'

export function HistoryScreen() {
  const { sessions } = useData()
  const nav = useNav()

  const answered = sessions.filter((s) => s.changed)
  const changedBehaviour = answered.filter((s) => s.changed !== 'no')

  const days: [string, Session[]][] = []
  for (const session of sessions) {
    const day = formatDay(session.startedAt)
    const last = days[days.length - 1]
    if (last && last[0] === day) last[1].push(session)
    else days.push([day, [session]])
  }

  return (
    <div className="screen">
      <header className="topbar">
        <BackButton label="Modes" />
      </header>
      <h1 className="title">History</h1>

      {sessions.length === 0 ? (
        <p className="empty">Nothing logged yet. Engage a mode before something that matters, then check in afterwards.</p>
      ) : (
        <>
          {answered.length > 0 && (
            <p className="readout">
              Choosing a mode changed what you did in {changedBehaviour.length} of {answered.length}{' '}
              {answered.length === 1 ? 'session' : 'sessions'}.
            </p>
          )}
          {days.map(([day, items]) => (
            <section key={day} className="log-day">
              <h2 className="log-date">{day}</h2>
              <ul className="log">
                {items.map((s) => (
                  <li key={s.id}>
                    <button className="log-row" onClick={() => nav.push({ name: 'session', id: s.id })}>
                      <span className="log-time">{formatTime(s.startedAt)}</span>
                      <span className="log-name">{s.modeName}</span>
                      {s.helped && <span className={cx('annunciator', `is-${s.helped}`)}>{HELPED_LABEL[s.helped]}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
