// import 'server-only'
import { type ObjectId } from 'mongodb'
import clientPromise from '../db'
import { type PokemonSummary, type Pokemon } from '../definitions'

const POKETEAMS_DB = 'poketeams'
const POKEMON_COLLECTION = 'pokemon'

interface PokemonModel extends Pokemon {
  _id?: ObjectId
}

/**
 * Fetch list of all Pokemon names.
 * @returns Array of Pokemon names.
 */
export async function fetchAllPokemonNames (): Promise<PokemonSummary[]> {
  const client = await clientPromise

  const result: PokemonModel[] = await client
    .db(POKETEAMS_DB)
    .collection<PokemonModel>(POKEMON_COLLECTION)
    .find({}, {
      sort: { id: 1 }, // Sort by id (pay attention, not _id), ascending
      projection: { _id: 0, name: 1, id: 1, types: 1, spriteSrcs: 1 }
    })
    .toArray()
  return result
}

/**
 * Fetch Pokemon data for Pokemon with name or id @param id
 * @param id Name or pokedex id of Pokemon.
 * @returns Pokemon matching the given id.
 */
export async function fetchPokemon (id: string | number): Promise<Pokemon> {
  try {
    const client = await clientPromise
    const pokemon: PokemonModel | null = await client
      .db(POKETEAMS_DB)
      .collection<PokemonModel>(POKEMON_COLLECTION)
      .findOne({
        $or: [{ name: id as string }, { id: id as number }]
      })
    if (pokemon === null) {
      throw new Error('No Pokemon found with name or id ' + id.toString())
    }
    delete pokemon._id
    return pokemon
  } catch (error) {
    throw new Error('Unable to get data for the Pokemon: ' + (error as any).message)
  }
}
