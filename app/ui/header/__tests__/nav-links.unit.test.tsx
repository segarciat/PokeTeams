import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import NavLinks, { type NavLinkContent } from '../nav-links'
import userEvent from '@testing-library/user-event'

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn()
}))

vi.mock('next/navigation', () => ({
  usePathname: mockUsePathname
}))

const links: NavLinkContent[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Search', href: '/search' }
] as const

describe('Nav links', () => {
  it('should set the current link according to the pathname and href', () => {
    mockUsePathname.mockReturnValueOnce(links[0].href)
    const { rerender } = render(<NavLinks links={links} onClick={vi.fn()}/>)

    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent(links[0].name)

    mockUsePathname.mockReturnValueOnce(links[1].href)
    rerender(<NavLinks links={links} onClick={vi.fn()} />)

    expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent(links[1].name)
  })

  it('should call handler when link is clicked', async () => {
    const mockOnClick = vi.fn()
    mockUsePathname.mockReturnValueOnce(links[0].href)
    render(<NavLinks links={links} onClick={mockOnClick} />)

    await userEvent.click(screen.getByRole('link', { current: 'page' }))
    expect(mockOnClick).toHaveBeenCalledOnce()
  })
})
