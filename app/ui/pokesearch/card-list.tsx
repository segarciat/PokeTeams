import { type ReactElement } from 'react'
import Card from './pokemon/card'
import { getArrayPage } from '@/app/lib/utils'
import { type PokemonSummary } from '@/app/lib/definitions'

interface CardListProps {
  matches: PokemonSummary[]
  page: number
  max: number
}

export default async function CardList ({ matches, page, max }: CardListProps): Promise<ReactElement> {
  const pokemons = getArrayPage(matches, page, max)
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
