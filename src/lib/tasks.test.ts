import { describe, expect, it } from 'vitest'
import { addTask, toggleTask } from './tasks'

describe('tasks', () => {
  it('adds a trimmed task with the next position', () => {
    const list = addTask([], '  buy milk ')
    expect(list).toHaveLength(1)
    expect(list[0]).toMatchObject({
      title: 'buy milk',
      done: false,
      position: 1,
    })
  })

  it('ignores blank titles and never mutates the input', () => {
    const before = addTask([], 'a')
    const after = addTask(before, '   ')
    expect(after).toEqual(before)
    expect(after).not.toBe(before)
  })

  it('toggles done by id', () => {
    const [task] = addTask([], 'a')
    expect(toggleTask([task], task.id)[0].done).toBe(true)
    expect(task.done).toBe(false)
  })
})
