import { describe, expect, it } from 'vitest'
import { exportFileName, exportText, localDay } from './export'
import { addTask } from './tasks'

describe('export (AC-10)', () => {
  it('names the file by the local calendar day', () => {
    expect(localDay(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    expect(exportFileName(new Date(2026, 8, 2))).toBe(
      'todo-export-2026-09-02.json',
    )
  })

  it('writes the exact stored blob', () => {
    const list = addTask([], 'a')
    expect(JSON.parse(exportText(list))).toEqual({ version: 1, tasks: list })
  })
})
