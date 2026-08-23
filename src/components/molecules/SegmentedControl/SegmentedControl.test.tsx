import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SegmentedControl from './SegmentedControl'

describe('SegmentedControl', () => {
  it('renders every option and marks the active one checked', () => {
    render(
      <SegmentedControl
        value="b"
        onChange={() => {}}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        ariaLabel="Letters"
      />,
    )

    expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('data-state', 'unchecked')
    expect(screen.getByRole('radio', { name: 'B' })).toHaveAttribute('data-state', 'checked')
  })

  it('calls onChange with the clicked option value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl
        value="a"
        onChange={onChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        ariaLabel="Letters"
      />,
    )

    await user.click(screen.getByRole('radio', { name: 'B' }))

    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('never fires onChange for a disabled option and renders it as soon', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl
        value="a"
        onChange={onChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ]}
        ariaLabel="Letters"
      />,
    )

    const disabledOption = screen.getByRole('radio', { name: /B/ })
    expect(disabledOption).toBeDisabled()

    await user.click(disabledOption)

    expect(onChange).not.toHaveBeenCalled()
  })
})
