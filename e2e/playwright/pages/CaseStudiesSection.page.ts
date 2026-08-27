import type { Locator, Page } from '@playwright/test'
import { CaseStudyModal } from './CaseStudyModal.page'

export class CaseStudiesSection {
  private readonly page: Page
  readonly section: Locator
  readonly modal: CaseStudyModal

  constructor(page: Page) {
    this.page = page
    this.section = page.locator('#case-studies')
    this.modal = new CaseStudyModal(page)
  }

  // Tile buttons have no aria-label — their accessible name is the badge +
  // title + summary text concatenated, not the case study id callers pass
  // in (e.g. 'CS 2') — so this looks up the card's data-testid instead
  // (see CaseStudies.tsx: `case-study-card-${caseStudy.id}`).
  tile(id: string): Locator {
    return this.page.getByTestId(`case-study-card-${id}`)
  }

  async open(id: string) {
    await this.tile(id).click()
  }
}
