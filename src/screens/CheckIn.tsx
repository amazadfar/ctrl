import { useState } from 'react'
import { finishSession, setReading } from '../actions'
import { Gauge } from '../components/Gauge'
import { BackButton, Choice, GrowingTextarea, Section } from '../components/Parts'
import { CHANGED_LABEL, formatTime, HELPED_LABEL } from '../format'
import { haptic } from '../haptics'
import { useNav } from '../nav'
import { useData } from '../store'
import type { Changed, Helped } from '../types'

export function CheckInScreen() {
  const data = useData()
  const nav = useNav()
  const [changed, setChanged] = useState<Changed>()
  const [helped, setHelped] = useState<Helped>()
  const [note, setNote] = useState('')
  const session = data.active
  if (!session) return null

  const hasBefore = session.readings.some((r) => r.before)

  const save = () => {
    haptic()
    finishSession({ changed, helped, note })
    nav.reset({ name: 'home' }, { name: 'history' })
  }

  return (
    <>
      <div className="screen has-actionbar">
        <header className="topbar">
          <BackButton label={session.modeName} />
        </header>
        <h1 className="title">Check in</h1>
        <p className="lede">
          {session.modeName}, {formatTime(session.startedAt)} to {formatTime(Math.min(Date.now(), session.endsAt))}
        </p>

        {session.readings.length > 0 && (
          <Section title="State now">
            {hasBefore && <p className="hint">Grey needles show where you started.</p>}
            <div className="gauges">
              {session.readings.map((r) => (
                <Gauge
                  key={r.signalId}
                  name={r.name}
                  labels={r.labels}
                  value={r.after}
                  ghost={r.before}
                  onChange={(level) => setReading(r.signalId, 'after', level)}
                />
              ))}
            </div>
          </Section>
        )}

        <Section title="Did choosing this change what you did?">
          <Choice label="Changed what you did" options={CHANGED_LABEL} value={changed} onChange={setChanged} />
        </Section>

        <Section title="Did it help?">
          <Choice label="Did it help" options={HELPED_LABEL} value={helped} onChange={setHelped} />
        </Section>

        <Section title="Note">
          <GrowingTextarea value={note} placeholder="What worked, what didn't." label="Note" onChange={setNote} />
        </Section>
      </div>

      <div className="actionbar">
        <div className="actionbar-inner">
          <button className="btn btn-primary" onClick={save}>
            Save check-in
          </button>
        </div>
      </div>
    </>
  )
}
