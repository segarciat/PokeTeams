import { type Pokemon } from '@/app/lib/definitions'
import { capitalize } from '@/app/lib/utils'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { type ReactElement } from 'react'

interface SpriteProps {
  isShiny: boolean
  isFlipped: boolean
  pokemonName: Pokemon['name']
  sprites: Pokemon['spriteSrcs']
}

export default function Sprite ({ isShiny, isFlipped, pokemonName, sprites }: SpriteProps): ReactElement {
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

  return (
    imageSrc !== null
      ? <Image
      alt={`${capitalize(pokemonName)}`}
      src={imageSrc ?? '/Octopus-amico.svg'}
      height={180}
      width={180}
      className='p-2'
    />
      : <QuestionMarkCircleIcon height={180} width={180}/>
  )
}
