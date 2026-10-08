import { deleteMode, updateMode } from '../actions'
import { PlusIcon } from '../components/Icons'
import { GrowingTextarea, Section } from '../components/Parts'
import { Tape } from '../components/Tape'
import { cx, DURATIONS, formatMinutes } from '../format'
import { useNav } from '../nav'
import { useData } from '../store'
import { MAX_DRIVERS, MAX_RULES, type Mode, type ModeDriver, type Rule } from '../types'

/** Configuration time: take two minutes at home so the moment itself takes five seconds. */
export function ModeEditorScreen({ id }: { id: string }) {
  const data = useData()
  const nav = useNav()
  const mode = data.modes.find((m) => m.id === id)
  if (!mode) return null

  const update = (fn: (m: Mode) => Mode) => updateMode(id, fn)
  const patchDriver = (i: number, patch: Partial<ModeDriver>) =>
    update((m) => ({ ...m, drivers: m.drivers.map((md, j) => (j === i ? { ...md, ...patch } : md)) }))
  const patchRule = (i: number, patch: Partial<Rule>) =>
    update((m) => ({ ...m, rules: m.rules.map((r, j) => (j === i ? { ...r, ...patch } : r)) }))

  const used = new Set(mode.drivers.map((md) => md.driverId))
  const nextDriver = data.drivers.find((d) => !used.has(d.id))
  const driverOf = (driverId: string) => data.drivers.find((d) => d.id === driverId)

  const remove = () => {
    if (!confirm(`Delete “${mode.name.trim() || 'Untitled'}”?`)) return
    nav.reset({ name: 'modes' })
    deleteMode(id)
  }

  return (
    <div className="screen">
      <header className="topbar">
        <span />
        <button className="link is-strong" onClick={() => nav.back()}>
          Done
        </button>
      </header>
      <input
        className="title-input"
        value={mode.name}
        placeholder="Name this mode"
        aria-label="Mode name"
        onChange={(e) => update((m) => ({ ...m, name: e.target.value }))}
      />

      <Section title="Drivers" aside={`${mode.drivers.length} of ${MAX_DRIVERS}`}>
        <p className="hint">What you choose. Drag each one to the level this situation needs.</p>
        <div className="strip is-editing">
          {mode.drivers.map((md, i) => {
            const driver = driverOf(md.driverId)
            return (
              <div className="strip-col" key={md.driverId}>
                <Tape
                  value={md.level}
                  labels={driver?.labels ?? []}
                  name={driver?.name ?? 'Driver'}
                  onChange={(level) => patchDriver(i, { level })}
                />
                <select
                  className="strip-select"
                  value={md.driverId}
                  aria-label="Driver"
                  onChange={(e) => patchDriver(i, { driverId: e.target.value })}
                >
                  {data.drivers
                    .filter((d) => d.id === md.driverId || !used.has(d.id))
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name.trim() || 'Untitled'}
                      </option>
                    ))}
                </select>
                <button
                  className="text-btn is-caution"
                  onClick={() => update((m) => ({ ...m, drivers: m.drivers.filter((_, j) => j !== i) }))}
                >
                  Remove
                </button>
              </div>
            )
          })}
          {mode.drivers.length < MAX_DRIVERS && nextDriver && (
            <button
              className="strip-col strip-empty"
              onClick={() => update((m) => ({ ...m, drivers: [...m.drivers, { driverId: nextDriver.id, level: 3, note: '' }] }))}
            >
              <span className="strip-empty-spine" />
              <span className="strip-empty-label">
                <PlusIcon />
                Add driver
              </span>
            </button>
          )}
        </div>

        {mode.drivers.length > 0 && (
          <div className="note-fields">
            {mode.drivers.map((md, i) => (
              <label className="note-field" key={md.driverId}>
                <span className="note-field-name">{driverOf(md.driverId)?.name ?? 'Driver'}</span>
                <GrowingTextarea
                  value={md.note}
                  placeholder="What this level means here"
                  onChange={(note) => patchDriver(i, { note })}
                />
              </label>
            ))}
          </div>
        )}
      </Section>

      <Section title="Rules" aside={`${mode.rules.length} of ${MAX_RULES}`}>
        <p className="hint">If this happens, then I do that. Concrete beats inspiring.</p>
        {mode.rules.map((rule, i) => (
          <div className="rule-edit" key={i}>
            <label className="rule-field">
              <span className="rule-if">If</span>
              <GrowingTextarea value={rule.cue} placeholder="I feel myself rushing" label="If" onChange={(cue) => patchRule(i, { cue })} />
            </label>
            <label className="rule-field">
              <span className="rule-then">Then</span>
              <GrowingTextarea
                value={rule.action}
                placeholder="Stop for two seconds before answering."
                label="Then"
                onChange={(action) => patchRule(i, { action })}
              />
            </label>
            <button className="text-btn is-caution" onClick={() => update((m) => ({ ...m, rules: m.rules.filter((_, j) => j !== i) }))}>
              Remove rule
            </button>
          </div>
        ))}
        {mode.rules.length < MAX_RULES && (
          <button className="add-btn" onClick={() => update((m) => ({ ...m, rules: [...m.rules, { cue: '', action: '' }] }))}>
            <PlusIcon />
            Add rule
          </button>
        )}
      </Section>

      <Section title="Duration">
        <div className="seg" role="radiogroup" aria-label="Duration">
          {DURATIONS.map((minutes) => (
            <button
              key={minutes}
              role="radio"
              aria-checked={mode.minutes === minutes}
              className={cx('seg-btn', mode.minutes === minutes && 'is-selected')}
              onClick={() => update((m) => ({ ...m, minutes }))}
            >
              {formatMinutes(minutes)}
            </button>
          ))}
        </div>
      </Section>

      <button className="text-btn is-caution delete-btn" onClick={remove}>
        Delete mode
      </button>
    </div>
  )
}
