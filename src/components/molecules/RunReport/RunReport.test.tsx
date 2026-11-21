import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RunReport from './RunReport'
import { hero } from '../../../content/hero'

function renderReport() {
  return render(
    <RunReport
      label="Career highlights, formatted as a test run"
      spec={hero.run.spec}
      workers={hero.run.workers}
      results={hero.run.results}
      flaky={hero.run.flaky}
      duration={hero.run.duration}
    />,
  )
}

describe('RunReport', () => {
  it('is a figure named by its label', () => {
    renderReport()
    expect(screen.getByRole('figure', { name: 'Career highlights, formatted as a test run' })).toBeInTheDocument()
  })

  it('lists one line per result, with its key figure in bold', () => {
    renderReport()
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(hero.run.results.length)
    hero.run.results.forEach((result, i) => {
      expect(items[i]).toHaveTextContent(result.text + result.strong)
      expect(within(items[i]).getByText(result.strong).tagName).toBe('B')
    })
  })

  it('summarises the run with the passed count derived from the results', () => {
    renderReport()
    expect(screen.getByText(`${hero.run.results.length} passed`)).toBeInTheDocument()
    expect(screen.getByText(`${hero.run.flaky} flaky`)).toBeInTheDocument()
    expect(screen.getByText(hero.run.duration)).toBeInTheDocument()
  })
})
