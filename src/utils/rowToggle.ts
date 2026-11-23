// The ledgers' rows (Experience, Case Studies) open from a click anywhere on
// them, not only their "+". The "+" stays the real control (keyboard and
// screen readers use it); this only widens the mouse and touch target. So a
// click doesn't toggle the row when it lands on a link or button (which do
// their own thing), inside one of the row's opened regions (they're for
// reading and selecting), or at the end of selecting some text.
export function isRowToggleClick(target: EventTarget | null, openRegions: readonly (HTMLElement | null)[]): boolean {
  if (!(target instanceof Element)) return false
  if (target.closest('a, button')) return false
  if (openRegions.some((region) => region?.contains(target))) return false
  return !window.getSelection()?.toString()
}
