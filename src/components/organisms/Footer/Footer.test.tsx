import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Footer from './Footer'
import { contactCopy } from '../../../content/contact'

describe('Footer', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('is the page footer, with the build line and this year’s copyright', () => {
    vi.useFakeTimers({ now: new Date('2031-06-01') })
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveTextContent(contactCopy.builtWith)
    expect(footer).toHaveTextContent('© 2031 James Usher')
  })
})
