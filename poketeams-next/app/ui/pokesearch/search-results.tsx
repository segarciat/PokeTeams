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
  return <>
    {pokemons.map(pokemon => <PokemonCard key={pokemon.name} pokemon={pokemon}/>)}
  </>
}
