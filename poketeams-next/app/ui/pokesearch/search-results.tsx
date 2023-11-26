import { fetchPokedexPage } from '@/app/lib/data'
import { type ReactElement } from 'react'
import PokemonCard from './pokemon-card'
import { type PokemonURL } from '@/app/lib/definitions'

interface SearchResultsProps {
  results: PokemonURL[]
  currentPage: number
}
export default async function SearchResults ({ results, currentPage }: SearchResultsProps): Promise<ReactElement> {
  const pokemons = await fetchPokedexPage(results, currentPage)
  return <section aria-label="Search results" className='flex flex-col items-center'>
    <ol>
      {pokemons.map(pokemon => (
        <li key={pokemon.name}>
          <PokemonCard pokemon={pokemon} />
        </li>
      ))}
    </ol>
  </ section>
}
