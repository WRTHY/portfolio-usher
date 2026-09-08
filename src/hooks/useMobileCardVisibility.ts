import { useEffect, useRef, useState } from 'react'

type Visibility = {
  visible: boolean
  eased: boolean // true only when revealed by an upward scroll, not a section change
}

// Debounces on 'scroll', not 'scrollend' - scroll-snap can still fire trailing
// scroll events after landing. snapCorrectionPx ignores small reversals from
// that correction so direction doesn't flicker near a section boundary.
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
