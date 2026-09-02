import type { ReactNode } from 'react'
import './components.css'

export interface ListRowProps {
  readonly done?: boolean
  readonly children: ReactNode
}

// A child with class "row-title" gets the done styling. Controls inside take the clicks, not the row.
export function ListRow({ done = false, children }: ListRowProps) {
  return (
    <li className="row" data-done={done}>
      {children}
    </li>
  )
}
