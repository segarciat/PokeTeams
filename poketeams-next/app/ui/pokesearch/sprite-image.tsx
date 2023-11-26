import { type Pokemon } from '@/app/lib/definitions'
import { capitalize } from '@/app/lib/utils'
import Image from 'next/image'
import { type ReactElement } from 'react'

interface PokeCardSpriteProps {
  isShiny: boolean
  isFlipped: boolean
  pokemonName: Pokemon['name']
  sprites: Pokemon['spriteSrcs']
}

export default function PokeCardSprite ({ isShiny, isFlipped, pokemonName, sprites }: PokeCardSpriteProps): ReactElement {
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
  />
}
