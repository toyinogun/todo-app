// Copy for the storage banner. Pure so it can be tested without React.
import type { Banner } from './usePersistedTasks'

export const bannerText = (b: Banner): string | undefined => {
  switch (b?.kind) {
    case 'dropped':
      return `${b.count} saved ${b.count === 1 ? 'task was' : 'tasks were'} unreadable and skipped.`
    case 'reset':
      return 'Saved data could not be read. Starting with an empty list.'
    case 'newer':
      return 'This list was saved by a newer version of the app. Reload to keep editing.'
    case 'saveFailed':
      return 'Changes are not being saved. Your list still works until you close the tab.'
    default:
      return undefined
  }
}
