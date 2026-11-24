import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Contact from './Contact'
import { contactCopy } from '../../../content/contact'
import { links } from '../../../content/links'

describe('Contact', () => {
  it('is the region named by its heading', () => {
    render(<Contact />)
    expect(screen.getByRole('region', { name: contactCopy.heading })).toHaveAttribute('id', 'contact')
  })

  it('leads with the email address, as a mail link', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: links.email })).toHaveAttribute('href', `mailto:${links.email}`)
  })

  it('links LinkedIn, GitHub and the resume, each in a new tab', () => {
    render(<Contact />)
    const list = screen.getByRole('list')
    const expected = [
      ['LinkedIn', links.linkedin],
      ['GitHub', links.github],
      ['Resume', links.resume],
    ]
    expect(within(list).getAllByRole('link')).toHaveLength(expected.length)
    expected.forEach(([name, href]) => {
      const link = within(list).getByRole('link', { name })
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  it('ends on the note about life outside work', () => {
    render(<Contact />)
    expect(screen.getByText(contactCopy.aside)).toBeInTheDocument()
  })
})
