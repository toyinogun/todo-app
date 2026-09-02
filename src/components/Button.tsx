import type { ButtonHTMLAttributes } from 'react'
import './components.css'

type Base = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  readonly type?: 'button' | 'submit'
  readonly danger?: boolean
}

// The icon variant has no visible text, so its accessible name is required.
export type ButtonProps =
  | (Base & { readonly variant?: 'primary' | 'plain' })
  | (Base & { readonly variant: 'icon'; readonly 'aria-label': string })

export function Button({
  variant = 'plain',
  danger = false,
  type = 'button',
  className = '',
  ...rest
}: ButtonProps) {
  const classes = [
    'btn',
    `btn-${variant}`,
    danger ? 'btn-danger' : '',
    className,
  ]
  return <button type={type} className={classes.join(' ').trim()} {...rest} />
}
