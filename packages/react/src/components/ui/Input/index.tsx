import type React from 'react'
import { createContext, useContext } from 'react'
import { cn } from '../../../lib/cn'

// ─── Context ─────────────────────────────────────────────────────────────────

interface InputFieldContextValue {
  state?: 'error' | 'success'
}

const InputFieldContext = createContext<InputFieldContextValue>({})

// ─── InputField ──────────────────────────────────────────────────────────────

interface InputFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: 'error' | 'success'
}

function InputField({ state, className, children, ...rest }: InputFieldProps) {
  return (
    <InputFieldContext.Provider value={{ state }}>
      <div className={cn('flex flex-col gap-1.5', className)} {...rest}>
        {children}
      </div>
    </InputFieldContext.Provider>
  )
}

// ─── InputLabel ──────────────────────────────────────────────────────────────

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

function InputLabel({ className, children, ...rest }: InputLabelProps) {
  return (
    <label className={cn('font-mono text-xs text-subtle', className)} {...rest}>
      {children}
    </label>
  )
}

// ─── InputHint ───────────────────────────────────────────────────────────────

const hintColors: Record<'default' | 'error' | 'success', string> = {
  default: 'text-muted',
  error: 'text-red',
  success: 'text-green',
}

interface InputHintProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function InputHint({ className, children, ...rest }: InputHintProps) {
  const { state } = useContext(InputFieldContext)
  const colorClass = hintColors[state ?? 'default']

  return (
    <p
      className={cn('font-mono text-xs', colorClass, className)}
      role={state === 'error' ? 'alert' : undefined}
      {...rest}
    >
      {children}
    </p>
  )
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export type { InputFieldProps, InputLabelProps, InputHintProps }
export { InputField, InputLabel, InputHint }
