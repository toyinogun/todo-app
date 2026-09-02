import { describe, expect, it } from 'vitest'
import {
  addTask,
  deleteTask,
  editTitle,
  renumber,
  reorderTask,
  toggleTask,
} from './tasks'

const three = () => addTask(addTask(addTask([], 'a'), 'b'), 'c')
const positions = (ts: { position: number }[]) => ts.map((t) => t.position)

describe('addTask (AC-1, AC-2, AC-3)', () => {
  it('adds at the bottom with fresh id, done false, createdAt, and position = count', () => {
    const list = three()
    expect(positions(list)).toEqual([0, 1, 2])
    expect(list[2]).toMatchObject({ title: 'c', done: false })
    expect(new Set(list.map((t) => t.id)).size).toBe(3)
    expect(Date.parse(list[0].createdAt)).not.toBeNaN()
    expect(list[0]).not.toHaveProperty('dueDate')
    expect(list[0]).not.toHaveProperty('completedAt')
  })

  it('trims and rejects blank or over long titles without mutating input', () => {
    const before = addTask([], ' x ')
    expect(before[0].title).toBe('x')
    expect(addTask(before, '   ')).toEqual(before)
    expect(addTask(before, 'y'.repeat(501))).toEqual(before)
    expect(addTask(before, 'y'.repeat(500))).toHaveLength(2)
    expect(addTask(before, 'z')).not.toBe(before)
  })
})

describe('editTitle (AC-3)', () => {
  it('edits a valid title and rejects invalid ones', () => {
    const list = three()
    expect(editTitle(list, list[0].id, ' new ')[0].title).toBe('new')
    expect(editTitle(list, list[0].id, '')).toEqual(list)
    expect(editTitle(list, 'nope', 'x')).toEqual(list)
  })
})

describe('toggleTask (AC-4)', () => {
  it('sets and clears completedAt, never moves position', () => {
    const list = three()
    const ticked = toggleTask(list, list[1].id)
    expect(ticked[1].done).toBe(true)
    expect(Date.parse(ticked[1].completedAt!)).not.toBeNaN()
    expect(positions(ticked)).toEqual([0, 1, 2])
    const unticked = toggleTask(ticked, list[1].id)
    expect(unticked[1].done).toBe(false)
    expect(unticked[1]).not.toHaveProperty('completedAt')
    expect(list[1].done).toBe(false)
  })
})

describe('deleteTask (AC-5)', () => {
  it('hard deletes and renumbers', () => {
    const list = three()
    const after = deleteTask(list, list[0].id)
    expect(after.map((t) => t.title)).toEqual(['b', 'c'])
    expect(positions(after)).toEqual([0, 1])
    expect(deleteTask(list, 'nope')).toEqual(list)
  })
})

describe('reorderTask and renumber (AC-2)', () => {
  it('moves a task and keeps positions contiguous, clamping the index', () => {
    const list = three()
    expect(reorderTask(list, list[2].id, 0).map((t) => t.title)).toEqual([
      'c',
      'a',
      'b',
    ])
    expect(positions(reorderTask(list, list[0].id, 99))).toEqual([0, 1, 2])
    expect(reorderTask(list, list[0].id, 99).map((t) => t.title)).toEqual([
      'b',
      'c',
      'a',
    ])
    expect(reorderTask(list, 'nope', 1)).toEqual(list)
    expect(
      positions(
        renumber([
          { ...list[0], position: 7 },
          { ...list[1], position: 7 },
        ]),
      ),
    ).toEqual([0, 1])
  })
})
