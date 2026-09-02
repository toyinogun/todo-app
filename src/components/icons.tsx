import type { SVGProps } from 'react'

// Decorative icons. The accessible name comes from the surrounding button's aria-label.
const base: SVGProps<SVGSVGElement> = {
  className: 'icon',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function CheckIcon() {
  return (
    <svg {...base}>
      <path d="M5 12l5 5L19 7" />
    </svg>
  )
}

export function TrashIcon() {
  return (
    <svg {...base}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  )
}

export function GripIcon() {
  return (
    <svg {...base}>
      <path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" />
    </svg>
  )
}
