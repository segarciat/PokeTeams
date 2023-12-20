import { type ReactElement } from 'react'
import NoResults from './no-results'
import CardList from './card-list'
import Pagination from './pagination'
import { type PokemonSummary, type PokeSearchParamAction } from '@/app/lib/definitions'
import { getTotalPageCount } from '@/app/lib/utils'
import { POKE_TYPE_BG_CLASS, type PokeType } from '@/app/lib/constants'
import { XMarkIcon } from '@heroicons/react/24/outline'
import PokeTypeTag from '../poke-type-tags'

export const RESULTS_PER_PAGE = 20

export interface ResultsProps {
  matches: PokemonSummary[]
  query: string
  filters: Set<PokeType>
  page: number
  onParamsAction: (action: PokeSearchParamAction) => void
}

export default function Results ({ matches, query, filters, page, onParamsAction }: ResultsProps): ReactElement {
  const totalPages = getTotalPageCount(matches.length, RESULTS_PER_PAGE)

  function handleTypeClick (type: PokeType): void {
    const newFilters = new Set(filters)
    newFilters.delete(type)
    onParamsAction({
      action: 'FILTER',
      types: newFilters
    })
  }

  return (
    <section aria-label="Search results" className='my-4'>
      <h3 className='my-4 text-2xl font-bold'>Results</h3>
      <ul className='flex flex-row flex-wrap gap-2 items-center my-2'>
        {filters.size > 0 && <ActiveTypeFilters filters={filters} onTypeClick={handleTypeClick}/>}
      </ul>
      <div className='flex flex-col items-center gap-3'>
        {matches.length === 0
          ? <NoResults />
          : (
            <>
              <CardList key={page + query} matches={matches} page={page} max={RESULTS_PER_PAGE} />
              {totalPages > 1 && page <= totalPages && (
                <Pagination totalPages={totalPages} page={page} onPageClick={onParamsAction} />
              )}
            </>
            )}
      </div>
    </section>
  )
}

function ActiveTypeFilters ({ filters, onTypeClick }: { filters: Set<PokeType>, onTypeClick: (type: PokeType) => void }): ReactElement {
  return (
    <ul aria-label='activeFilters'>
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
    </ul>
  )
}
