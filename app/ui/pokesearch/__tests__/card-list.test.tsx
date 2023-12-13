import { afterAll, afterEach, beforeAll, describe, it } from 'vitest'
import { render } from '@testing-library/react'
import { server } from '@/mocks/server'
import { type PokemonSummary } from '@/app/lib/definitions'

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let CardList: typeof import('../card-list').default

beforeAll(async () => {
  CardList = (await import('../card-list')).default
})

describe('card list', () => {
  it('should display list of pokemons', async () => {
    const match: PokemonSummary = {
      name: 'bulbasaur',
      id: 1,
      types: [{ name: 'grass', url: 'http://grass.com' }],
      spriteSrcs: {
        backDefault: '/back.png',
        frontDefault: '/front.png',
        frontShiny: '/frontshiny.png',
        backShiny: '/backshiny.png'
      }
    }
    render(await CardList({ matches: [match], page: 1, max: 1 }))
  })
})
