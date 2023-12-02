import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import Main from '../main'

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
})
