import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('defaults to Postman and renders every example with its title and filename', () => {
    render(<ApiTesting />)

    expect(screen.getByRole('radio', { name: 'Postman' })).toHaveAttribute(
      'data-state',
      'checked',
    )

    apiTestingExamples.forEach((example) => {
      expect(screen.getByRole('heading', { name: example.title })).toBeInTheDocument()
      expect(screen.getAllByText(example.postman.filename).length).toBeGreaterThan(0)
    })
  })

  it('switches every example to its Playwright test when the tool toggle changes', async () => {
    const user = userEvent.setup()
    render(<ApiTesting />)

    await user.click(screen.getByRole('radio', { name: 'Playwright' }))

    apiTestingExamples.forEach((example) => {
      expect(screen.getAllByText(example.playwright.filename).length).toBeGreaterThan(0)
    })
    expect(screen.queryByText(apiTestingExamples[0].postman.filename)).not.toBeInTheDocument()
  })
})
