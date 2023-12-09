import { Suspense, type ReactElement } from 'react'
import NoResults from './no-results'
import CardList from './card-list'
import { filterLike, getTotalPageCount } from '@/app/lib/utils'
import { SearchResultsSkeleton } from '../skeletons'
import Pagination from './pagination'

export const RESULTS_PER_PAGE = 20

export interface ResultProps {
  allPokemons: string[]
  query: string
  page: number
}

export default function Results ({ allPokemons, query, page }: ResultProps): ReactElement {
  const filtered = filterLike(allPokemons, query)
  const totalPages = getTotalPageCount(filtered.length, RESULTS_PER_PAGE)
  return (
    <section aria-label="Search results" className='my-4 flex flex-col gap-4 items-center'>
      {filtered.length === 0
        ? <NoResults />
        : <Suspense key={page + query} fallback={<SearchResultsSkeleton />}>
            <CardList matches={filtered} page={page} max={RESULTS_PER_PAGE} />
            {totalPages > 1 && (<Pagination totalPages={totalPages} page={page} />)}
          </Suspense>
      }
    </section>
  )
}
