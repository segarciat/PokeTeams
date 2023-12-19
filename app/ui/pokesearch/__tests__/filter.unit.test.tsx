import { describe, expect, it, vi } from 'vitest'
import Filter from '../filter'
import { render, screen } from '@testing-library/react'
import { POKE_TYPES, type PokeType } from '@/app/lib/constants'
import userEvent from '@testing-library/user-event'
import { type PokeSearchParamAction } from '@/app/lib/definitions'

describe('pokesearch filter', () => {
  it('should hide filter form until filter button is clicked', async () => {
    const mockOnSubmit = vi.fn()
    render(<Filter defaultEnabledTypes={new Set()} onSubmit={mockOnSubmit} />)

    expect(screen.queryByRole('form', { name: /filter/i })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /openFilters/i }))
    expect(screen.queryByRole('form', { name: /filter/i })).toBeInTheDocument()
  })
  it('should display buttons as pressed for provided types and on-click, and show as not pressed when unclicked', async () => {
    const enabledTypes = new Set<PokeType>(['grass', 'poison'])
    const disabledTypes = new Set(POKE_TYPES.filter(type => !enabledTypes.has(type)))
    const mockOnSubmit = vi.fn()
    render(<Filter defaultEnabledTypes={enabledTypes} onSubmit={mockOnSubmit}/>)
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

  it('should call submit with a set of types and close form when apply button is clicked', async () => {
    const enabledTypes = new Set<PokeType>(['grass', 'poison'])
    const mockOnSubmit = vi.fn()
    render(<Filter defaultEnabledTypes={enabledTypes} onSubmit={mockOnSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: /openFilters/i }))

    const typeToDisable: PokeType = 'grass'
    const typeToEnable: PokeType = 'dark'
    await userEvent.click(screen.getByRole('button', { name: new RegExp(typeToDisable, 'i') }))
    await userEvent.click(screen.getByRole('button', { name: new RegExp(typeToEnable, 'i') }))
    await userEvent.click(screen.getByRole('button', { name: /apply/i }))

    expect(screen.queryByRole('form', { name: /filter/i })).not.toBeInTheDocument()
    expect(mockOnSubmit.mock.calls.length).toBe(1)
    const expectedSubmitArgs: PokeSearchParamAction = {
      action: 'FILTER',
      types: new Set<PokeType>(['dark', 'poison'])
    }
    expect(mockOnSubmit.mock.calls[0][0]).toEqual(expectedSubmitArgs)
  })

  it.each([/cancel/i, /close/i])('when %s is clicked, should hide form and disable all type filters except given defaults', async (buttonName) => {
    const enabledTypes = new Set<PokeType>(['grass', 'poison'])
    const disabledTypes = new Set(POKE_TYPES.filter(type => !enabledTypes.has(type)))
    const mockOnSubmit = vi.fn()
    render(<Filter defaultEnabledTypes={enabledTypes} onSubmit={mockOnSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: /openFilters/i }))

    await userEvent.click(screen.getByRole('button', { name: new RegExp('grass' as PokeType, 'i') }))
    await userEvent.click(screen.getByRole('button', { name: new RegExp('dark' as PokeType, 'i') }))

    expect(screen.getByRole('button', { name: new RegExp('grass' as PokeType, 'i'), pressed: false }))
    expect(screen.getByRole('button', { name: new RegExp('dark' as PokeType, 'i'), pressed: true }))

    await userEvent.click(screen.getByRole('button', { name: buttonName }))
    await userEvent.click(screen.getByRole('button', { name: /openFilters/i }))

    enabledTypes.forEach(type => expect(screen.getByRole('button', { name: new RegExp(type, 'i'), pressed: true })).toBeInTheDocument())
    disabledTypes.forEach(type => expect(screen.getByRole('button', { name: new RegExp(type, 'i'), pressed: false })).toBeInTheDocument())
  })
  it('should disable all types when reset is clicked', async () => {
    const enabledTypes = new Set<PokeType>(['grass', 'poison'])
    const mockOnSubmit = vi.fn()
    render(<Filter defaultEnabledTypes={enabledTypes} onSubmit={mockOnSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: /openFilters/i }))

    enabledTypes.forEach(type => expect(screen.getByRole('button', { name: new RegExp(type, 'i'), pressed: true })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /reset/i }))
    POKE_TYPES.forEach(type => expect(screen.getByRole('button', { name: new RegExp(type, 'i'), pressed: false })).toBeInTheDocument())
  })
})
