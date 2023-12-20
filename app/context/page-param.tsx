import { createContext } from 'react'

export const PAGE_PARAM = 'page'

const PageParamContext = createContext({
  page: 1,
  setPage: (newPage: number) => {}
})

export default PageParamContext
