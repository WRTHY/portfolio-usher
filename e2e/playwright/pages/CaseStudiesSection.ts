import type { Locator, Page } from '@playwright/test'
import { CaseStudyModal } from './CaseStudyModal'

export class CaseStudiesSection {
  private readonly page: Page
  readonly section: Locator
  readonly modal: CaseStudyModal

  constructor(page: Page) {
    this.page = page
    this.section = page.locator('#case-studies')
    this.modal = new CaseStudyModal(page)
  }

  tile(caseStudyId: string): Locator {
    return this.page.getByTestId(`case-study-card-${caseStudyId}`)
  }

  async open(caseStudyId: string) {
    await this.tile(caseStudyId).click()
  }
}
