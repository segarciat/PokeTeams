import { Suspense, type ReactElement } from 'react'
import NoResults from './no-results'
import CardList from './card-list'
import { containsCaseInsensitively } from '@/app/lib/utils'
import { SearchResultsSkeleton } from '../skeletons'

const RESULTS_PER_PAGE = 20

export interface ResultProps {
  allPokemons: string[]
  query: string
  page: number
}

export default function Results ({ allPokemons, query, page }: ResultProps): ReactElement {
  const filtered = allPokemons.filter(containsCaseInsensitively(query))
  return (
    <section aria-label="Search results" className='my-4 flex flex-col items-center'>
      {filtered.length === 0
        ? <NoResults />
        : <Suspense key={page + query} fallback={<SearchResultsSkeleton />}>
            <CardList matches={filtered} page={page} max={RESULTS_PER_PAGE} />
          </Suspense>
      }
    </section>
  )
}
