import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NotFound from '../not-found'

describe('Not found page', () => {
  it('should have a home link and construction title', () => {
    render(<NotFound />)

    expect(screen.getByRole('img', { name: /not found/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/')
  })
})
