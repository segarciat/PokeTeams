import { POKE_TYPES, type PokeType } from './constants'

/**
 * Capitalizes the given word.
 * @param word String to capitalize, assuming no spaces.
 * @returns Identical string, except first letter is uppercased.
 */
export function capitalize (word: string): string {
  if (word.length === 0) {
    return word
  }
  return word.replace(/\w+/g, (match) => match[0].toUpperCase() + match.substring(1).toLowerCase())
}

/**
 * Returns a subset array where all object names contain the query insensitively.
 * @param words Array of objects containing a property "name".
 * @param query String to match for containment.
 * @returns filtered array, without altering ordering.
 */
export function filterByName <T extends { name: string }> (words: T[], query: string): T[] {
  const insensitiveQuery = query.toLowerCase()
  return words.filter(w => w.name.toLowerCase().includes(insensitiveQuery))
}

export function getArrayPage<T> (a: T[], page: number, pageSize: number): T[] {
  if (page <= 0 || pageSize <= 0) {
    throw new RangeError(`Expected non-zero page and pageSize, but got: page=${page}, pageSize=${pageSize}`)
  }
  const offset = (page - 1) * pageSize
  return a.slice(offset, offset + pageSize)
}

export function getTotalPageCount (resultSize: number, pageSize: number): number {
  if (resultSize < 0 || pageSize <= 0) {
    throw new RangeError(`Expected non-negative result size and position page size, but got: resultSize=${resultSize}, pageSize=${pageSize}`)
  }
  return Math.ceil(resultSize / pageSize)
}

export function getPaginationNumbers (currentPage: number, totalPages: number, maxLinks: number): number[] {
  if (currentPage <= 0 || totalPages <= 0 || maxLinks <= 0) {
    throw new RangeError('Only position inputs are allowed')
  }
  const first = Math.max(1, currentPage - Math.floor(maxLinks / 2))
  return Array.from({ length: maxLinks }, (v, i) => first + i)
    .filter(n => n !== 0 && n !== totalPages + 1)
}

export type URLPageParam = string | string[] | undefined

export function validatePageParam (page: URLPageParam): number {
  const p = Number(Array.isArray(page) ? page[0] : page)
  return isNaN(p) ? 1 : Math.floor(Math.max(1, Math.abs(p)))
}

export function validateQueryParam (query: URLPageParam): string {
  if (query === undefined) {
    return ''
  } else {
    return Array.isArray(query) ? query.join('') : query
  }
}

export function validateTypeParam (types: string[]): Set<PokeType> {
  return new Set(
    types.filter(type => POKE_TYPES.includes(type as any)) as PokeType[]
  )
}
