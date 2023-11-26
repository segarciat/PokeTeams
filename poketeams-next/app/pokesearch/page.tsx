'use server'
import { type ReactElement } from 'react'
import { fetchAllPokemon } from '@/app/lib/data'
import Search from '@/app/ui/pokesearch/search'
import SearchResults from '@/app/ui/pokesearch/search-results'
import { filterByName } from '@/app/lib/utils'

interface PageProps {
  searchParams?: {
    query?: string
    page?: string
  }
}

export default async function Page ({ searchParams }: PageProps): Promise<ReactElement> {
  const allPokemonURLs = await fetchAllPokemon()
  const query = searchParams?.query ?? ''
  const currentPage = Number(searchParams?.page) ?? 1
  const filtered = filterByName(allPokemonURLs, query)

  return (
    <main className='p-4'>
      <h1 className='font-bold text-4xl'>Pokesearch</h1>
      <div className='my-4'>
        <Search placeholder='Search' allPokemon={allPokemonURLs} />
      </div>
      <SearchResults results={filtered} currentPage={currentPage} />
    </main>
  )
}
