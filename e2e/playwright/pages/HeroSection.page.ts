import type { Locator, Page } from '@playwright/test'

export type TaggedElement = {
  /** A page locator, written as the Playwright call chain after `page.`. */
  loc: string
  /** An assertion, written as the matcher call after `expect(locator).`. */
  check: string
}

// The hero: name, pitch, actions, the docked test run, and the Pick locator
// switch that turns on the locator inspector. Also owns the one-time opener,
// since it's the hero's entrance.
export class HeroSection {
  private readonly page: Page
  readonly root: Locator
  readonly name: Locator
  readonly pickSwitch: Locator
  readonly locatorTip: Locator
  readonly opener: Locator
  /** The top bar's copy of the name, which only shows once the hero name has
   *  scrolled away. includeHidden, so specs can assert both states. */
  readonly barName: Locator

  constructor(page: Page) {
    this.page = page
    this.root = page.locator('#top')
    this.name = page.getByRole('heading', { level: 1 })
    this.pickSwitch = page.getByRole('switch', { name: 'Pick locator' })
    this.locatorTip = page.getByTestId('locator-tip')
    this.opener = page.getByTestId('opener')
    this.barName = page.getByRole('banner').getByRole('link', { name: 'James Usher', includeHidden: true })
  }

  async startPicking() {
    await this.pickSwitch.click()
  }

  // Every element the inspector can show, with its locator/assertion pair.
  // Each element also gets a data-verify-id, so a spec can check that the
  // locator resolves to this exact element and not a look-alike.
  async taggedElements(): Promise<(TaggedElement & { id: string })[]> {
    return this.page.$$eval('[data-loc]', (elements) =>
      elements.map((element, i) => {
        element.setAttribute('data-verify-id', String(i))
        const tagged = element as HTMLElement
        return { id: String(i), loc: tagged.dataset.loc ?? '', check: tagged.dataset.check ?? '' }
      }),
    )
  }
}
