import { describe, expect, it } from 'vitest'
import { computeSearchParams } from '../poke-search-params'
import { QUERY_PARAM } from '@/app/context/query-param'
import { TYPES_PARAM } from '@/app/context/poke-types-param'
import { type PokeSearchParamAction } from '@/app/lib/definitions'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { PAGE_PARAM } from '@/app/context/page-param'
import { type PokeType } from '@/app/lib/constants'

describe('compute search params', () => {
  it('should throw when given an invalid action', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams())
    const action = { [TYPES_PARAM]: 'FAKE' } as any as PokeSearchParamAction
    expect(() => computeSearchParams(searchParams, action)).toThrow()
  })
  it('should delete the query parameter on CLEAR_QUERY', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams({ [QUERY_PARAM]: 'foo' }))
    const action: PokeSearchParamAction = { action: 'CLEAR_QUERY' }
    const resultParams = computeSearchParams(searchParams, action)

    expect(searchParams.get(QUERY_PARAM)).toEqual('foo')
    expect(resultParams.has(QUERY_PARAM)).toBeFalsy()
  })
  it('should add the query parameter on SUBMIT_QUERY and set page parameter to 1', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams())
    const action: PokeSearchParamAction = { action: 'SUBMIT_QUERY', [QUERY_PARAM]: 'hello' }
    const resultParams = computeSearchParams(searchParams, action)

    expect(searchParams.has(QUERY_PARAM)).toBeFalsy()
    expect(resultParams.get(QUERY_PARAM)).toEqual('hello')
    expect(resultParams.get(PAGE_PARAM)).toEqual('1')
  })
  it('should set the page parameter to the indicated number, and keep the existing parameters', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams({ [QUERY_PARAM]: 'hello', [TYPES_PARAM]: 'grass' }))
    const action: PokeSearchParamAction = { action: 'NEW_PAGE', [PAGE_PARAM]: 7 }
    const resultParams = computeSearchParams(searchParams, action)

    expect(resultParams.get(QUERY_PARAM)).toEqual('hello')
    expect(resultParams.get(TYPES_PARAM)).toEqual('grass')
    expect(resultParams.get(PAGE_PARAM)).toEqual('7')
  })
  it('should set page param to 1 and clear the type parameter when given an empty array', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams({ [QUERY_PARAM]: 'hello', [PAGE_PARAM]: '7' }))
    const action: PokeSearchParamAction = { action: 'FILTER', types: new Set() }
    const resultParams = computeSearchParams(searchParams, action)

    expect(resultParams.get(QUERY_PARAM)).toEqual('hello')
    expect(resultParams.get(PAGE_PARAM)).toEqual('1')
    expect(resultParams.get(TYPES_PARAM)).toBeNull()
  })

  it('should set page param to 1 and replace the type parameter when given a non-empty array of types', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams({ [QUERY_PARAM]: 'hello', [PAGE_PARAM]: '7', [TYPES_PARAM]: 'foo' }))
    const action: PokeSearchParamAction = { action: 'FILTER', types: new Set<PokeType>(['grass', 'poison']) }
    const resultParams = computeSearchParams(searchParams, action)

    expect(resultParams.get(QUERY_PARAM)).toEqual('hello')
    expect(resultParams.get(PAGE_PARAM)).toEqual('1')
    expect(resultParams.getAll(TYPES_PARAM)).toEqual(['grass', 'poison'])
  })
})
