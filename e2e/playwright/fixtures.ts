import { test as base, expect } from '@playwright/test'
import { PortfolioPage } from './pages/PortfolioPage.page'

type Fixtures = {
  portfolioPage: PortfolioPage
}

export const test = base.extend<Fixtures>({
  portfolioPage: async ({ page }, use) => {
    await use(new PortfolioPage(page))
  },
})

export { expect }
