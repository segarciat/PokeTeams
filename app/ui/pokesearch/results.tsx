'use client'
import { useContext, type ReactElement } from 'react'
import NoResults from './no-results'
import Pagination from './pagination'
import { type PokemonSummary } from '@/app/lib/definitions'
import { filterByName, filterByType, getArrayPage, getTotalPageCount } from '@/app/lib/utils'
import { notFound } from 'next/navigation'
import Card from './pokemon/card'
import { type PokeType } from '@/app/lib/constants'
import PokeSearchParamsContext from '@/app/context/poke-search-params'

export const RESULTS_PER_PAGE = 20

export interface ResultsProps {
  allPokemon: PokemonSummary[]
}

export default function Results ({ allPokemon }: ResultsProps): ReactElement {
  const { query, page, types, dispatch } = useContext(PokeSearchParamsContext)

  const matches = applyFilters(allPokemon, query, types)
  const totalPages = getTotalPageCount(matches.length, RESULTS_PER_PAGE)

  if (matches.length !== 0 && page > totalPages) {
    notFound() // or setPage to 1?
  }
  const pokemons = getArrayPage(matches, page, RESULTS_PER_PAGE)

  function handleNewPage (page: number): void {
    dispatch?.('NEW_PAGE', { page })
  }

  return (
    <div className='flex flex-col items-center gap-3'>
      {matches.length === 0
        ? <NoResults />
        : (
          <>
            <ol aria-label='pokemonCards' className='flex flex-col gap-3'>
              {pokemons.map(p => (<li key={p.name}><Card pokemon={p} /></li>))}
            </ol>
            {totalPages > 1 && (<Pagination totalPages={totalPages} page={page} onNewPage={handleNewPage} />)}
          </>
          )}
    </div>
  )
}

function applyFilters (allPokemon: PokemonSummary[], query: string, types: Set<PokeType>): PokemonSummary[] {
  let matches = allPokemon
  if (query.length > 0) {
    matches = filterByName(matches, query)
  }
  if (types.size > 0) {
    matches = filterByType(matches, types)
  }
  return matches
}
