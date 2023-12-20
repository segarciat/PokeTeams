import { createContext } from 'react'

export const PAGE_PARAM = 'page'

export interface PageParamContextValue {
  page: number
  setPage: (newPage: number) => void
}

const PageParamContext = createContext<PageParamContextValue>({
  page: 1,
  setPage: (newPage: number) => {}
})

export default PageParamContext
