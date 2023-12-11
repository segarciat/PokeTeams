import { type Pokemon } from '@/app/lib/definitions'
import { capitalize } from '@/app/lib/utils'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { type ReactElement } from 'react'

export interface SpriteProps {
  isShiny: boolean
  isFlipped: boolean
  pokemonName: Pokemon['name']
  sprites: Pokemon['spriteSrcs']
}

export default function Sprite (props: SpriteProps): ReactElement {
  const { alt, imgSrc } = pickSprite(props)
  return (
    imgSrc !== null
      ? <Image
      alt={alt}
      src={imgSrc}
      height={180}
      width={180}
      className='p-2'
    />
      : <QuestionMarkCircleIcon aria-hidden={false} role='img' title={`Missing ${props.pokemonName} sprite`} height={180} width={180} />
  )
}

function pickSprite ({ sprites, pokemonName, isFlipped, isShiny }: SpriteProps): { alt: string, imgSrc: string | null } {
  const name = capitalize(pokemonName)
  if (isFlipped && isShiny) {
    return { alt: `${name} back shiny`, imgSrc: sprites.backShiny }
  } else if (!isFlipped && isShiny) {
    return { alt: `${name} front shiny`, imgSrc: sprites.frontShiny }
  } else if (isFlipped && !isShiny) {
    return { alt: `${name} back`, imgSrc: sprites.backDefault }
  } else {
    return { alt: `${name} front`, imgSrc: sprites.frontDefault }
  }
}
