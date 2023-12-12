import { type ReactElement } from 'react'
import { fetchAllPokemonNames } from '@/app/lib/data'
import { type Metadata } from 'next'
import ParamsWrapper from '@/app/ui/pokesearch/params-wrapper'

export const metadata: Metadata = {
  title: 'Pokesearch'
}

export default async function Page (): Promise<ReactElement> {
  const allPokemons = await fetchAllPokemonNames()

  return (
    <div className='p-4'>
      <h2 className='font-bold text-4xl'>Pokesearch</h2>
      <ParamsWrapper allPokemons={allPokemons} />
    </div>
  )
}
