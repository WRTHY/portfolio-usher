// Cypress has no built-in equivalent of Playwright's toBeInViewport(), so
// this adds a matching `be.inViewport` chai assertion: true if any part of
// the element intersects the current viewport, same default threshold
// Playwright's matcher uses (ratio > 0, i.e. partially visible counts).
declare global {
  // Required by chai's ambient declaration-merging shape — there's no
  // ES module equivalent for augmenting the global `Chai` namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Chai {
    interface Assertion {
      inViewport: Assertion
    }
  }
}

chai.Assertion.addProperty('inViewport', function inViewport(this: Chai.AssertionStatic) {
  const subject = (this as unknown as { _obj: JQuery })._obj
  const el = subject[0] as HTMLElement
  const rect = el.getBoundingClientRect()
  const viewportWidth = Cypress.config('viewportWidth')
  const viewportHeight = Cypress.config('viewportHeight')

  const isInViewport =
    rect.top < viewportHeight && rect.bottom > 0 && rect.left < viewportWidth && rect.right > 0

  this.assert(
    isInViewport,
    'expected #{this} to be in the viewport',
    'expected #{this} not to be in the viewport',
    isInViewport,
  )
})

export {}
