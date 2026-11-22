import type { Locator, Page } from '@playwright/test'

// The Experience ledger: one row per role, newest first.
export class ExperienceSection {
  readonly root: Locator
  readonly rows: Locator
  /** The git-graph rail down the ledger's left edge (decorative SVG). */
  readonly graph: Locator

  constructor(page: Page) {
    this.root = page.locator('#experience')
    this.graph = this.root.getByTestId('career-graph')
    this.rows = this.root.getByRole('listitem').filter({ has: page.getByRole('heading', { level: 3 }) })
  }

  row(role: string): Locator {
    return this.rows.filter({ has: this.root.page().getByRole('heading', { level: 3, name: role, exact: true }) })
  }

  tools(role: string): Locator {
    return this.row(role).getByRole('list', { name: `Key tools as ${role}` }).getByRole('listitem')
  }

  /** The row's one-sentence impact line: a plain part of the row to hover or click. */
  impact(role: string): Locator {
    return this.row(role).locator('p:not([data-graph-anchor])').first()
  }

  /** The row's "+", which opens its detail bullets and full stack. */
  toggle(role: string): Locator {
    return this.row(role).getByRole('button', { name: `Details: ${role}` })
  }

  graphNode(id: string): Locator {
    return this.graph.locator(`circle[data-node="${id}"]`)
  }

  /** The rest of the role's stack, which unfolds under its key tools. */
  moreTools(role: string): Locator {
    return this.row(role).getByRole('list', { name: `More tools as ${role}`, includeHidden: true })
  }

  details(role: string): Locator {
    return this.row(role).getByRole('list', { name: `What I did as ${role}`, includeHidden: true })
  }
}
