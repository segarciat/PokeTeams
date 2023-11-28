import { fetchPokedexPage } from '@/app/lib/data'
import { type ReactElement } from 'react'
import PokemonCard from './pokemon-card'

const RESULTS_PER_PAGE = 20

interface SearchResultsProps {
  resultUrls: string[]
  page: number
}
export default async function SearchResults ({ resultUrls, page }: SearchResultsProps): Promise<ReactElement> {
  const pokemons = await fetchPokedexPage(resultUrls, page, RESULTS_PER_PAGE)
  return <section aria-label="Search results" className='flex flex-col items-center'>
    <ol className='flex flex-col gap-3'>
      {pokemons.map(p => (
        <li key={p.name}>
          <PokemonCard pokemon={p} />
        </li>
      ))}
    </ol>
  </ section>
}
