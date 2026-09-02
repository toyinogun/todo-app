import type { InputHTMLAttributes } from 'react'
import './components.css'

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  readonly label: string
  readonly hideLabel?: boolean
}

export function Checkbox({
  label,
  hideLabel = false,
  className = '',
  ...rest
}: CheckboxProps) {
  return (
    <label className={`checkbox ${className}`.trim()}>
      <input type="checkbox" {...rest} />
      <span className={hideLabel ? 'visually-hidden' : undefined}>{label}</span>
    </label>
  )
}
