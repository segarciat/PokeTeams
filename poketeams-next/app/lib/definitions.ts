export type PokeType = 'normal' | 'fighting' | 'flying' | 'poison' | 'ground' | 'rock' | 'bug' | 'ghost' | 'steel' |
'fire' | 'water' | 'grass' | 'electric' | 'psychic' | 'ice' | 'dragon' | 'dark' | 'fairy'

export interface Pokemon {
  name: string
  types: PokeType[]
  gameIndex: number
  abilities: string[]
  spriteSrcs: {
    frontDefault: string
    backDefault: string
    frontShiny: string
    backShiny: string
  }
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
}
