import { type PokemonURL, type Pokemon, type RawPokemonData } from './definitions'
import { capitalize } from './utils'
import toCamelCase from 'lodash.camelcase'

const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2'
const POKEMON_URL = POKE_API_BASE_URL + '/pokemon'
const POKEMONS_PER_PAGE = 20

/**
 * Fetch list of all Pokemon names and their resource URLs.
 * @returns Array of Pokemon names and their resource URLs, ordered by ID.
 */
export async function fetchAllPokemon (): Promise<PokemonURL[]> {
  // See: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-server-with-fetch
  let result = await fetch(POKEMON_URL, { cache: 'force-cache' })
  const { count } = await result.json()

  result = await fetch(`${POKEMON_URL}/?limit=${count}`, { cache: 'force-cache' })
  const data = await result.json()
  return data.results.map((p: PokemonURL) => ({ ...p, name: capitalize(p.name) }))
}

/**
 * Fetches Pokemon details for all Pokemon on the indicated @param page.
 * @param results List of Pokemon URLs.
 * @param page Desired page from given URLs.
 * @param resultsPerPage Number of results per page, defaults to @constant POKEMONS_PER_PAGE
 * @returns List of details for all Pokemon in desired page.
 */
export async function fetchPokedexPage (results: PokemonURL[], page: number, resultsPerPage = POKEMONS_PER_PAGE): Promise<Pokemon[]> {
  resultsPerPage = resultsPerPage <= 0 ? POKEMONS_PER_PAGE : resultsPerPage
  const offset = resultsPerPage * (page - 1)
  const details = await Promise.all(results
    .slice(offset, offset + resultsPerPage)
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    .map(({ url }) => fetch(url).then(data => data.json()))
  )
  return details.map(flattenPokemonData)
}

/**
 * Flattens the Pokemon data received from PokeAPI's /pokemon endpoint into new array.
 * @param data Parsed JSON from external endpoint.
 */
function flattenPokemonData (data: RawPokemonData): Pokemon {
  const stats = data.stats.reduce((acc: Record<string, number>, s) => {
    acc[toCamelCase(s.stat.name)] = s.base_stat
    return acc
  }, {}) as Pokemon['stats']
  const abilities = data.abilities.map((a) =>
    ({ name: a.ability.name, isHidden: a.is_hidden, url: a.ability.url })
  )
  const types = data.types.map(({ type: { name, url } }) => ({ name, url }))

  return {
    stats,
    abilities,
    types,
    name: data.name,
    id: data.id,
    spriteSrcs: {
      frontDefault: data.sprites.front_default ?? data.sprites.other['official-artwork'].front_default,
      backDefault: data.sprites.back_default,
      frontShiny: data.sprites.front_shiny ?? data.sprites.other['official-artwork'].front_default,
      backShiny: data.sprites.back_shiny
    }
  }
}
