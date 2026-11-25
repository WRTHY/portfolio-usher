import type { Locator, Page } from '@playwright/test'

// Case studies section - rows are looked up by id, e.g. 'CS 2'
export class CaseStudiesSection {
  readonly section: Locator

  constructor(page: Page) {
    this.section = page.locator('#case-studies')
  }

  row(id: string): Locator {
    return this.section.getByTestId(`case-study-${id}`)
  }

  toggle(id: string): Locator {
    return this.row(id).getByRole('button', { name: /^Read case study:/ })
  }

  writeUp(id: string): Locator {
    return this.section.getByTestId(`case-study-write-up-${id}`)
  }

  closeFromEnd(id: string): Locator {
    return this.writeUp(id).getByRole('button', { name: 'Close case study' })
  }

  async open(id: string) {
    await this.toggle(id).click()
  }
}
