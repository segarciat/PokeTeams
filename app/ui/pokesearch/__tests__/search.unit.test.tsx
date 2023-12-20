import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Search from '../search'
import userEvent from '@testing-library/user-event'
import { type ReactElement } from 'react'
import QueryParamContext, { type QueryParamsContextValue } from '@/app/context/query-param'

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
    const contextValue: QueryParamsContextValue = {
      query: 'default test input',
      setQuery: vi.fn()
    }
    customRender(<Search placeholder='pokesearch input' />, { contextValue })

    const search = screen.getByRole('search')
    expect(search).toBeInTheDocument()

    const input = within(search).getByLabelText(/pokesearch input/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('default test input')

    const clearInputButton = within(search).getByRole('button', { name: /clear/i })
    expect(clearInputButton).toBeInTheDocument()

    await userEvent.click(clearInputButton)
    expect(input).toHaveValue('')
  })

  it('should set page parameter to 1 and query parameter to the input value', async () => {
    const mockSetQuery = vi.fn()
    const contextValue: QueryParamsContextValue = {
      query: '',
      setQuery: mockSetQuery
    }
    customRender(<Search placeholder='pokesearch input' />, { contextValue })

    await userEvent.type(screen.getByLabelText(/pokesearch input/i), 'hello')
    fireEvent.submit(screen.getByRole('search'))

    expect(mockSetQuery).toHaveBeenCalledTimes(1)
    expect(mockSetQuery.mock.calls[0][0]).toEqual('hello')
  })

  it('should not have a query parameter when search input is empty', async () => {
    const mockSetQuery = vi.fn()
    const contextValue: QueryParamsContextValue = {
      query: '',
      setQuery: mockSetQuery
    }
    customRender(<Search placeholder='pokesearch input' />, { contextValue })

    fireEvent.submit(screen.getByRole('search'))

    expect(mockSetQuery).toHaveBeenCalledTimes(1)
    expect(mockSetQuery.mock.calls[0][0]).toEqual('')
  })
})

type RenderParameters = Parameters<typeof render>
const customRender = (ui: ReactElement, { contextValue, renderOptions }: { contextValue: QueryParamsContextValue, renderOptions?: RenderParameters[1] }): ReturnType<typeof render> => {
  return render(
    <QueryParamContext.Provider value={{ ...contextValue }}>{ui}</QueryParamContext.Provider>,
    renderOptions
  )
}
