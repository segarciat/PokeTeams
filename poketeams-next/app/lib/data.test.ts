import { describe, it, expect, jest, beforeAll, beforeEach } from '@jest/globals'
import { type Pokemon, type RawPokemonData } from './definitions'
import fs from 'fs'
import path from 'path'

jest.mock('./utils', () => ({
  getArrayPage: jest.fn()
}))

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let dataModule: typeof import('./data')
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let utilsModule: typeof import('./utils')

interface TestPokemonData {
  name: string
  rawData: RawPokemonData
  parsedPokemon: Pokemon
}

let testPokemonData: TestPokemonData[]

beforeAll(async () => {
  // See: https://stackoverflow.com/a/71044616
  dataModule = await import('./data')
  utilsModule = await import('./utils')
  const testFile = path.join(__dirname, 'pokemons.test.json')
  testPokemonData = JSON.parse(fs.readFileSync(testFile, 'utf-8'))
})

afterEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('Fetch Pokemon data', () => {
  it('should throw an exception when fetch fails', async () => {
    // Arrange
    const inputName = 'pokemon-name'
    const mockFetch = jest.fn(
      async (id) => await Promise.reject(new Error('some error'))
    )
    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(mockFetch)

    // Act && Assert
    await expect(dataModule.fetchPokemon(inputName)).rejects.toBeTruthy()
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.calls[0][0]).toMatch(inputName)
  })

  it('corrrectly transforms raw data', async () => {
    // Arrange
    const { name, rawData, parsedPokemon } = testPokemonData[0]
    const mockFetch = jest.fn(
      async (id) => await Promise.resolve({
        json: async () => await Promise.resolve(rawData)
      }) as any
    )
    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(mockFetch) as jest.Mock

    // Act
    const result = dataModule.fetchPokemon(name)

    // Assert
    await expect(result).resolves.toEqual(parsedPokemon)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.calls[0][0]).toMatch(name)
  })
})

describe('Fetch all Pokemon names', () => {
  it('should throw an error on fetch rejection', async () => {
    // Arrange
    const mockFetchCall = jest.fn(
      async () => await Promise.reject(new Error('some error'))
    )

    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(mockFetchCall) as jest.Mock

    // Act && Assert
    await expect(dataModule.fetchAllPokemonNames()).rejects.toBeTruthy()
  })

  it('should return list of names and urls', async () => {
    // Arrange
    const mockFirstFetchCall = jest.fn(
      async () => await Promise.resolve({
        json: async () => await Promise.resolve({ count: 3 })
      }) as any
    )
    const mockSecondFetchCall = jest.fn(
      async () => await Promise.resolve({
        json: async () => await Promise.resolve({
          results: [
            { name: 'first', url: '1.com' },
            { name: 'second', url: '2.com' },
            { name: 'third', url: '3.com' }
          ]
        })
      }) as any
    )

    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(mockFirstFetchCall)
      .mockImplementationOnce(mockSecondFetchCall) as jest.Mock

    // Act & Assert
    await expect(dataModule.fetchAllPokemonNames()).resolves.toEqual(
      ['first', 'second', 'third']
    )
  })
})

describe('Fetch Pokedex page', () => {
  let pokemonIds: string[]
  let spyGetArrayPage: any
  beforeEach(() => {
    pokemonIds = testPokemonData.map(({ name }) => name)
    spyGetArrayPage = jest.spyOn(utilsModule, 'getArrayPage')
      .mockImplementation((array, page, pageSize) => array)
  })

  it('should throw if fails to fetch details for any one of the Pokemon', async () => {
    const mockSuccessFetch = jest.fn(
      async () => await Promise.resolve({
        json: async () => await Promise.resolve(testPokemonData[0].rawData)
      }) as any
    )
    const mockFailedFetch = jest.fn(
      async () => await Promise.reject(new Error('some error'))
    )

    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(mockSuccessFetch)
      .mockImplementationOnce(mockFailedFetch)

    const result = dataModule.fetchPokedexPage(['bulbasaur', 'charmander'], Math.random(), Math.random())

    expect(mockSuccessFetch).toHaveBeenCalledTimes(1)
    expect(mockFailedFetch).toHaveBeenCalledTimes(1)
    await expect(result).rejects.toBeTruthy()
  })

  it('should fetch all Pokemon in the given page', async () => {
    // Arrange
    const nameToRaw = testPokemonData.reduce<Record<string, RawPokemonData>>((acc, { name, rawData }) =>
      ({ ...acc, [name]: rawData }),
    {})
    const allPokemons = testPokemonData.map(({ parsedPokemon }) => parsedPokemon)

    const mockFetch = jest.fn(
      async (arg: string) => await Promise.resolve({
        json: async () => {
          const id = pokemonIds.find(id => arg.includes(id)) as string
          return await Promise.resolve(nameToRaw[id])
        }
      })
    ) as any

    jest.spyOn(global, 'fetch')
      .mockImplementation(mockFetch)

    // Act
    const result = dataModule.fetchPokedexPage(pokemonIds, Math.random(), Math.random())

    // Assert
    expect(spyGetArrayPage).toHaveBeenCalledTimes(1)
    expect(true).toBeTruthy()
    expect(jest.isMockFunction(spyGetArrayPage)).toBeTruthy()
    expect(mockFetch).toHaveBeenCalledTimes(pokemonIds.length)
    await expect(result).resolves.toEqual(allPokemons)
  })
})
