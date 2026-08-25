import SegmentedControl from './SegmentedControl'

// Deliberately redundant with SegmentedControl.test.tsx (Vitest + React
// Testing Library): same component, same three behaviors, run through
// Cypress's real-browser mount instead of jsdom. Featured verbatim as the
// Component/Cypress example in codeExamples.ts — keep this file's content
// and that copy in sync if either changes.
describe('SegmentedControl', () => {
  it('renders every option and marks the active one checked', () => {
    cy.mount(
      <SegmentedControl
        value="b"
        onChange={() => {}}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        ariaLabel="Letters"
      />,
    )

    cy.findByRole('radio', { name: 'A' }).should('have.attr', 'data-state', 'unchecked')
    cy.findByRole('radio', { name: 'B' }).should('have.attr', 'data-state', 'checked')
  })

  it('calls onChange with the clicked option value', () => {
    const onChange = cy.stub().as('onChange')
    cy.mount(
      <SegmentedControl
        value="a"
        onChange={onChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        ariaLabel="Letters"
      />,
    )

    cy.findByRole('radio', { name: 'B' }).click()

    cy.get('@onChange').should('have.been.calledWith', 'b')
  })

  it('never fires onChange for a disabled option and renders it as soon', () => {
    const onChange = cy.stub().as('onChange')
    cy.mount(
      <SegmentedControl
        value="a"
        onChange={onChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ]}
        ariaLabel="Letters"
      />,
    )

    cy.findByRole('radio', { name: /B/ }).should('be.disabled')
    cy.findByRole('radio', { name: /B/ }).click({ force: true })

    cy.get('@onChange').should('not.have.been.called')
  })
})
