import { describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import NavActions from './nav-actions'

describe('NavActions', () => {
  it('should display either open or close button, not both', () => {
    const mockFunction = jest.fn()
    const { rerender } = render(<NavActions isNavMenuOpen={false} onOpenNavMenu={mockFunction} onCloseNavMenu={mockFunction} />)
    expect(true).toBeTruthy()
    expect(screen.getByRole('button', { name: /open/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()

    rerender(<NavActions isNavMenuOpen={true} onOpenNavMenu={mockFunction} onCloseNavMenu={mockFunction} />)
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /open/i })).not.toBeInTheDocument()
  })
})
