import type { Locator, Page } from '@playwright/test'

// The Case Studies ledger: one outcome-led row per case study, each opening
// its write-up in place.
export class CaseStudiesSection {
  readonly section: Locator

  constructor(page: Page) {
    this.section = page.locator('#case-studies')
  }

  // Rows are looked up by case study id (e.g. 'CS 2') through their test id:
  // a row's visible text is its outcome, title and topics, none of which is
  // as stable a handle as the id callers pass in.
  row(id: string): Locator {
    return this.section.getByTestId(`case-study-${id}`)
  }

  /** The row's "+": a disclosure button named for its case study. */
  toggle(id: string): Locator {
    return this.row(id).getByRole('button', { name: /^Read case study:/ })
  }

  /** The full write-up. Resolves while closed too, so specs can assert both. */
  writeUp(id: string): Locator {
    return this.section.getByTestId(`case-study-write-up-${id}`)
  }

  /** The control at the end of an open write-up. */
  closeFromEnd(id: string): Locator {
    return this.writeUp(id).getByRole('button', { name: 'Close case study' })
  }

  async open(id: string) {
    await this.toggle(id).click()
  }
}
