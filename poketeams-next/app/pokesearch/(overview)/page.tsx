import { Suspense, type ReactElement } from 'react'
import { fetchAllPokemonNames } from '@/app/lib/data'
import Search from '@/app/ui/pokesearch/search'
import SearchResults from '@/app/ui/pokesearch/search-results'
import { containsCaseInsensitively } from '@/app/lib/utils'
import { type Metadata } from 'next'
import NoPokeSearchResults from '@/app/ui/pokesearch/no-results'
import { SearchResultsSkeleton } from '@/app/ui/skeletons'

export const metadata: Metadata = {
  title: 'Pokesearch'
}

interface PageProps {
  searchParams?: {
    query?: string
    page?: string
  }
}

export default async function Page ({ searchParams }: PageProps): Promise<ReactElement> {
  const allPokemonURLs = await fetchAllPokemonNames()
  const query = searchParams?.query ?? ''
  const currentPage = Number(searchParams?.page ?? 1)
  const filtered = allPokemonURLs.filter(containsCaseInsensitively(query))

  return (
    <div className='p-4'>
      <h2 className='font-bold text-4xl'>Pokesearch</h2>
      <div className='my-4'>
        <Search placeholder='Search Pokemon' allPokemon={allPokemonURLs} />
      </div>
      <section aria-label="Search results" className='flex flex-col items-center'>
        {filtered.length === 0
          ? <NoPokeSearchResults />
          : (
            <Suspense key={query + currentPage} fallback={<SearchResultsSkeleton />}>
              <SearchResults resultUrls={filtered} page={currentPage} />
            </Suspense>
            )
        }
      </section>
    </div>
  )
}
