import { PortfolioPage } from './pages/PortfolioPage.page'

const ROLES = [
  'QA Lead / Senior SDET',
  'Software Development Engineer in Test',
  'QA Specialist',
  'Software Quality Engineer',
]

describe('experience ledger', () => {
  const portfolioPage = new PortfolioPage()
  const { experience } = portfolioPage

  beforeEach(() => {
    portfolioPage.visit()
  })

  it('lists every role, newest first', () => {
    experience.roleHeadings.should('have.length', ROLES.length)
    experience.roleHeadings.then((headings) => {
      expect([...headings].map((heading) => heading.textContent)).to.deep.equal(ROLES)
    })
  })

  it('keeps each role to at most four tools', () => {
    ROLES.forEach((role) => {
      experience.tools(role).its('length').should('be.within', 1, 4)
    })
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
