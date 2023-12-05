import { type ReactElement } from 'react'
import { fetchAllPokemonNames } from '@/app/lib/data'
import { type Metadata } from 'next'
import Form from '@/app/ui/pokesearch/forms'
import Results from '@/app/ui/pokesearch/results'

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
  const allPokemons = await fetchAllPokemonNames()
  const query = searchParams?.query ?? ''
  const page = Number(searchParams?.page ?? 1)

  return (
    <div className='p-4'>
      <h2 className='font-bold text-4xl'>Pokesearch</h2>
      <Form placeholder='Search Pokemon' />
      <Results allPokemons={allPokemons} query={query} page={page} />
    </div>
  )
}
