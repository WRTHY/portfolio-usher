import { PortfolioPage } from './pages/PortfolioPage'

describe('theme toggle', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    portfolioPage.visit()
  })

  it('clicking the toggle flips the theme', () => {
    const { themeToggle } = portfolioPage

    themeToggle.toggle()
    themeToggle.currentMode().then((modeAfterFirstClick) => {
      expect(['light', 'dark']).to.include(modeAfterFirstClick)

      themeToggle.toggle()
      themeToggle
        .currentMode()
        .should('eq', modeAfterFirstClick === 'dark' ? 'light' : 'dark')
    })
  })

  it('the chosen theme persists across a reload', () => {
    const { themeToggle } = portfolioPage

    themeToggle.toggle()
    themeToggle.currentMode().then((chosenMode) => {
      cy.reload()
      themeToggle.currentMode().should('eq', chosenMode)
      themeToggle.storedMode().should('eq', chosenMode)
    })
  })
})
