import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Search from '../search'
import userEvent from '@testing-library/user-event'
import { type PokeSearchParamAction } from '@/app/lib/definitions'

describe('search form', () => {
  it('should display form with labeled search input', async () => {
    const mockSubmit = vi.fn()
    render(<Search placeholder='pokesearch input' defaultQuery='' onSubmit={mockSubmit}/>)

    const search = screen.getByRole('search')
    expect(search).toBeInTheDocument()

    const input = within(search).getByLabelText(/pokesearch input/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')

    expect(within(search).queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
  })

  it('should clear input value when clear button is clicked', async () => {
    const mockSubmit = vi.fn()
    render(<Search placeholder='pokesearch input' defaultQuery='default test input' onSubmit={mockSubmit}/>)

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
    const mockSubmit = vi.fn()
    render(<Search placeholder='pokesearch input' defaultQuery='' onSubmit={mockSubmit}/>)

    await userEvent.type(screen.getByLabelText(/pokesearch input/i), 'hello')
    fireEvent.submit(screen.getByRole('search'))

    expect(mockSubmit).toHaveBeenCalledTimes(1)
    const expectedArg: PokeSearchParamAction = {
      action: 'SUBMIT_QUERY',
      query: 'hello'
    }
    expect(mockSubmit.mock.calls[0][0]).toEqual(expectedArg)
  })

  it('should not have a query parameter when search input is empty', async () => {
    const mockSubmit = vi.fn()
    render(<Search placeholder='pokesearch input' defaultQuery='' onSubmit={mockSubmit}/>)

    fireEvent.submit(screen.getByRole('search'))

    const expectedArg: PokeSearchParamAction = {
      action: 'SUBMIT_QUERY',
      query: ''
    }
    expect(mockSubmit).toHaveBeenCalledTimes(1)
    expect(mockSubmit.mock.calls[0][0]).toEqual(expectedArg)
  })
})
