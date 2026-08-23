import type { SVGProps } from 'react'

// react-icons' Simple Icons set has brand marks, not concept marks — there's
// no icon for a testing *type* the way SiCypress is an icon for Cypress (see
// FrameworkSwitcher/frameworkOptions.tsx). These are small custom monochrome
// glyphs instead of a fake brand icon.

export function ComponentTestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="11" height="11" rx="2" />
      <rect x="10" y="10" width="11" height="11" rx="2" />
    </svg>
  )
}

export function EndToEndIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...props}>
      <circle cx="4" cy="19" r="2" />
      <circle cx="12" cy="5" r="2" />
      <circle cx="20" cy="19" r="2" />
      <path d="M5.6 17.6 10.6 6.8M13.4 6.8 18.4 17.6" />
    </svg>
  )
}

export function PerformanceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="M12 18 16 10" />
      <circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}
