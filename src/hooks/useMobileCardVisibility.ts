import { useEffect, useRef, useState } from 'react'

type Visibility = {
  visible: boolean
  // True only when `visible` just became true because the user scrolled
  // up — the one case MobileInfoCard eases in rather than snapping
  // straight to visible (see its own comment for why the other cases stay
  // instant).
  eased: boolean
}

// Sticky-header-style visibility for MobileInfoCard, combined with a
// reveal for landing on a new section:
//  - hidden while actively scrolling down away from the top
//  - shown, eased in, on any upward scroll (the same pattern most native
//    app top bars use) or once back within `nearTopThreshold` of the top
//  - shown instantly, no easing, once scrolling has settled on a
//    DIFFERENT section than the last one this reveal fired for
//
// The settle check is a debounce on 'scroll' itself (rescheduled on every
// event, only running once none have fired for `settleDebounceMs`) rather
// than the native `scrollend` event — scroll-snap's own snap-correction
// can still be generating trailing 'scroll' events (and sometimes an
// early 'scrollend') after the section has already changed, and revealing
// before that settles meant the card blinked in and then immediately back
// out again once those trailing events resumed and re-hid it. Critically,
// this settle-reveal is only ever reverted by a later *scroll event*
// (real movement), never by a timer — an earlier version cleared it on a
// fixed timeout, which raced against exactly that trailing momentum and
// produced the same blink.
//
// Direction itself needs the same snap-correction tolerance: landing on a
// tall section (e.g. Code Samples) via an upward scroll, scroll-snap's own
// settle can end with a final trailing event that's a few px *down* (the
// snap correcting into place) even though the user's actual gesture was
// up. Comparing only against the immediately-previous event took that
// correction at face value, flipped scrollingUp to false, and left the
// card hidden with no reveal ever firing for a section it had already
// settled on before (revealedIdRef skips the settle-reveal in that case).
// `snapCorrectionPx` ignores any single-event delta smaller than that,
// keeping whatever direction was already established through the actual
// scroll gesture instead of trusting the last, possibly-corrective, pixel.
function useMobileCardVisibility(
  activeId: string,
  nearTopThreshold: number,
  settleDebounceMs = 150,
  snapCorrectionPx = 6,
): Visibility {
  const [state, setState] = useState<Visibility>({ visible: true, eased: false })
  const lastY = useRef(0)
  const scrollingUpRef = useRef(false)
  const activeIdRef = useRef(activeId)
  const revealedIdRef = useRef(activeId)
  activeIdRef.current = activeId

  useEffect(() => {
    lastY.current = window.scrollY
    let settleTimer: ReturnType<typeof setTimeout> | undefined

    const handleScroll = () => {
      const y = window.scrollY
      const delta = y - lastY.current
      if (Math.abs(delta) > snapCorrectionPx) {
        scrollingUpRef.current = delta < 0
      }
      const scrollingUp = scrollingUpRef.current
      lastY.current = y

      clearTimeout(settleTimer)

      if (y < nearTopThreshold || scrollingUp) {
        setState({ visible: true, eased: scrollingUp })
      } else {
        setState({ visible: false, eased: false })
      }

      settleTimer = setTimeout(() => {
        if (activeIdRef.current === revealedIdRef.current) return
        revealedIdRef.current = activeIdRef.current
        setState({ visible: true, eased: false })
      }, settleDebounceMs)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(settleTimer)
    }
  }, [nearTopThreshold, settleDebounceMs])

  return state
}

export default useMobileCardVisibility
