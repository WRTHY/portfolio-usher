import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Nav from './Nav'
import { siteContent } from '../../../content/site'

describe('Nav', () => {
  it('renders a link for each section', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Experience' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Case Studies' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Automation Examples' })).toBeInTheDocument()
  })

  // quickSummary moved here from MobileInfoCard (the fixed card at the top
  // of the page) to keep that card from getting cluttered — see its own
  // test file for the matching regression check that it's gone from there.
  it('shows the quickSummary blurb near the bottom of the menu', () => {
    render(<Nav />)
    expect(screen.getByText(siteContent.quickSummary)).toBeInTheDocument()
  })

  // The role (tagline) moved here too, right under the theme toggle —
  // MobileInfoCard shows the active section's label in that slot instead
  // now (see its own test file for the matching regression check).
  it('shows the role/title near the top of the menu', () => {
    render(<Nav />)
    expect(screen.getByText(siteContent.tagline)).toBeInTheDocument()
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

  it('closes again after a link is clicked', async () => {
    const user = userEvent.setup()
    render(<Nav />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(screen.getByRole('link', { name: 'About' }))

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })
})
