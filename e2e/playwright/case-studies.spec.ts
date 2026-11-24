import { test, expect } from './fixtures'

const CASE_STUDY_ID = 'CS 2'
const CASE_STUDY_TITLE = `Building E2E Test Automation From Zero for Eventric's Flagship Desktop App`

test.describe('case studies', () => {
  // Closed by default - just the outcome and title
  test('a row leads with its outcome, and keeps the write-up closed', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage
    const row = caseStudies.row(CASE_STUDY_ID)

    await expect(row.getByRole('heading', { level: 3 })).toHaveText(CASE_STUDY_TITLE)
    await expect(row).toContainText('4 hrs → 10 min')
    await expect(caseStudies.toggle(CASE_STUDY_ID)).toHaveAttribute('aria-expanded', 'false')
    await expect(caseStudies.writeUp(CASE_STUDY_ID)).toBeHidden()
  })

  // Every write-up should have the same four parts
  test('the "+" opens the write-up in place, and closes it again', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage

    await caseStudies.open(CASE_STUDY_ID)

    await expect(caseStudies.toggle(CASE_STUDY_ID)).toHaveAttribute('aria-expanded', 'true')
    const writeUp = caseStudies.writeUp(CASE_STUDY_ID)
    await expect(writeUp).toBeVisible()
    await expect(writeUp.getByRole('heading', { level: 4 })).toHaveText([
      'Problem',
      'Approach',
      'Outcome',
      'Future iterations',
    ])

    await caseStudies.toggle(CASE_STUDY_ID).click()
    await expect(writeUp).toBeHidden()
  })

  // Close button at the bottom of a long write-up - focus and scroll go back to the row
  test('closing from the end of a write-up returns focus and the view to its row', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage

    await caseStudies.open(CASE_STUDY_ID)
    await caseStudies.closeFromEnd(CASE_STUDY_ID).click()

    await expect(caseStudies.writeUp(CASE_STUDY_ID)).toBeHidden()
    await expect(caseStudies.toggle(CASE_STUDY_ID)).toBeFocused()
    await expect(caseStudies.row(CASE_STUDY_ID)).toBeInViewport()
  })
})
