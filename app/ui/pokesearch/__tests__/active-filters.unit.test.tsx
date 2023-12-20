import TypesParamContext, { type TypesParamContextValue } from '@/app/context/poke-types-param'
import { render, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import ActiveFilters from '../active-filters'
import { POKE_TYPES, type PokeType } from '@/app/lib/constants'
import userEvent from '@testing-library/user-event'

describe('Active filters', () => {
  it('should display an empty list when no type filters are present', () => {
    render(<ActiveFilters/>)

    expect(screen.getByRole('list', { name: /filters/i })).toBeInTheDocument()
    POKE_TYPES.forEach(type =>
      expect(screen.queryByRole('button', { name: new RegExp(type, 'i') })).not.toBeInTheDocument()
    )
  })

  it('should display list and type tags that are enabled, and remove filters clicked', async () => {
    const types = new Set<PokeType>(['grass', 'poison'] as PokeType[])
    const mockSetTypes = vi.fn()
    const contextValue: TypesParamContextValue = {
      types,
      setTypes: mockSetTypes
    }
    customRender(<ActiveFilters />, { contextValue })

    expect(screen.getByRole('list', { name: /filters/i })).toBeInTheDocument()
    Array.from(types).forEach(type =>
      expect(screen.queryByRole('button', { name: new RegExp(type, 'i') })).toBeInTheDocument()
    )

    await userEvent.click(screen.getByRole('button', { name: /grass/i }))
    expect(mockSetTypes).toHaveBeenCalledOnce()
    expect(mockSetTypes.mock.calls[0][0]).toEqual(new Set(['poison'] as PokeType[]))
  })
})

type RenderParameters = Parameters<typeof render>
const customRender = (ui: ReactElement, { contextValue, renderOptions }: { contextValue: TypesParamContextValue, renderOptions?: RenderParameters[1] }): ReturnType<typeof render> => {
  return render(
    <TypesParamContext.Provider value={{ ...contextValue }}>{ui}</TypesParamContext.Provider>,
    renderOptions
  )
}
