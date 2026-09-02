import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY, isTask, load, migrate, save } from './storage'
import { addTask, toggleTask } from './tasks'

// ponytail: minimal in memory localStorage, enough for get/set/clear and a throwing setItem
const makeStore = (failWrites = false) => {
  const data = new Map<string, string>()
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (failWrites) throw new Error('quota')
      data.set(k, v)
    },
    removeItem: (k: string) => void data.delete(k),
    clear: () => data.clear(),
    key: () => null,
    length: 0,
  } as unknown as Storage
}

beforeEach(() => {
  globalThis.localStorage = makeStore()
})

describe('save and load (AC-6)', () => {
  it('round trips a list, sorted and renumbered', () => {
    const list = toggleTask(addTask(addTask([], 'a'), 'b'), 'x')
    expect(save(list)).toBe(true)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({
      version: 1,
      tasks: list,
    })
    expect(load()).toEqual({ tasks: list, dropped: 0, status: 'ok' })
  })

  it('loads an empty list when nothing is stored', () => {
    expect(load()).toEqual({ tasks: [], dropped: 0, status: 'ok' })
  })

  it('returns false when the write fails instead of throwing', () => {
    globalThis.localStorage = makeStore(true)
    expect(save([])).toBe(false)
  })
})

describe('validation and reset (AC-8)', () => {
  it('drops invalid rows, keeps valid ones renumbered, and reports the count', () => {
    const good = {
      id: '1',
      title: 't',
      done: false,
      position: 5,
      createdAt: 'now',
    }
    const noId = { title: 't', done: false, position: 0, createdAt: 'now' }
    const badTitle = {
      id: '2',
      title: 3,
      done: false,
      position: 1,
      createdAt: 'now',
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, tasks: [noId, good, badTitle] }),
    )
    expect(load()).toEqual({
      tasks: [{ ...good, position: 0 }],
      dropped: 2,
      status: 'ok',
    })
  })

  it('resets on unreadable JSON or a non blob', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(load().status).toBe('reset')
    localStorage.setItem(STORAGE_KEY, '[1,2]')
    expect(load().status).toBe('reset')
  })

  it('isTask accepts optional dueDate and completedAt only as strings', () => {
    const base = {
      id: '1',
      title: 't',
      done: true,
      position: 0,
      createdAt: 'now',
    }
    expect(isTask({ ...base, dueDate: '2026-09-02', completedAt: 'now' })).toBe(
      true,
    )
    expect(isTask({ ...base, dueDate: 5 })).toBe(false)
    expect(isTask({ ...base, position: 1.5 })).toBe(false)
  })
})

describe('migrate (AC-7, AC-9)', () => {
  it('is the identity for version 1', () => {
    const blob = { version: 1, tasks: [] }
    expect(migrate(blob)).toEqual(blob)
  })

  it('refuses a newer version, and load reports newer with an empty list', () => {
    expect(migrate({ version: 9, tasks: [] })).toBeUndefined()
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 9, tasks: [{ id: 'keep' }] }),
    )
    expect(load()).toEqual({ tasks: [], dropped: 0, status: 'newer' })
    expect(localStorage.getItem(STORAGE_KEY)).toContain('keep')
  })
})
