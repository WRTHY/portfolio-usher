import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ApiTesting from './ApiTesting'
import { apiTestingExamples } from '../../../content/apiTesting'
import { links } from '../../../content/links'

describe('ApiTesting', () => {
  it('links out to the API testing repo', () => {
    render(<ApiTesting />)

    expect(
      screen.getByRole('link', { name: /View the API testing repo on GitHub/ }),
    ).toHaveAttribute('href', links.apiTestingRepo)
  })

  it('renders every static example with its title and filename', () => {
    render(<ApiTesting />)

    apiTestingExamples.forEach((example) => {
      expect(screen.getByRole('heading', { name: example.title })).toBeInTheDocument()
      expect(screen.getByText(example.filename)).toBeInTheDocument()
    })
  })
})
