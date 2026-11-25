import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CopyButton from './CopyButton'

let writeText: ReturnType<typeof vi.fn>

// Vitest twin of CopyButton.cy.tsx
describe('CopyButton', () => {
  beforeEach(() => {
    // userEvent stubs the clipboard itself, so these tests use fireEvent.
    writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      get: () => ({ writeText }),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('mounts with a "Copy code" label', () => {
    render(<CopyButton text="npx playwright test" />)
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument()
  })

  it('copies its text to the clipboard on click', async () => {
    render(<CopyButton text="npx playwright test" />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))
    })

    expect(writeText).toHaveBeenCalledWith('npx playwright test')
  })

  it('flips its label to "Copied" and back after ~1500ms', async () => {
    // Fake timers so we don't wait out the 1.5s reset
    vi.useFakeTimers()
    render(<CopyButton text="npx playwright test" />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))
    })
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument()
  })
})
