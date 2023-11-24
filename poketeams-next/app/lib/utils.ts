import { type PokeType } from './definitions'

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
 * Creates a filtered list of Pokemon URLs from the given query string.
 * @param urls List of Pokemon and URLs to filter.
 * @param query Text used to filter the list.
 */
export function filterByName <T extends { name: string }> (urls: T[], query: string): T[] {
  return urls.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
}
