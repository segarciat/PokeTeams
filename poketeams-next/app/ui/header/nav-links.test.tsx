/**
 * @jest-environment jsdom
 */

import { describe, it, expect, jest, beforeAll } from '@jest/globals'
import { render, screen } from '@testing-library/react'

const usePathnameMock = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: usePathnameMock
}))

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let NavLinks: typeof import('./nav-links').default
beforeAll(async () => {
  NavLinks = (await import('./nav-links')).default
})

describe('Navbar Links', () => {
  it('should mark link as current according to pathname', async () => {
    usePathnameMock.mockReturnValueOnce('/')
    render(<NavLinks />)
    expect(screen.getByRole('link', { name: /home/i, current: 'page' })).toBeInTheDocument()
    const pokesearchLink = screen.getByRole('link', { name: /pokesearch/i, current: false })
    expect(pokesearchLink).toBeInTheDocument()

    usePathnameMock.mockReturnValueOnce(pokesearchLink.getAttribute('href'))
    render(<NavLinks/>)
    expect(screen.getByRole('link', { name: /home/i, current: false })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pokesearch/i, current: 'page' }))
  })
})
