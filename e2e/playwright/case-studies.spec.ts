import { test, expect } from './fixtures'

const CASE_STUDY_ID = 'CS 2'
const CASE_STUDY_TITLE = `Building E2E Test Automation From Zero for Eventric's Flagship Desktop App`

test.describe('case study modal', () => {
  test('clicking a tile opens the modal with that case study', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage

    await caseStudies.open(CASE_STUDY_ID)

    const { modal } = caseStudies
    await expect(modal.dialog).toBeVisible()
    await expect(modal.title).toHaveText(CASE_STUDY_TITLE)
  })

  test('Escape closes the modal and returns focus to the trigger', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage
    const trigger = caseStudies.tile(CASE_STUDY_ID)

    await caseStudies.open(CASE_STUDY_ID)
    await expect(caseStudies.modal.dialog).toBeVisible()

    await caseStudies.modal.closeWithEscape()
    await expect(caseStudies.modal.dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })

  test('the close button closes the modal and returns focus to the trigger', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage
    const trigger = caseStudies.tile(CASE_STUDY_ID)

    await caseStudies.open(CASE_STUDY_ID)
    await expect(caseStudies.modal.dialog).toBeVisible()

    await caseStudies.modal.close()
    await expect(caseStudies.modal.dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })
})
