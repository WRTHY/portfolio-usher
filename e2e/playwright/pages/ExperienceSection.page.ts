import type { Locator, Page } from '@playwright/test'

// The Experience ledger: one row per role, newest first.
export class ExperienceSection {
  readonly root: Locator
  readonly rows: Locator

  constructor(page: Page) {
    this.root = page.locator('#experience')
    this.rows = this.root.getByRole('listitem').filter({ has: page.getByRole('heading', { level: 3 }) })
  }

  row(role: string): Locator {
    return this.rows.filter({ has: this.root.page().getByRole('heading', { level: 3, name: role, exact: true }) })
  }

  tools(role: string): Locator {
    return this.row(role).getByRole('list', { name: `Key tools as ${role}` }).getByRole('listitem')
  }
}
