'use client'
import { type Pokemon, type PokeType } from '@/app/lib/definitions'
import { capitalize, POKE_TYPE_BG_CLASS } from '@/app/lib/utils'
import { ArrowPathRoundedSquareIcon, DocumentMagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useState, type ReactElement } from 'react'

export default function PokemonCard ({ pokemon }: { pokemon: Pokemon }): ReactElement {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isShiny, setIsShiny] = useState(false)

  const actionButtons = [
    { actionName: 'flip', icon: ArrowPathRoundedSquareIcon, onClick: () => { setIsFlipped(!isFlipped) } },
    { actionName: 'toggleShiny', icon: SparklesIcon, onClick: () => { setIsShiny(!isShiny) } }
  ]
  const capitalizedName = capitalize(pokemon.name)

  return (
    <div className='p-3 bg-white ring-1 ring-slate-200 rounded-2xl flex flex-col w-[280px] relative'>
      <p className='flex items-center gap-1 text-base text-gray-300 font-bold'>
        <Image
          src={'/poketeams.png'}
          alt='PokeTeams logo'
          height={24}
          width={24}
          className='inline-block opacity-20'
        />
        No.
        </p>
      <p className='text-4xl font-bold text-gray-300'>{pokemon.id.toString().padStart(4, '0')}</p>
      <Sprite isFlipped={isFlipped} isShiny={isShiny} pokemonName={pokemon.name} sprites={pokemon.spriteSrcs}/>
      <hr/>
      <AttributeLabel text='Name' />
      <h3 className='text-center font-bold text-3xl'>{capitalizedName}</h3>
      <hr />
      <AttributeLabel text='Types' />
      <div className='flex justify-center gap-2 my-2'>
        {pokemon.types.map((type) => <TypeButton key={type.name} type={type.name}/>)}
      </div>
      <hr />
      <div className='flex flex-col justify-center gap-1 my-1 absolute top-3 right-3'>
        {actionButtons.map(({ actionName, icon: Icon, onClick }) => (
          <button
            key={actionName}
            className='ring-1 bg-primary text-white rounded-full p-2'
            onClick={onClick}
          >
            <Icon height={20} width={20}/>
          </button>
        ))}
      </div>
      <button className='ring-1 self-center my-4 px-5 py-2 rounded-full flex items-center gap-1 bg-primary text-white'>
        <DocumentMagnifyingGlassIcon height={20} width={20} className='inline-block'/>
        See More
      </button>
    </div>
  )
}

interface TypeButtonProps {
  type: PokeType
}

function TypeButton ({ type }: TypeButtonProps): ReactElement {
  return <button className={`${POKE_TYPE_BG_CLASS[type]} px-6 py-2 rounded-full text-white text-xs `}>
    {capitalize(type)}
  </button>
}

function AttributeLabel ({ text }: { text: string }): ReactElement {
  return <p className='text-sm text-gray-300 font-bold'>{text}</p>
}

interface SpriteProps {
  isShiny: boolean
  isFlipped: boolean
  sprites: Pokemon['spriteSrcs']
  pokemonName: Pokemon['name']
}

function Sprite ({ isFlipped, isShiny, sprites, pokemonName }: SpriteProps): ReactElement {
  let imageSrc
  if (!isFlipped && !isShiny) {
    imageSrc = sprites.frontDefault
  } else if (!isFlipped && isShiny) {
    imageSrc = sprites.frontShiny
  } else if (isFlipped && !isShiny) {
    imageSrc = sprites.backDefault
  } else {
    imageSrc = sprites.backShiny
  }

  return <Image
    alt={`${capitalize(pokemonName)}`}
    src={imageSrc}
    height={180}
    width={180}
    className='self-center'
  />
}
