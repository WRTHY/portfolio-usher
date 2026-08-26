import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Modal from './Modal'

describe('Modal', () => {
  it('renders its content into the document body', () => {
    render(
      <Modal titleId="title" onClose={() => {}}>
        <h2 id="title">Case study title</h2>
      </Modal>,
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    // The dialog's direct parent is the backdrop div — it's the backdrop
    // that's portaled straight onto <body>, not the dialog itself.
    expect(dialog.parentElement?.parentElement).toBe(document.body)
    expect(dialog).toHaveAttribute('aria-labelledby', 'title')
  })

  it('locks body scroll while open and restores it on unmount', () => {
    const { unmount } = render(
      <Modal titleId="title" onClose={() => {}}>
        <h2 id="title">Case study title</h2>
      </Modal>,
    )

    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    render(
      <Modal titleId="title" onClose={handleClose}>
        <h2 id="title">Case study title</h2>
      </Modal>,
    )

    await user.keyboard('{Escape}')

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the backdrop is clicked, but not when the dialog content is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    render(
      <Modal titleId="title" onClose={handleClose}>
        <h2 id="title">Case study title</h2>
      </Modal>,
    )

    await user.click(screen.getByText('Case study title'))
    expect(handleClose).not.toHaveBeenCalled()

    await user.click(screen.getByRole('dialog').parentElement!)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
