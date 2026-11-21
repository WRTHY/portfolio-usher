import { test, expect } from './fixtures'

const ROLES = [
  'QA Lead / Senior SDET',
  'Software Development Engineer in Test',
  'QA Specialist',
  'Software Quality Engineer',
]

test.describe('experience ledger', () => {
  test('lists every role, newest first', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { experience } = portfolioPage

    await expect(experience.rows).toHaveCount(ROLES.length)
    await expect(experience.rows.getByRole('heading', { level: 3 })).toHaveText(ROLES)
  })

  test('keeps each role to at most four tools', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { experience } = portfolioPage

    for (const role of ROLES) {
      const count = await experience.tools(role).count()
      expect(count, role).toBeGreaterThanOrEqual(1)
      expect(count, role).toBeLessThanOrEqual(4)
    }
  })

  test('company links open in a new tab', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const link = portfolioPage.experience.row('QA Specialist').getByRole('link', { name: 'Fubo Gaming' })

    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('href', /fubo/)
  })

  test.describe('on a phone', () => {
    test.use({ viewport: { width: 375, height: 812 } })

    test('stacks each row instead of squeezing four columns', async ({ portfolioPage }) => {
      await portfolioPage.goto()
      const row = portfolioPage.experience.row('QA Lead / Senior SDET')
      const dates = row.getByText('Jan 2025 – Aug 2026')
      const role = row.getByRole('heading', { level: 3 })

      const datesBox = await dates.boundingBox()
      const roleBox = await role.boundingBox()
      expect(roleBox!.y).toBeGreaterThan(datesBox!.y + datesBox!.height - 1)
    })
  })
})
