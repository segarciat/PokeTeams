import { type Pokemon } from '@/app/lib/definitions'
import { beforeAll, describe, it, jest } from '@jest/globals'
import { render } from '@testing-library/react'

const mockPokemon: Pokemon = {
  stats: {
    hp: 45,
    attack: 49,
    defense: 49,
    specialAttack: 65,
    specialDefense: 65,
    speed: 45
  },
  abilities: [
    {
      name: 'overgrow',
      isHidden: false,
      url: 'https://pokeapi.co/api/v2/ability/65/'
    },
    {
      name: 'chlorophyll',
      isHidden: true,
      url: 'https://pokeapi.co/api/v2/ability/34/'
    }
  ],
  types: [
    {
      name: 'grass',
      url: 'https://pokeapi.co/api/v2/type/12/'
    },
    {
      name: 'poison',
      url: 'https://pokeapi.co/api/v2/type/4/'
    }
  ],
  name: 'bulbasaur',
  id: 1,
  spriteSrcs: {
    frontDefault: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    backDefault: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    frontShiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png',
    backShiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png'
  }
}

const mockFetchPokedexPage: jest.Mock<any> = jest.fn()

jest.mock('../../../lib/data', () => ({
  fetchPokedexPage: mockFetchPokedexPage
}))

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let CardList: typeof import('../card-list').default

beforeAll(async () => {
  CardList = (await import('../card-list')).default
})

describe('card list', () => {
  it('should display list of pokemons', async () => {
    mockFetchPokedexPage.mockResolvedValue([mockPokemon])
    render(await CardList({ matches: [''], page: 1, max: 1 }))
  })
})
