'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type ReactElement } from 'react'
import React from 'react'
import PokeSearchParamsContext, { DEFAULT_POKE_SEARCH_PARAMS, type PokeSearchParams, type PokeSearchParamsAction } from '../context/poke-search-params'
import { POKE_SEARCH_SORT_KEYS, POKE_TYPES, type PokeSearchSortKey, type PokeType } from '../lib/constants'

export const QUERY_PARAM = 'query'
export const PAGE_PARAM = 'page'
export const TYPES_PARAM = 'types'
export const SORT_PARAM = 'sort'

export default function PokeSearchParamsProvider ({ children }: { children: React.ReactNode }): ReactElement {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  function parseQueryParam (): string {
    const query = searchParams.get(QUERY_PARAM)
    return query ?? DEFAULT_POKE_SEARCH_PARAMS.query
  }

  function parsePageParam (): number {
    const page = Number(searchParams.get(PAGE_PARAM))
    return isNaN(page) || page < 1 ? DEFAULT_POKE_SEARCH_PARAMS.page : Math.floor(page)
  }

  function parseTypesParam (): Set<PokeType> {
    const types = searchParams.getAll(TYPES_PARAM)
    return new Set(
      types.filter(type => POKE_TYPES.includes(type as any)) as PokeType[]
    )
  }

  function parseSortParam (): PokeSearchSortKey {
    const sort = searchParams.get(SORT_PARAM)?.toLowerCase()
    if (POKE_SEARCH_SORT_KEYS.map(k => k.toLowerCase()).includes(sort as PokeSearchSortKey)) {
      return sort as PokeSearchSortKey
    } else {
      return DEFAULT_POKE_SEARCH_PARAMS.sort
    }
  }

  function handleDispatch (actionType: PokeSearchParamsAction, { query, page, types, sort }: Partial<PokeSearchParams>): void {
    const params = new URLSearchParams(searchParams)
    switch (actionType) {
      case 'SUBMIT_QUERY': {
        params.set(PAGE_PARAM, DEFAULT_POKE_SEARCH_PARAMS.page.toString())
        if (query?.length === 0) {
          params.delete(QUERY_PARAM)
        } else {
          params.set(QUERY_PARAM, query ?? DEFAULT_POKE_SEARCH_PARAMS.query)
        }
        break
      }
      case 'NEW_PAGE': {
        params.set(PAGE_PARAM, page?.toString() ?? DEFAULT_POKE_SEARCH_PARAMS.page.toString())
        break
      }
      case 'FILTER': {
        params.set(PAGE_PARAM, DEFAULT_POKE_SEARCH_PARAMS.page.toString())
        if (sort !== undefined) {
          params.set(SORT_PARAM, sort)
        }
        params.delete(TYPES_PARAM)
        types?.forEach(type => { params.append(TYPES_PARAM, type) })
        break
      }
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <PokeSearchParamsContext.Provider value={{
      query: parseQueryParam(),
      page: parsePageParam(),
      types: parseTypesParam(),
      sort: parseSortParam(),
      dispatch: handleDispatch
    }}>
      {children}
    </PokeSearchParamsContext.Provider>
  )
}
