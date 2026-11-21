import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Switch from './Switch'

describe('Switch', () => {
  it('is a switch named by its label, reflecting checked', () => {
    const { rerender } = render(
      <Switch checked={false} onChange={() => {}}>
        Pick locator
      </Switch>,
    )
    expect(screen.getByRole('switch', { name: 'Pick locator' })).not.toBeChecked()

    rerender(
      <Switch checked onChange={() => {}}>
        Pick locator
      </Switch>,
    )
    expect(screen.getByRole('switch', { name: 'Pick locator' })).toBeChecked()
  })

  it('asks for the opposite state when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Switch checked={false} onChange={onChange}>
        Pick locator
      </Switch>,
    )
    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('passes data attributes and a description through', () => {
    render(
      <>
        <span id="hint">See the locator</span>
        <Switch checked={false} onChange={() => {}} describedBy="hint" data-loc="loc" data-check="check">
          Pick locator
        </Switch>
      </>,
    )
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAccessibleDescription('See the locator')
    expect(toggle).toHaveAttribute('data-loc', 'loc')
    expect(toggle).toHaveAttribute('data-check', 'check')
  })
})
