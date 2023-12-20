import { createContext } from 'react'
import { type PokeType } from '../lib/constants'

export const TYPES_PARAM = 'types'

export interface TypesParamContextValue {
  types: Set<PokeType>
  setTypes: (newTypes: Set<PokeType>) => void
}

const TypesParamContext = createContext<TypesParamContextValue>({
  types: new Set<PokeType>(),
  setTypes: (newTypes: Set<PokeType>) => {}
})

export default TypesParamContext
