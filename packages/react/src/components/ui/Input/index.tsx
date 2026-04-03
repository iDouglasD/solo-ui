import type React from 'react'
import { createContext } from 'react'
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

// ─── Exports ─────────────────────────────────────────────────────────────────

export type { InputFieldProps }
export { InputField }
