import type { SVGProps } from 'react'

// react-icons' Simple Icons set has brand marks, not concept marks, so this is
// a small custom monochrome glyph instead: a speed dial, for performance
// (Skills & Tools uses it for Reassure).

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
