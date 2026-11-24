import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Experience from './Experience'
import { education, experience, experienceIntro, remainingStack, skillsHeading } from '../../../content/experience'
import { toolCategories } from '../../molecules/SkillsAndTools/toolCategories'

describe('Experience', () => {
  // jsdom has no scrolling; opening a row below an open one scrolls the page after it.
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(window, 'scrollBy').mockImplementation(() => {})
  })

  it('is the region named by its heading, with the intro beside it', () => {
    render(<Experience />)
    expect(screen.getByRole('region', { name: 'Experience' })).toHaveAttribute('id', 'experience')
    expect(screen.getByText(experienceIntro)).toBeInTheDocument()
  })

  it('lists one ledger row per role, newest first, then the degree, then the tools', () => {
    render(<Experience />)
    const rows = screen.getAllByRole('heading', { level: 3 })
    expect(rows.map((heading) => heading.textContent)).toEqual([
      ...experience.map((entry) => entry.role),
      education.degree,
      skillsHeading,
    ])
  })

  it('ends on every tool at a glance, grouped by category', () => {
    render(<Experience />)
    toolCategories.forEach((category) => {
      expect(screen.getByRole('list', { name: category.ariaLabel })).toBeInTheDocument()
    })
  })

  it('closes on the degree: the school linked out, and nothing to open', () => {
    render(<Experience />)
    const row = screen.getByTestId(`education-${education.id}`)
    expect(within(row).getByText(education.dates)).toBeInTheDocument()
    const link = within(row).getByRole('link', { name: education.school })
    expect(link).toHaveAttribute('href', education.schoolUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(within(row).queryByRole('button')).not.toBeInTheDocument()
  })

  it.each(experience.map((entry) => [entry.role, entry] as const))(
    '%s shows its dates, impact line and key tools, with details hidden',
    (_role, entry) => {
      render(<Experience />)
      const row = screen.getByTestId(`experience-${entry.id}`)
      expect(within(row).getByText(entry.dates)).toBeInTheDocument()
      expect(within(row).getByText(entry.impact)).toBeInTheDocument()

      const tools = within(row).queryByRole('list', { name: `Key tools as ${entry.role}` })
      if (entry.keyTools.length === 0) {
        expect(tools).not.toBeInTheDocument()
      } else {
        // Each tool sits over what it tested, in that order.
        const items = within(tools!).getAllByRole('listitem')
        expect(items.map((item) => [...item.children].map((part) => part.textContent))).toEqual(
          entry.keyTools.map(({ tool, scope }) => [tool, scope]),
        )
      }

      // The detail bullets and the rest of the stack wait behind the row's "+".
      expect(within(row).getByText(entry.details[0])).not.toBeVisible()
      expect(within(row).queryByRole('list', { name: `More tools as ${entry.role}` })).not.toBeInTheDocument()
    },
  )

  it.each(experience.map((entry) => [entry.role, entry] as const))(
    '%s opens its detail bullets and stack with the "+", and closes again',
    async (_role, entry) => {
      const user = userEvent.setup()
      render(<Experience />)
      const row = screen.getByTestId(`experience-${entry.id}`)
      const toggle = within(row).getByRole('button', { name: `Details: ${entry.role}` })
      expect(toggle).toHaveAttribute('aria-expanded', 'false')

      await user.click(toggle)

      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      const points = within(row).getByRole('list', { name: `What I did as ${entry.role}` })
      expect(within(points).getAllByRole('listitem').map((item) => item.textContent)).toEqual([...entry.details])
      // The tools column grows into the full stack: the rest of it, with
      // nothing the key tools already show listed twice.
      const rest = remainingStack(entry)
      const more = within(row).queryByRole('list', { name: `More tools as ${entry.role}` })
      if (rest.length === 0) {
        expect(more).not.toBeInTheDocument()
      } else {
        expect(within(more!).getAllByRole('listitem').map((item) => item.textContent)).toEqual([...rest])
      }

      await user.click(toggle)
      expect(within(row).getByText(entry.details[0])).not.toBeVisible()
      expect(within(row).queryByRole('list', { name: `More tools as ${entry.role}` })).not.toBeInTheDocument()
    },
  )

  it('opens one row at a time, folding the one that was open', async () => {
    const user = userEvent.setup()
    render(<Experience />)
    const [first, second] = experience
    const toggleFor = (role: string) => screen.getByRole('button', { name: `Details: ${role}` })

    await user.click(toggleFor(first.role))
    expect(screen.getByText(first.details[0])).toBeVisible()
    expect(screen.getByText(second.details[0])).not.toBeVisible()

    await user.click(toggleFor(second.role))
    expect(screen.getByText(second.details[0])).toBeVisible()
    expect(screen.getByText(first.details[0])).not.toBeVisible()
    expect(toggleFor(first.role)).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggleFor(second.role))
    expect(screen.getByText(second.details[0])).not.toBeVisible()
  })

  it('opens a row from a click anywhere on it, not only the "+"', async () => {
    const user = userEvent.setup()
    render(<Experience />)
    const [entry] = experience
    const toggle = screen.getByRole('button', { name: `Details: ${entry.role}` })

    await user.click(screen.getByText(entry.impact))
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    // Clicking inside the opened write-up leaves it open, for reading and selecting.
    await user.click(screen.getByText(entry.details[0]))
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByText(entry.dates))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('highlights a row, and only that row, while the pointer is over it', async () => {
    const user = userEvent.setup()
    render(<Experience />)
    const [first, second] = experience
    const row = screen.getByTestId(`experience-${first.id}`)

    await user.hover(screen.getByText(first.impact))
    expect(row).toHaveAttribute('data-highlighted', 'true')
    expect(screen.getByTestId(`experience-${second.id}`)).not.toHaveAttribute('data-highlighted')

    await user.unhover(screen.getByText(first.impact))
    expect(row).not.toHaveAttribute('data-highlighted')
  })

  it('leaves the row alone when the company link is clicked', async () => {
    const user = userEvent.setup()
    render(<Experience />)
    const [entry] = experience
    const row = screen.getByTestId(`experience-${entry.id}`)
    const link = within(row).getByRole('link', { name: entry.company })
    link.addEventListener('click', (event) => event.preventDefault())

    await user.click(link)
    expect(within(row).getByRole('button', { name: `Details: ${entry.role}` })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
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
