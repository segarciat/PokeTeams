import { describe, expect, it, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Navbar from './navbar'

describe('Navbar', () => {
  it('should show navigation menu in page', async () => {
    const mockFunction = jest.fn()
    render(<Navbar isNavSidebarOpen={false} onOpenNavSidebar={mockFunction} onCloseNavSidebar={mockFunction} title={'example'}/>)
    expect(screen.getByRole('navigation', { name: /navigation/i })).toBeInTheDocument()
  })
})
