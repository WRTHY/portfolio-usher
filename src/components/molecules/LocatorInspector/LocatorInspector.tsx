import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { FaCheck } from 'react-icons/fa6'
import styles from './LocatorInspector.module.css'

type LocatorInspectorProps = {
  /** The element currently picked, or null when inspecting is off. */
  picked: HTMLElement | null
  onPick: (element: HTMLElement) => void
  onExit: () => void
  /** Inspecting turns itself off once this element scrolls out of view. */
  scopeRef: RefObject<HTMLElement | null>
  /** Gets focus back on Escape (the switch that turned inspecting on). */
  returnFocusRef: RefObject<HTMLElement | null>
}

/** Splits a locator into spans: the method name, quoted strings, the rest. */
function paintLocator(locator: string): ReactNode[] {
  const [, method = '', rest = locator] = locator.match(/^(\w+)([\s\S]*)$/) ?? []
  return [
    <span key="method" className={styles.method}>
      {method}
    </span>,
    ...rest.split(/('[^']*')/).map((part, i) =>
      part.startsWith("'") ? (
        <span key={i} className={styles.string}>
          {part}
        </span>
      ) : (
        part
      ),
    ),
  ]
}

const PAD = 4
const GAP = 8
const EDGE = 8

// The hero's locator inspector: while something is picked, any element
// tagged with data-loc/data-check (see utils/locatorAttrs.ts) can be picked
// by hover, keyboard focus or tap. It gets a violet highlight box and a
// terminal tooltip with its page locator and an assertion whose check mark
// springs in a beat later. Clicks pick instead of navigating. Escape, or the
// hero scrolling out of view, ends it.
function LocatorInspector({ picked, onPick, onExit, scopeRef, returnFocusRef }: LocatorInspectorProps) {
  const active = picked !== null
  const boxRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const pickedRef = useRef<HTMLElement | null>(null)
  const wasShownRef = useRef(false)

  // Positions the box over the picked element and the tooltip above it (or
  // below, when there's no room), kept inside the viewport.
  const place = useCallback(() => {
    const element = pickedRef.current
    const box = boxRef.current
    const tip = tipRef.current
    if (!element || !box || !tip) return
    const rect = element.getBoundingClientRect()
    box.style.left = `${rect.left - PAD}px`
    box.style.top = `${rect.top - PAD}px`
    box.style.width = `${rect.width + PAD * 2}px`
    box.style.height = `${rect.height + PAD * 2}px`
    const left = Math.max(EDGE, Math.min(rect.left - PAD, window.innerWidth - tip.offsetWidth - EDGE))
    let top = rect.top - PAD - tip.offsetHeight - GAP
    if (top < EDGE) top = rect.bottom + PAD + GAP
    tip.style.left = `${left}px`
    tip.style.top = `${top}px`
  }, [])

  useLayoutEffect(() => {
    pickedRef.current = picked
    if (!picked) {
      wasShownRef.current = false
      return
    }
    // The first pick appears in place; later picks glide to their element.
    const firstShow = !wasShownRef.current
    wasShownRef.current = true
    boxRef.current?.classList.toggle(styles.jump, firstShow)
    tipRef.current?.classList.toggle(styles.jump, firstShow)
    place()
  }, [picked, place])

  useEffect(() => {
    if (!active) return
    const root = document.documentElement
    root.classList.add('inspecting')

    const tagged = (event: Event) =>
      event.target instanceof Element ? event.target.closest<HTMLElement>('[data-loc]') : null
    const onPointerOver = (event: Event) => {
      const element = tagged(event)
      if (element) onPick(element)
    }
    const onClick = (event: MouseEvent) => {
      const element = tagged(event)
      if (!element || element === returnFocusRef.current) return
      event.preventDefault()
      onPick(element)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      onExit()
      returnFocusRef.current?.focus()
    }

    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('focusin', onPointerOver)
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', place, { passive: true })
    window.addEventListener('resize', place)

    let observer: IntersectionObserver | undefined
    if (scopeRef.current) {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) onExit()
      })
      observer.observe(scopeRef.current)
    }

    return () => {
      root.classList.remove('inspecting')
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('focusin', onPointerOver)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', place)
      window.removeEventListener('resize', place)
      observer?.disconnect()
    }
  }, [active, onPick, onExit, scopeRef, returnFocusRef, place])

  if (!picked) return null

  return createPortal(
    <>
      <div ref={boxRef} className={styles.box} aria-hidden="true" />
      <div ref={tipRef} className={styles.tip} role="status" aria-live="polite" data-testid="locator-tip">
        {/* Keyed by locator so each pick remounts and replays the check. */}
        <div key={picked.dataset.loc}>
          <div className={styles.locator}>{paintLocator(picked.dataset.loc ?? '')}</div>
          <div className={styles.assert}>
            <FaCheck className={styles.tick} aria-hidden="true" />
            <span>{picked.dataset.check}</span>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}

export default LocatorInspector
