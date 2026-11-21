import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ExpandToggle from './ExpandToggle'

describe('ExpandToggle', () => {
  it('is a button named by its label that reports its state', () => {
    const { rerender } = render(
      <ExpandToggle expanded={false} onToggle={() => {}} controls="panel" label="Details: QA Specialist" />,
    )
    const button = screen.getByRole('button', { name: 'Details: QA Specialist' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', 'panel')

    rerender(<ExpandToggle expanded onToggle={() => {}} controls="panel" label="Details: QA Specialist" />)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<ExpandToggle expanded={false} onToggle={onToggle} controls="panel" label="Details" />)
    await user.click(screen.getByRole('button', { name: 'Details' }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
