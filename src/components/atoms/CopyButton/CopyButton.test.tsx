import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CopyButton from './CopyButton'

// Backs the "Component testing" preview example in codeExamples.ts, which
// claims CopyButton mounts, copies its text on click, and flips its
// aria-label 'Copy code' -> 'Copied' -> back after ~1500ms. This test proves
// those claims are true of the real component.
let writeText: ReturnType<typeof vi.fn>

describe('CopyButton', () => {
  beforeEach(() => {
    // jsdom 30's navigator.clipboard is a live getter that hands back a
    // fresh instance on every access, so mutating the object it returns
    // doesn't stick — own the getter instead so every read resolves to the
    // same mock. userEvent.setup() installs its own clipboard stub that
    // would clobber this, so these tests click via fireEvent instead.
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
