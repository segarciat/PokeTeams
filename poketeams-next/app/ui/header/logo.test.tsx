/**
 * @jest-environment jsdom
 */
import { it, expect, describe } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import Logo from './logo'

describe('Website banner', () => {
  it('should display image logo and website title', () => {
    render(<Logo title={'mytitle'}/>)
    expect(screen.getByRole('heading', { name: /mytitle/ })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /logo/ })).toBeInTheDocument()
  })
})
