import { PortfolioPage } from './pages/PortfolioPage.page'

const ROLES = [
  'QA Lead / Senior SDET',
  'Software Development Engineer in Test',
  'QA Specialist',
  'Software Quality Engineer',
]

// The degree closes the ledger as its last row, and the git-graph's root.
const DEGREE = 'B.S. Computer Engineering'
const ROWS = [...ROLES, DEGREE]

describe('experience ledger', () => {
  const portfolioPage = new PortfolioPage()
  const { experience } = portfolioPage

  beforeEach(() => {
    portfolioPage.visit()
  })

  it('lists every role, newest first, then the degree', () => {
    experience.roleHeadings.should('have.length', ROWS.length)
    experience.roleHeadings.then((headings) => {
      expect([...headings].map((heading) => heading.textContent)).to.deep.equal(ROWS)
    })
  })

  it('keeps each role to at most four tools', () => {
    ROLES.forEach((role) => {
      experience.toolCount(role).should('be.at.most', 4)
    })
  })

  it('the "+" opens a role in place and closes it again', () => {
    const role = 'QA Lead / Senior SDET'

    experience.details(role).should('not.be.visible')
    experience.toggle(role).click()

    experience.toggle(role).should('have.attr', 'aria-expanded', 'true')
    experience.details(role).should('be.visible').and('contain.text', 'Maestro suite of 100+ cases')
    // The tools column grows into the rest of the stack beside the bullets.
    experience.moreTools(role).should('be.visible').and('contain.text', 'Qase')
    // Other roles stay closed.
    experience.details('QA Specialist').should('not.be.visible')

    experience.toggle(role).click()
    experience.details(role).should('not.be.visible')
    experience.moreTools(role).should('not.be.visible')
  })

  it('opening a role folds the one that was open', () => {
    const [first, second] = ['QA Lead / Senior SDET', 'QA Specialist']

    experience.toggle(first).click()
    experience.details(first).should('be.visible')

    experience.toggle(second).click()
    experience.toggle(second).should('have.attr', 'aria-expanded', 'true')
    experience.details(second).should('be.visible')
    experience.toggle(first).should('have.attr', 'aria-expanded', 'false')
    experience.details(first).should('not.be.visible')
  })

  it('the git-graph rail has a node per role on one line', () => {
    cy.get('#experience').scrollIntoView()

    experience.graph.find('circle').should('have.length', ROWS.length)
    experience.graph.find('line').should('have.length', 1)
  })

  it('a click anywhere on a row opens it', () => {
    const role = 'QA Specialist'
    experience.impact(role).click()
    experience.toggle(role).should('have.attr', 'aria-expanded', 'true')
    experience.details(role).should('be.visible')
  })

  it('opening a role lights its node', () => {
    // No role is current, so nothing is lit until a role is opened.
    experience.graph.find('circle').should('have.length', ROWS.length)
    experience.graph.find('[data-active]').should('have.length', 0)
    experience.toggle('Software Development Engineer in Test').click()
    experience.graphNode('eventric-sdet').should('have.attr', 'data-active', 'true')
  })

  it('company links open in a new tab', () => {
    experience
      .row('QA Specialist')
      .findByRole('link', { name: 'Fubo Gaming' })
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'href')
      .and('match', /fubo/)
  })
})
