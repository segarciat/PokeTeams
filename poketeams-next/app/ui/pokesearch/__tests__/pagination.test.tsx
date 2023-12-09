import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Pagination from '../pagination'

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

describe('pagination', () => {
  it('should display next link if the current is not the last page', () => {
    render(<Pagination page={1} totalPages={7} />)
    const pagination = screen.getByRole('navigation', { name: /pagination/i })
    expect(pagination).toBeVisible()
    expect(within(pagination).getByRole('button', { name: /next/i })).toBeVisible()
  })

  it('should display previous link if current is not first page', () => {
    render(<Pagination page={7} totalPages={7} />)
    const pagination = screen.getByRole('navigation', { name: /pagination/i })
    expect(pagination).toBeVisible()
    expect(within(pagination).getByRole('button', { name: /previous/i })).toBeVisible()
  })
})
