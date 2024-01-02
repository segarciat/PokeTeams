import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Search from '../search'
import userEvent from '@testing-library/user-event'
import { type ReactElement } from 'react'
import PokeSearchParamsContext, { DEFAULT_POKE_SEARCH_PARAMS, type PokeSearchParamsContextValue } from '@/app/context/poke-search-params'

describe('search form', () => {
  it('should display form with labeled search input', async () => {
    render(<Search placeholder='pokesearch input'/>)

    const search = screen.getByRole('search')
    expect(search).toBeInTheDocument()

    const input = within(search).getByLabelText(/pokesearch input/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')

    expect(within(search).queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
  })

  it('should clear input value when clear button is clicked', async () => {
    const query = 'default test input'
    customRender(<Search placeholder='pokesearch input' />, { contextValue: { query, dispatch: vi.fn() } })

    const search = screen.getByRole('search')
    expect(search).toBeInTheDocument()

    const input = within(search).getByLabelText(/pokesearch input/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue(query)

    const clearInputButton = within(search).getByRole('button', { name: /clear/i })
    expect(clearInputButton).toBeInTheDocument()

    await userEvent.click(clearInputButton)
    expect(input).toHaveValue('')
  })

  it('should set page parameter to 1 and query parameter to the input value', async () => {
    const mockDispatch = vi.fn()
    const query = ''
    const userInputText = 'hello'
    customRender(<Search placeholder='pokesearch input' />, { contextValue: { query, dispatch: mockDispatch } })

    await userEvent.type(screen.getByLabelText(/pokesearch input/i), userInputText)
    fireEvent.submit(screen.getByRole('search'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch.mock.calls[0][0]).toEqual('SUBMIT_QUERY')
    expect(mockDispatch.mock.calls[0][1]).toEqual({ query: userInputText })
  })

  it('should not have a query parameter when search input is empty', async () => {
    const mockDispatch = vi.fn()
    const query = ''
    customRender(<Search placeholder='pokesearch input' />, { contextValue: { query, dispatch: mockDispatch } })

    fireEvent.submit(screen.getByRole('search'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch.mock.calls[0][0]).toEqual('SUBMIT_QUERY')
    expect(mockDispatch.mock.calls[0][1]).toEqual({ query })
  })
})

type RenderParameters = Parameters<typeof render>
const customRender = (ui: ReactElement, { contextValue, renderOptions }: {
  contextValue: Pick<PokeSearchParamsContextValue, 'dispatch' | 'query'>
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
