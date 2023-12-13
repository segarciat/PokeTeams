import clientPromise from '../../db'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { POKEMON_COLLECTION, POKETEAMS_DB, fetchAllPokemon, fetchPokemon } from '../pokemon'
import { type MongoClient } from 'mongodb'
import { type Pokemon } from '../../definitions'

let client: MongoClient

beforeAll(async () => {
  client = await clientPromise
  // Seed database with some information.
  const { bulbasaur, charmander } = getTestData()
  await client
    .db(POKETEAMS_DB)
    .collection(POKEMON_COLLECTION)
    .insertMany([bulbasaur, charmander])
})

afterAll(async () => {
  const { bulbasaur, charmander } = getTestData()
  await client
    .db(POKETEAMS_DB)
    .collection(POKEMON_COLLECTION)
    .deleteMany({ $or: [{ id: bulbasaur.id }, { id: charmander.id }] })
  await client.close()
})

describe('fetch Pokemon summary', () => {
  const { bulbasaur, charmander } = getTestData()
  it('should give an array of all Pokemon in database', async () => {
    const allPokemon = await fetchAllPokemon()

    expect(allPokemon.length).toEqual(2)
    expect(allPokemon[0]).toEqual({
      name: bulbasaur.name,
      id: bulbasaur.id,
      types: bulbasaur.types,
      spriteSrcs: bulbasaur.spriteSrcs
    })
  })

  it('should return pokemon by ID or name', async () => {
    const bulbaByName = await fetchPokemon(bulbasaur.name)
    const bulbaById = await fetchPokemon(bulbasaur.id)
    const charByName = await fetchPokemon(charmander.name)
    const charById = await fetchPokemon(charmander.id)

    expect(bulbaByName).toEqual(bulbasaur)
    expect(bulbaById).toEqual(bulbasaur)
    expect(charByName).toEqual(charmander)
    expect(charById).toEqual(charmander)
  })

  it('should throw when a Pokemon match is not found', async () => {
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    await expect(() => fetchPokemon('fake')).rejects.not.toBeNull()
  })
})

function getTestData (): Record<'bulbasaur' | 'charmander', Pokemon> {
  return {
    bulbasaur: {
      name: 'bulbasaur',
      id: 1,
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
      spriteSrcs: {
        frontDefault: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        backDefault: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
        frontShiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png',
        backShiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png'
      }
    },
    charmander: {
      stats: {
        hp: 39,
        attack: 52,
        defense: 43,
        specialAttack: 60,
        specialDefense: 50,
        speed: 65
      },
      abilities: [
        {
          name: 'blaze',
          isHidden: false,
          url: 'https://pokeapi.co/api/v2/ability/66/'
        },
        {
          name: 'solar-power',
          isHidden: true,
          url: 'https://pokeapi.co/api/v2/ability/94/'
        }
      ],
      types: [
        {
          name: 'fire',
          url: 'https://pokeapi.co/api/v2/type/10/'
        }
      ],
      name: 'charmander',
      id: 4,
      spriteSrcs: {
        frontDefault: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        backDefault: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png',
        frontShiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/4.png',
        backShiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/4.png'
      }
    }
  }
}
