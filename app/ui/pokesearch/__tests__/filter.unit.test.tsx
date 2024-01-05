import { describe, expect, it, vi } from 'vitest'
import Filter from '../filter'
import { render, screen, within } from '@testing-library/react'
import { POKE_TYPES, type PokeSearchSortKey, type PokeType } from '@/app/lib/constants'
import userEvent from '@testing-library/user-event'
import { type ReactElement } from 'react'
import PokeSearchParamsContext, { DEFAULT_POKE_SEARCH_PARAMS, type PokeSearchParamsContextValue } from '@/app/context/poke-search-params'

describe('pokesearch filter', () => {
  it('should hide filter form until filter button is clicked', async () => {
    render(<Filter />)

    expect(screen.queryByRole('form', { name: /filter/i })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /openFilters/i }))
    expect(screen.queryByRole('form', { name: /filter/i })).toBeInTheDocument()
  })
  it('should display default types as enabled, and on-click, and show as not pressed when unclicked', async () => {
    const enabledTypes = new Set<PokeType>(['grass', 'poison'])
    const disabledTypes = new Set(POKE_TYPES.filter(type => !enabledTypes.has(type)))

    customRender(<Filter />, { contextValue: { types: enabledTypes, sort: 'id', dispatch: vi.fn() } })

    await userEvent.click(screen.getByRole('button', { name: /openFilters/i }))

    enabledTypes.forEach(type => expect(screen.getByRole('button', { name: new RegExp(type, 'i'), pressed: true })).toBeInTheDocument())
    disabledTypes.forEach(type => expect(screen.getByRole('button', { name: new RegExp(type, 'i'), pressed: false })).toBeInTheDocument())

    const anotherEnabledType: PokeType = 'dragon'
    const typeToDisable = 'poison'
    await userEvent.click(screen.getByRole('button', { name: new RegExp(anotherEnabledType, 'i'), pressed: false }))
    await userEvent.click(screen.getByRole('button', { name: new RegExp(typeToDisable, 'i'), pressed: true }))

    expect(enabledTypes).toContain(typeToDisable)
    expect(enabledTypes).not.toContain(anotherEnabledType)
    expect(screen.getByRole('button', { name: new RegExp(anotherEnabledType, 'i'), pressed: true })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: new RegExp(typeToDisable, 'i'), pressed: false })).toBeInTheDocument()
  })

  it('should call submit with a set of types and sort string, and close form when apply button is clicked', async () => {
    const enabledTypes = new Set<PokeType>(['grass', 'poison'])
    const mockDispatch = vi.fn()
    customRender(<Filter />, { contextValue: { types: enabledTypes, sort: 'name', dispatch: mockDispatch } })
    await userEvent.click(screen.getByRole('button', { name: /openFilters/i }))

    const typeToDisable: PokeType = 'grass'
    const typeToEnable: PokeType = 'dark'
    await userEvent.click(screen.getByRole('button', { name: new RegExp(typeToDisable, 'i') }))
    await userEvent.click(screen.getByRole('button', { name: new RegExp(typeToEnable, 'i') }))
    await userEvent.click(screen.getByRole('button', { name: /apply/i }))

    expect(screen.queryByRole('form', { name: /filter/i })).not.toBeInTheDocument()
    expect(mockDispatch.mock.calls.length).toBe(1)
    expect(mockDispatch.mock.calls[0][0]).toEqual('FILTER')
    expect(mockDispatch.mock.calls[0][1]).toEqual({ types: new Set<PokeType>(['dark', 'poison']), sort: 'name' })
  })

  it.each([/cancel/i, /close/i])('when %s is clicked, should hide form and disable all type filters except given defaults', async (buttonName) => {
    const sort: PokeSearchSortKey = 'name'
    const enabledTypes = new Set<PokeType>(['grass', 'poison'])
    const disabledTypes = new Set(POKE_TYPES.filter(type => !enabledTypes.has(type)))

    customRender(<Filter />, { contextValue: { types: enabledTypes, dispatch: vi.fn(), sort } })

    await userEvent.click(screen.getByRole('button', { name: /openFilters/i }))

    await userEvent.click(screen.getByRole('button', { name: new RegExp('grass' as PokeType, 'i') }))
    await userEvent.click(screen.getByRole('button', { name: new RegExp('dark' as PokeType, 'i') }))
    let sortFields = screen.getByRole('group', { name: /sortfields/i })
    await userEvent.click(within(sortFields).getByLabelText(new RegExp('id' as PokeSearchSortKey, 'i')))

    expect(screen.getByRole('button', { name: new RegExp('grass' as PokeType, 'i'), pressed: false }))
    expect(screen.getByRole('button', { name: new RegExp('dark' as PokeType, 'i'), pressed: true }))
    expect(within(sortFields).getByLabelText(new RegExp('id' as PokeSearchSortKey, 'i'))).toBeChecked()

    await userEvent.click(screen.getByRole('button', { name: buttonName }))
    await userEvent.click(screen.getByRole('button', { name: /openFilters/i }))

    sortFields = screen.getByRole('group', { name: /sortfields/i })
    expect(within(sortFields).getByLabelText('Name')).toBeChecked()
    enabledTypes.forEach(type => expect(screen.getByRole('button', { name: new RegExp(type, 'i'), pressed: true })).toBeInTheDocument())
    disabledTypes.forEach(type => expect(screen.getByRole('button', { name: new RegExp(type, 'i'), pressed: false })).toBeInTheDocument())
  })
  it('should set form defaults when reset is clicked', async () => {
    const enabledTypes = new Set<PokeType>(['grass', 'poison'])
    customRender(<Filter />, { contextValue: { types: enabledTypes, sort: 'name', dispatch: vi.fn() } })
    await userEvent.click(screen.getByRole('button', { name: /openFilters/i }))

    enabledTypes.forEach(type => expect(screen.getByRole('button', { name: new RegExp(type, 'i'), pressed: true })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /reset/i }))
    POKE_TYPES.forEach(type => expect(screen.getByRole('button', { name: new RegExp(type, 'i'), pressed: false })).toBeInTheDocument())
    const sortFields = screen.getByRole('group', { name: /sortfields/i })
    expect(within(sortFields).getByLabelText(/id/i)).toBeChecked()
  })
})

type RenderParameters = Parameters<typeof render>
const customRender = (ui: ReactElement, { contextValue, renderOptions }: {
  contextValue: Pick<PokeSearchParamsContextValue, 'dispatch' | 'types' | 'sort'>
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
