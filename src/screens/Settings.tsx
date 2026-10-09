import { useRef } from 'react'
import { createScale, replaceData, type ScaleKind } from '../actions'
import { exportBackup, readBackup } from '../backup'
import { ChevronRightIcon, PlusIcon } from '../components/Icons'
import { BackButton, Section } from '../components/Parts'
import { levelLabel } from '../format'
import { useNav } from '../nav'
import { useData } from '../store'

const SECTIONS: { kind: ScaleKind; title: string; hint: string; add: string }[] = [
  { kind: 'signals', title: 'State', hint: 'What you observe. You read these gauges before and after.', add: 'Add signal' },
  { kind: 'drivers', title: 'Drivers', hint: 'What you choose. Modes set these.', add: 'Add driver' },
]

/** A tiny gauge for state signals, a tiny volume bar for drivers: the same instruments the app uses for each. */
function ScaleGlyph({ kind }: { kind: ScaleKind }) {
  return (
    <svg className="glyph" viewBox="0 0 36 36" aria-hidden="true">
      {kind === 'signals' ? (
        <>
          <path className="glyph-arc" d="M6.74 26.5 A13 13 0 1 1 29.26 26.5" />
          <line className="glyph-needle" x1={18} y1={20} x2={26.7} y2={15} />
        </>
      ) : (
        <>
          <rect className="sig-track" x={3} y={16.5} width={30} height={3} rx={1.5} />
          <rect className="sig-fill" x={3} y={16.5} width={21} height={3} rx={1.5} />
          <rect className="sig-thumb" x={18} y={13} width={12} height={10} rx={5} />
        </>
      )}
    </svg>
  )
}

export function SettingsScreen() {
  const data = useData()
  const nav = useNav()
  const fileInput = useRef<HTMLInputElement>(null)

  const onImport = async (file: File | undefined) => {
    if (!file) return
    try {
      const next = await readBackup(file)
      const summary = `${next.modes.length} modes, ${next.sessions.length} sessions`
      if (confirm(`Replace everything on this phone with this backup (${summary})?`)) replaceData(next)
    } catch {
      alert("That file isn't a CTRL backup.")
    } finally {
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  return (
    <div className="screen">
      <header className="topbar">
        <BackButton label="CTRL" />
      </header>
      <h1 className="title">Settings</h1>

      {SECTIONS.map(({ kind, title, hint, add }) => (
        <Section key={kind} title={title}>
          <p className="hint">{hint}</p>
          <ul className="settings-list">
            {data[kind].map((scale) => (
              <li key={scale.id}>
                <button className="setting-row" onClick={() => nav.push({ name: 'scale', kind, id: scale.id })}>
                  <ScaleGlyph kind={kind} />
                  <span className="setting-main">
                    <span className="setting-name">{scale.name.trim() || 'Untitled'}</span>
                    <span className="setting-sub">
                      {levelLabel(scale.labels, 1)} to {levelLabel(scale.labels, 5).toLowerCase()}
                    </span>
                  </span>
                  <ChevronRightIcon />
                </button>
              </li>
            ))}
          </ul>
          <button className="add-btn" onClick={() => nav.push({ name: 'scale', kind, id: createScale(kind) })}>
            <PlusIcon />
            {add}
          </button>
        </Section>
      ))}

      <Section title="Backup">
        <p className="hint">Everything lives on this phone only. Removing CTRL from your Home Screen deletes it, so export now and then.</p>
        <div className="button-row">
          <button className="btn btn-secondary" onClick={() => exportBackup(data)}>
            Export backup
          </button>
          <button className="btn btn-secondary" onClick={() => fileInput.current?.click()}>
            Import backup
          </button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => onImport(e.target.files?.[0])}
        />
      </Section>

      <p className="build">Build {__BUILD__}</p>
    </div>
  )
}
