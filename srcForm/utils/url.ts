import { SystemKey } from '@/consts'

export function getGoSearch(search: Record<string, unknown> = {}) {
  const newSearch: typeof search = {}

  if (search[SystemKey]) {
    newSearch[SystemKey] = search[SystemKey]
  }
  return newSearch
}
