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
    frontDefault: string
    backDefault: string
    frontShiny: string
    backShiny: string
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
    front_default: string
    back_default: string
    front_shiny: string
    back_shiny: string
  }
  abilities: Array<{
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
  }>
}
