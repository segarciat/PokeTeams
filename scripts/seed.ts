import { type Db } from 'mongodb'
import clientPromise from '../app/lib/db.js'
import { fetchAllPokemonNames, fetchPokemon } from './lib/pokeapi.js'

async function seedPokemons (db: Db): Promise<void> {
  const collection = db.collection('pokemon')
  const pokemonNames = await fetchAllPokemonNames()
  for (const name of pokemonNames) {
    try {
      const pokemonFromDB = await collection.findOne({
        name
      })
      if (pokemonFromDB === null) {
        console.log(`Did not have ${name} in database. Fetching and saving to DB.`)
        const pokemon = await fetchPokemon(name)
        await collection.insertOne(pokemon)
      }
    } catch (error) {
      console.error(`Failed to insert data for ${name} due to ${(error as any).message}`)
    }
  }
}

async function run (): Promise<void> {
  const client = await clientPromise
  try {
    console.log('Seeding data...')
    const db = client.db('poketeams')
    await seedPokemons(db)
  } finally {
    await client.close()
  }
}
run().catch(console.dir)
