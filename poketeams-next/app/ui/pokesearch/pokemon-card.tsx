'use client'
import { type Pokemon } from '@/app/lib/definitions'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState, type ReactElement } from 'react'
import PokeCardSprite from './sprite-image'
import CardHeader from './card-header'
import CardSummary from './card-summary'
import CardActions from './card-actions'

export default function PokemonCard ({ pokemon }: { pokemon: Pokemon }): ReactElement {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isShiny, setIsShiny] = useState(false)

  function handleFlipClick (): void {
    setIsFlipped(isFlipped => !isFlipped)
  }

  function handleShinyClick (): void {
    setIsShiny(isShiny => !isShiny)
  }

  return (
    <article className='bg-white ring-1 ring-slate-200 rounded-2xl w-[280px] p-3 flex flex-col relative'>
      <CardHeader id={pokemon.id}/>
      <div className='self-center'>
        <PokeCardSprite isFlipped={isFlipped} isShiny={isShiny} pokemonName={pokemon.name} sprites={pokemon.spriteSrcs} />
      </div>
      <hr/>
      <CardSummary name={pokemon.name} types={pokemon.types} />
      <div className='absolute top-3 right-3'>
        <CardActions isFlipped={isFlipped} isShiny={isShiny} onFlipClick={handleFlipClick} onShinyClick={handleShinyClick} />
      </div>
      <footer className='flex justify-center'>
        <button className='ring-1 self-center my-4 px-5 py-2 rounded-full flex items-center gap-1 bg-primary text-white text-sm font-semibold'>
          <DocumentMagnifyingGlassIcon height={20} width={20} className='inline-block' />
          See More
        </button>
      </footer>
    </article>
  )
}
