'use client'
import { type PokeSearchParamAction } from '@/app/lib/definitions'
import { type ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type ReactElement } from 'react'
import Search from './search'
import { filterLike, validatePageParam, validateQueryParam } from '@/app/lib/utils'
import Results from './results'

export interface ParamsWrapperProps {
  allPokemons: string[]
}

export default function ParamsWrapper ({ allPokemons }: ParamsWrapperProps): ReactElement {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = validateQueryParam(searchParams.get('query') ?? undefined)
  const page = validatePageParam(searchParams.get('page') ?? undefined)

  const filtered = filterLike(allPokemons, query)

  function handleParamsAction (action: PokeSearchParamAction): void {
    const params = computeSearchParams(searchParams, action)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <>
      <Search placeholder='Search Pokemon' defaultQuery={query} onSubmit={handleParamsAction}/>
      <Results matches={filtered} page={page} query={query} onParamsAction={handleParamsAction}/>
    </>
  )
}

export function computeSearchParams (searchParams: ReadonlyURLSearchParams, { action, page = 1, query = '' }: PokeSearchParamAction): URLSearchParams {
  const params = new URLSearchParams(searchParams)
  switch (action) {
    case 'CLEAR_QUERY': {
      params.set('page', '1')
      params.delete('query')
      break
    }
    case 'SUBMIT_QUERY': {
      params.set('page', '1')
      params.set('query', query)
      break
    }
    case 'NEW_PAGE': {
      params.set('page', page.toString())
      break
    }
    default:
      throw new Error(`Invalid action: ${action as any}`)
  }
  return params
}
