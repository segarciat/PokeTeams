import { type PokemonURL } from './definitions'
import { capitalize, filterByName } from './utils'
import { describe, it, expect } from '@jest/globals'

describe('Capitalize', () => {
  it('should lowercase word', () => {
    expect(capitalize('word')).toEqual('Word')
    expect(capitalize('WORD')).toEqual('Word')
    expect(capitalize('wORd')).toEqual('Word')
    expect(capitalize('')).toEqual('')
    expect(capitalize('w')).toEqual('W')
    expect(capitalize('ho-oh')).toEqual('Ho-Oh')
  })
})

describe('Filter Pokemons', () => {
  // Arrange
  const pokemonURLs = [
    { name: 'butterfree' },
    { name: 'squirtle' },
    { name: 'electrabuzz' }
  ] as PokemonURL[]

  it('should match pokemon with names containing the query', () => {
    // Arrange
    const query = 'bu'

    // Act
    const result = filterByName(pokemonURLs, query)

    // Assert
    expect(result).toEqual([
      { name: 'butterfree' },
      { name: 'electrabuzz' }
    ])
  })

  it('should be case insensitive', () => {
    // Arrange
    const query = 'bU'

    // Act
    const result = filterByName(pokemonURLs, query)

    // Assert
    expect(result).toEqual([
      { name: 'butterfree' },
      { name: 'electrabuzz' }
    ])
  })

  it('should be empty when no matches exist', () => {
    // Arrange
    const query = 'foo'

    // Act
    const result = filterByName(pokemonURLs, query)

    // Assert
    expect(result).toHaveLength(0)
  })
})
