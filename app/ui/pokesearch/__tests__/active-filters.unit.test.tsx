import TypesParamContext, { type TypesParamContextValue } from '@/app/context/poke-types-param'
import { render, screen, within } from '@testing-library/react'
import { type ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import ActiveFilters from '../active-filters'
import { POKE_TYPES, type PokeType } from '@/app/lib/constants'
import userEvent from '@testing-library/user-event'
import QueryParamContext, { type QueryParamsContextValue } from '@/app/context/query-param'

describe('Active filters', () => {
  it('should display an empty list when no query or type filters are present', () => {
    render(<ActiveFilters/>)

    const filterList = screen.getByRole('list', { name: /filters/i })
    expect(filterList).toBeInTheDocument()
    expect(within(filterList).queryByRole('button')).not.toBeInTheDocument()
    POKE_TYPES.forEach(type =>
      expect(screen.queryByRole('button', { name: new RegExp(type, 'i') })).not.toBeInTheDocument()
    )
  })

  it('should display list, type tags that are enabled, and query, and remove filters clicked and query if clicked', async () => {
    const types = new Set<PokeType>(['grass', 'poison'] as PokeType[])
    const mockSetTypes = vi.fn()
    const mockSetQuery = vi.fn()
    const contextValue: ContextValue = {
      types,
      setTypes: mockSetTypes,
      query: 'bulbasaur',
      setQuery: mockSetQuery
    }
    customRender(<ActiveFilters />, { contextValue })

    expect(screen.getByRole('list', { name: /filters/i })).toBeInTheDocument()
    Array.from(types).forEach(type =>
      expect(screen.queryByRole('button', { name: new RegExp(type, 'i') })).toBeInTheDocument()
    )

    await userEvent.click(screen.getByRole('button', { name: /grass/i }))
    expect(mockSetTypes).toHaveBeenCalledOnce()
    expect(mockSetTypes.mock.calls[0][0]).toEqual(new Set(['poison'] as PokeType[]))

    await userEvent.click(screen.getByRole('button', { name: /bulbasaur/i }))
    expect(mockSetQuery).toHaveBeenCalledOnce()
    expect(mockSetQuery.mock.calls[0][0]).toEqual('')
  })
})

type RenderParameters = Parameters<typeof render>
type ContextValue = TypesParamContextValue & QueryParamsContextValue
const customRender = (ui: ReactElement, { contextValue, renderOptions }: { contextValue: ContextValue, renderOptions?: RenderParameters[1] }): ReturnType<typeof render> => {
  const { query, setQuery, types, setTypes } = contextValue
  return render(
    <TypesParamContext.Provider value={{ types, setTypes }}>
      <QueryParamContext.Provider value={{ query, setQuery }}>
        {ui}
      </QueryParamContext.Provider>
    </TypesParamContext.Provider>,
    renderOptions
  )
}
