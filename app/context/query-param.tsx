import { createContext } from 'react'

export const QUERY_PARAM = 'query'

export interface QueryParamsContextValue {
  query: string
  setQuery: (newQuery: string) => void
}

const QueryParamContext = createContext<QueryParamsContextValue>({
  query: '',
  setQuery: (newQuery: string) => {}
})

export default QueryParamContext
