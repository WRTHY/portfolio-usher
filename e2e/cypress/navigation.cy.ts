import { PortfolioPage } from './pages/PortfolioPage.page'

describe('primary navigation', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    // The bar's inline section links only show from 1024px up (below that
    // they live in the hamburger menu), and Cypress's default viewport is
    // 1000px wide - so this pins a desktop size, the same way the mobile
    // block below pins a phone size.
    cy.viewport(1280, 720)
    portfolioPage.visit()
  })

  it('each nav link scrolls its section into view', () => {
    portfolioPage.nav.goTo('case-studies')
    portfolioPage.section('case-studies').should('be.inViewport')

    portfolioPage.nav.goTo('projects')
    portfolioPage.section('projects').should('be.inViewport')

    portfolioPage.nav.goTo('experience')
    portfolioPage.section('experience').should('be.inViewport')

    portfolioPage.nav.goTo('about')
    portfolioPage.section('about').should('be.inViewport')
  })

  it('the left rail switches to readable colours over the violet section', () => {
    // Dots, theme toggle and socials each switch on their own.
    portfolioPage.railPartsOnAccent.should('have.length', 0)

    portfolioPage.scrollSectionToTop('projects')
    portfolioPage.railPartsOnAccent.should('have.length', 3)

    portfolioPage.scrollSectionToTop('experience')
    portfolioPage.railPartsOnAccent.should('have.length', 0)
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
