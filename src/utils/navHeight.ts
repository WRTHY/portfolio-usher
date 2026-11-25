// The sticky top bar's height in px, from index.css's --nav-height, for
// observers that treat the band below the bar as the visible page.
export function navHeight(): number {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64
}
