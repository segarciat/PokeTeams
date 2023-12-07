import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Results from '../results'

// Results has a child async component CardList (React Server Component), and currently there's no clear way to test this.
// See: https://github.com/testing-library/react-testing-library/issues/1209

describe('pokesearch results', () => {
  it('should display fallback image and text when no results are found', () => {
    render(<Results allPokemons={[]} query={''} page={1}/>)
    expect(screen.queryByRole('heading', { name: /no results/i })).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
