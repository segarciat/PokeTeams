'use client'
import { useContext, type ReactElement } from 'react'
import NoResults from './no-results'
import Pagination from './pagination'
import { type PokemonSummary } from '@/app/lib/definitions'
import { filterByName, filterByType, getArrayPage, getTotalPageCount } from '@/app/lib/utils'
import PageParamContext from '@/app/context/page-param'
import { notFound } from 'next/navigation'
import TypesParamContext from '@/app/context/poke-types-param'
import QueryParamContext from '@/app/context/query-param'
import Card from './pokemon/card'
import { type PokeType } from '@/app/lib/constants'

export const RESULTS_PER_PAGE = 20

export interface ResultsProps {
  allPokemon: PokemonSummary[]
}

export default function Results ({ allPokemon }: ResultsProps): ReactElement {
  const { query } = useContext(QueryParamContext)
  const { page, setPage } = useContext(PageParamContext)
  const { types } = useContext(TypesParamContext)

  const matches = applyFilters(allPokemon, query, types)
  const totalPages = getTotalPageCount(matches.length, RESULTS_PER_PAGE)

  if (matches.length !== 0 && page > totalPages) {
    notFound() // or setPage to 1?
  }
  const pokemons = getArrayPage(matches, page, RESULTS_PER_PAGE)

  return (
    <div className='flex flex-col items-center gap-3'>
      {matches.length === 0
        ? <NoResults />
        : (
          <>
            <ol aria-label='pokemonCards' className='flex flex-col gap-3'>
              {pokemons.map(p => (<li key={p.name}><Card pokemon={p} /></li>))}
            </ol>
            {totalPages > 1 && (<Pagination totalPages={totalPages} page={page} onNewPage={setPage} />)}
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
