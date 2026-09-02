// JSON export of the stored blob. Spec 0002, AC-10.
import { toBlob } from './storage'
import type { Task } from './tasks'

/** Local calendar day as YYYY-MM-DD (same local day rule spec 0001 sets for due dates). */
export const localDay = (d: Date = new Date()): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const exportFileName = (d: Date = new Date()): string =>
  `todo-export-${localDay(d)}.json`

export const exportText = (tasks: readonly Task[]): string =>
  JSON.stringify(toBlob(tasks), null, 2)

/** Triggers a browser download of the blob. Side effect at the edge; nothing to test here. */
export const exportBlob = (tasks: readonly Task[]): void => {
  const url = URL.createObjectURL(
    new Blob([exportText(tasks)], { type: 'application/json' }),
  )
  const a = document.createElement('a')
  a.href = url
  a.download = exportFileName()
  a.click()
  URL.revokeObjectURL(url)
}
