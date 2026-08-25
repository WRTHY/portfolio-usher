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
    expect(screen.getByTestId('active-file-path')).toHaveTextContent(
      'playwright/case-studies.spec.ts',
    )
  })

  it('disables the Performance testing type', () => {
    render(<CodeSamples />)
    expect(screen.getByRole('radio', { name: /Performance/ })).toBeDisabled()
  })

  it('switching to the Component tier defaults to Vitest and offers a real Cypress CT alternative', async () => {
    const user = userEvent.setup()
    render(<CodeSamples />)

    await user.click(screen.getByRole('radio', { name: 'Component' }))

    expect(screen.getByRole('radio', { name: 'Vitest + React Testing Library' })).toHaveAttribute(
      'data-state',
      'checked',
    )
    expect(screen.getByRole('tab', { name: /CopyButton\.test\.tsx/ })).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Cypress CT' }))

    expect(screen.getByRole('tab', { name: /CopyButton\.cy\.tsx/ })).toBeInTheDocument()
  })

  it('switching framework within a tier resets back to the first file', async () => {
    const user = userEvent.setup()
    render(<CodeSamples />)

    await user.click(screen.getByRole('tab', { name: /playwright\.config\.ts/ }))
    await user.click(screen.getByRole('radio', { name: 'Cypress' }))

    expect(screen.getByTestId('active-file-path')).toHaveTextContent(
      'cypress/case-studies.cy.ts',
    )
  })

  it('shows a static TypeScript badge instead of a language selector', () => {
    render(<CodeSamples />)

    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: /TypeScript/ })).not.toBeInTheDocument()
  })
})
