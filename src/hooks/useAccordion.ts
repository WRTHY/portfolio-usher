import { useEffect, useRef, useState } from 'react'
import { keepInPlace } from '../utils/keepInPlace'
import usePrefersReducedMotion from './usePrefersReducedMotion'

/** How long the page keeps following a fold, in ms: a little over the fold itself. */
export const FOLLOW_DURATION = 560

// One open row at a time, so the page stays short. Opening a row folds the
// one that was open. When that one is above, the page would slide the new
// row up out from under the reader as it folds, so the row is held where
// they clicked it instead.
//
// Attach `scopeRef` to the element holding the rows, and mark each row
// data-accordion-row="<id>".
export function useAccordion<Scope extends HTMLElement = HTMLElement>(initialId: string | null = null) {
  const [openId, setOpenId] = useState<string | null>(initialId)
  const scopeRef = useRef<Scope>(null)
  const stopHolding = useRef<() => void>(undefined)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => () => stopHolding.current?.(), [])

  const toggle = (id: string) => {
    if (openId === id) {
      setOpenId(null)
      return
    }

    const scope = scopeRef.current
    const row = scope?.querySelector<HTMLElement>(`[data-accordion-row="${id}"]`)
    const openRow = scope?.querySelector('button[aria-expanded="true"]')?.closest('[data-accordion-row]')
    const foldsAbove = row && openRow && openRow.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING

    setOpenId(id)

    if (row && foldsAbove) {
      stopHolding.current?.()
      stopHolding.current = keepInPlace(row, { duration: FOLLOW_DURATION, reducedMotion: prefersReducedMotion })
    }
  }

  return { openId, setOpenId, toggle, scopeRef }
}
