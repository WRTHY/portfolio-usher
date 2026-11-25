// Shared between the opener (organisms/Opener) and anything that waits for
// it (the hero's switch hint). index.html's inline script makes the actual
// play/skip decision before first paint and marks <html> with `intro`.

/** sessionStorage key set once the opener has played this session. */
export const INTRO_SEEN_KEY = 'ju-intro-seen'

/** Fired on window when the opener hands off to the page. */
export const OPENER_DONE_EVENT = 'opener:done'

/** Whether the opener is playing on this page load. */
export function introRequested(): boolean {
  return document.documentElement.classList.contains('intro')
}
