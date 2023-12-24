import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ScrollToTopBtn, { SHOW_BTN_DURATION } from '../scroll-top-btn'
import userEvent from '@testing-library/user-event'

describe('scroll to top button', () => {
  it('only shows when you scroll up and position is not 0', async () => {
    render(<ScrollToTopBtn />)
    expect(screen.queryByRole('button', { name: /scroll top/i })).not.toBeInTheDocument()

    act(() => {
      global.window.scrollY = 5
      fireEvent.scroll(window)
    })
    expect(screen.queryByRole('button', { name: /scroll top/i })).not.toBeInTheDocument()

    act(() => {
      global.window.scrollY = 4
      fireEvent.scroll(window)
    })

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /scroll top/i })).toBeInTheDocument()
    })

    act(() => {
      global.window.scrollY = 0
      fireEvent.scroll(window)
    })

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /scroll top/i })).not.toBeInTheDocument()
    })
  })

  it('should disappear after a short duration of no scrolling', async () => {
    render(<ScrollToTopBtn />)

    act(() => {
      global.window.scrollY = 5
      fireEvent.scroll(window)
    })

    act(() => {
      global.window.scrollY = 4
      fireEvent.scroll(window)
    })

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /scroll top/i })).toBeInTheDocument()
    })

    vi.useFakeTimers()
    act(() => {
      vi.advanceTimersByTime(SHOW_BTN_DURATION + 1)
    })

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /scroll top/i })).not.toBeInTheDocument()
      vi.clearAllTimers()
      vi.useRealTimers()
    })
  })

  it('should scroll top when clicked', async () => {
    render(<ScrollToTopBtn />)
    expect(screen.queryByRole('button', { name: /scroll top/i })).not.toBeInTheDocument()

    act(() => {
      global.window.scrollY = 5
      fireEvent.scroll(window)
    })
    expect(screen.queryByRole('button', { name: /scroll top/i })).not.toBeInTheDocument()

    act(() => {
      global.window.scrollY = 4
      fireEvent.scroll(window)
    })

    expect(screen.queryByRole('button', { name: /scroll top/i })).toBeInTheDocument()
    const scrollToSpy = vi.spyOn(global, 'scrollTo')

    await userEvent.click(screen.getByRole('button', { name: /scroll top/i }))

    expect(scrollToSpy).toHaveBeenCalledOnce()
  })
})
