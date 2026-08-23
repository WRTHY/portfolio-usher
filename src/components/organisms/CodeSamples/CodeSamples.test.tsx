import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import CodeSamples from './CodeSamples'

describe('CodeSamples', () => {
  it('defaults to the End-to-End / Playwright example', () => {
    render(<CodeSamples />)

    expect(screen.getByRole('radio', { name: 'End-to-End' })).toHaveAttribute(
      'data-state',
      'checked',
    )
    expect(screen.getByRole('radio', { name: 'Playwright' })).toHaveAttribute(
      'data-state',
      'checked',
    )
    expect(screen.getByRole('tab', { name: /case-study-modal\.spec\.ts/ })).toBeInTheDocument()
  })

  it('disables the Performance testing type', () => {
    render(<CodeSamples />)
    expect(screen.getByRole('radio', { name: /Performance/ })).toBeDisabled()
  })

  it('switching testing type resets the framework and file to the new tier\'s first option', async () => {
    const user = userEvent.setup()
    render(<CodeSamples />)

    await user.click(screen.getByRole('radio', { name: 'Component' }))

    expect(screen.getByRole('radio', { name: /Cypress CT/ })).toHaveAttribute(
      'data-state',
      'checked',
    )
    expect(screen.getByRole('tab', { name: /CopyButton\.cy\.tsx/ })).toBeInTheDocument()
  })

  it('disables Playwright CT under the Component tier (no honest example yet)', async () => {
    const user = userEvent.setup()
    render(<CodeSamples />)

    await user.click(screen.getByRole('radio', { name: 'Component' }))

    expect(screen.getByRole('radio', { name: /Playwright CT/ })).toBeDisabled()
  })

  it('switching framework within a tier resets back to the first file', async () => {
    const user = userEvent.setup()
    render(<CodeSamples />)

    await user.click(screen.getByRole('radio', { name: 'Cypress' }))

    expect(screen.getByRole('tab', { name: /case-study-modal\.cy\.ts/ })).toBeInTheDocument()
  })

  it('shows a static TypeScript badge instead of a language selector', () => {
    render(<CodeSamples />)

    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: /TypeScript/ })).not.toBeInTheDocument()
  })
})
