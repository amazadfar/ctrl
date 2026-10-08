import { useRef } from 'react'
import { createScale, replaceData, type ScaleKind } from '../actions'
import { exportBackup, readBackup } from '../backup'
import { ChevronRightIcon, PlusIcon } from '../components/Icons'
import { BackButton } from '../components/Parts'
import { levelLabel } from '../format'
import { useNav } from '../nav'
import { useData } from '../store'

const SECTIONS: { kind: ScaleKind; title: string; hint: string; add: string }[] = [
  { kind: 'signals', title: 'State', hint: 'What you observe. You name these before and after.', add: 'Add signal' },
  { kind: 'drivers', title: 'Drivers', hint: 'What you choose. Modes set these.', add: 'Add driver' },
]

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
        <BackButton label="Modes" />
      </header>
      <h1 className="title">Settings</h1>

      {SECTIONS.map(({ kind, title, hint, add }) => (
        <section key={kind}>
          <h2 className="eyebrow section-label">{title}</h2>
          <p className="hint tight">{hint}</p>
          <div className="list">
            {data[kind].map((scale) => (
              <button key={scale.id} className="row is-compact" onClick={() => nav.push({ name: 'scale', kind, id: scale.id })}>
                <span className="row-main">
                  <span className="row-title">{scale.name.trim() || 'Untitled'}</span>
                  <span className="row-sub">
                    {levelLabel(scale.labels, 1)} → {levelLabel(scale.labels, 5)}
                  </span>
                </span>
                <ChevronRightIcon />
              </button>
            ))}
            <button className="row row-add" onClick={() => nav.push({ name: 'scale', kind, id: createScale(kind) })}>
              <PlusIcon />
              {add}
            </button>
          </div>
        </section>
      ))}

      <h2 className="eyebrow section-label">Backup</h2>
      <p className="hint tight">
        Everything lives on this phone only. Removing CTRL from your Home Screen deletes it, so export now and then.
      </p>
      <div className="list">
        <button className="row is-compact" onClick={() => exportBackup(data)}>
          <span className="row-main">
            <span className="row-title">Export backup</span>
          </span>
        </button>
        <button className="row is-compact" onClick={() => fileInput.current?.click()}>
          <span className="row-main">
            <span className="row-title">Import backup</span>
          </span>
        </button>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => onImport(e.target.files?.[0])}
      />

      <p className="build">CTRL · build {__BUILD__}</p>
    </div>
  )
}
