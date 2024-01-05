'use client'
import { type PokemonSummary } from '@/app/lib/definitions'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState, type ReactElement } from 'react'
import Sprite from './sprite'
import Header from './header'
import Summary from './summary'
import Actions from './actions'
import Link from 'next/link'

export interface CardProps {
  pokemon: PokemonSummary
}

export default function Card ({ pokemon }: CardProps): ReactElement {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isShiny, setIsShiny] = useState(false)

  function handleFlipClick (): void {
    setIsFlipped(isFlipped => !isFlipped)
  }

  function handleShinyClick (): void {
    setIsShiny(isShiny => !isShiny)
  }

  return (
    <article aria-label={`${pokemon.name} card`} className='bg-white shadow-md dark:bg-primary-800 rounded-2xl w-[280px] p-3 flex flex-col relative'>
      <Header id={pokemon.id}/>
      <div className='self-center'>
        <Sprite isFlipped={isFlipped} isShiny={isShiny} pokemonName={pokemon.name} sprites={pokemon.spriteSrcs} />
      </div>
      <hr/>
      <Summary name={pokemon.name} types={pokemon.types} />
      <div className='absolute top-3 right-3'>
        <Actions isFlipped={isFlipped} isShiny={isShiny} onFlipClick={handleFlipClick} onShinyClick={handleShinyClick} />
      </div>
      <footer className='flex justify-center'>
        <Link href={`/pokesearch/${pokemon.name}`} className='ring-1 self-center my-4 px-5 py-2 rounded-full flex items-center gap-1 bg-primary text-white text-sm font-semibold'>
          <DocumentMagnifyingGlassIcon height={20} width={20} className='inline-block' />
          View Entry
        </Link>
      </footer>
    </article>
  )
}
