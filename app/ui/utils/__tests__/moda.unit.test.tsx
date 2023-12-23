import { render, screen } from '@testing-library/react'
import { type ReactElement, useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import Modal, { type ModalProps } from '../modal'
import userEvent from '@testing-library/user-event'

describe('Modal', () => {
  it('should display the children and invoke callback only when outer element is clicked.', async () => {
    const mockClose = vi.fn()
    render(<TestComponent onClose={mockClose} />)

    expect(screen.getByRole('heading', { name: /inside/i })).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('inner container with ref'))
    expect(mockClose).not.toHaveBeenCalledOnce()

    await userEvent.click(screen.getByRole('button', { name: /outside/i }))
    expect(mockClose).toHaveBeenCalled()
  })
})

function TestComponent ({ onClose }: { onClose: ModalProps['onClose'] }): ReactElement {
  const ref = useRef(null)
  return (
    <div>
      <button>outside</button>
      <div data-testid='inner container with ref' ref={ref}>
        <Modal containerRef={ref} onClose={onClose}>
          <h1>inside</h1>
        </Modal>
      </div>
    </div>
  )
}
