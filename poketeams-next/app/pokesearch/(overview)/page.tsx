import { type ReactElement } from 'react'
import { fetchAllPokemonNames } from '@/app/lib/data'
import { type Metadata } from 'next'
import { validatePageParam, validateQueryParam } from '@/app/lib/utils'
import { type URLPageParam } from '@/app/lib/definitions'
import ParamsWrapper from '@/app/ui/pokesearch/params-wrapper'

export const metadata: Metadata = {
  title: 'Pokesearch'
}

interface PageProps {
  searchParams?: {
    query?: URLPageParam
    page?: URLPageParam
  }
}

export default async function Page ({ searchParams }: PageProps): Promise<ReactElement> {
  const allPokemons = await fetchAllPokemonNames()
  const query = validateQueryParam(searchParams?.query)
  const page = validatePageParam(searchParams?.page)

  return (
    <div className='p-4'>
      <h2 className='font-bold text-4xl'>Pokesearch</h2>
      <ParamsWrapper allPokemons={allPokemons} query={query} page={page}/>
    </div>
  )
}
