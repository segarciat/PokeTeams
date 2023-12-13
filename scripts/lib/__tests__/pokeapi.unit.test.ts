import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { mockError, server } from '@/mocks/server'
import { type Pokemon } from '@/app/lib/definitions'

let pokemons: Pokemon[]

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let pokeapiModule: typeof import('../pokeapi')

beforeAll(async () => {
  // See: https://stackoverflow.com/a/71044616
  pokeapiModule = await import('../pokeapi')
  const testFile = path.join(__dirname, 'pokemons-parsed.test.json')
  const expectedParsedPokemons = fs.readFileSync(testFile, 'utf-8')
  pokemons = JSON.parse(expectedParsedPokemons)
  server.listen()
})

afterEach(() => {
  // vi.restoreAllMocks()
  // vi.clearAllMocks()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

describe('Fetch Pokemon data', () => {
  it('should throw an exception when fetch fails', async () => {
    // Arrange
    const inputName = 'pokemon-name'
    const pokemonNames = pokemons.map(({ name }) => name)

    // Act && Assert
    expect(pokemonNames).not.toContain(inputName)
    await expect(pokeapiModule.fetchPokemon(inputName)).rejects.toBeTruthy()
  })

  it('corrrectly transforms raw data', async () => {
    // Arrange
    const parsedPokemon = pokemons[0]

    // Act
    const resultUsingName = pokeapiModule.fetchPokemon(parsedPokemon.name)
    const resultUsingId = pokeapiModule.fetchPokemon(parsedPokemon.id)

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
    await expect(pokeapiModule.fetchAllPokemonNames()).rejects.toBeTruthy()
  })

  it('should return list of names and urls', async () => {
    const pokemonNames = pokemons.map(({ name }) => name)
    // Act & Assert
    await expect(pokeapiModule.fetchAllPokemonNames()).resolves.toEqual(pokemonNames)
  })
})
