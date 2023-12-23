import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import UnderConstruction from '../under-construction'

describe('Under construction', () => {
  it('should have a home link and construction title', () => {
    render(<UnderConstruction />)

    expect(screen.getByRole('heading', { name: /construction/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/')
  })
})
