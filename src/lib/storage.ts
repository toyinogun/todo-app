// localStorage blob under todo:v1. Never throws. Spec: docs/specs/0002-task-data-model.md
import { renumber, type Task } from './tasks'

export const STORAGE_KEY = 'todo:v1'
export const CURRENT_VERSION = 1

export type Blob = { version: number; tasks: unknown[] }
export type LoadStatus = 'ok' | 'reset' | 'newer'
export type LoadResult = { tasks: Task[]; dropped: number; status: LoadStatus }

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null

const optString = (v: unknown) => v === undefined || typeof v === 'string'

export const isTask = (v: unknown): v is Task =>
  isRecord(v) &&
  typeof v.id === 'string' &&
  typeof v.title === 'string' &&
  typeof v.done === 'boolean' &&
  Number.isInteger(v.position) &&
  typeof v.createdAt === 'string' &&
  optString(v.dueDate) &&
  optString(v.completedAt)

export const isBlob = (v: unknown): v is Blob =>
  isRecord(v) && typeof v.version === 'number' && Array.isArray(v.tasks)

/** Upgrades an older blob step by step. Returns undefined for a version newer than this build. */
export const migrate = (blob: Blob): Blob | undefined => {
  if (blob.version > CURRENT_VERSION) return undefined
  // ponytail: version 1 is the identity; each later version adds a step here, e.g.
  // if (blob.version === 1) blob = { ...blob, version: 2, tasks: blob.tasks.map(addField) }
  return blob
}

const readRaw = (): unknown => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === null
      ? { version: CURRENT_VERSION, tasks: [] }
      : JSON.parse(raw)
  } catch {
    return undefined
  }
}

export const load = (): LoadResult => {
  const raw = readRaw()
  if (!isBlob(raw)) return { tasks: [], dropped: 0, status: 'reset' }
  const blob = migrate(raw)
  if (blob === undefined) return { tasks: [], dropped: 0, status: 'newer' }
  const valid = blob.tasks.filter(isTask)
  const tasks = renumber([...valid].sort((a, b) => a.position - b.position))
  return { tasks, dropped: blob.tasks.length - valid.length, status: 'ok' }
}

export const toBlob = (tasks: readonly Task[]): Blob => ({
  version: CURRENT_VERSION,
  tasks: [...tasks],
})

export const save = (tasks: readonly Task[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toBlob(tasks)))
    return true
  } catch {
    return false
  }
}
