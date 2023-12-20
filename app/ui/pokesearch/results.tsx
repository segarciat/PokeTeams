'use client'
import { useContext, type ReactElement } from 'react'
import NoResults from './no-results'
import CardList from './card-list'
import Pagination from './pagination'
import { type PokemonSummary } from '@/app/lib/definitions'
import { filterByName, filterByType, getTotalPageCount } from '@/app/lib/utils'
import { POKE_TYPE_BG_CLASS, type PokeType } from '@/app/lib/constants'
import { XMarkIcon } from '@heroicons/react/24/outline'
import PokeTypeTag from '../poke-type-tags'
import PageParamContext from '@/app/context/page-param'
import { notFound } from 'next/navigation'
import TypesParamContext from '@/app/context/poke-types-param'
import QueryParamContext from '@/app/context/query-param'

export const RESULTS_PER_PAGE = 20

export interface ResultsProps {
  allPokemon: PokemonSummary[]
}

export default function Results ({ allPokemon }: ResultsProps): ReactElement {
  const { query } = useContext(QueryParamContext)
  const { page, setPage } = useContext(PageParamContext)
  const { types, setTypes } = useContext(TypesParamContext)

  let matches = allPokemon
  if (query.length > 0) {
    matches = filterByName(matches, query)
  }
  if (types.size > 0) {
    matches = filterByType(matches, types)
  }
  const totalPages = getTotalPageCount(matches.length, RESULTS_PER_PAGE)

  if (matches.length !== 0 && page > totalPages) {
    notFound() // or setPage to 1?
  }

  function handleTypeClick (type: PokeType): void {
    const newFilters = new Set(types)
    newFilters.delete(type)
    setTypes(newFilters)
  }

  return (
    <section aria-label="Search results" className='my-4'>
      <h3 className='my-4 text-2xl font-bold'>Results</h3>
      <ul aria-label='activeFilters' className='flex flex-row flex-wrap gap-2 items-center my-2'>
        {types.size > 0 && <ActiveTypeFilters filters={types} onTypeClick={handleTypeClick}/>}
      </ul>
      <div className='flex flex-col items-center gap-3'>
        {matches.length === 0
          ? <NoResults />
          : (
            <>
              <CardList key={page + query} matches={matches} page={page} max={RESULTS_PER_PAGE} />
              {totalPages > 1 && page <= totalPages && (
                <Pagination totalPages={totalPages} page={page} onNewPage={setPage} />
              )}
            </>
            )}
      </div>
    </section>
  )
}

function ActiveTypeFilters ({ filters, onTypeClick }: { filters: Set<PokeType>, onTypeClick: (type: PokeType) => void }): ReactElement {
  return (
    <>
      {
        Array.from(filters).map(type => (
          <button key={type} onClick={onTypeClick.bind(null, type)} type='button'
            className={`px-4 py-2 ${POKE_TYPE_BG_CLASS[type]} rounded-full text-white flex flex-row items-center
            justify-center gap-2 text-sm`}
          >
            <PokeTypeTag pokeType={type} />
            <XMarkIcon height={16} width={16} />
          </button>
        ))
      }
    </>
  )
}
