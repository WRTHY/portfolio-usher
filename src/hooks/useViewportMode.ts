import { useEffect, useState } from 'react'

export type ViewportMode = 'mobile' | 'desktop'

// Width alone used to decide mobile vs desktop everywhere (the 640px
// breakpoint every other CSS module still checks), but a phone in landscape
// is often wider than that while still only ~375px tall - so it was getting
// the desktop chrome (a fixed-height InfoPanel, a fixed-position Sidebar)
// sized for far more vertical room than it actually has. Adding a
// height-based clause catches that case without touching the width
// breakpoint tablets/desktops still rely on: 500px comfortably covers real
// phones in landscape (typically 320-430px tall) while staying well under
// the shortest common tablet landscape height (~768px).
const MOBILE_QUERY = '(max-width: 639px), (max-height: 500px) and (orientation: landscape)'

function resolveMode(query: MediaQueryList): ViewportMode {
  return query.matches ? 'mobile' : 'desktop'
}

// Single source of truth for "mobile vs desktop" chrome, mirrored onto
// <html data-viewport> so CSS can key off one attribute instead of every
// component re-declaring its own width-only breakpoint (see index.css,
// Header/MenuToggle/Nav/InfoPanel/Sidebar module CSS for the
// [data-viewport] rules this drives).
function useViewportMode(): ViewportMode {
  const [mode, setMode] = useState<ViewportMode>(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    const initial = resolveMode(query)
    document.documentElement.dataset.viewport = initial
    return initial
  })

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    const update = () => {
      const next = resolveMode(query)
      document.documentElement.dataset.viewport = next
      setMode(next)
    }
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return mode
}

export default useViewportMode
