import { type ReactElement } from 'react'
import NoResults from './no-results'
import CardList from './card-list'
import Pagination from './pagination'
import { type PokemonSummary, type PokeSearchParamAction } from '@/app/lib/definitions'
import { getTotalPageCount } from '@/app/lib/utils'

export const RESULTS_PER_PAGE = 20

export interface ResultsProps {
  matches: PokemonSummary[]
  query: string
  page: number
  onParamsAction: (action: PokeSearchParamAction) => void
}

export default function Results ({ matches, query, page, onParamsAction }: ResultsProps): ReactElement {
  const totalPages = getTotalPageCount(matches.length, RESULTS_PER_PAGE)

  return (
    <section aria-label="Search results" className='my-4'>
      <h3 className='my-4 text-2xl font-bold'>Results</h3>
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
