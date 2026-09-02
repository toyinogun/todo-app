import { describe, expect, it } from 'vitest'
import { bannerText } from './banner'

describe('bannerText', () => {
  it('is undefined with no banner', () => {
    expect(bannerText(undefined)).toBeUndefined()
  })
  it('pluralises dropped rows', () => {
    expect(bannerText({ kind: 'dropped', count: 1 })).toMatch(
      /1 saved task was/,
    )
    expect(bannerText({ kind: 'dropped', count: 3 })).toMatch(
      /3 saved tasks were/,
    )
  })
  it('has copy for every other kind', () => {
    for (const kind of ['reset', 'newer', 'saveFailed'] as const)
      expect(bannerText({ kind })).toBeTruthy()
  })
})
