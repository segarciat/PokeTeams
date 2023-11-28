export type PokeType = 'normal' | 'fighting' | 'flying' | 'poison' | 'ground' | 'rock' | 'bug' | 'ghost' | 'steel' |
'fire' | 'water' | 'grass' | 'electric' | 'psychic' | 'ice' | 'dragon' | 'dark' | 'fairy'

export type PokeStat = 'hp' | 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed'

export interface Pokemon {
  name: string
  id: number
  abilities: Array<{
    name: string
    isHidden: boolean
    url: string
  }>
  types: Array<{
    name: PokeType
    url: string
  }>
  stats: Record<PokeStat, number>
  spriteSrcs: {
    frontDefault: string | null
    backDefault: string | null
    frontShiny: string | null
    backShiny: string | null
  }
}

export interface PokemonURL {
  name: string
  url: string
}

export interface RawPokemonData {
  id: number
  name: string
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  types: Array< {
    type: {
      name: PokeType
      url: string
    }
  }>
  sprites: {
    front_default: string | null
    back_default: string | null
    front_shiny: string | null
    back_shiny: string | null
    other: {
      'official-artwork': {
        front_default: string | null
        front_shiny: string | null
      }
    }
  }
  abilities: Array<{
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
  }>
}
