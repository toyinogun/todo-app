// The one place storage side effects live. Spec 0002, AC-6, AC-8, AC-9.
import { useCallback, useEffect, useState } from 'react'
import { STORAGE_KEY, load, save, type LoadResult } from '../../lib/storage'
import type { Task } from '../../lib/tasks'

export type Banner =
  | { kind: 'dropped'; count: number }
  | { kind: 'reset' }
  | { kind: 'newer' }
  | { kind: 'saveFailed' }
  | undefined

const bannerFor = (r: LoadResult): Banner => {
  if (r.status === 'newer') return { kind: 'newer' }
  if (r.status === 'reset') return { kind: 'reset' }
  return r.dropped > 0 ? { kind: 'dropped', count: r.dropped } : undefined
}

type State = { tasks: Task[]; banner: Banner; frozen: boolean }

const fromLoad = (r: LoadResult): State => ({
  tasks: r.tasks,
  banner: bannerFor(r),
  frozen: r.status === 'newer',
})

export const usePersistedTasks = () => {
  const [state, setState] = useState<State>(() => fromLoad(load()))

  // Save after every change. A frozen state (newer blob on disk) never writes.
  useEffect(() => {
    if (state.frozen) return
    // oxlint-disable-next-line react/set-state-in-effect -- the save is the external system; its failure is only known here
    if (!save(state.tasks))
      setState((s) =>
        s.banner?.kind === 'saveFailed'
          ? s
          : { ...s, banner: { kind: 'saveFailed' } },
      )
  }, [state.tasks, state.frozen])

  // Another tab wrote the blob: reload from it so last write does not silently win.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) setState(fromLoad(load()))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setTasks = useCallback((update: (tasks: readonly Task[]) => Task[]) => {
    setState((s) => (s.frozen ? s : { ...s, tasks: update(s.tasks) }))
  }, [])

  const dismissBanner = useCallback(
    () => setState((s) => ({ ...s, banner: undefined })),
    [],
  )

  return { tasks: state.tasks, setTasks, banner: state.banner, dismissBanner }
}
