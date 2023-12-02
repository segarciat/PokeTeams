/**
 * @jest-environment node
 */

// Line above is required to enable 'fetch', since jest.config.mjs sets 'jest-environment-jsdom'
import { describe, it, expect, jest, beforeAll, afterEach, afterAll } from '@jest/globals'
import { mockError, server } from '@/mocks/server'
import { type Pokemon } from '../definitions'
import fs from 'fs'
import path from 'path'

jest.mock('../utils', () => ({
  getArrayPage: jest.fn()
}))

let pokemons: Pokemon[]
let pokemonNames: string[]

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let dataModule: typeof import('../data')
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let utilsModule: typeof import('../utils')

beforeAll(async () => {
  // See: https://stackoverflow.com/a/71044616
  dataModule = await import('../data')
  utilsModule = await import('../utils')
  const testFile = path.join(__dirname, 'pokemons-parsed.test.json')
  const expectedParsedPokemons = fs.readFileSync(testFile, 'utf-8')
  pokemons = JSON.parse(expectedParsedPokemons)
  pokemonNames = pokemons.map(({ name }) => name)
  server.listen()
})

afterEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

describe('Fetch Pokemon data', () => {
  it('should throw an exception when fetch fails', async () => {
    // Arrange
    const inputName = 'pokemon-name'

    // Act && Assert
    expect(pokemonNames).not.toContain(inputName)
    await expect(dataModule.fetchPokemon(inputName)).rejects.toBeTruthy()
  })

  it('corrrectly transforms raw data', async () => {
    // Arrange
    const parsedPokemon = pokemons[0]

    // Act
    const resultUsingName = dataModule.fetchPokemon(parsedPokemon.name)
    const resultUsingId = dataModule.fetchPokemon(parsedPokemon.id)

    // Assert
    await expect(resultUsingName).resolves.toEqual(parsedPokemon)
    await expect(resultUsingId).resolves.toEqual(parsedPokemon)
  })
})

describe('Fetch all Pokemon names', () => {
  it('should throw an error on fetch rejection', async () => {
    // Arrange
    server.use(mockError)

    // Act && Assert
    await expect(dataModule.fetchAllPokemonNames()).rejects.toBeTruthy()
  })

  it('should return list of names and urls', async () => {
    const pokemonNames = pokemons.map(({ name }) => name)
    // Act & Assert
    await expect(dataModule.fetchAllPokemonNames()).resolves.toEqual(pokemonNames)
  })
})

describe('Fetch Pokedex page', () => {
  it('should throw if fails to fetch details for any one of the Pokemon', async () => {
    // Setup
    server.use(mockError)
    const fakeName = 'fake-name'
    const desiredPokemonNames = [pokemonNames[0], fakeName]
    const result = dataModule.fetchPokedexPage(desiredPokemonNames, Math.random(), Math.random())
    await expect(result).rejects.toBeTruthy()
  })

  it('should fetch all Pokemon in the given page', async () => {
    // Arrange
    const expected = pokemons.slice(1)
    const expectedNames = pokemonNames.slice(1)
    const spyGetArrayPage = jest.spyOn(utilsModule, 'getArrayPage')
      .mockImplementation((array, page, pageSize) => expectedNames)

    // Act
    const result = dataModule.fetchPokedexPage(expectedNames, Math.random(), Math.random())

    // Assert
    expect(spyGetArrayPage).toHaveBeenCalledTimes(1)
    expect(jest.isMockFunction(spyGetArrayPage)).toBeTruthy()
    await expect(result).resolves.toEqual(expected)
  })
})
