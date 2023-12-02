import { type RawPokemonData } from '@/app/lib/definitions'
import fs from 'fs'
import path from 'path'

const testFile = path.join(__dirname, 'pokemons-raw.test.json')
export const testPokemonData: RawPokemonData[] = JSON.parse(fs.readFileSync(testFile, 'utf-8'))
