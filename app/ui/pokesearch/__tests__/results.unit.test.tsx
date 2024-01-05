import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Results, { RESULTS_PER_PAGE } from '../results'
import { type PokemonSummary } from '@/app/lib/definitions'
import { type PokeSearchSortKey, type PokeType } from '@/app/lib/constants'
import { type ReactElement } from 'react'
import { isNotFoundError } from 'next/dist/client/components/not-found'
import PokeSearchParamsContext, { DEFAULT_POKE_SEARCH_PARAMS, type PokeSearchParamsContextValue } from '@/app/context/poke-search-params'

// TODO: The comment below is stale, so results unit tests may be updated so as to not mock CardList.
// Results has a child async component CardList (React Server Component), and currently there's no clear way to test this.
// See: https://github.com/testing-library/react-testing-library/issues/1209

const bulbasaur: PokemonSummary = {
  id: 1,
  name: 'bulbasaur',
  types: [{ name: 'grass', url: 'http://grass.com' }],
  spriteSrcs: {
    frontDefault: null,
    backDefault: null,
    frontShiny: null,
    backShiny: null
  }
}

const absol: PokemonSummary = {
  id: 359,
  name: 'absol',
  types: [{ name: 'dark', url: 'http://dark.com' }],
  spriteSrcs: {
    frontDefault: null,
    backDefault: null,
    frontShiny: null,
    backShiny: null
  }
}

describe('PokeSearch Results', () => {
  it('should display no results page when no matches are found', () => {
    const mockDispatch = vi.fn()
    customRender(<Results allPokemon={[bulbasaur]} />, { contextValue: { ...DEFAULT_POKE_SEARCH_PARAMS, query: '#141$#!', dispatch: mockDispatch } })
    expect(screen.queryByRole('list', { name: /cards/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /no results/i })).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it.each([{
    query: bulbasaur.name
  }, {
    types: new Set<PokeType>([bulbasaur.types[0].name] as PokeType[])
  }
  ])('should display pokemon cards and no pagination when there are too few matches for the the filters: %s', ({ query, types }) => {
    customRender(<Results allPokemon={[bulbasaur]} />, {
      contextValue: {
        query: query ?? '', page: 1, sort: 'id', types: types ?? new Set<PokeType>(), dispatch: vi.fn()
      }
    })
    expect(screen.queryByRole('heading', { name: /no results/i })).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: /cards/i })).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('should display pokemon cards and pagination when there are too many matches for the the filters', () => {
    const allPokemon: PokemonSummary[] = Array(RESULTS_PER_PAGE + 1).fill(bulbasaur).map((p, i) => ({
      ...bulbasaur,
      name: bulbasaur.name + i
    }))

    customRender(<Results allPokemon={allPokemon} />, {
      contextValue: {
        query: bulbasaur.name, page: 1, sort: 'id', types: new Set<PokeType>(), dispatch: vi.fn()
      }
    })
    expect(screen.queryByRole('heading', { name: /no results/i })).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: /cards/i })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: /pagination/i })).toBeInTheDocument()
  })

  it.each([{
    sort: 'id' as PokeSearchSortKey,
    results: [/bulbasaur/i, /absol/i]
  }, {
    sort: 'name' as PokeSearchSortKey,
    results: [/absol/i, /bulbasaur/i]
  }])('should display results in order %s when sort key is %s', ({ sort, results }) => {
    customRender(<Results allPokemon={[bulbasaur, absol]} />, {
      contextValue: {
        query: 'a', page: 1, sort, types: new Set<PokeType>(), dispatch: vi.fn()
      }
    })
    expect(screen.queryByRole('heading', { name: /no results/i })).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: /cards/i })).toBeInTheDocument()
    const resultCards = screen.getAllByRole('article', { name: /card/i })
    expect(resultCards).toHaveLength(2)
    expect(resultCards[0]).toEqual(screen.getByRole('article', { name: results[0] }))
    expect(resultCards[1]).toEqual(screen.getByRole('article', { name: results[1] }))
  })

  it('should throw not found error when there are results but an invalid page is requested', () => {
    try {
      customRender(<Results allPokemon={[bulbasaur]} />, {
        contextValue: {
          query: bulbasaur.name, page: 2, sort: 'id', types: new Set<PokeType>(), dispatch: vi.fn()
        }
      })
      throw new Error('Should have thrown not found')
    } catch (error) {
      expect(isNotFoundError(error)).toBeTruthy()
    }
  })
})

type RenderParameters = Parameters<typeof render>
const customRender = (ui: ReactElement, { contextValue, renderOptions }: {
  contextValue: PokeSearchParamsContextValue
  renderOptions?: RenderParameters[1]
}): ReturnType<typeof render> => {
  return render(
    <PokeSearchParamsContext.Provider value={{
      ...DEFAULT_POKE_SEARCH_PARAMS,
      ...contextValue
    }}>
      {ui}
    </PokeSearchParamsContext.Provider>,
    renderOptions
  )
}
