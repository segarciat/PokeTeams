import { type PokeType } from './definitions'

/**
 * Capitalizes the given word.
 * @param word String to capitalize, assuming no spaces.
 * @returns Identical string, except first letter is uppercased.
 */
export function capitalize (word: string): string {
  return word.length === 0 ? word : word[0].toUpperCase() + word.substring(1).toLowerCase()
}

/**
 * Gets the background color class for the specified type.
 * @param type The pokemon type.
 * @returns A background color tailwind CSS class corresponding to the provided type.
 */
export function getPokeTypeBgClass (type: PokeType): string {
  // Dynamic tailwind class must appear as unbroken literals: https://tailwindcss.com/docs/content-configuration#dynamic-class-names
  switch (type) {
    case 'grass': return 'bg-grass'
    case 'poison': return 'bg-poison'
    case 'bug': return 'bg-bug'
    case 'dark': return 'bg-dark'
    case 'normal': return 'bg-normal'
    case 'dragon': return 'bg-dragon'
    case 'electric': return 'bg-electric'
    case 'fairy': return 'bg-fairy'
    case 'fighting': return 'bg-fighting'
    case 'ghost': return 'bg-ghost'
    case 'fire': return 'bg-fire'
    case 'flying': return 'bg-flying'
    case 'ground': return 'bg-ground'
    case 'ice': return 'bg-ice'
    case 'psychic': return 'bg-psychic'
    case 'rock': return 'bg-rock'
    case 'steel': return 'bg-steel'
    case 'water': return 'bg-water'
  }
}
