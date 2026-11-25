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

    portfolioPage.nav.goTo('case-studies')
    portfolioPage.section('case-studies').should('be.inViewport')
  })

  it("the bar's Let's talk pill jumps to the contact close", () => {
    cy.get('header').findByRole('link', { name: 'Let’s talk' }).click()
    portfolioPage.contact.section.should('be.inViewport')
  })

  it('at the hero nothing in the bar is marked, and the rail marks the hero itself', () => {
    cy.get('header [aria-current]').should('not.exist')
    portfolioPage.rail.findByRole('link', { name: 'Intro' }).should('have.attr', 'aria-current', 'true')

    portfolioPage.scrollSectionToTop('experience')
    portfolioPage.rail.findByRole('link', { name: 'Experience' }).should('have.attr', 'aria-current', 'true')
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

describe('rail socials', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    // The rail is desktop-only.
    cy.viewport(1280, 720)
    portfolioPage.visit()
  })

  it('fade out at the contact close, which has the same links, and back in above it', () => {
    portfolioPage.railSocials.should('have.css', 'opacity', '1')

    portfolioPage.contact.section.scrollIntoView()
    portfolioPage.railSocials.should('have.css', 'opacity', '0')

    portfolioPage.scrollSectionToTop('experience')
    portfolioPage.railSocials.should('have.css', 'opacity', '1')
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

    nav.mobileLink('experience').should('not.be.visible')

    nav.openMenu()
    nav.menuToggle.should('have.attr', 'aria-label', 'Close menu')
    nav.mobileLink('experience').should('be.visible')

    nav.closeMenu()
    nav.menuToggle.should('have.attr', 'aria-label', 'Open menu')
    nav.mobileLink('experience').should('not.be.visible')
  })

  it('choosing a link closes the menu and scrolls to the section', () => {
    const { nav } = portfolioPage

    nav.openMenu()
    nav.mobileGoTo('experience')

    portfolioPage.section('experience').should('be.inViewport')
    nav.menuToggle.should('have.attr', 'aria-label', 'Open menu')
  })
})
