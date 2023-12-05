import { describe, expect, it } from '@jest/globals'
import Card, { type CardProps } from '../card'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('pokemon card', () => {
  const pokemon: CardProps['pokemon'] = {
    name: 'bulbasaur',
    id: 1,
    types: [
      { name: 'grass', url: 'https://grass.com' },
      { name: 'poison', url: 'http://poison.com' }
    ],
    spriteSrcs: {
      frontDefault: '/front.png',
      backDefault: '/back.png',
      frontShiny: '/shiny.png',
      backShiny: '/backShiny.png'
    }
  }
  it('should display pokedex id, name, types, and image', () => {
    render(<Card pokemon={pokemon} />)
    expect(screen.getByText(/0001/i)).toBeInTheDocument()
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /grass/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /poison/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /front/i })).toBeInTheDocument()
  })

  it('should display fallback image when no image is avaiable', () => {
    const pokemonWithNoImage: CardProps['pokemon'] = {
      ...pokemon,
      spriteSrcs: {
        frontDefault: null,
        backDefault: null,
        frontShiny: null,
        backShiny: null
      }
    }
    render(<Card pokemon={pokemonWithNoImage} />)
    expect(screen.queryByRole('img', { name: /missing/i })).toBeInTheDocument()
  })

  it('should change image when toggler actions are clicked', async () => {
    render(<Card pokemon={pokemon} />)
    expect(screen.getByRole('img', { name: /front/i })).toBeInTheDocument()

    const flipBtn = screen.getByRole('button', { name: /flip/i })
    const shinyBtn = screen.getByRole('button', { name: /shiny/i })

    await userEvent.click(flipBtn)
    expect(screen.getByRole('img', { name: /back/i })).toBeInTheDocument()

    await userEvent.click(shinyBtn)
    expect(screen.getByRole('img', { name: /back shiny/i })).toBeInTheDocument()

    await userEvent.click(flipBtn)
    expect(screen.getByRole('img', { name: /front shiny/i })).toBeInTheDocument()

    await userEvent.click(shinyBtn)
    expect(screen.getByRole('img', { name: /front/i })).toBeInTheDocument()
  })
})
