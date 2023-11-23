import { type Pokemon } from './definitions'

const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2'

const POKEMON_URL = POKE_API_BASE_URL + '/pokemon'

export async function fetchPokemonDetails (gameIndex: number): Promise<Pokemon> {
  const result = await fetch(`${POKEMON_URL}/${gameIndex}`)
  const data = await result.json()

  const stats = data.stats.reduce((acc: any, s: any) => {
    acc[s.stat.name] = s.base_stat
    return acc
  }, {})

  return {
    gameIndex,
    stats,
    name: data.name,
    types: data.types.map(({ type }: any) => type.name),
    abilities: data.abilities.map(({ ability }: any) => ability.name),
    spriteSrcs: {
      frontDefault: data.sprites.front_default,
      backDefault: data.sprites.back_default,
      frontShiny: data.sprites.front_shiny,
      backShiny: data.sprites.back_shiny
    }
  }
}
