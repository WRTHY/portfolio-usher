import type { Locator, Page } from '@playwright/test'
import { test, expect } from './fixtures'

// The inspector shows each element's locator and assertion as text (its
// data-loc / data-check attributes). Turning that text back into real calls
// is what keeps the on-page claims honest: every pair the page shows is run
// here, exactly as written.
function runLocator(page: Page, loc: string): Locator {
  return new Function('page', `return page.${loc}`)(page) as Locator
}

function runAssertion(target: Locator, check: string): Promise<void> {
  return new Function('expect', 'target', `return expect(target).${check}`)(expect, target) as Promise<void>
}

// The page's layout and which duplicate links are displayed differ between
// desktop (left nav card) and phones (hamburger menu), so the locators are
// held to being exact at both sizes.
for (const [device, viewport] of [
  ['desktop', { width: 1280, height: 800 }],
  ['phone', { width: 375, height: 812 }],
] as const) {
  test.describe(`hero locators on ${device}`, () => {
    test.use({ viewport })

    test('every locator the inspector shows finds exactly its element, and every assertion passes', async ({
      portfolioPage,
    }) => {
      await portfolioPage.goto()
      const { hero } = portfolioPage
      // Some assertions describe the inspecting state (the switch is checked).
      await hero.startPicking()

      const tagged = await hero.taggedElements()
      expect(tagged.length).toBeGreaterThanOrEqual(7)

      for (const element of tagged) {
        await test.step(`${element.loc} -> ${element.check}`, async () => {
          const target = runLocator(portfolioPage.page, element.loc)
          await expect(target).toHaveCount(1)
          await expect(target).toHaveAttribute('data-verify-id', element.id)
          await runAssertion(target, element.check)
        })
      }
    })
  })
}

test.describe('hero locator inspector', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('the switch stays hidden until a letter of the name is clicked, and folds away again', async ({
    portfolioPage,
  }) => {
    await portfolioPage.goto()
    const { hero } = portfolioPage

    await expect(hero.pickSwitch).toBeHidden()
    await hero.startPicking()
    await expect(hero.pickSwitch).toBeChecked()

    await hero.hidePicker()
    await expect(hero.pickSwitch).toBeHidden()
    await expect(hero.locatorTip).toHaveCount(0)
  })

  test('starts on the name and follows the pointer', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { hero, page } = { hero: portfolioPage.hero, page: portfolioPage.page }

    await hero.startPicking()
    await expect(hero.locatorTip).toContainText("getByRole('heading', { level: 1 })")

    await page.getByRole('link', { name: 'Download resume' }).hover()
    await expect(hero.locatorTip).toContainText("getByRole('link', { name: 'Download resume' })")
  })

  test('clicks pick instead of navigating while it is on', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { hero, page } = { hero: portfolioPage.hero, page: portfolioPage.page }
    await hero.startPicking()

    await page.getByRole('link', { name: 'Download resume' }).click()

    await expect(page).toHaveURL(/\/$/)
    await expect(hero.locatorTip).toContainText("name: 'Download resume'")
  })

  test('Escape turns it off and returns focus to the switch', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { hero, page } = { hero: portfolioPage.hero, page: portfolioPage.page }
    await hero.startPicking()

    await page.keyboard.press('Escape')

    await expect(hero.pickSwitch).not.toBeChecked()
    await expect(hero.pickSwitch).toBeFocused()
    await expect(hero.locatorTip).toHaveCount(0)
  })

  test('scrolling past the hero turns it off', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { hero } = portfolioPage
    await hero.startPicking()
    await expect(hero.pickSwitch).toBeChecked()

    await portfolioPage.section('case-studies').scrollIntoViewIfNeeded()

    await expect(hero.pickSwitch).not.toBeChecked()
    await expect(hero.locatorTip).toHaveCount(0)
  })
})

test.describe('name hand-off', () => {
  test('the bar shows the name only once the hero name has scrolled away', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { hero, page } = { hero: portfolioPage.hero, page: portfolioPage.page }

    await expect(hero.name).toBeInViewport()
    await expect(hero.barName).toBeHidden()

    await portfolioPage.section('experience').scrollIntoViewIfNeeded()
    await expect(hero.barName).toBeVisible()

    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(hero.barName).toBeHidden()
  })
})

test.describe('opener', () => {
  test('plays on the first visit of a session, skips on any key, and stays gone after', async ({
    portfolioPage,
  }) => {
    await portfolioPage.goto({ intro: true })
    const { hero, page } = { hero: portfolioPage.hero, page: portfolioPage.page }

    await expect(hero.opener).toBeVisible()
    await expect(hero.opener).toContainText('npx playwright test james-usher.spec.ts')

    await page.keyboard.press('Space')

    await expect(hero.opener).toHaveCount(0)
    await expect(hero.name).toBeVisible()

    await page.reload()
    await expect(hero.name).toBeVisible()
    await expect(hero.opener).toHaveCount(0)
  })

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })

    test('never plays', async ({ portfolioPage }) => {
      await portfolioPage.goto({ intro: true })
      await expect(portfolioPage.hero.name).toBeVisible()
      await expect(portfolioPage.hero.opener).toHaveCount(0)
    })
  })
})
