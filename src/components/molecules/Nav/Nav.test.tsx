import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Nav from './Nav'
import { sections } from '../../../content/navigation'
import { siteContent } from '../../../content/site'

describe('Nav', () => {
  it('links the wordmark to the top of the page (the hero)', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: siteContent.name })).toHaveAttribute('href', '#top')
  })

  it('hides the name while the hero name is on screen', () => {
    const { rerender } = render(<Nav showName={false} />)
    const wordmark = screen.getByRole('link', { name: siteContent.name })
    expect(wordmark.className).toMatch(/undocked/)

    rerender(<Nav showName />)
    expect(wordmark.className).not.toMatch(/undocked/)
  })

  // jsdom doesn't apply the CSS that shows one link list and hides the other,
  // so both lists are present here; each test scopes to its own landmark.
  it('renders a link for each section in the bar', () => {
    render(<Nav />)
    const primary = screen.getByRole('navigation', { name: 'Primary' })
    sections.forEach((section) => {
      expect(within(primary).getByRole('link', { name: section.label })).toHaveAttribute(
        'href',
        `#${section.id}`,
      )
    })
  })

  it('renders a link for each section in the menu', () => {
    render(<Nav />)
    const menu = screen.getByRole('navigation', { name: 'Menu' })
    sections.forEach((section) => {
      expect(within(menu).getByRole('link', { name: section.label })).toHaveAttribute(
        'href',
        `#${section.id}`,
      )
    })
  })

  it('shows the theme toggle in the bar', () => {
    render(<Nav />)
    expect(screen.getByRole('button', { name: /switch to (light|dark) mode/i })).toBeInTheDocument()
  })

  it('starts closed and opens when the menu toggle is clicked', async () => {
    const user = userEvent.setup()
    render(<Nav />)

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )

    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('closes again after a menu link is clicked', async () => {
    const user = userEvent.setup()
    render(<Nav />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const menu = screen.getByRole('navigation', { name: 'Menu' })
    await user.click(within(menu).getByRole('link', { name: 'Experience' }))

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('closes on Escape and returns focus to the menu toggle', async () => {
    const user = userEvent.setup()
    render(<Nav />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.keyboard('{Escape}')

    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('carries the tagline and the resume button in the menu', () => {
    render(<Nav />)
    expect(screen.getByText(siteContent.tagline)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Download resume' })).toHaveAttribute(
      'href',
      siteContent.resumeUrl,
    )
  })
})
