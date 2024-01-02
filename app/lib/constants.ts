export const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2'
export const POKEMON_URL = POKE_API_BASE_URL + '/pokemon'

export const POKE_TYPES = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel',
  'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'] as const

export type PokeType = typeof POKE_TYPES[number]

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

export const POKE_SEARCH_SORT_KEYS = ['pokedexId', 'name'] as const
export type PokeSearchSortKey = typeof POKE_SEARCH_SORT_KEYS[number]
