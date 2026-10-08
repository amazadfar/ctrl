import { useState } from 'react'
import { finishSession, setReading } from '../actions'
import { SignalRow } from '../components/Meter'
import { BackButton, Choice, GrowingTextarea } from '../components/Parts'
import { CHANGED_LABEL, formatTime, HELPED_LABEL, levelLabel } from '../format'
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

  const save = () => {
    haptic()
    finishSession({ changed, helped, note })
    nav.reset({ name: 'modes' }, { name: 'history' })
  }

  return (
    <>
      <div className="screen has-actionbar">
        <header className="topbar">
          <BackButton label={session.modeName} />
        </header>
        <h1 className="title">Check in</h1>
        <p className="lede">
          {session.modeName} · {formatTime(session.startedAt)}–{formatTime(Math.min(Date.now(), session.endsAt))}
        </p>

        {session.readings.length > 0 && (
          <>
            <h2 className="eyebrow section-label">State now</h2>
            <div className="signals">
              {session.readings.map((r) => (
                <SignalRow
                  key={r.signalId}
                  name={r.name}
                  labels={r.labels}
                  value={r.after}
                  hint={r.before ? `was ${levelLabel(r.labels, r.before).toLowerCase()}` : undefined}
                  onChange={(level) => setReading(r.signalId, 'after', level)}
                />
              ))}
            </div>
          </>
        )}

        <h2 className="eyebrow section-label">Did choosing this change what you did?</h2>
        <Choice label="Changed what you did" options={CHANGED_LABEL} value={changed} onChange={setChanged} />

        <h2 className="eyebrow section-label">Did it help?</h2>
        <Choice label="Did it help" options={HELPED_LABEL} value={helped} onChange={setHelped} />

        <h2 className="eyebrow section-label">Note</h2>
        <GrowingTextarea value={note} placeholder="What worked, what didn't." label="Note" onChange={setNote} />
      </div>

      <div className="actionbar">
        <div className="actionbar-inner">
          <button className="btn btn-primary" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </>
  )
}
