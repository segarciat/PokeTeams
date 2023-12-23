import { afterEach, describe, expect, it, vi } from 'vitest'
import ThemeMenu, { LS_THEME_KEY } from '../theme-menu'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

afterEach(() => {
  vi.clearAllMocks()
})

describe('theme menu', () => {
  it('should hide menu by default, then show on click, then hide when click anywhere.', async () => {
    const { container } = render(<ThemeMenu />)
    expect(screen.queryByRole('list', { name: /theme menu/i })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /change theme/i }))
    expect(screen.getByRole('list', { name: /theme menu/i })).toBeInTheDocument()
    await userEvent.click(container)
    expect(screen.queryByRole('list', { name: /theme menu/i })).not.toBeInTheDocument()
  })

  it('clicking a menu choice changes the theme in local storage and closes the menu', async () => {
    const mockSetItemLS = vi.fn()
    const mockRemoveItemLS = vi.fn()
    vi.spyOn(Storage.prototype, 'setItem')
    Storage.prototype.setItem = mockSetItemLS
    vi.spyOn(Storage.prototype, 'removeItem')
    Storage.prototype.removeItem = mockRemoveItemLS

    render(<ThemeMenu />)
    expect(mockRemoveItemLS).toHaveBeenCalledTimes(1) // defaults to removing theme from LS, i.e., system default
    expect(mockRemoveItemLS).toHaveBeenCalledWith(LS_THEME_KEY)
    mockRemoveItemLS.mockClear()

    expect(screen.queryByRole('list', { name: /theme menu/i })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /change theme/i }))
    expect(screen.queryByRole('list', { name: /theme menu/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /light theme/i }))
    expect(mockSetItemLS).toHaveBeenCalledWith(LS_THEME_KEY, 'light')
    expect(screen.queryByRole('list', { name: /theme menu/i })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /change theme/i }))
    await userEvent.click(screen.getByRole('button', { name: /dark theme/i }))
    expect(mockSetItemLS).toHaveBeenCalledWith(LS_THEME_KEY, 'dark')
    expect(screen.queryByRole('list', { name: /theme menu/i })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /change theme/i }))
    await userEvent.click(screen.getByRole('button', { name: /system theme/i }))
    expect(mockSetItemLS).not.toHaveBeenCalledWith(LS_THEME_KEY, 'system')
    expect(mockRemoveItemLS).toHaveBeenCalledTimes(1)
    expect(mockRemoveItemLS).toHaveBeenCalledWith(LS_THEME_KEY)
    expect(screen.queryByRole('list', { name: /theme menu/i })).not.toBeInTheDocument()

    expect(mockSetItemLS).toHaveBeenCalledTimes(2)
  })

  it('should add dark theme when user prefers it or local storage has dark theme stored', async () => {
    const mockGetItemLS = vi.fn().mockReturnValue('dark')
    vi.spyOn(Storage.prototype, 'getItem')
    Storage.prototype.getItem = mockGetItemLS

    render(<ThemeMenu />)

    await userEvent.click(screen.getByRole('button', { name: /change theme/i }))
    await userEvent.click(screen.getByRole('button', { name: /dark theme/i }))
    expect(mockGetItemLS).toHaveBeenCalledWith(LS_THEME_KEY)
    expect(screen.queryByRole('list', { name: /theme menu/i })).not.toBeInTheDocument()
  })
})
