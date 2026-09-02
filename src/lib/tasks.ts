// Pure list logic. No React, no DOM, no storage. Shape and rules: docs/specs/0002-task-data-model.md
export type Task = {
  id: string
  title: string
  done: boolean
  position: number
  createdAt: string
  dueDate?: string
  completedAt?: string
}

export const TITLE_MAX = 500

export const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}` // ponytail: plain http LAN dev has no randomUUID

/** Trimmed title, or undefined when blank or over TITLE_MAX. */
export const validTitle = (title: string): string | undefined => {
  const trimmed = title.trim()
  return trimmed.length >= 1 && trimmed.length <= TITLE_MAX
    ? trimmed
    : undefined
}

/** Positions become 0..n-1 in array order. */
export const renumber = (tasks: readonly Task[]): Task[] =>
  tasks.map((t, i) => (t.position === i ? t : { ...t, position: i }))

export const addTask = (tasks: readonly Task[], title: string): Task[] => {
  const t = validTitle(title)
  if (t === undefined) return [...tasks]
  return [
    ...tasks,
    {
      id: newId(),
      title: t,
      done: false,
      position: tasks.length,
      createdAt: new Date().toISOString(),
    },
  ]
}

export const editTitle = (
  tasks: readonly Task[],
  id: string,
  title: string,
): Task[] => {
  const t = validTitle(title)
  if (t === undefined) return [...tasks]
  return tasks.map((task) => (task.id === id ? { ...task, title: t } : task))
}

export const toggleTask = (tasks: readonly Task[], id: string): Task[] =>
  tasks.map((t) => {
    if (t.id !== id) return t
    if (t.done) {
      const { completedAt: _, ...rest } = t
      return { ...rest, done: false }
    }
    return { ...t, done: true, completedAt: new Date().toISOString() }
  })

export const deleteTask = (tasks: readonly Task[], id: string): Task[] =>
  renumber(tasks.filter((t) => t.id !== id))

export const reorderTask = (
  tasks: readonly Task[],
  id: string,
  toIndex: number,
): Task[] => {
  const from = tasks.findIndex((t) => t.id === id)
  if (from === -1) return [...tasks]
  const to = Math.max(0, Math.min(tasks.length - 1, toIndex))
  const rest = tasks.filter((t) => t.id !== id)
  return renumber([...rest.slice(0, to), tasks[from], ...rest.slice(to)])
}
