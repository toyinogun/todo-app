import { useId, type InputHTMLAttributes } from 'react'
import './components.css'

export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id'
> {
  readonly label: string
  readonly hideLabel?: boolean
}

export function TextInput({
  label,
  hideLabel = false,
  className = '',
  ...rest
}: TextInputProps) {
  const id = useId()
  return (
    <div className="field">
      <label
        htmlFor={id}
        className={hideLabel ? 'visually-hidden' : 'field-label'}
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        className={`input ${className}`.trim()}
        {...rest}
      />
    </div>
  )
}
