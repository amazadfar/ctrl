import { deleteSession } from '../actions'
import { Gauge } from '../components/Gauge'
import { BackButton, DriverList, RuleView, Section } from '../components/Parts'
import { CHANGED_LABEL, cx, formatDay, formatTime, HELPED_LABEL } from '../format'
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
        <button className="link is-caution" onClick={remove}>
          Delete
        </button>
      </header>
      <h1 className="title">{session.modeName}</h1>
      <p className="lede">
        {formatDay(session.startedAt)}, {formatTime(session.startedAt)} to {formatTime(session.endedAt ?? session.endsAt)}
      </p>

      <dl className="verdicts">
        <div>
          <dt>Changed what I did</dt>
          <dd className={cx(session.changed && session.changed !== 'no' && 'is-green')}>
            {session.changed ? CHANGED_LABEL[session.changed] : 'Not answered'}
          </dd>
        </div>
        <div>
          <dt>Did it help</dt>
          <dd className={cx(session.helped === 'better' && 'is-green', session.helped === 'worse' && 'is-amber')}>
            {session.helped ? HELPED_LABEL[session.helped] : 'Not answered'}
          </dd>
        </div>
      </dl>

      {readings.length > 0 && (
        <Section title="State" aside="grey before, white after">
          <div className="gauges">
            {readings.map((r) => (
              <Gauge key={r.signalId} name={r.name} labels={r.labels} value={r.after} ghost={r.before} />
            ))}
          </div>
        </Section>
      )}

      {session.drivers.length > 0 && (
        <Section title="Drivers">
          <DriverList drivers={session.drivers} />
        </Section>
      )}

      {session.rules.length > 0 && (
        <Section title="Rules">
          <div className="rules">
            {session.rules.map((rule, i) => (
              <RuleView key={i} rule={rule} />
            ))}
          </div>
        </Section>
      )}

      {session.note && (
        <Section title="Note">
          <p className="note">{session.note}</p>
        </Section>
      )}
    </div>
  )
}
