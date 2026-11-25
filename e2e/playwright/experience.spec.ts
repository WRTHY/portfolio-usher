import { test, expect } from './fixtures'

const ROLES = [
  'QA Lead / Senior SDET',
  'Software Development Engineer in Test',
  'QA Specialist',
  'Software Quality Engineer',
]

// The degree closes the ledger as its last row, and the git-graph's root.
const DEGREE = 'B.S. Computer Engineering'
const ROWS = [...ROLES, DEGREE]

test.describe('experience ledger', () => {
  test('lists every role, newest first, then the degree', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { experience } = portfolioPage

    await expect(experience.rows).toHaveCount(ROWS.length)
    await expect(experience.rows.getByRole('heading', { level: 3 })).toHaveText(ROWS)
  })

  test('keeps each role to at most four tools', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { experience } = portfolioPage

    for (const role of ROLES) {
      const count = await experience.tools(role).count()
      expect(count, role).toBeLessThanOrEqual(4)
    }
  })

  test('the "+" opens a role in place and closes it again', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { experience } = portfolioPage
    const role = 'QA Lead / Senior SDET'

    await expect(experience.details(role)).toBeHidden()
    await experience.toggle(role).click()

    await expect(experience.toggle(role)).toHaveAttribute('aria-expanded', 'true')
    await expect(experience.details(role)).toBeVisible()
    await expect(experience.details(role)).toContainText('500+ manual test cases')
    // The tools column grows into the rest of the stack beside the bullets.
    await expect(experience.moreTools(role)).toBeVisible()
    await expect(experience.moreTools(role)).toContainText('Qase')
    // Other roles stay closed.
    await expect(experience.details('QA Specialist')).toBeHidden()

    await experience.toggle(role).click()
    await expect(experience.details(role)).toBeHidden()
    await expect(experience.moreTools(role)).toBeHidden()
  })

  test('opening a role folds the one that was open, and keeps the new one where it was clicked', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { experience } = portfolioPage
    const [first, second] = ['QA Lead / Senior SDET', 'QA Specialist']

    await experience.toggle(first).click()
    await expect(experience.details(first)).toBeVisible()

    await experience.toggle(second).scrollIntoViewIfNeeded()
    const before = (await experience.toggle(second).boundingBox())!.y
    await experience.toggle(second).click()

    await expect(experience.toggle(second)).toHaveAttribute('aria-expanded', 'true')
    await expect(experience.details(second)).toBeVisible()
    await expect(experience.toggle(first)).toHaveAttribute('aria-expanded', 'false')
    await expect(experience.details(first)).toBeHidden()
    // The role above folded away, but the page held the clicked one in place.
    await expect.poll(async () => Math.abs((await experience.toggle(second).boundingBox())!.y - before)).toBeLessThanOrEqual(2)
  })

  test('the git-graph rail puts a node level with each role', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { experience } = portfolioPage
    await experience.root.scrollIntoViewIfNeeded()

    await expect(experience.graph.locator('circle')).toHaveCount(ROWS.length)
    await expect(experience.graph.locator('line')).toHaveCount(1)

    // Each node sits on its role's dates line, within a pixel.
    for (const [i, role] of ROWS.entries()) {
      const dates = await experience.row(role).locator('[data-graph-anchor]').boundingBox()
      const node = await experience.graph.locator('circle').nth(i).boundingBox()
      expect(Math.abs(node!.y + node!.height / 2 - (dates!.y + dates!.height / 2)), role).toBeLessThanOrEqual(1)
    }
  })

  test('hovering a row rings its node, and a click anywhere on the row opens it', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { experience } = portfolioPage
    const role = 'QA Specialist'

    await experience.impact(role).hover()
    await expect(experience.row(role)).toHaveAttribute('data-highlighted', 'true')
    await expect(experience.graphNode('fubo-gaming-qa-specialist')).toHaveAttribute('data-highlighted', 'true')
    // The "+" fills to say the row is clickable, though the pointer isn't on it.
    await expect(experience.toggle(role)).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

    await experience.impact(role).click()
    await expect(experience.toggle(role)).toHaveAttribute('aria-expanded', 'true')
    await expect(experience.details(role)).toBeVisible()
  })

  test('opening a role lights its node and keeps the rail aligned', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { experience } = portfolioPage
    const sdet = 'Software Development Engineer in Test'

    // No role is current, so nothing is lit until a role is opened.
    await expect(experience.graph.locator('circle')).toHaveCount(ROWS.length)
    await expect(experience.graph.locator('[data-active]')).toHaveCount(0)
    await experience.toggle(sdet).click()
    await expect(experience.graphNode('eventric-sdet')).toHaveAttribute('data-active', 'true')

    // The row below grew taller; its node must have followed it.
    const role = 'QA Specialist'
    await expect(async () => {
      const dates = await experience.row(role).locator('[data-graph-anchor]').boundingBox()
      const node = await experience.graphNode('fubo-gaming-qa-specialist').boundingBox()
      expect(Math.abs(node!.y + node!.height / 2 - (dates!.y + dates!.height / 2))).toBeLessThanOrEqual(1)
    }).toPass()
  })

  test('picking a tool fades the roles that never used it, and picking it again clears it', async ({
    portfolioPage,
  }) => {
    await portfolioPage.goto()
    const { experience } = portfolioPage

    await experience.toolFilter('Selenium').click()

    await expect(experience.toolFilter('Selenium')).toHaveAttribute('aria-pressed', 'true')
    await expect(experience.skillsStatus).toHaveText('Selenium: QA Specialist')
    await expect(experience.row('QA Specialist')).toHaveAttribute('data-tool-match', 'true')
    await expect(experience.row('QA Lead / Senior SDET')).toHaveAttribute('data-tool-match', 'false')
    await expect(experience.graphNode('fubo-gaming-qa-specialist')).toHaveAttribute('data-highlighted', 'true')

    await experience.toolFilter('Selenium').click()
    await expect(experience.row('QA Lead / Senior SDET')).not.toHaveAttribute('data-tool-match')
  })

  test('leaving the section clears the filter', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { experience } = portfolioPage
    await experience.toolFilter('Selenium').click()
    await expect(experience.toolFilter('Selenium')).toHaveAttribute('aria-pressed', 'true')

    // Checked while away: the section has to be seen leaving first.
    await portfolioPage.section('case-studies').scrollIntoViewIfNeeded()
    await expect(experience.toolFilter('Selenium')).toHaveAttribute('aria-pressed', 'false')

    await experience.root.scrollIntoViewIfNeeded()
    await expect(experience.row('QA Lead / Senior SDET')).not.toHaveAttribute('data-tool-match')
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
