import { type ReactElement } from 'react'
import { type PokeType } from '../lib/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type IconDefinition, faBiohazard, faBolt, faBug, faCube, faDove, faDragon, faDroplet, faFire, faGhost, faHandFist, faHatWizard, faLeaf, faMoon, faMound, faMountain, faSnowflake, faSquare, faStar } from '@fortawesome/free-solid-svg-icons'
import { capitalize } from '../lib/utils'

export default function PokeTypeTag ({ pokeType }: { pokeType: PokeType }): ReactElement {
  let icon: IconDefinition
  switch (pokeType) {
    case 'grass':
      icon = faLeaf
      break
    case 'bug':
      icon = faBug
      break
    case 'dragon':
      icon = faDragon
      break
    case 'dark':
      icon = faMoon
      break
    case 'electric':
      icon = faBolt
      break
    case 'fairy':
      icon = faStar
      break
    case 'fighting':
      icon = faHandFist
      break
    case 'fire':
      icon = faFire
      break
    case 'flying':
      icon = faDove
      break
    case 'ghost':
      icon = faGhost
      break
    case 'ice':
      icon = faSnowflake
      break
    case 'poison':
      icon = faBiohazard
      break
    case 'psychic':
      icon = faHatWizard
      break
    case 'water':
      icon = faDroplet
      break
    case 'rock':
      icon = faMountain
      break
    case 'ground':
      icon = faMound
      break
    case 'normal':
      icon = faSquare
      break
    case 'steel':
      icon = faCube
      break
    default:
      throw new Error(`Invalid type: ${pokeType as any}`)
  }
  return (
    <span className='flex gap-2 items-center justify-center flex-row'>
      <FontAwesomeIcon icon={icon}/>
      {capitalize(pokeType)}
    </span>
  )
}
