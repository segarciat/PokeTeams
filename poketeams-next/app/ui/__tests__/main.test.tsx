import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import Main from '../main'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

describe('Main (global) layout', () => {
  it('should display main content, and navbar with logo, navigation links, and actions', () => {
    render((
      <Main title='Test title'>
        <h2>Test section</h2>
      </Main>
    ))

    expect(screen.queryByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('should hide the button to open the navbar after clicking it, and then shows the open button', async () => {
    render((
      <Main title='Test title'>
        <h2>Test section</h2>
      </Main>
    ))
    const navbar = screen.getByRole('banner')
    expect(navbar).toBeInTheDocument()
    const openSidenavBtn = within(navbar).getByRole('button', { name: /open/i })
    expect(openSidenavBtn).toBeInTheDocument()
    expect(within(navbar).queryByRole('button', { name: /close/i })).not.toBeInTheDocument()

    await userEvent.click(openSidenavBtn)
    expect(within(navbar).queryByRole('button', { name: /close/i })).toBeInTheDocument()
    expect(within(navbar).queryByRole('button', { name: /open/i })).not.toBeInTheDocument()
  })

  it('should show button to open nav sidebar after resizing to desktop size screen', async () => {
    global.innerWidth = 800
    render((
      <Main title='Test title'>
        <h2>Test section</h2>
      </Main>
    ))

    const openSidenavBtn = screen.getByRole('button', { name: /open nav/i })
    expect(openSidenavBtn).toBeInTheDocument()
    await userEvent.click(openSidenavBtn)
    expect(screen.queryByRole('button', { name: /open nav/i })).not.toBeInTheDocument()

    // See: https://vitest.dev/guide/migration.html#timer-mocks-3925
    vi.useFakeTimers({ toFake: ['nextTick'] })

    act(() => {
      global.innerWidth = 1200
      fireEvent.resize(window)
      vi.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /open nav/i })).toBeInTheDocument()
    })
    vi.useRealTimers()
  })
})
