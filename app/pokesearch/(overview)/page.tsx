import { type ReactElement } from 'react'
import { fetchAllPokemon } from '@/app/lib/models/pokemon'
import { type Metadata } from 'next'
import PokeSearchParamsProvider from '@/app/providers/poke-search-params'
import Search from '@/app/ui/pokesearch/search'
import Filter from '@/app/ui/pokesearch/filter'
import Results from '@/app/ui/pokesearch/results'

export const metadata: Metadata = {
  title: 'Pokesearch'
}

export default async function Page (): Promise<ReactElement> {
  const allPokemons = await fetchAllPokemon()

  return (
    <div className='p-4'>
      <h2 className='font-bold text-4xl'>Pokesearch</h2>
      <PokeSearchParamsProvider>
        <Search placeholder='Search Pokemon' />
        <Filter />
        <Results allPokemon={allPokemons} />
      </PokeSearchParamsProvider>
    </div>
  )
}
