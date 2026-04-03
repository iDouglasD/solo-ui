import { cva, type VariantProps } from 'class-variance-authority'
import type React from 'react'
import { cn } from '../../../lib/cn'

// ─── Variants ───────────────────────────────────────────────────────────────

const buttonVariants = cva(
  'font-mono font-semibold rounded-lg cursor-pointer inline-flex items-center justify-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-30 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-default hover:opacity-70',
        destructive: 'bg-red text-default text-white hover:opacity-70',
        secondary: 'bg-elevated hover:opacity-70 text-primary hover:bg-border',
        outline:
          'bg-transparent text-default border border-muted hover:border-accent hover:text-accent',
        ghost: 'bg-transparent text-subtle hover:bg-elevated hover:text-primary',
        link: 'bg-transparent text-accent underline underline-offset-4 hover:opacity-70 px-0',
      },
      size: {
        sm: 'text-xs py-1.5 px-3.5',
        md: 'text-sm py-2.5 px-6',
        lg: 'text-default py-3.5 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

// ─── Spinner ─────────────────────────────────────────────────────────────────

const spinnerSizes: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
}

function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'border-[1.5px] border-current border-t-transparent rounded-full animate-spin shrink-0',
        spinnerSizes[size],
      )}
    />
  )
}

// ─── Button ──────────────────────────────────────────────────────────────────

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode
  loading?: boolean
}

function Button({
  className,
  variant,
  size,
  icon,
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading
  const resolvedSize: 'sm' | 'md' | 'lg' = size ?? 'md'

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size={resolvedSize} /> : icon}
      {children}
    </button>
  )
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export type { ButtonProps }
export { Button, buttonVariants }
