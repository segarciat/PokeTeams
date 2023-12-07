import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Results from '../results'

const { CardListMock } = vi.hoisted(() => ({
  CardListMock: vi.fn()
}))

vi.mock('../card-list', () => ({
  default: CardListMock
}))

afterEach(() => {
  vi.clearAllMocks()
})

// Results has a child async component CardList (React Server Component), and currently there's no clear way to test this.
// See: https://github.com/testing-library/react-testing-library/issues/1209

describe('pokesearch results', () => {
  it('should display fallback image and text when no results are found', () => {
    render(<Results allPokemons={[]} query={''} page={1}/>)
    expect(screen.queryByRole('heading', { name: /no results/i })).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('should display a list when the results are found', () => {
    CardListMock.mockReturnValue(<ul><li>test</li></ul>)
    render(<Results allPokemons={['bulbasaur']} query='b' page={1}/>)
    expect(screen.queryByRole('heading', { name: /no results/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('list')).toBeInTheDocument()
  })
})
