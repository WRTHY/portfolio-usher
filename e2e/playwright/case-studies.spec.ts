import { test, expect } from './fixtures'

const CASE_STUDY_ONE = /Placeholder case study one/

test.describe('case study modal', () => {
  test('clicking a tile opens the modal with that case study', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage

    await caseStudies.open(CASE_STUDY_ONE)

    const { modal } = caseStudies
    await expect(modal.dialog).toBeVisible()
    await expect(modal.heading('Placeholder case study one')).toBeVisible()
    await expect(modal.dialog.getByText('Placeholder', { exact: false }).first()).toBeVisible()
  })

  test('Escape closes the modal and returns focus to the trigger', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage
    const trigger = caseStudies.tile(CASE_STUDY_ONE)

    await caseStudies.open(CASE_STUDY_ONE)
    await expect(caseStudies.modal.dialog).toBeVisible()

    await caseStudies.modal.closeWithEscape()
    await expect(caseStudies.modal.dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })

  test('the close button closes the modal and returns focus to the trigger', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage
    const trigger = caseStudies.tile(CASE_STUDY_ONE)

    await caseStudies.open(CASE_STUDY_ONE)
    await expect(caseStudies.modal.dialog).toBeVisible()

    await caseStudies.modal.close()
    await expect(caseStudies.modal.dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })
})
