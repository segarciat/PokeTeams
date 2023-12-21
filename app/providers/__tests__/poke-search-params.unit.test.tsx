import { afterEach, describe, expect, it, vi } from 'vitest'
import PokeSearchParamsProvider, { computeSearchParams } from '../poke-search-params'
import QueryParamContext, { QUERY_PARAM } from '@/app/context/query-param'
import TypesParamContext, { TYPES_PARAM } from '@/app/context/poke-types-param'
import { type PokeSearchParamAction } from '@/app/lib/definitions'
import { ReadonlyURLSearchParams } from 'next/navigation'
import PageParamContext, { PAGE_PARAM } from '@/app/context/page-param'
import { type PokeType } from '@/app/lib/constants'
import { render, screen, within } from '@testing-library/react'
import { type ReactElement, useContext } from 'react'
import userEvent from '@testing-library/user-event'

const { mockReplace, mockUsePathname, mockUseSearchParams } = vi.hoisted(() => ({
  mockUseSearchParams: vi.fn(),
  mockUsePathname: vi.fn().mockReturnValue('/path'),
  mockReplace: vi.fn()
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

describe('PokeSearch context consumer', () => {
  it('should have display default values', () => {
    const searchParams = new URLSearchParams()
    mockUseSearchParams.mockReturnValue(new ReadonlyURLSearchParams(searchParams))
    render(
      <PokeSearchParamsProvider>
        <TestPokeSearchContextConsumer/>
      </PokeSearchParamsProvider>
    )
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /1/i })).toBeInTheDocument()
    const typesList = screen.getByRole('list')
    expect(within(typesList).queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('should display the search param values, removing duplicate and invalid types from search params', () => {
    const validTypes: PokeType[] = ['grass', 'poison', 'grass']
    const invalidTypes = ['fake', 'not real']
    const searchParams = new URLSearchParams({ [QUERY_PARAM]: 'bulbasaur', [PAGE_PARAM]: '7' })
    validTypes.forEach(type => { searchParams.append(TYPES_PARAM, type) })
    invalidTypes.forEach(type => { searchParams.append(TYPES_PARAM, type) })
    mockUseSearchParams.mockReturnValue(new ReadonlyURLSearchParams(searchParams))
    render(
      <PokeSearchParamsProvider>
        <TestPokeSearchContextConsumer />
      </PokeSearchParamsProvider>
    )
    expect(screen.getByRole('button', { name: 'bulbasaur' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
    const typesList = screen.getByRole('list')
    expect(within(typesList).getByText('grass')).toBeInTheDocument() // fails if there's more than 1 matching
    expect(within(typesList).getByText('poison')).toBeInTheDocument()
    expect(within(typesList).queryByText('fake')).not.toBeInTheDocument()
    expect(within(typesList).queryByText('not real')).not.toBeInTheDocument()
  })

  it('should call context setters when buttons are clicked', async () => {
    const validTypes: PokeType[] = ['grass', 'poison', 'grass']
    const searchParams = new URLSearchParams({ [QUERY_PARAM]: 'bulbasaur', [PAGE_PARAM]: '7' })
    validTypes.forEach(type => { searchParams.append(TYPES_PARAM, type) })
    mockUseSearchParams.mockReturnValue(new ReadonlyURLSearchParams(searchParams))

    render(
      <PokeSearchParamsProvider>
        <TestPokeSearchContextConsumer />
      </PokeSearchParamsProvider>
    )

    await userEvent.click(screen.getByRole('button', { name: 'bulbasaur' }))
    await userEvent.click(screen.getByRole('button', { name: '7' }))
    await userEvent.click(screen.getByRole('button', { name: /grass/i }))
    await userEvent.click(screen.getByRole('button', { name: /poison/i }))

    expect(mockReplace).toHaveBeenCalledTimes(4)
  })
})

describe('compute search params', () => {
  it('should throw when given an invalid action', () => {
    const searchParams = new ReadonlyURLSearchParams(new URLSearchParams())
    const action = { [TYPES_PARAM]: 'FAKE' } as any as PokeSearchParamAction
    expect(() => computeSearchParams(searchParams, action)).toThrow()
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

function TestPokeSearchContextConsumer (): ReactElement {
  const { query, setQuery } = useContext(QueryParamContext)
  const { page, setPage } = useContext(PageParamContext)
  const { types, setTypes } = useContext(TypesParamContext)

  return (
    <main>
      <button type='button' onClick={(e) => { setPage(1) }}>{page}</button>
      <button type='button' onClick={(e) => { setQuery('') }}>{query}</button>
      <ul aria-label='types'>
        {Array.from(types).map(t =>
        <li key={t}>
          <button type='button' onClick={(e) => { setTypes(new Set<PokeType>([t])) }}>{t}</button>
        </li>)
        }
      </ul>
    </main>
  )
}
