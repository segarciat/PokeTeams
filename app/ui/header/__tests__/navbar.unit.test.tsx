import { describe, expect, vi, it } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import Navbar, { MOBILE_THRESHOLD } from '../navbar'
import userEvent from '@testing-library/user-event'

const TITLE = 'poketeams'

describe('Navbar', () => {
  it('should display logo, navigation links, correct buttons, and theme menu', () => {
    render(<Navbar title={TITLE} />)

    expect(screen.getByRole('heading', { name: new RegExp(TITLE, 'i') })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open nav/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /close nav/i })).not.toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /site/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument()
  })

  it('should swap open and close button when either is clicked', async () => {
    render(<Navbar title={TITLE} />)

    expect(screen.queryByRole('button', { name: /close nav/i })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /open nav/i }))
    expect(screen.queryByRole('button', { name: /open nav/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /close nav/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /close nav/i }))
    expect(screen.queryByRole('button', { name: /close nav/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /open nav/i })).toBeInTheDocument()
  })

  it('should hide close button and show open button when screen is resized to desktop size', async () => {
    render(<Navbar title={TITLE} />)

    expect(screen.queryByRole('button', { name: /close nav/i })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /open nav/i }))
    expect(screen.queryByRole('button', { name: /open nav/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /close nav/i })).toBeInTheDocument()

    // See: https://vitest.dev/guide/migration.html#timer-mocks-3925
    vi.useFakeTimers({ toFake: ['nextTick'] })

    act(() => {
      global.innerWidth = MOBILE_THRESHOLD + 1
      fireEvent.resize(window)
      vi.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /close nav/i })).not.toBeInTheDocument()
    })
    vi.useRealTimers()

    // See: https://vitest.dev/guide/migration.html#timer-mocks-3925
    vi.useFakeTimers({ toFake: ['nextTick'] })

    act(() => {
      global.innerWidth = MOBILE_THRESHOLD - 1
      fireEvent.resize(window)
      vi.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /close nav/i })).not.toBeInTheDocument()
    })
    vi.useRealTimers()
  })
})
