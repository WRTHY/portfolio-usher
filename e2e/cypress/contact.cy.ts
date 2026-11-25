import { PortfolioPage } from './pages/PortfolioPage.page'

describe('contact', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    portfolioPage.visit()
  })

  it('the close offers email, LinkedIn, GitHub and the resume', () => {
    const { contact } = portfolioPage

    contact.section.scrollIntoView()
    contact.email.should('have.attr', 'href').and('match', /^mailto:/)
    ;(['LinkedIn', 'GitHub', 'Resume'] as const).forEach((name) => {
      contact.link(name).should('have.attr', 'target', '_blank')
    })
    contact.footer.should('contain.text', `© ${new Date().getFullYear()} James Usher`)
  })
})
