import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Pagination from '../pagination'
import userEvent from '@testing-library/user-event'

describe('pagination', () => {
  it('should display next and last link if the current is not the last page', () => {
    const handlePageClick = vi.fn()
    render(<Pagination page={1} totalPages={7} onNewPage={handlePageClick}/>)
    const pagination = screen.getByRole('list', { name: /pagination/i })
    expect(pagination).toBeVisible()
    expect(within(pagination).getByText(/1/i))
    expect(within(pagination).getByLabelText(/next/i)).toBeVisible()
    expect(within(pagination).getByLabelText(/last/i)).toBeVisible()
  })

  it('should display previous and first link if current is not first page', () => {
    const handlePageClick = vi.fn()
    render(<Pagination page={7} totalPages={7} onNewPage={handlePageClick}/>)
    const pagination = screen.getByRole('list', { name: /pagination/i })
    expect(pagination).toBeVisible()
    expect(within(pagination).getByText(/7/i)).toBeVisible()
    expect(within(pagination).getByLabelText(/previous/i)).toBeVisible()
    expect(within(pagination).getByLabelText(/first/i)).toBeVisible()
  })

  it('should call handler with correct page number when page button is clicked', async () => {
    const handlePageClick = vi.fn()
    const currentPage = 5
    const lastPage = 10
    render(<Pagination page={currentPage} totalPages={lastPage} onNewPage={handlePageClick} />)

    await userEvent.click(screen.getByText(/5/i)) // should not register event, it's current page.
    await userEvent.click(screen.getByText(/6/i))
    await userEvent.click(screen.getByLabelText(/previous/i))
    await userEvent.click(screen.getByLabelText(/next/i))
    await userEvent.click(screen.getByLabelText(/first/i))
    await userEvent.click(screen.getByLabelText(/last/i))

    expect(handlePageClick).toHaveBeenCalledTimes(5)
    expect(handlePageClick.mock.calls[0][0]).toEqual(6)
    expect(handlePageClick.mock.calls[1][0]).toEqual(currentPage - 1)
    expect(handlePageClick.mock.calls[2][0]).toEqual(currentPage + 1)
    expect(handlePageClick.mock.calls[3][0]).toEqual(1)
    expect(handlePageClick.mock.calls[4][0]).toEqual(lastPage)
  })

  it('should go to the typed page number when page number form is submitted', async () => {
    const handlePageClick = vi.fn()
    const currentPage = 5
    const lastPage = 10
    render(<Pagination page={currentPage} totalPages={lastPage} onNewPage={handlePageClick} />)

    expect(screen.getByLabelText(/desired page/i)).toHaveValue(5)
    await userEvent.type(screen.getByLabelText(/desired page/i), '{backspace}4')
    expect(screen.getByLabelText(/desired page/i)).toHaveValue(4)
    await userEvent.click(screen.getByRole('button', { name: /go/i }))

    expect(handlePageClick).toHaveBeenCalledTimes(1)
    expect(handlePageClick.mock.calls[0][0]).toEqual(4)
  })
})
