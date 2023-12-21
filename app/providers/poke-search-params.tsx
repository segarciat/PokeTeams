'use client'
import React, { type ReactElement } from 'react'
import { type ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type PokeSearchParamAction } from '../lib/definitions'
import { validatePageParam, validateQueryParam, validateTypeParam } from '../lib/utils'
import PageParamContext, { PAGE_PARAM } from '../context/page-param'
import QueryParamContext, { QUERY_PARAM } from '../context/query-param'
import TypesParamContext, { TYPES_PARAM } from '../context/poke-types-param'
import { type PokeType } from '../lib/constants'

export default function PokeSearchParamsProvider ({ children }: { children: React.ReactNode }): ReactElement {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = validateQueryParam(searchParams.get(QUERY_PARAM) ?? undefined)
  const page = validatePageParam(searchParams.get(PAGE_PARAM) ?? undefined)
  const types = validateTypeParam(searchParams.getAll(TYPES_PARAM))

  function handleParamsAction (action: PokeSearchParamAction): void {
    const params = computeSearchParams(searchParams, action)
    router.replace(`${pathname}?${params.toString()}`)
  }

  function handleSetPage (page: number): void {
    handleParamsAction({ action: 'NEW_PAGE', page })
  }

  function handleSetQuery (query: string): void {
    handleParamsAction({ action: 'SUBMIT_QUERY', query })
  }

  function handleSetTypes (types: Set<PokeType>): void {
    handleParamsAction({ action: 'FILTER', types })
  }

  return (
    <PageParamContext.Provider value={ { page, setPage: handleSetPage }}>
      <QueryParamContext.Provider value={{ query, setQuery: handleSetQuery }}>
        <TypesParamContext.Provider value={{ types, setTypes: handleSetTypes }}>
          {children}
        </TypesParamContext.Provider>
      </QueryParamContext.Provider>
    </PageParamContext.Provider>

  )
}

export function computeSearchParams (searchParams: ReadonlyURLSearchParams, { action, page = 1, query = '', types }: PokeSearchParamAction): URLSearchParams {
  const params = new URLSearchParams(searchParams)
  switch (action) {
    case 'SUBMIT_QUERY': {
      params.set(PAGE_PARAM, '1')
      if (query.length === 0) {
        params.delete(QUERY_PARAM)
      } else {
        params.set(QUERY_PARAM, query)
      }
      break
    }
    case 'NEW_PAGE': {
      params.set(PAGE_PARAM, (page).toString())
      break
    }
    case 'FILTER': {
      params.set(PAGE_PARAM, '1')
      params.delete(TYPES_PARAM)
      types?.forEach(type => { params.append(TYPES_PARAM, type) })
      break
    }
    default:
      throw new Error(`Invalid action: ${action as any}`)
  }
  return params
}
