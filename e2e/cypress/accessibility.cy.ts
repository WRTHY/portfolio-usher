import { PortfolioPage } from './pages/PortfolioPage.page'
import { scanForViolations, formatViolations } from './support/axe'

describe('accessibility', () => {
  const portfolioPage = new PortfolioPage()

  it('the page has no WCAG 2.1 AA violations in its default state', () => {
    portfolioPage.visit()

    scanForViolations().then((violations) => {
      expect(violations.length, formatViolations(violations)).to.equal(0)
    })
  })

  it('the case study modal has no violations while open', () => {
    portfolioPage.visit()
    portfolioPage.caseStudies.open('CS 1')
    portfolioPage.caseStudies.modal.dialog.should('be.visible')

    scanForViolations().then((violations) => {
      expect(violations.length, formatViolations(violations)).to.equal(0)
    })
  })

  it('dark mode has no additional contrast violations', () => {
    portfolioPage.visit()
    portfolioPage.themeToggle.toggle()
    // InfoPanel's background-color transition runs 0.6s (see
    // InfoPanel.module.css) — scanning before it settles catches axe
    // mid-crossfade and flags transitional colors that never render.
    cy.wait(700)

    scanForViolations().then((violations) => {
      expect(violations.length, formatViolations(violations)).to.equal(0)
    })
  })

  describe('mobile viewport', () => {
    beforeEach(() => {
      cy.viewport(375, 812)
    })

    it('the mobile nav menu has no violations while open', () => {
      portfolioPage.visit()
      portfolioPage.nav.openMenu()

      scanForViolations().then((violations) => {
        expect(violations.length, formatViolations(violations)).to.equal(0)
      })
    })
  })
})
