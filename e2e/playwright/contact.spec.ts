import { test, expect } from './fixtures'

test.describe('contact', () => {
  test('the close offers email, LinkedIn, GitHub and the resume', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { contact } = portfolioPage

    await contact.section.scrollIntoViewIfNeeded()
    await expect(contact.email).toHaveAttribute('href', /^mailto:/)
    for (const name of ['LinkedIn', 'GitHub', 'Resume'] as const) {
      await expect(contact.link(name)).toHaveAttribute('target', '_blank')
    }
    await expect(contact.footer).toContainText(`© ${new Date().getFullYear()} James Usher`)
  })
})
