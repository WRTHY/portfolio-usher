import { PortfolioPage } from './pages/PortfolioPage'
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
    portfolioPage.caseStudies.open(/Placeholder case study one/)
    portfolioPage.caseStudies.modal.dialog.should('be.visible')

    scanForViolations().then((violations) => {
      expect(violations.length, formatViolations(violations)).to.equal(0)
    })
  })

  it('dark mode has no additional contrast violations', () => {
    portfolioPage.visit()
    portfolioPage.themeToggle.toggle()

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
