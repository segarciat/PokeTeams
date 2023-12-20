import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Results, { RESULTS_PER_PAGE } from '../results'
import { type PokemonSummary } from '@/app/lib/definitions'
import { type PokeType } from '@/app/lib/constants'
import { type ReactElement } from 'react'
import QueryParamContext, { type QueryParamsContextValue } from '@/app/context/query-param'
import PageParamContext, { type PageParamContextValue } from '@/app/context/page-param'
import TypesParamContext, { type TypesParamContextValue } from '@/app/context/poke-types-param'
import { isNotFoundError } from 'next/dist/client/components/not-found'

// TODO: The comment below is stale, so results unit tests may be updated so as to not mock CardList.
// Results has a child async component CardList (React Server Component), and currently there's no clear way to test this.
// See: https://github.com/testing-library/react-testing-library/issues/1209

const pokemon: PokemonSummary = {
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

describe('PokeSearch Results', () => {
  it('should display no results page when no matches are found', () => {
    const contextValue: ContextValue = {
      query: '?!@#@1',
      setQuery: vi.fn(),
      page: 1,
      setPage: vi.fn(),
      types: new Set<PokeType>(),
      setTypes: vi.fn()
    }
    customRender(<Results allPokemon={[pokemon]}/>, { contextValue })
    expect(screen.queryByRole('list', { name: /cards/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /no results/i })).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it.each([{
    query: pokemon.name
  }, {
    types: new Set<PokeType>([pokemon.types[0].name] as PokeType[])
  }
  ])('should display pokemon cards and no pagination when there are too few matches for the the filters: %s', ({ query, types }) => {
    const contextValue: ContextValue = {
      query: query ?? '',
      setQuery: vi.fn(),
      page: 1,
      setPage: vi.fn(),
      types: types ?? new Set<PokeType>(),
      setTypes: vi.fn()
    }
    customRender(<Results allPokemon={[pokemon]} />, { contextValue })
    expect(screen.queryByRole('heading', { name: /no results/i })).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: /cards/i })).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('should display pokemon cards and pagination when there are too many matches for the the filters', () => {
    const allPokemon: PokemonSummary[] = Array(RESULTS_PER_PAGE + 1).fill(pokemon).map((p, i) => ({
      ...pokemon,
      name: pokemon.name + i
    }))
    const contextValue: ContextValue = {
      query: pokemon.name,
      setQuery: vi.fn(),
      page: 1,
      setPage: vi.fn(),
      types: new Set<PokeType>(),
      setTypes: vi.fn()
    }
    customRender(<Results allPokemon={allPokemon} />, { contextValue })
    expect(screen.queryByRole('heading', { name: /no results/i })).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: /cards/i })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: /pagination/i })).toBeInTheDocument()
  })

  it('should throw not found error when there are results but an invalid page is requested', () => {
    const contextValue: ContextValue = {
      query: pokemon.name,
      setQuery: vi.fn(),
      page: 2,
      setPage: vi.fn(),
      types: new Set<PokeType>(),
      setTypes: vi.fn()
    }
    try {
      customRender(<Results allPokemon={[pokemon]} />, { contextValue })
      throw new Error('Should have thrown not found')
    } catch (error) {
      expect(isNotFoundError(error)).toBeTruthy()
    }
  })
})

type RenderParameters = Parameters<typeof render>
type ContextValue = QueryParamsContextValue & PageParamContextValue & TypesParamContextValue
const customRender = (ui: ReactElement, { contextValue, renderOptions }: { contextValue: ContextValue, renderOptions?: RenderParameters[1] }): ReturnType<typeof render> => {
  const { query, setQuery, page, setPage, types, setTypes } = contextValue
  return render(
    <QueryParamContext.Provider value={{ query, setQuery }}>
      <PageParamContext.Provider value={ { page, setPage }}>
        <TypesParamContext.Provider value={{ types, setTypes }}>
          {ui}
        </TypesParamContext.Provider>
      </PageParamContext.Provider>
    </QueryParamContext.Provider>,
    renderOptions
  )
}
