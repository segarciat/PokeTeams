import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Results, { RESULTS_PER_PAGE } from '../results'

const { CardListMock, PaginationMock } = vi.hoisted(() => ({
  CardListMock: vi.fn(),
  PaginationMock: vi.fn()
}))

vi.mock('../card-list', () => ({
  default: CardListMock
}))

vi.mock('../pagination', () => ({
  default: PaginationMock
}))

afterEach(() => {
  vi.clearAllMocks()
})

// Results has a child async component CardList (React Server Component), and currently there's no clear way to test this.
// See: https://github.com/testing-library/react-testing-library/issues/1209

describe('pokesearch results', () => {
  it('should display fallback image and text when no results are found', () => {
    const handleParamsAction = vi.fn()
    render(<Results matches={[]} query={''} page={1} onParamsAction={handleParamsAction}/>)
    expect(screen.queryByRole('heading', { name: /no results/i })).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('should display a list when the results are found, and pagination if more than 1 page is available', () => {
    const handleParamsAction = vi.fn()
    CardListMock.mockReturnValue(<ol><li>test</li></ol>)
    PaginationMock.mockReturnValue(<nav></nav>)

    const { rerender } = render(<Results matches={['bulbasaur']} query='b' page={1} onParamsAction={handleParamsAction}/>)
    expect(screen.queryByRole('heading', { name: /no results/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('list')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()

    rerender(<Results matches={Array.from('b'.repeat(RESULTS_PER_PAGE + 1))} query='b' page={1} onParamsAction={handleParamsAction}/>)
    expect(screen.queryByRole('heading', { name: /no results/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('list')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).toBeInTheDocument()
  })
})
