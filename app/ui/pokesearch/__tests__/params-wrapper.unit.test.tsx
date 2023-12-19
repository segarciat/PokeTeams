import { afterEach, describe, expect, it, vi } from 'vitest'
import ParamsWrapper, { PAGE_PARAM, QUERY_PARAM, TYPE_PARAM, computeSearchParams } from '../params-wrapper'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { type PokeSearchParamAction } from '@/app/lib/definitions'
import { render } from '@testing-library/react'
import { type PokeType } from '@/app/lib/constants'

const { ResultsMock, mockReplace, mockUsePathname, mockUseSearchParams } = vi.hoisted(() => ({
  ResultsMock: vi.fn(),
  mockUseSearchParams: vi.fn(),
  mockUsePathname: vi.fn().mockReturnValue('/path'),
  mockReplace: vi.fn()
}))

vi.mock('../results', () => ({
  default: ResultsMock
}))

vi.mock('next/navigation', async () => {
  const nextNavigation = await vi.importActual('next/navigation')
  return {
    ...nextNavigation,
    useSearchParams: mockUseSearchParams,
    usePathname: mockUsePathname,
    useRouter: vi.fn().mockReturnValue({ replace: mockReplace })
  }
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('compute search params', () => {
  it('should throw when given an invalid action', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams())
    const action = { [TYPE_PARAM]: 'FAKE' } as any as PokeSearchParamAction
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
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams({ [QUERY_PARAM]: 'hello', [TYPE_PARAM]: 'grass' }))
    const action: PokeSearchParamAction = { action: 'NEW_PAGE', [PAGE_PARAM]: 7 }
    const resultParams = computeSearchParams(searchParams, action)

    expect(resultParams.get(QUERY_PARAM)).toEqual('hello')
    expect(resultParams.get(TYPE_PARAM)).toEqual('grass')
    expect(resultParams.get(PAGE_PARAM)).toEqual('7')
  })
  it('should set page param to 1 and clear the type parameter when given an empty array', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams({ [QUERY_PARAM]: 'hello', [PAGE_PARAM]: '7' }))
    const action: PokeSearchParamAction = { action: 'FILTER', types: new Set() }
    const resultParams = computeSearchParams(searchParams, action)

    expect(resultParams.get(QUERY_PARAM)).toEqual('hello')
    expect(resultParams.get(PAGE_PARAM)).toEqual('1')
    expect(resultParams.get(TYPE_PARAM)).toBeNull()
  })

  it('should set page param to 1 and replace the type parameter when given a non-empty array of types', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams({ [QUERY_PARAM]: 'hello', [PAGE_PARAM]: '7', [TYPE_PARAM]: 'foo' }))
    const action: PokeSearchParamAction = { action: 'FILTER', types: new Set<PokeType>(['grass', 'poison']) }
    const resultParams = computeSearchParams(searchParams, action)

    expect(resultParams.get(QUERY_PARAM)).toEqual('hello')
    expect(resultParams.get(PAGE_PARAM)).toEqual('1')
    expect(resultParams.getAll(TYPE_PARAM)).toEqual(['grass', 'poison'])
  })
})

describe('params wrapper', () => {
  it('should display search container and results container', () => {
    const searchParams = new URLSearchParams({ [QUERY_PARAM]: 'bulbasaur', [PAGE_PARAM]: '1' })
    mockUseSearchParams.mockReturnValue(new ReadonlyURLSearchParams(searchParams))
    render(<ParamsWrapper allPokemons={[]}/>)
  })
})
