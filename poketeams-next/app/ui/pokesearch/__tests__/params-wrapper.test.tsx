import { afterEach, describe, expect, it, vi } from 'vitest'
import ParamsWrapper, { computeSearchParams } from '../params-wrapper.js'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { type PokeSearchParamAction } from '@/app/lib/definitions'
import { render } from '@testing-library/react'

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
    const action = { type: 'FAKE' } as any as PokeSearchParamAction
    expect(() => computeSearchParams(searchParams, action)).toThrow()
  })
  it('should delete the query parameter on CLEAR_QUERY', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams({ query: 'foo' }))
    const action: PokeSearchParamAction = { action: 'CLEAR_QUERY' }
    const resultParams = computeSearchParams(searchParams, action)

    expect(searchParams.get('query')).toEqual('foo')
    expect(resultParams.has('query')).toBeFalsy()
  })
  it('should add the query parameter on SUBMIT_QUERY and set page parameter to 1', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams())
    const action: PokeSearchParamAction = { action: 'SUBMIT_QUERY', query: 'hello' }
    const resultParams = computeSearchParams(searchParams, action)

    expect(searchParams.has('query')).toBeFalsy()
    expect(resultParams.get('query')).toEqual('hello')
    expect(resultParams.get('page')).toEqual('1')
  })
  it('should set the page parameter to the indicated number, and keep the existing parameters', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams({ query: 'hello', pokeType: 'grass' }))
    const action: PokeSearchParamAction = { action: 'NEW_PAGE', page: 7 }
    const resultParams = computeSearchParams(searchParams, action)

    expect(resultParams.get('query')).toEqual('hello')
    expect(resultParams.get('pokeType')).toEqual('grass')
    expect(resultParams.get('page')).toEqual('7')
  })
})

describe('params wrapper', () => {
  it('should display search container and results container', () => {
    render(<ParamsWrapper allPokemons={[]} query='bulbasaur' page={1}/>)
  })
})
