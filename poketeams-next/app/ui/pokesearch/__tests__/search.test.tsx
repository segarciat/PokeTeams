import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Search from '../search'
import userEvent from '@testing-library/user-event'

const { mockReplace, mockUsePathname, mockUseSearchParams } = vi.hoisted(() => ({
  mockUseSearchParams: vi.fn(),
  mockUsePathname: vi.fn().mockReturnValue('/path'),
  mockReplace: vi.fn()
}))

vi.mock('next/navigation', () => ({
  useSearchParams: mockUseSearchParams,
  usePathname: mockUsePathname,
  useRouter: vi.fn().mockReturnValue({ replace: mockReplace })
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('search form', () => {
  it('should display form with labeled search input', async () => {
    render(<Search placeholder='pokesearch input'/>)
    const search = screen.getByRole('search')
    expect(search).toBeInTheDocument()
    const input = within(search).getByLabelText(/pokesearch input/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('should have default text on input', () => {
    const params = new URLSearchParams()
    params.set('query', 'default test input')
    mockUseSearchParams.mockReturnValueOnce(params)
    render(<Search placeholder='pokesearch input' />)
    const search = screen.getByRole('search')
    expect(search).toBeInTheDocument()
    const input = within(search).getByLabelText(/pokesearch input/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('default test input')
  })

  it('should set page parameter to 1 and query parameter to the input value', async () => {
    render(<Search placeholder='pokesearch input' />)
    await userEvent.type(screen.getByLabelText(/pokesearch input/i), 'hello')
    fireEvent.submit(screen.getByRole('search'))

    expect(mockReplace).toHaveBeenCalledTimes(1)
    const arg: string = mockReplace.mock.calls[0][0]
    expect(arg).toMatch(/^\/path\?/)
    expect(arg).toMatch(/query=hello/)
    expect(arg).toMatch(/page=1/)
  })

  it('should not have a query parameter when search input is empty', async () => {
    render(<Search placeholder='pokesearch input' />)
    fireEvent.submit(screen.getByRole('search'))

    expect(mockReplace).toHaveBeenCalledTimes(1)
    const arg: string = mockReplace.mock.calls[0][0]
    expect(arg).toMatch(/^\/path\?/)
    expect(arg).toMatch(/page=1/)
    expect(arg).not.toMatch(/query/)
  })
})
