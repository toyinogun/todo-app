import { useId, type InputHTMLAttributes, type Ref } from 'react'
import './components.css'

export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id'
> {
  readonly label: string
  readonly hideLabel?: boolean
  readonly ref?: Ref<HTMLInputElement>
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
