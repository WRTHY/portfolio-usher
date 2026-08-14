import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FaGithub } from 'react-icons/fa6'
import SocialIcon from './SocialIcon'

describe('SocialIcon', () => {
  it('opens external links in a new tab safely', () => {
    render(<SocialIcon href="https://github.com/WRTHY" label="GitHub" icon={FaGithub} />)
    const link = screen.getByRole('link', { name: 'GitHub' })
    expect(link).toHaveAttribute('href', 'https://github.com/WRTHY')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })

  it('does not add target/rel for a non-http link like mailto', () => {
    render(<SocialIcon href="mailto:test@example.com" label="Email" icon={FaGithub} />)
    const link = screen.getByRole('link', { name: 'Email' })
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('rel')
  })
})
