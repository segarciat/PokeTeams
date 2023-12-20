import TypesParamContext, { type TypesParamContextValue } from '@/app/context/poke-types-param'
import { render, screen } from '@testing-library/react'
import { type ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import Summary from '../summary'
import { type PokeType } from '@/app/lib/constants'
import userEvent from '@testing-library/user-event'

describe('Pokemon summary', () => {
  it('should set type when clicked', async () => {
    const mockSetTypes = vi.fn()
    const contextValue: TypesParamContextValue = {
      types: new Set<PokeType>(),
      setTypes: mockSetTypes
    }
    customRender(
    <Summary name='bulbasaur' types={[{ name: 'grass', url: 'grass.com' }, { name: 'poison', url: 'poison.com' }]}/>, {
      contextValue
    })

    await userEvent.click(screen.getByRole('button', { name: /grass/i }))
    expect(mockSetTypes).toHaveBeenCalledOnce()
    expect(mockSetTypes.mock.calls[0][0]).toEqual(new Set(['grass'] as PokeType[]))
  })
})

type RenderParameters = Parameters<typeof render>
const customRender = (ui: ReactElement, { contextValue, renderOptions }: { contextValue: TypesParamContextValue, renderOptions?: RenderParameters[1] }): ReturnType<typeof render> => {
  return render(
    <TypesParamContext.Provider value={{ ...contextValue }}>{ui}</TypesParamContext.Provider>,
    renderOptions
  )
}
