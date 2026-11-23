import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Reveal from './Reveal'

describe('Reveal', () => {
  it('shows its content when open', () => {
    render(
      <Reveal open id="region">
        <p>Inside</p>
      </Reveal>,
    )
    expect(screen.getByText('Inside')).toBeVisible()
    expect(document.getElementById('region')).not.toHaveAttribute('hidden')
  })

  it('takes its content out of the page when closed, not just out of sight', () => {
    render(
      <Reveal open={false} id="region">
        <p>Inside</p>
      </Reveal>,
    )
    expect(screen.getByText('Inside')).not.toBeVisible()
    expect(document.getElementById('region')).toHaveAttribute('hidden')
  })
})
