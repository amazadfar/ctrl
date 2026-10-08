import { ChevronRightIcon } from '../components/Icons'
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
        <p className="empty">Nothing yet. Engage a mode before something that matters, then check in afterwards.</p>
      ) : (
        <>
          {answered.length > 0 && (
            <p className="readout">
              <strong>
                {changedBehaviour.length} of {answered.length}
              </strong>{' '}
              {answered.length === 1 ? 'session' : 'sessions'} changed what you did.
            </p>
          )}
          {days.map(([day, items]) => (
            <section key={day}>
              <h2 className="eyebrow section-label">{day}</h2>
              <div className="list">
                {items.map((s) => (
                  <button key={s.id} className="row" onClick={() => nav.push({ name: 'session', id: s.id })}>
                    <span className="row-main">
                      <span className="row-title">{s.modeName}</span>
                      <span className="row-sub">
                        {formatTime(s.startedAt)}–{formatTime(s.endedAt ?? s.endsAt)}
                      </span>
                    </span>
                    {s.helped && <span className={cx('badge', `badge-${s.helped}`)}>{HELPED_LABEL[s.helped]}</span>}
                    <ChevronRightIcon />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
