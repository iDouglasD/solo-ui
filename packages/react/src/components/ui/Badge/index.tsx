import { cva, type VariantProps } from 'class-variance-authority'
import type React from 'react'
import { cn } from '../../../lib/cn'

// ─── Variants ───────────────────────────────────────────────────────────────

const badgeVariants = cva(
  'font-mono text-xs font-medium rounded inline-flex items-center gap-1.5 py-0.5 px-2 border',
  {
    variants: {
      variant: {
        default: 'bg-elevated text-primary border-muted',
        success: 'bg-green/10 text-green border-green',
        warning: 'bg-yellow/10 text-yellow border-yellow',
        danger: 'bg-red/10 text-red border-red',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

// ─── Badge ───────────────────────────────────────────────────────────────────

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, dot = false, children, ...rest }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...rest}>
      {dot && (
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0"
        />
      )}
      {children}
    </span>
  )
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export type { BadgeProps }
export { Badge, badgeVariants }
