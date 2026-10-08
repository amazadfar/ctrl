import { deleteSession } from '../actions'
import { BackButton, RuleView } from '../components/Parts'
import { CHANGED_LABEL, formatDay, formatTime, HELPED_LABEL, levelLabel } from '../format'
import { useNav } from '../nav'
import { useData } from '../store'

export function SessionScreen({ id }: { id: string }) {
  const { sessions } = useData()
  const nav = useNav()
  const session = sessions.find((s) => s.id === id)
  if (!session) return null

  const readings = session.readings.filter((r) => r.before || r.after)

  const remove = () => {
    if (!confirm('Delete this session?')) return
    nav.back()
    deleteSession(id)
  }

  return (
    <div className="screen">
      <header className="topbar">
        <BackButton label="History" />
        <button className="link danger" onClick={remove}>
          Delete
        </button>
      </header>
      <h1 className="title">{session.modeName}</h1>
      <p className="lede">
        {formatDay(session.startedAt)} · {formatTime(session.startedAt)}–{formatTime(session.endedAt ?? session.endsAt)}
      </p>

      <div className="stats">
        <div className="stat">
          <span className="eyebrow">Changed what I did</span>
          <span className="stat-value">{session.changed ? CHANGED_LABEL[session.changed] : '—'}</span>
        </div>
        <div className="stat">
          <span className="eyebrow">Helped</span>
          <span className="stat-value">{session.helped ? HELPED_LABEL[session.helped] : '—'}</span>
        </div>
      </div>

      {readings.length > 0 && (
        <>
          <h2 className="eyebrow section-label">State</h2>
          <div className="table">
            <div className="table-row table-head">
              <span />
              <span>Before</span>
              <span>After</span>
            </div>
            {readings.map((r) => (
              <div className="table-row" key={r.signalId}>
                <span>{r.name}</span>
                <span>{r.before ? levelLabel(r.labels, r.before) : '—'}</span>
                <span>{r.after ? levelLabel(r.labels, r.after) : '—'}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {session.drivers.length > 0 && (
        <>
          <h2 className="eyebrow section-label">Drivers</h2>
          <div className="table">
            {session.drivers.map((d) => (
              <div className="table-row is-pair" key={d.driverId}>
                <span>{d.name}</span>
                <span className="accent">{levelLabel(d.labels, d.level)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {session.rules.length > 0 && (
        <>
          <h2 className="eyebrow section-label">Rules</h2>
          <div className="rules">
            {session.rules.map((rule, i) => (
              <RuleView key={i} rule={rule} />
            ))}
          </div>
        </>
      )}

      {session.note && (
        <>
          <h2 className="eyebrow section-label">Note</h2>
          <p className="note">{session.note}</p>
        </>
      )}
    </div>
  )
}
