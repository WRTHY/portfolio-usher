import { PortfolioPage } from './pages/PortfolioPage.page'

// Cypress mirror of e2e/playwright/hero.spec.ts's behaviour checks. The
// "every on-page locator resolves" check lives on the Playwright side only:
// the locators are written in Playwright's call syntax, so that's the runner
// that can execute them verbatim.
describe('hero locator inspector', () => {
  const portfolioPage = new PortfolioPage()
  const { hero } = portfolioPage

  beforeEach(() => {
    cy.viewport(1280, 800)
    portfolioPage.visit()
  })

  it('the switch stays hidden until a letter of the name is clicked, and folds away again', () => {
    hero.pickSwitch.should('not.be.visible')
    hero.startPicking()
    hero.pickSwitch.should('have.attr', 'aria-checked', 'true')

    hero.hidePicker()
    hero.pickSwitch.should('not.be.visible')
    hero.locatorTip.should('not.exist')
  })

  it('starts on the name and follows the pointer', () => {
    hero.startPicking()
    hero.pickSwitch.should('have.attr', 'aria-checked', 'true')
    hero.locatorTip.should('contain.text', "getByRole('heading', { level: 1 })")

    cy.findByRole('link', { name: 'Download resume' }).trigger('pointerover')
    hero.locatorTip.should('contain.text', "getByRole('link', { name: 'Download resume' })")
  })

  it('clicks pick instead of navigating while it is on', () => {
    hero.startPicking()

    cy.findByRole('link', { name: 'Download resume' }).click()

    cy.location('pathname').should('eq', '/')
    hero.locatorTip.should('contain.text', "name: 'Download resume'")
  })

  it('Escape turns it off and returns focus to the switch', () => {
    hero.startPicking()

    cy.get('body').type('{esc}')

    hero.pickSwitch.should('have.attr', 'aria-checked', 'false').and('have.focus')
    hero.locatorTip.should('not.exist')
  })

  it('scrolling past the hero turns it off', () => {
    hero.startPicking()

    portfolioPage.section('case-studies').scrollIntoView()

    hero.pickSwitch.should('have.attr', 'aria-checked', 'false')
    hero.locatorTip.should('not.exist')
  })
})

describe('name hand-off', () => {
  const portfolioPage = new PortfolioPage()
  const { hero } = portfolioPage

  it('the bar shows the name only once the hero name has scrolled away', () => {
    portfolioPage.visit()
    hero.barName.should('not.be.visible')

    portfolioPage.section('experience').scrollIntoView()
    hero.barName.should('be.visible')

    cy.scrollTo('top')
    hero.barName.should('not.be.visible')
  })
})

describe('opener', () => {
  const portfolioPage = new PortfolioPage()
  const { hero } = portfolioPage

  it('plays on the first visit of a session and skips on any key', () => {
    portfolioPage.visit({ intro: true })

    hero.opener.should('be.visible').and('contain.text', 'npx playwright test james-usher.spec.ts')

    cy.get('body').type(' ')

    hero.opener.should('not.exist')
    hero.name.should('be.visible')
  })
})
