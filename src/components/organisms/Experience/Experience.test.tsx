import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Experience from './Experience'
import { experience, experienceIntro } from '../../../content/experience'

describe('Experience', () => {
  it('is the region named by its heading, with the intro beside it', () => {
    render(<Experience />)
    expect(screen.getByRole('region', { name: 'Experience' })).toHaveAttribute('id', 'experience')
    expect(screen.getByText(experienceIntro)).toBeInTheDocument()
  })

  it('lists one ledger row per role, newest first', () => {
    render(<Experience />)
    const rows = screen.getAllByRole('heading', { level: 3 })
    expect(rows.map((heading) => heading.textContent)).toEqual(experience.map((entry) => entry.role))
  })

  it.each(experience.map((entry) => [entry.role, entry] as const))(
    '%s shows its dates, impact line and key tools only',
    (_role, entry) => {
      render(<Experience />)
      const row = screen.getByTestId(`experience-${entry.id}`)
      expect(within(row).getByText(entry.dates)).toBeInTheDocument()
      expect(within(row).getByText(entry.impact)).toBeInTheDocument()

      const tools = within(row).getByRole('list', { name: `Key tools as ${entry.role}` })
      expect(within(tools).getAllByRole('listitem').map((item) => item.textContent)).toEqual([...entry.keyTools])

      // The full write-up waits behind the row's "+".
      expect(within(row).getByText(entry.summary)).not.toBeVisible()
    },
  )

  it.each(experience.map((entry) => [entry.role, entry] as const))(
    '%s opens its full write-up and stack with the "+", and closes again',
    async (_role, entry) => {
      const user = userEvent.setup()
      render(<Experience />)
      const row = screen.getByTestId(`experience-${entry.id}`)
      const toggle = within(row).getByRole('button', { name: `Details: ${entry.role}` })
      expect(toggle).toHaveAttribute('aria-expanded', 'false')

      await user.click(toggle)

      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      expect(within(row).getByText(entry.summary)).toBeVisible()
      if (entry.stack) {
        const stack = within(row).getByRole('list', { name: `Full stack as ${entry.role}` })
        expect(within(stack).getAllByRole('listitem')).toHaveLength(entry.stack.length)
      }

      await user.click(toggle)
      expect(within(row).getByText(entry.summary)).not.toBeVisible()
    },
  )

  it('opens rows independently', async () => {
    const user = userEvent.setup()
    render(<Experience />)
    const [first, second] = experience
    await user.click(screen.getByRole('button', { name: `Details: ${first.role}` }))

    expect(screen.getByText(first.summary)).toBeVisible()
    expect(screen.getByText(second.summary)).not.toBeVisible()
  })

  it('links each company out in a new tab', () => {
    render(<Experience />)
    experience.forEach((entry) => {
      const row = screen.getByTestId(`experience-${entry.id}`)
      const link = within(row).getByRole('link', { name: entry.company })
      expect(link).toHaveAttribute('href', entry.companyUrl)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })
})
