import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Results, { RESULTS_PER_PAGE } from '../results'
import { type PokeSearchParamAction, type PokemonSummary } from '@/app/lib/definitions'
import { type PokeType } from '@/app/lib/constants'
import userEvent from '@testing-library/user-event'

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

// TODO: The comment below is stale, so results unit tests may be updated so as to not mock CardList.
// Results has a child async component CardList (React Server Component), and currently there's no clear way to test this.
// See: https://github.com/testing-library/react-testing-library/issues/1209

describe('pokesearch results', () => {
  it('should display fallback image and text when no results are found', () => {
    const handleParamsAction = vi.fn()
    render(<Results matches={[]} query={''} filters={new Set()} page={1} onParamsAction={handleParamsAction}/>)
    expect(screen.queryByRole('heading', { name: /no results/i })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: /card/i })).not.toBeInTheDocument()
  })

  it('should display a list when the results are found, and pagination if more than 1 page is available', () => {
    const handleParamsAction = vi.fn()
    CardListMock.mockReturnValue(<ol aria-label='cards'><li>test</li></ol>)
    PaginationMock.mockReturnValue(<nav></nav>)
    const matches: PokemonSummary[] = [{
      id: 1,
      name: 'bulbasaur',
      types: [{ name: 'grass', url: 'https://grass.com' }],
      spriteSrcs: {
        frontDefault: null,
        backDefault: null,
        frontShiny: null,
        backShiny: null
      }
    }]

    const activeFilters = new Set<PokeType>()

    const { rerender } = render(<Results matches={matches} query='b' filters={activeFilters} page={1} onParamsAction={handleParamsAction}/>)
    expect(screen.queryByRole('heading', { name: /no results/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: /card/i })).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()

    rerender(<Results matches={Array(RESULTS_PER_PAGE + 1).fill(matches[0])} query='b' filters={activeFilters} page={1} onParamsAction={handleParamsAction}/>)
    expect(screen.queryByRole('heading', { name: /no results/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: /card/i })).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).toBeInTheDocument()
  })

  it('should show type filters when any is present, and updaters on click', async () => {
    const handleParamsAction = vi.fn()
    const activeFilters = new Set<PokeType>(['grass', 'poison', 'dragon'] as PokeType[])
    render(<Results matches={[]} query='' filters={activeFilters} page={1} onParamsAction={handleParamsAction} />)

    expect(screen.queryByRole('list', { name: /activefilter/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /grass/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dragon/i })).toBeInTheDocument()
    const poisonButton = screen.getByRole('button', { name: /poison/i })
    expect(poisonButton).toBeInTheDocument()

    await userEvent.click(poisonButton)

    expect(handleParamsAction).toHaveBeenCalledOnce()
    const expectedArgs: PokeSearchParamAction = {
      action: 'FILTER',
      types: new Set<PokeType>(['grass', 'dragon'] as PokeType[])
    }
    expect(handleParamsAction.mock.calls[0][0]).toEqual(expectedArgs)
  })
})
