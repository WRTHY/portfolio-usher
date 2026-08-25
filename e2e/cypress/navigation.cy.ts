import { PortfolioPage } from './pages/PortfolioPage'

describe('primary navigation', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    portfolioPage.visit()
  })

  it('each nav link scrolls its section into view', () => {
    portfolioPage.nav.goTo('case-studies')
    portfolioPage.section('case-studies').should('be.inViewport')

    portfolioPage.nav.goTo('code-samples')
    portfolioPage.section('code-samples').should('be.inViewport')

    portfolioPage.nav.goTo('experience')
    portfolioPage.section('experience').should('be.inViewport')

    portfolioPage.nav.goTo('about')
    portfolioPage.section('about').should('be.inViewport')
  })
})

describe('mobile navigation', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    cy.viewport(375, 812)
    portfolioPage.visit()
  })

  it('the menu toggle opens and closes the nav', () => {
    const { nav } = portfolioPage

    nav.mobileLink('about').should('not.be.visible')

    nav.openMenu()
    nav.menuToggle.should('have.attr', 'aria-label', 'Close menu')
    nav.mobileLink('about').should('be.visible')

    nav.closeMenu()
    nav.menuToggle.should('have.attr', 'aria-label', 'Open menu')
    nav.mobileLink('about').should('not.be.visible')
  })

  it('choosing a link closes the menu and scrolls to the section', () => {
    const { nav } = portfolioPage

    nav.openMenu()
    nav.mobileGoTo('about')

    portfolioPage.section('about').should('be.inViewport')
    nav.menuToggle.should('have.attr', 'aria-label', 'Open menu')
  })
})
