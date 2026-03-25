import { cva } from 'class-variance-authority'
import type React from 'react'
import { cn } from '../../../lib/cn'

// ─── Variants ───────────────────────────────────────────────────────────────

const cardVariants = cva('rounded-lg border overflow-hidden font-mono text-sm', {
  variants: {
    variant: {
      default: 'bg-surface border-border text-primary',
    },
  },
  defaultVariants: { variant: 'default' },
})

// ─── Card (root) ─────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default'
}

function Card({ className, variant, children, ...rest }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...rest}>
      {children}
    </div>
  )
}

// ─── Card.Header ─────────────────────────────────────────────────────────────

interface CardHeaderProps {
  title: string
  description?: string
  className?: string
}

function CardHeader({ title, description, className }: CardHeaderProps) {
  return (
    <div className={cn('bg-elevated border-b border-border px-4 py-3', className)}>
      {/* Traffic-light dots — decorative */}
      <div className="flex items-center">
        <span aria-hidden="true" className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red" />
          <span className="w-3 h-3 rounded-full bg-yellow" />
          <span className="w-3 h-3 rounded-full bg-green" />
        </span>
        <span className="ml-2 text-subtle text-xs">{title}</span>
      </div>
      {description && <p className="text-muted text-xs mt-2">{description}</p>}
    </div>
  )
}

// ─── Card.Content ────────────────────────────────────────────────────────────

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('p-4', className)}>{children}</div>
}

// ─── Card.Footer ─────────────────────────────────────────────────────────────

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('px-4 py-3 border-t border-border text-muted text-xs', className)}>
      {children}
    </div>
  )
}

// ─── Composition ─────────────────────────────────────────────────────────────

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export type { CardContentProps, CardFooterProps, CardHeaderProps, CardProps }
export { Card }
