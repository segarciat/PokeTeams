import { createContext } from 'react'
import { type PokeSearchSortKey, type PokeType } from '../lib/constants'

export interface PokeSearchParams {
  query: string
  page: number
  types: Set<PokeType>
  sort: PokeSearchSortKey
}

export type PokeSearchParamsAction = 'SUBMIT_QUERY' | 'NEW_PAGE' | 'FILTER'
export type PokeSearchParamsDispatcher = (actionType: PokeSearchParamsAction, params: Partial<PokeSearchParams>) => void

export interface PokeSearchParamsContextValue extends PokeSearchParams {
  dispatch: PokeSearchParamsDispatcher | null
}

export const DEFAULT_POKE_SEARCH_PARAMS: PokeSearchParams = Object.freeze({
  query: '',
  page: 1,
  types: new Set<PokeType>(),
  sort: 'id'
})

const PokeSearchParamsContext = createContext<PokeSearchParamsContextValue>({
  ...DEFAULT_POKE_SEARCH_PARAMS,
  dispatch: null
})

export default PokeSearchParamsContext
