// Tags an element for the hero's Pick locator inspector: the page locator
// that finds it and an assertion that holds for it. Both must stay true for
// this page - e2e/playwright/hero.spec.ts runs every pair it finds.
export type LocatorAttrs = {
  'data-loc': string
  'data-check': string
}

export function locatorAttrs(loc: string, check: string): LocatorAttrs {
  return { 'data-loc': loc, 'data-check': check }
}

/** Any data-* attribute, for components that pass them through. */
export type DataAttributes = { [key: `data-${string}`]: string | undefined }
