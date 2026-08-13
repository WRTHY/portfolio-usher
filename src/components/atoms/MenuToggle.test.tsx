import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import MenuToggle from './MenuToggle'

describe('MenuToggle', () => {
  it('reflects open state via its accessible label and aria-expanded', () => {
    const { rerender } = render(<MenuToggle isOpen={false} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )

    rerender(<MenuToggle isOpen={true} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<MenuToggle isOpen={false} onClick={handleClick} />)

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
