// Pure list logic. No React, no DOM, no storage. Extended by the data model spec.
export type Task = {
  id: string
  title: string
  done: boolean
  position: number
}

export const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}` // ponytail: plain http LAN dev has no randomUUID

export const addTask = (tasks: readonly Task[], title: string): Task[] => {
  const trimmed = title.trim()
  if (trimmed === '') return [...tasks]
  const position = tasks.reduce((max, t) => Math.max(max, t.position), 0) + 1
  return [...tasks, { id: newId(), title: trimmed, done: false, position }]
}

export const toggleTask = (tasks: readonly Task[], id: string): Task[] =>
  tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
