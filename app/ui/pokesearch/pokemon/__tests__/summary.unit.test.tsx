import { render, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import Summary from '../summary'
import { type PokeType } from '@/app/lib/constants'
import userEvent from '@testing-library/user-event'
import PokeSearchParamsContext, { type PokeSearchParamsContextValue, DEFAULT_POKE_SEARCH_PARAMS } from '@/app/context/poke-search-params'

describe('Pokemon summary', () => {
  it('should set type when clicked', async () => {
    const mockDispatch = vi.fn()
    customRender(
    <Summary name='bulbasaur' types={[{ name: 'grass', url: 'grass.com' }, { name: 'poison', url: 'poison.com' }]}/>, {
      contextValue: { dispatch: mockDispatch }
    })

    await userEvent.click(screen.getByRole('button', { name: /grass/i }))
    expect(mockDispatch).toHaveBeenCalledOnce()
    expect(mockDispatch.mock.calls[0][0]).toEqual('FILTER')
    expect(mockDispatch.mock.calls[0][1]).toEqual({ types: new Set(['grass'] as PokeType[]) })
  })
})

type RenderParameters = Parameters<typeof render>
const customRender = (ui: ReactElement, { contextValue, renderOptions }: {
  contextValue: Pick<PokeSearchParamsContextValue, 'dispatch'>
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
