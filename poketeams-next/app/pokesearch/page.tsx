import { type ReactElement } from 'react'
import PokemonCard from '../ui/pokesearch/pokemon-card'
import { fetchPokemonDetails } from '../lib/data'

export default async function Page (): Promise<ReactElement> {
  const pokemon = await fetchPokemonDetails(4)
  return (
    <div className='p-4'>
      <h1 className='font-bold text-4xl'>Pokesearch</h1>
      <form className='my-4'>
        <input type='text' className='bg-white ring-1 rounded-full w-full py-1 px-3' placeholder='Search'/>
      </form>
      <section className='flex flex-col items-center'>
        <PokemonCard pokemon={pokemon}/>
      </section>
    </div>
  )
}
