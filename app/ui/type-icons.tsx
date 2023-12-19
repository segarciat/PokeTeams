import { type ReactElement } from 'react'
import { type PokeType } from '../lib/constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBiohazard, faBolt, faBug, faCube, faDove, faDragon, faDroplet, faFire, faGhost, faHandFist, faHatWizard, faLeaf, faMoon, faMound, faMountain, faSnowflake, faSquare, faStar } from '@fortawesome/free-solid-svg-icons'
import { type SizeProp } from '@fortawesome/fontawesome-svg-core'

export default function PokeTypeIcon ({ pokeType, size }: { pokeType: PokeType, size: SizeProp }): ReactElement {
  switch (pokeType) {
    case 'grass':
      return <FontAwesomeIcon icon={faLeaf} size={size} />
    case 'bug':
      return <FontAwesomeIcon icon={faBug} size={size} />
    case 'dragon':
      return <FontAwesomeIcon icon={faDragon} size={size} />
    case 'dark':
      return <FontAwesomeIcon icon={faMoon} size={size} />
    case 'electric':
      return <FontAwesomeIcon icon={faBolt} size={size} />
    case 'fairy':
      return <FontAwesomeIcon icon={faStar} size={size} />
    case 'fighting':
      return <FontAwesomeIcon icon={faHandFist} size={size} />
    case 'fire':
      return <FontAwesomeIcon icon={faFire} size={size} />
    case 'flying':
      return <FontAwesomeIcon icon={faDove} size={size} />
    case 'ghost':
      return <FontAwesomeIcon icon={faGhost} size={size} />
    case 'ice':
      return <FontAwesomeIcon icon={faSnowflake} size={size} />
    case 'poison':
      return <FontAwesomeIcon icon={faBiohazard} size={size} />
    case 'psychic':
      return <FontAwesomeIcon icon={faHatWizard} size={size} />
    case 'water':
      return <FontAwesomeIcon icon={faDroplet} size={size} />
    case 'rock':
      return <FontAwesomeIcon icon={faMountain} size={size} />
    case 'ground':
      return <FontAwesomeIcon icon={faMound} size={size} />
    case 'normal':
      return <FontAwesomeIcon icon={faSquare} size={size} />
    case 'steel':
      return <FontAwesomeIcon icon={faCube} size={size} />
    default:
      throw new Error(`Invalid type: ${pokeType as any}`)
  }
}
