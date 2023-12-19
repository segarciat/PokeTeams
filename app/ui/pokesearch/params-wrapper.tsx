'use client'
import { type PokemonSummary, type PokeSearchParamAction } from '@/app/lib/definitions'
import { type ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type ReactElement } from 'react'
import Search from './search'
import { filterByName, validatePageParam, validateQueryParam, validateTypeParam } from '@/app/lib/utils'
import Results from './results'
import Filter from './filter'

export interface ParamsWrapperProps {
  allPokemons: PokemonSummary[]
}

export const QUERY_PARAM = 'query'
export const PAGE_PARAM = 'page'
export const TYPE_PARAM = 'types'

export default function ParamsWrapper ({ allPokemons }: ParamsWrapperProps): ReactElement {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = validateQueryParam(searchParams.get(QUERY_PARAM) ?? undefined)
  const page = validatePageParam(searchParams.get(PAGE_PARAM) ?? undefined)
  const types = validateTypeParam(searchParams.getAll(TYPE_PARAM))

  const filtered = filterByName(allPokemons, query)

  function handleParamsAction (action: PokeSearchParamAction): void {
    const params = computeSearchParams(searchParams, action)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <>
      <Search placeholder='Search Pokemon' defaultQuery={query} onSubmit={handleParamsAction}/>
      <Filter defaultEnabledTypes={types} onSubmit={handleParamsAction}/>
      <Results matches={filtered} page={page} query={query} onParamsAction={handleParamsAction}/>
    </>
  )
}

export function computeSearchParams (searchParams: ReadonlyURLSearchParams, { action, page = 1, query = '', types }: PokeSearchParamAction): URLSearchParams {
  const params = new URLSearchParams(searchParams)
  switch (action) {
    case 'CLEAR_QUERY': {
      params.set(PAGE_PARAM, '1')
      params.delete(QUERY_PARAM)
      break
    }
    case 'SUBMIT_QUERY': {
      params.set(PAGE_PARAM, '1')
      params.set(QUERY_PARAM, query)
      break
    }
    case 'NEW_PAGE': {
      params.set(PAGE_PARAM, page.toString())
      break
    }
    case 'FILTER': {
      params.delete(TYPE_PARAM)
      types?.forEach(type => { params.append(TYPE_PARAM, type) })
      break
    }
    default:
      throw new Error(`Invalid action: ${action as any}`)
  }
  return params
}
