import { type PokemonURL } from './definitions'
import { capitalize, filterPokemons } from './utils'

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
    const result = filterPokemons(pokemonURLs, query)

    // Assert
    expect(result).toHaveLength(2)
    expect(result).toMatchObject([
      { name: 'butterfree' },
      { name: 'electrabuzz' }
    ])
  })

  it('should be case insensitive', () => {
    // Arrange
    const query = 'bU'

    // Act
    const result = filterPokemons(pokemonURLs, query)

    // Assert
    expect(result).toHaveLength(2)
    expect(result).toMatchObject([
      { name: 'butterfree' },
      { name: 'electrabuzz' }
    ])
  })

  it('should be empty when no matches exist', () => {
    // Arrange
    const query = 'foo'

    // Act
    const result = filterPokemons(pokemonURLs, query)

    // Assert
    expect(result).toHaveLength(0)
  })
})
