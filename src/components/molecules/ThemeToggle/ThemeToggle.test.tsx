import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.mode
  })

  afterEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.mode
  })

  it('defaults to the system mode when nothing is stored', () => {
    // setup.ts stubs matchMedia to matches: false by default, i.e. "light"
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument()
  })

  it('picks up a previously stored preference on mount', () => {
    localStorage.setItem('mode', 'dark')
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
  })

  it('toggles the mode, updates the DOM attribute, and persists the choice', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }))

    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
    expect(document.documentElement.dataset.mode).toBe('dark')
    expect(localStorage.getItem('mode')).toBe('dark')
  })
})
