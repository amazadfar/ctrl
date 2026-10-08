import { deleteMode, updateMode } from '../actions'
import { Dial } from '../components/Dial'
import { PlusIcon } from '../components/Icons'
import { GrowingTextarea } from '../components/Parts'
import { cx, DURATIONS, formatMinutes, levelLabel } from '../format'
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

  const remove = () => {
    if (!confirm(`Delete “${mode.name.trim() || 'Untitled'}”?`)) return
    nav.reset({ name: 'modes' })
    deleteMode(id)
  }

  return (
    <div className="screen">
      <header className="topbar">
        <span />
        <button className="link strong" onClick={() => nav.back()}>
          Done
        </button>
      </header>
      <input
        className="title-input"
        value={mode.name}
        placeholder="Mode name"
        aria-label="Mode name"
        onChange={(e) => update((m) => ({ ...m, name: e.target.value }))}
      />

      <h2 className="eyebrow section-label">
        Drivers <span className="count">{mode.drivers.length}/{MAX_DRIVERS}</span>
      </h2>
      <p className="hint tight">What you choose. Set the level, then say what it means here.</p>
      {mode.drivers.map((md, i) => {
        const driver = data.drivers.find((d) => d.id === md.driverId)
        const labels = driver?.labels ?? []
        return (
          <div className="driver is-editing" key={md.driverId}>
            <div className="driver-head">
              <select
                className="driver-select"
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
              <span className="driver-value">{levelLabel(labels, md.level)}</span>
            </div>
            <Dial
              value={md.level}
              labels={labels}
              label={`${driver?.name ?? 'Driver'} level`}
              onChange={(level) => patchDriver(i, { level })}
            />
            <GrowingTextarea
              value={md.note}
              placeholder="What this level means here"
              onChange={(note) => patchDriver(i, { note })}
            />
            <button
              className="text-btn danger"
              onClick={() => update((m) => ({ ...m, drivers: m.drivers.filter((_, j) => j !== i) }))}
            >
              Remove
            </button>
          </div>
        )
      })}
      {mode.drivers.length < MAX_DRIVERS && nextDriver && (
        <button
          className="row row-add"
          onClick={() => update((m) => ({ ...m, drivers: [...m.drivers, { driverId: nextDriver.id, level: 3, note: '' }] }))}
        >
          <PlusIcon />
          Add driver
        </button>
      )}

      <h2 className="eyebrow section-label">
        Rules <span className="count">{mode.rules.length}/{MAX_RULES}</span>
      </h2>
      <p className="hint tight">If this happens, then I do that. Concrete beats inspiring.</p>
      {mode.rules.map((rule, i) => (
        <div className="rule-edit" key={i}>
          <label className="rule-field">
            <span className="rule-key">If</span>
            <GrowingTextarea
              value={rule.cue}
              placeholder="I feel myself rushing"
              label="If"
              onChange={(cue) => patchRule(i, { cue })}
            />
          </label>
          <label className="rule-field">
            <span className="rule-key">Then</span>
            <GrowingTextarea
              value={rule.action}
              placeholder="Stop for two seconds before answering."
              label="Then"
              onChange={(action) => patchRule(i, { action })}
            />
          </label>
          <button
            className="text-btn danger"
            onClick={() => update((m) => ({ ...m, rules: m.rules.filter((_, j) => j !== i) }))}
          >
            Remove
          </button>
        </div>
      ))}
      {mode.rules.length < MAX_RULES && (
        <button className="row row-add" onClick={() => update((m) => ({ ...m, rules: [...m.rules, { cue: '', action: '' }] }))}>
          <PlusIcon />
          Add rule
        </button>
      )}

      <h2 className="eyebrow section-label">Duration</h2>
      <div className="seg">
        {DURATIONS.map((minutes) => (
          <button
            key={minutes}
            className={cx('seg-btn', mode.minutes === minutes && 'is-selected')}
            onClick={() => update((m) => ({ ...m, minutes }))}
          >
            {formatMinutes(minutes)}
          </button>
        ))}
      </div>

      <button className="text-btn danger section-label" onClick={remove}>
        Delete mode
      </button>
    </div>
  )
}
