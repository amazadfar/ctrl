import { isData } from './store'
import type { Data } from './types'

export async function exportBackup(data: Data): Promise<void> {
  const name = `ctrl-backup-${new Date().toISOString().slice(0, 10)}.json`
  const file = new File([JSON.stringify(data, null, 2)], name, { type: 'application/json' })

  // On iPhone the share sheet is the reliable way out ("Save to Files", AirDrop, Mail...).
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return
    } catch (error) {
      if ((error as Error).name === 'AbortError') return
    }
  }

  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function readBackup(file: File): Promise<Data> {
  const parsed: unknown = JSON.parse(await file.text())
  if (!isData(parsed)) throw new Error('Not a CTRL backup')
  return parsed
}
