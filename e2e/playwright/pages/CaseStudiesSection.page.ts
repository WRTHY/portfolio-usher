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
  // title + summary text concatenated — so callers match on the title alone.
  tile(title: string | RegExp): Locator {
    return this.page.getByRole('button', { name: title })
  }

  async open(title: string | RegExp) {
    await this.tile(title).click()
  }
}
