import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import IconButton from './IconButton'

describe('IconButton', () => {
  it('renders with its accessible label', () => {
    render(
      <IconButton ariaLabel="Copy code" onClick={() => {}}>
        icon
      </IconButton>,
    )
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <IconButton ariaLabel="Copy code" onClick={onClick}>
        icon
      </IconButton>,
    )

    await user.click(screen.getByRole('button', { name: 'Copy code' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
