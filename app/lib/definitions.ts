export type PokeType = 'normal' | 'fighting' | 'flying' | 'poison' | 'ground' | 'rock' | 'bug' | 'ghost' | 'steel' |
'fire' | 'water' | 'grass' | 'electric' | 'psychic' | 'ice' | 'dragon' | 'dark' | 'fairy'

export type PokeStat = 'hp' | 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed'

export interface PokemonSummary {
  name: string
  id: number
  types: Array<{
    name: PokeType
    url: string
  }>
  spriteSrcs: {
    frontDefault: string | null
    backDefault: string | null
    frontShiny: string | null
    backShiny: string | null
  }
}

export interface Pokemon extends PokemonSummary {
  abilities: Array<{
    name: string
    isHidden: boolean
    url: string
  }>
  stats: Record<PokeStat, number>
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

export type URLPageParam = string | string[] | undefined

export interface PokeSearchParamAction {
  action: 'CLEAR_QUERY' | 'SUBMIT_QUERY' | 'NEW_PAGE'
  page?: number
  query?: string
}
