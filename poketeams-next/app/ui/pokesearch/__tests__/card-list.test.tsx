import { afterAll, afterEach, beforeAll, describe, it } from 'vitest'
import { render } from '@testing-library/react'
import { server } from '@/mocks/server'

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
    // mockFetchPokedexPage.mockResolvedValue([mockPokemon])
    render(await CardList({ matches: ['bulbasaur'], page: 1, max: 1 }))
  })
})
