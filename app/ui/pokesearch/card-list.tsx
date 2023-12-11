import { fetchPokedexPage } from '@/app/lib/data'
import { type ReactElement } from 'react'
import Card from './pokemon/card'

interface CardListProps {
  matches: string[]
  page: number
  max: number
}

export default async function CardList ({ matches, page, max }: CardListProps): Promise<ReactElement> {
  const pokemons = await fetchPokedexPage(matches, page, max)
  return (
    <ol className='flex flex-col gap-3'>
      {pokemons.map(p => (
        <li key={p.name}>
          <Card pokemon={p} />
        </li>
      ))}
    </ol>
  )
}
