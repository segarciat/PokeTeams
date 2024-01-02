import { afterEach, describe, expect, it, vi } from 'vitest'
import PokeSearchParamsProvider, { PAGE_PARAM, QUERY_PARAM, SORT_PARAM, TYPES_PARAM } from '../poke-search-params'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { type PokeSearchSortKey, type PokeType } from '@/app/lib/constants'
import { render, screen, within } from '@testing-library/react'
import { type ReactElement, useContext } from 'react'
import userEvent from '@testing-library/user-event'
import PokeSearchParamsContext, { DEFAULT_POKE_SEARCH_PARAMS } from '@/app/context/poke-search-params'

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

describe('PokeSearch context provider', () => {
  it('should ignore params with invalid or missing values, or replace the with defaults', () => {
    const invalidPage = 'first'
    const invalidSort = 'color'
    const invalidTypes = ['fake', 'not real']

    const searchParams = new URLSearchParams()
    searchParams.set(PAGE_PARAM, invalidPage)
    searchParams.set(SORT_PARAM, invalidSort)
    invalidTypes.forEach(type => { searchParams.append(TYPES_PARAM, type) })
    mockUseSearchParams.mockReturnValue(new ReadonlyURLSearchParams(searchParams))

    render(
      <PokeSearchParamsProvider>
        <TestPokeSearchContextConsumer />
      </PokeSearchParamsProvider>
    )

    expect(screen.getByRole('button', { name: `query:${DEFAULT_POKE_SEARCH_PARAMS.query}` })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: `page:${DEFAULT_POKE_SEARCH_PARAMS.page}` })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: `sort:${DEFAULT_POKE_SEARCH_PARAMS.sort}` })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'all types:' })).toBeInTheDocument()
    const typesList = screen.getByRole('list')
    expect(within(typesList).queryByText('fake')).not.toBeInTheDocument()
    expect(within(typesList).queryByText('not real')).not.toBeInTheDocument()
  })
  it('should parse valid params', () => {
    const query = 'bulbasaur'
    const page = 7
    const sort: PokeSearchSortKey = 'name'
    const validTypes: PokeType[] = ['grass', 'poison', 'grass']

    const searchParams = new URLSearchParams()
    searchParams.set(QUERY_PARAM, query)
    searchParams.set(PAGE_PARAM, page.toString())
    searchParams.set(SORT_PARAM, sort)
    validTypes.forEach(type => { searchParams.append(TYPES_PARAM, type) })
    mockUseSearchParams.mockReturnValue(new ReadonlyURLSearchParams(searchParams))

    render(
      <PokeSearchParamsProvider>
        <TestPokeSearchContextConsumer />
      </PokeSearchParamsProvider>
    )

    expect(screen.getByRole('button', { name: `query:${query}` })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: `page:${page.toString()}` })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: `sort:${sort.toString()}` })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'all types:grass,poison' })).toBeInTheDocument()
    const typesList = screen.getByRole('list')
    expect(within(typesList).getByText('grass')).toBeInTheDocument() // fails if there's more than 1 matching
    expect(within(typesList).getByText('poison')).toBeInTheDocument()
  })

  it('should set query to provided value and page to 1 when query is submitted', async () => {
    const query = 'bulbasaur'

    const searchParams = new URLSearchParams()
    searchParams.set(QUERY_PARAM, query)
    mockUseSearchParams.mockReturnValue(new ReadonlyURLSearchParams(searchParams))

    render(
      <PokeSearchParamsProvider>
        <TestPokeSearchContextConsumer />
      </PokeSearchParamsProvider>
    )

    await userEvent.click(screen.getByRole('button', { name: `query:${query}` }))

    expect(mockReplace).toHaveBeenCalledTimes(1)
    const submitQueryActionParams = new URLSearchParams(mockReplace.mock.calls[0][0].split('?')[1])
    expect(Array.from(submitQueryActionParams.keys())).toHaveLength(2)
    expect(submitQueryActionParams.get(QUERY_PARAM)).toEqual(query)
    expect(submitQueryActionParams.get(PAGE_PARAM)).toEqual(DEFAULT_POKE_SEARCH_PARAMS.page.toString())
  })

  it('should set page to provided value when action is new page', async () => {
    const page = 7

    const searchParams = new URLSearchParams()
    searchParams.set(PAGE_PARAM, page.toString())
    mockUseSearchParams.mockReturnValue(new ReadonlyURLSearchParams(searchParams))

    render(
      <PokeSearchParamsProvider>
        <TestPokeSearchContextConsumer />
      </PokeSearchParamsProvider>
    )

    await userEvent.click(screen.getByRole('button', { name: `page:${page}` }))

    expect(mockReplace).toHaveBeenCalledTimes(1)
    const newPageActionParams = new URLSearchParams(mockReplace.mock.calls[0][0].split('?')[1])
    expect(Array.from(newPageActionParams.keys())).toHaveLength(1)
    expect(newPageActionParams.get(PAGE_PARAM)).toEqual(page.toString())
  })

  it('should set sort to provided value when filter action is dispatched', async () => {
    const sort: PokeSearchSortKey = 'name'

    const searchParams = new URLSearchParams()
    searchParams.set(SORT_PARAM, sort)
    mockUseSearchParams.mockReturnValue(new ReadonlyURLSearchParams(searchParams))

    render(
      <PokeSearchParamsProvider>
        <TestPokeSearchContextConsumer />
      </PokeSearchParamsProvider>
    )

    await userEvent.click(screen.getByRole('button', { name: `sort:${sort}` }))

    expect(mockReplace).toHaveBeenCalledTimes(1)
    const filterSortActionParams = new URLSearchParams(mockReplace.mock.calls[0][0].split('?')[1])
    expect(Array.from(filterSortActionParams.keys())).toHaveLength(2)
    expect(filterSortActionParams.get(PAGE_PARAM)).toEqual(DEFAULT_POKE_SEARCH_PARAMS.page.toString())
    expect(filterSortActionParams.get(SORT_PARAM)).toEqual(sort)
  })

  it('should set types to provided value when filter action is dispatched', async () => {
    const validTypes: PokeType[] = ['grass', 'poison', 'grass']

    const searchParams = new URLSearchParams()
    validTypes.forEach(type => { searchParams.append(TYPES_PARAM, type) })
    mockUseSearchParams.mockReturnValue(new ReadonlyURLSearchParams(searchParams))

    render(
      <PokeSearchParamsProvider>
        <TestPokeSearchContextConsumer />
      </PokeSearchParamsProvider>
    )

    await userEvent.click(screen.getByRole('button', { name: 'grass' }))
    await userEvent.click(screen.getByRole('button', { name: 'poison' }))
    await userEvent.click(screen.getByRole('button', { name: /all types/i }))

    expect(mockReplace).toHaveBeenCalledTimes(3)
    const grassFilterParams = new URLSearchParams(mockReplace.mock.calls[0][0].split('?')[1])
    expect(Array.from(grassFilterParams.keys())).toHaveLength(2)
    expect(grassFilterParams.get(PAGE_PARAM)).toEqual(DEFAULT_POKE_SEARCH_PARAMS.page.toString())
    expect(grassFilterParams.get(TYPES_PARAM)).toEqual('grass')

    const poisonFilterParams = new URLSearchParams(mockReplace.mock.calls[1][0].split('?')[1])
    expect(Array.from(poisonFilterParams.keys())).toHaveLength(2)
    expect(poisonFilterParams.get(PAGE_PARAM)).toEqual(DEFAULT_POKE_SEARCH_PARAMS.page.toString())
    expect(poisonFilterParams.get(TYPES_PARAM)).toEqual('poison')

    const multipleTypesFilterParams = new URLSearchParams(mockReplace.mock.calls[2][0].split('?')[1])
    expect(Array.from(multipleTypesFilterParams.keys())).toHaveLength(3)
    expect(multipleTypesFilterParams.get(PAGE_PARAM)).toEqual(DEFAULT_POKE_SEARCH_PARAMS.page.toString())
    expect(multipleTypesFilterParams.getAll(TYPES_PARAM).sort()).toEqual(['grass', 'poison'].sort())
  })
})

function TestPokeSearchContextConsumer (): ReactElement {
  const { query, page, sort, types, dispatch } = useContext(PokeSearchParamsContext)

  return (
    <main>
      <button type='button' onClick={(e) => { dispatch?.('SUBMIT_QUERY', { query }) }}>query:{query}</button>
      <button type='button' onClick={(e) => { dispatch?.('NEW_PAGE', { page }) }}>page:{page}</button>
      <button type='button' onClick={(e) => { dispatch?.('FILTER', { sort }) }}>sort:{sort}</button>
      <ul aria-label='types'>
        {Array.from(types).map(t =>
        <li key={t}>
            <button type='button' onClick={(e) => { dispatch?.('FILTER', { types: new Set<PokeType>([t]) }) }}>{t}</button>
        </li>)
        }
      </ul>
      <button type='button' onClick={(e) => { dispatch?.('FILTER', { types }) }}>all types:{Array.from(types).join(',')}</button>
    </main>
  )
}
