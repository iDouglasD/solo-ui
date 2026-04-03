import type React from 'react'
import { createContext, useContext } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/cn'

// ─── Variants ────────────────────────────────────────────────────────────────

const inputVariants = cva(
  'w-full rounded-lg border bg-elevated font-mono text-primary outline-none transition-all placeholder:text-muted disabled:opacity-30 disabled:cursor-not-allowed focus-visible:ring-2',
  {
    variants: {
      size: {
        sm: 'text-xs py-1.5 px-2.5',
        md: 'text-sm py-2 px-3',
        lg: 'text-sm py-2.5 px-4',
      },
      state: {
        default: 'border-border focus-visible:border-subtle focus-visible:ring-subtle/50',
        error: 'border-red focus-visible:border-red focus-visible:ring-red/50',
        success: 'border-green focus-visible:border-green focus-visible:ring-green/50',
      },
      hasLeftIcon: {
        true: '',
      },
      hasRightIcon: {
        true: '',
      },
    },
    compoundVariants: [
      { size: 'sm', hasLeftIcon: true, class: 'pl-7' },
      { size: 'sm', hasRightIcon: true, class: 'pr-7' },
      { size: 'md', hasLeftIcon: true, class: 'pl-9' },
      { size: 'md', hasRightIcon: true, class: 'pr-9' },
      { size: 'lg', hasLeftIcon: true, class: 'pl-10' },
      { size: 'lg', hasRightIcon: true, class: 'pr-10' },
    ],
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  },
)

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

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { }

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

interface InputHintProps extends React.HTMLAttributes<HTMLParagraphElement> { }

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

// ─── Input ───────────────────────────────────────────────────────────────────

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
  Pick<VariantProps<typeof inputVariants>, 'size'> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const iconOffset: Record<'sm' | 'md' | 'lg', { left: string; right: string }> = {
  sm: { left: 'left-2.5', right: 'right-2.5' },
  md: { left: 'left-3', right: 'right-3' },
  lg: { left: 'left-4', right: 'right-4' },
}

function Input({ className, size, leftIcon, rightIcon, ...rest }: InputProps) {
  const { state } = useContext(InputFieldContext)
  const resolvedState = state ?? 'default'
  const resolvedSize = size ?? 'md'
  const hasLeftIcon = !!leftIcon
  const hasRightIcon = !!rightIcon

  const inputEl = (
    <input
      className={cn(
        inputVariants({ size, state: resolvedState, hasLeftIcon, hasRightIcon }),
        className,
      )}
      {...rest}
    />
  )

  if (!hasLeftIcon && !hasRightIcon) return inputEl

  const { left, right } = iconOffset[resolvedSize]

  return (
    <div className="relative flex w-full items-center">
      {leftIcon && (
        <span className={cn('pointer-events-none absolute flex shrink-0 items-center text-muted', left)}>
          {leftIcon}
        </span>
      )}
      {inputEl}
      {rightIcon && (
        <span className={cn('pointer-events-none absolute flex shrink-0 items-center text-muted', right)}>
          {rightIcon}
        </span>
      )}
    </div>
  )
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export type { InputFieldProps, InputLabelProps, InputHintProps, InputProps }
export { InputField, InputLabel, InputHint, Input, inputVariants }
