import { POKEMON_URL } from '@/app/lib/constants'
import { http, HttpResponse } from 'msw'
import { testPokemonData } from './data'
import { type RawPokemonData } from '@/app/lib/definitions'

const allPokemonNames = testPokemonData.map(({ name }) => ({ name }))

const allPokemonDetails = testPokemonData.reduce((map, pokemon) => {
  map.set(pokemon.name, pokemon)
  map.set(pokemon.id.toString(), pokemon)
  return map
}, new Map<string, RawPokemonData>())

export const handlers = [
  http.get(POKEMON_URL, ({ request }) => {
    const url = new URL(request.url)
    const count = Number(url.searchParams.get('limit') ?? 1)
    const results = allPokemonNames.slice(0, count)
    return HttpResponse.json({
      count: allPokemonNames.length,
      results
    })
  }),
  http.get(`${POKEMON_URL}/:id`, ({ params }) => {
    const { id } = params
    if (Array.isArray(id)) { // bad request
      return HttpResponse.json(null, { status: 400 })
    } else if (!allPokemonDetails.has(id as string)) {
      return HttpResponse.json(null, { status: 404 })
    } else {
      return HttpResponse.json(allPokemonDetails.get(id as string))
    }
  })
]
