import { type URLPageParam, type PokeType } from './definitions'

// Dynamic tailwind class must appear as unbroken literals: https://tailwindcss.com/docs/content-configuration#dynamic-class-names
export const POKE_TYPE_BG_CLASS: Record<PokeType, string> = {
  grass: 'bg-grass',
  poison: 'bg-poison',
  bug: 'bg-bug',
  dark: 'bg-dark',
  normal: 'bg-normal',
  dragon: 'bg-dragon',
  electric: 'bg-electric',
  fairy: 'bg-fairy',
  fighting: 'bg-fighting',
  ghost: 'bg-ghost',
  fire: 'bg-fire',
  flying: 'bg-flying',
  ground: 'bg-ground',
  ice: 'bg-ice',
  psychic: 'bg-psychic',
  rock: 'bg-rock',
  steel: 'bg-steel',
  water: 'bg-water'
}

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
 * Returns an array of the strings in @param words that contain @param query. Case insensitive.
 * @param words Array of strings
 * @param query String to match for containment
 */
export function filterLike (words: string[], query: string): string[] {
  const insensitiveQuery = query.toLowerCase()
  return words.filter(w => w.toLowerCase().includes(insensitiveQuery))
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
