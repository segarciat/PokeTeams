import { describe, expect, vi, beforeAll, it } from 'vitest'
import { render, screen } from '@testing-library/react'

const usePathnameMock = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock
}))

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let Navbar: typeof import('../navbar').default
beforeAll(async () => {
  Navbar = (await import('../navbar')).default
})

describe('Navbar', () => {
  it('should display navigation links, site actions, and logo', () => {
    const mockIsSideNavOpen = vi.fn()
    render(<Navbar title='test title' isSideNavOpen={false} setIsSideNavOpen={mockIsSideNavOpen} />)
    expect(screen.queryByRole('heading', { level: 1, name: /test title/i })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: /site navigation/i })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: /site actions/i })).toBeInTheDocument()
  })

  it('pathname changes the current navigation link', () => {
    const mockIsSideNavOpen = vi.fn()
    usePathnameMock
      .mockReturnValueOnce('/')
      .mockReturnValueOnce('/pokesearch')

    const { rerender } = render(<Navbar title='test title' isSideNavOpen={true} setIsSideNavOpen={mockIsSideNavOpen} />)
    expect(screen.queryByRole('link', { name: /home/i, current: 'page' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /pokesearch/i, current: false })).toBeInTheDocument()

    rerender(<Navbar title='test title' isSideNavOpen={true} setIsSideNavOpen={mockIsSideNavOpen} />)
    expect(screen.queryByRole('link', { name: /home/i, current: false })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /pokesearch/i, current: 'page' })).toBeInTheDocument()
  })
})
