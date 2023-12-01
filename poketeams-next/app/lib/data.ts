import { type Pokemon, type RawPokemonData } from './definitions'
import { getArrayPage } from './utils'
import toCamelCase from 'lodash.camelcase'

const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2'
const POKEMON_URL = POKE_API_BASE_URL + '/pokemon'

/**
 * Fetch list of all Pokemon names.
 * @returns Array of Pokemon names.
 */
export async function fetchAllPokemonNames (): Promise<string[]> {
  try {
    // See: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-server-with-fetch
    let result = await fetch(POKEMON_URL, { cache: 'force-cache' })
    const { count } = await result.json()

    result = await fetch(`${POKEMON_URL}/?limit=${count}`, { cache: 'force-cache' })
    const data = await result.json()
    return data.results.map(({ name }: { name: string }) => (name))
  } catch (error) {
    throw new Error(`Failed to fetch list of all Pokemon: ${(error as Error).message}.`)
  }
}

/**
 * Fetches for all Pokemon on the indicated @param page.
 * @param pokemonIds Array of Pokemon IDs.
 * @param page Desired page from given URLs.
 * @param pageSize Number of results per page.
 * @returns Array of at most @param pageSize Pokemon from the given page.
 */
export async function fetchPokedexPage (pokemonIds: Array<string | number>, page: number, pageSize: number): Promise<Pokemon[]> {
  const pageUrls = getArrayPage(pokemonIds, page, pageSize)
  try {
    return await Promise.all(pageUrls.map(fetchPokemon))
  } catch (error) {
    throw new Error('Failed to fetch details for some Pokemon in given page.')
  }
}

/**
 * Fetch Pokemon data for Pokemon with name or id @param id
 * @param id Name or id of Pokemon of interest
 * @returns Pokemon matching the given id.
 */
export async function fetchPokemon (id: string | number): Promise<Pokemon> {
  try {
    const res = await fetch(`${POKEMON_URL}/${id}`)
    const data = await res.json()
    return flattenRawPokeData(data)
  } catch (error) {
    throw new Error(`Failed to fetch pokemon data for ${id}: ${(error as Error).message}`)
  }
}

/**
 * Flattens the Pokemon data received from PokeAPI's /pokemon endpoint into new array.
 * @param rawData Parsed JSON from external endpoint.
 */
function flattenRawPokeData (rawData: RawPokemonData): Pokemon {
  const stats = rawData.stats.reduce((acc: Record<string, number>, s) => {
    acc[toCamelCase(s.stat.name)] = s.base_stat
    return acc
  }, {}) as Pokemon['stats']
  const abilities = rawData.abilities.map((a) =>
    ({ name: a.ability.name, isHidden: a.is_hidden, url: a.ability.url })
  )
  const types = rawData.types.map(({ type: { name, url } }) => ({ name, url }))

  return {
    stats,
    abilities,
    types,
    name: rawData.name,
    id: rawData.id,
    spriteSrcs: {
      frontDefault: rawData.sprites.front_default ?? rawData.sprites.other['official-artwork'].front_default,
      backDefault: rawData.sprites.back_default,
      frontShiny: rawData.sprites.front_shiny ?? rawData.sprites.other['official-artwork'].front_shiny,
      backShiny: rawData.sprites.back_shiny
    }
  }
}
