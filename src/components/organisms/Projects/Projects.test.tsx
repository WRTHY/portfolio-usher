import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Projects from './Projects'
import { apiTestingExamples, apiTestingIntro } from '../../../content/apiTesting'
import { links } from '../../../content/links'
import { pipeline, pipelineStages } from '../../../content/pipeline'
import { projectsCopy } from '../../../content/projects'
import { testCounts } from '../../../content/testCounts.generated'

const stage = (id: string) => screen.getByTestId(`pipeline-stage-${id}`)
// This site's project: its code panel, as opposed to the API suite's.
const site = () => within(screen.getByTestId('project-site'))
const count = (suite: string) => testCounts.suites.find((item) => item.id === suite)!.count
const toggleOf = (id: string) => within(screen.getByTestId(id)).getByRole('button', { name: /^Open:/ })
const indexLink = (name: RegExp) =>
  within(screen.getByRole('list', { name: 'Projects in this section' })).getByRole('link', { name })

describe('Projects', () => {
  // jsdom has no scrolling; the jump from the index scrolls.
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(window, 'scrollBy').mockImplementation(() => {})
  })

  it('is the region named by its heading, with a count saying it holds two projects', () => {
    render(<Projects />)
    expect(screen.getByRole('region', { name: 'Projects' })).toHaveAttribute('id', 'projects')
    expect(screen.getByTestId('section-count')).toHaveTextContent('(2)')
    expect(screen.getByTestId('project-site')).toBeInTheDocument()
    expect(screen.getByTestId('project-api')).toBeInTheDocument()
  })

  it('numbers the two projects, and indexes them beside the title', () => {
    render(<Projects />)
    const index = screen.getByRole('list', { name: 'Projects in this section' })
    const links = within(index).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#project-site', '#project-api'])
    expect(links.map((link) => link.textContent)).toEqual([
      `01${projectsCopy.site.headline}`,
      `02${projectsCopy.api.name}`,
    ])
    expect(screen.getByRole('heading', { level: 3, name: `01${projectsCopy.site.headline}` })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: `02${projectsCopy.api.name}` })).toBeInTheDocument()
  })

  it('jumping from the index opens only that project, and moves focus to it', async () => {
    const user = userEvent.setup()
    render(<Projects />)
    expect(toggleOf('project-site')).toHaveAttribute('aria-expanded', 'true')
    expect(toggleOf('project-api')).toHaveAttribute('aria-expanded', 'false')

    await user.click(indexLink(/API/))

    expect(toggleOf('project-api')).toHaveAttribute('aria-expanded', 'true')
    expect(toggleOf('project-site')).toHaveAttribute('aria-expanded', 'false')
    expect(toggleOf('project-api')).toHaveFocus()

    await user.click(indexLink(new RegExp(projectsCopy.site.headline)))

    expect(toggleOf('project-site')).toHaveAttribute('aria-expanded', 'true')
    expect(toggleOf('project-api')).toHaveAttribute('aria-expanded', 'false')
  })

  it("this site's project folds away from its \"+\", and back", async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(toggleOf('project-site'))
    expect(toggleOf('project-site')).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('radiogroup', { name: 'Test stage' })).not.toBeInTheDocument()

    await user.click(site().getByText(projectsCopy.site.description))
    expect(toggleOf('project-site')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('radiogroup', { name: 'Test stage' })).toBeVisible()
  })

  it("leads with this site's testing, its repo link beside the name", () => {
    render(<Projects />)
    const heading = site().getByRole('heading', { level: 3 })
    const repo = site().getByRole('link', { name: `${projectsCopy.repoLink}: ${projectsCopy.site.headline}` })
    expect(repo).toHaveTextContent(projectsCopy.repoLink)
    expect(repo).toHaveAttribute('href', links.portfolioRepo)
    expect(heading.parentElement).toContainElement(repo)
    expect(site().getByText(projectsCopy.site.description)).toBeVisible()
  })

  it('draws the CI as the pipeline file, then its tiers in the order they run, each a way into its code', () => {
    render(<Projects />)
    const stages = screen.getByRole('radiogroup', { name: 'Test stage' })

    pipeline.tiers.forEach((tier) => {
      const drawn = within(stages).getByTestId(`pipeline-tier-${tier.number}`)
      expect(drawn).toHaveTextContent(tier.name)
      tier.stages.forEach((item) => expect(within(drawn).getByTestId(`pipeline-stage-${item.id}`)).toHaveTextContent(item.name))
    })
    expect(within(stages).getByTestId('pipeline-start')).toHaveTextContent(pipeline.start.name)
    expect(within(stages).getAllByRole('radio').map((radio) => radio.dataset.testid)).toEqual([
      'pipeline-stage-pipeline',
      ...pipelineStages.map((item) => `pipeline-stage-${item.id}`),
    ])
  })

  it("shows each stage's test count, from the generated counts", () => {
    render(<Projects />)
    expect(stage('unit')).toHaveTextContent(`${count('vitest')} tests`)
    expect(stage('component')).toHaveTextContent(`${count('cypress-component')} tests`)
    expect(stage('e2e')).toHaveTextContent(`${count('playwright') + count('cypress-e2e')} tests`)
    expect(stage('static')).not.toHaveTextContent('tests')
  })

  it('opens on the end-to-end stage, in Playwright, and names the workflow that runs it', () => {
    render(<Projects />)
    expect(stage('e2e')).toHaveAttribute('data-state', 'checked')
    expect(site().getByRole('radio', { name: 'Playwright' })).toHaveAttribute('data-state', 'checked')
    expect(site().getByTestId('active-file-path')).toHaveTextContent('e2e/playwright/case-studies.spec.ts')
    expect(site().getByTestId('active-file-note')).toHaveTextContent('Tier 3 of 3 · e2e-tests.yml, called by ci.yml')
    // The workflow that runs it is its last file.
    expect(site().getByRole('tab', { name: /e2e-tests.yml/ })).toBeInTheDocument()
  })

  it('the first node opens the pipeline file itself', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(stage('pipeline'))

    expect(site().getByTestId('active-file-path')).toHaveTextContent('.github/workflows/ci.yml')
    expect(site().getAllByRole('tab')).toHaveLength(1)
    expect(site().getByTestId('active-file-note')).toHaveTextContent('Starts every run · calls tiers 1 to 3, in order')
    expect(site().getByText('YAML')).toBeInTheDocument()
  })

  it('the static checks open the lint rules, then the workflow that runs them', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(stage('static'))

    expect(site().getByTestId('active-file-path')).toHaveTextContent('eslint.config.js')
    expect(site().getByRole('tab', { name: /lint-and-build.yml/ })).toBeInTheDocument()
    expect(site().getByTestId('active-file-note')).toHaveTextContent('Tier 1 of 3 · lint-and-build.yml, called by ci.yml')
    expect(site().getByText('JavaScript')).toBeInTheDocument()
  })

  it('switching framework resets to that framework’s first file', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(site().getByRole('tab', { name: /playwright\.config\.ts/ }))
    await user.click(site().getByRole('radio', { name: 'Cypress' }))

    expect(site().getByTestId('active-file-path')).toHaveTextContent('e2e/cypress/case-studies.cy.ts')
  })

  it('choosing a stage shows its code, with no framework switch where there is one framework', async () => {
    const user = userEvent.setup()
    render(<Projects />)

    await user.click(stage('unit'))
    expect(site().getByRole('tab', { name: /CopyButton\.test\.tsx/ })).toBeInTheDocument()
    expect(site().getByTestId('active-file-note')).toHaveTextContent('unit-tests.yml')
    expect(site().queryByRole('radiogroup', { name: /framework/ })).not.toBeInTheDocument()

    await user.click(stage('component'))
    expect(site().getByRole('tab', { name: /CopyButton\.cy\.tsx/ })).toBeInTheDocument()
    expect(site().getByTestId('active-file-note')).toHaveTextContent('component-tests.yml')
  })

  it('keeps the API suite closed under its own name until opened', async () => {
    const user = userEvent.setup()
    render(<Projects />)
    const api = screen.getByTestId('project-api')

    expect(within(api).getByRole('heading', { level: 3, name: `02${projectsCopy.api.name}` })).toBeVisible()
    expect(within(api).getByText(projectsCopy.api.summary)).toBeVisible()
    const toggle = within(api).getByRole('button', { name: `Open: ${projectsCopy.api.name}` })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    // Its repo link is beside its name, so it shows while closed too.
    expect(within(api).getByRole('link', { name: `${projectsCopy.repoLink}: ${projectsCopy.api.name}` })).toHaveAttribute(
      'href',
      links.apiTestingRepo,
    )
    expect(within(api).getByText(apiTestingIntro)).not.toBeVisible()

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(within(api).getByText(apiTestingIntro)).toBeVisible()
    // Its own code: each case from the API repo, in Playwright and Postman.
    const [first, second] = apiTestingExamples
    expect(within(api).getByRole('tab', { name: /positive case/ })).toHaveAttribute('aria-selected', 'true')
    expect(within(api).getByTestId('active-file-path')).toHaveTextContent(`API-testing-sample/${first.playwright.filename}`)

    await user.click(within(api).getByRole('radio', { name: 'Postman' }))
    expect(within(api).getByTestId('active-file-path')).toHaveTextContent(`API-testing-sample/${second.postman.filename}`)
    expect(within(api).getByText('JavaScript')).toBeInTheDocument()
  })

  it('opens the API suite from a click anywhere on its row', async () => {
    const user = userEvent.setup()
    render(<Projects />)
    const api = screen.getByTestId('project-api')

    await user.click(within(api).getByText(projectsCopy.api.summary))
    expect(within(api).getByRole('button', { name: `Open: ${projectsCopy.api.name}` })).toHaveAttribute('aria-expanded', 'true')
  })
})
