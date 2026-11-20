import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Nav from './Nav'
import { sections } from '../../../content/navigation'
import { siteContent } from '../../../content/site'

describe('Nav', () => {
  it('links the wordmark to the top of the page', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: siteContent.name })).toHaveAttribute(
      'href',
      `#${sections[0].id}`,
    )
  })

  // On desktop the section links live in InfoPanel (see its own tests); the
  // bar itself only carries them in the hamburger menu.
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

  it('keeps the resume one click away in the bar, opening in a new tab', () => {
    render(<Nav />)
    const resume = screen.getByRole('link', { name: 'Resume' })
    expect(resume).toHaveAttribute('href', siteContent.resumeUrl)
    expect(resume).toHaveAttribute('target', '_blank')
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
    await user.click(within(menu).getByRole('link', { name: 'About' }))

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
