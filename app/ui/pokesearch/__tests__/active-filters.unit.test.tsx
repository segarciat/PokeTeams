import { render, screen, within } from '@testing-library/react'
import { type ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import ActiveFilters from '../active-filters'
import { POKE_TYPES, type PokeType } from '@/app/lib/constants'
import userEvent from '@testing-library/user-event'
import PokeSearchParamsContext, { DEFAULT_POKE_SEARCH_PARAMS, type PokeSearchParamsContextValue } from '@/app/context/poke-search-params'

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
    const query = 'bulbasaur'
    const mockDispatch = vi.fn()

    customRender(<ActiveFilters />, {
      contextValue: {
        types, query, dispatch: mockDispatch
      }
    })

    expect(screen.getByRole('list', { name: /filters/i })).toBeInTheDocument()
    Array.from(types).forEach(type =>
      expect(screen.queryByRole('button', { name: new RegExp(type, 'i') })).toBeInTheDocument()
    )

    await userEvent.click(screen.getByRole('button', { name: /grass/i }))
    await userEvent.click(screen.getByRole('button', { name: /bulbasaur/i }))

    expect(mockDispatch).toHaveBeenCalledTimes(2)

    expect(mockDispatch.mock.calls[0][0]).toEqual('FILTER')
    expect(mockDispatch.mock.calls[0][1]).toEqual({ types: new Set<PokeType>(['poison']) })

    expect(mockDispatch.mock.calls[1][0]).toEqual('SUBMIT_QUERY')
    expect(mockDispatch.mock.calls[1][1]).toEqual({ query: '' })
  })
})

type RenderParameters = Parameters<typeof render>
const customRender = (ui: ReactElement, { contextValue, renderOptions }: {
  contextValue: Pick<PokeSearchParamsContextValue, 'dispatch' | 'types' | 'query'>
  renderOptions?: RenderParameters[1]
}): ReturnType<typeof render> => {
  return render(
    <PokeSearchParamsContext.Provider value={{
      ...DEFAULT_POKE_SEARCH_PARAMS,
      ...contextValue
    }}>
      {ui}
    </PokeSearchParamsContext.Provider>,
    renderOptions
  )
}
