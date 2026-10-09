import { Fragment } from 'react'
import { discardSession, setReading } from '../actions'
import { Gauge } from '../components/Gauge'
import { BackButton, DriverList, Fma, RuleView, Section } from '../components/Parts'
import { cx, formatClock, formatTime } from '../format'
import { useNow } from '../hooks'
import { useNav } from '../nav'
import { useData } from '../store'

// A flight deck boxes a newly engaged mode for ten seconds so the change can't be missed.
const ENGAGE_BOX_MS = 10_000

export function ActiveScreen() {
  const data = useData()
  const nav = useNav()
  const now = useNow()
  const session = data.active

  if (!session) {
    return (
      <div className="screen">
        <header className="topbar">
          <BackButton label="CTRL" />
        </header>
        <p className="empty">No mode is engaged.</p>
      </div>
    )
  }

  const left = session.endsAt - now
  const done = left <= 0

  const discard = () => {
    if (!confirm('Discard this session? Nothing will be saved.')) return
    nav.reset({ name: 'home' })
    discardSession()
  }

  return (
    <>
      <div className="screen has-actionbar">
        <header className="topbar">
          <BackButton label="CTRL" />
          <button className="link is-caution" onClick={discard}>
            Discard
          </button>
        </header>

        <Fma
          label={`${session.modeName} engaged until ${formatTime(session.endsAt)}`}
          cells={[
            { text: session.modeName, tone: 'green', boxed: now - session.startedAt < ENGAGE_BOX_MS },
            done ? { text: "Time's up", tone: 'amber' } : { text: 'Engaged', tone: 'green' },
            { text: `Ends ${formatTime(session.endsAt)}` },
          ]}
        />

        <div className="countdown-block">
          <p className={cx('countdown', done && 'is-done')}>
            {formatClock(left)
              .split(':')
              .map((part, i) => (
                <Fragment key={i}>
                  {i > 0 && <span className="colon">:</span>}
                  {part}
                </Fragment>
              ))}
          </p>
          <p className="countdown-sub">{done ? "Check in while it's fresh." : 'remaining'}</p>
        </div>

        {session.readings.length > 0 && (
          <Section title="Right now">
            <p className="hint">Read each gauge: tap where you are. Naming it is part of the work.</p>
            <div className="gauges">
              {session.readings.map((r) => (
                <Gauge
                  key={r.signalId}
                  name={r.name}
                  labels={r.labels}
                  value={r.before}
                  onChange={(level) => setReading(r.signalId, 'before', level)}
                />
              ))}
            </div>
          </Section>
        )}

        {session.rules.length > 0 && (
          <Section title="Rules">
            <div className="rules">
              {session.rules.map((rule, i) => (
                <RuleView key={i} rule={rule} large />
              ))}
            </div>
          </Section>
        )}

        {session.drivers.length > 0 && (
          <Section title="Drivers">
            <DriverList drivers={session.drivers} />
          </Section>
        )}
      </div>

      <div className="actionbar">
        <div className="actionbar-inner">
          <button className={cx('btn', done ? 'btn-primary' : 'btn-secondary')} onClick={() => nav.push({ name: 'checkin' })}>
            {done ? 'Check in' : 'End and check in'}
          </button>
        </div>
      </div>
    </>
  )
}
