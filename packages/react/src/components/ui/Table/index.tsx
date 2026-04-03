import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '../../../lib/cn'

// ─── Variants ───────────────────────────────────────────────────────────────

const tableRowVariants = cva('border-b border-border transition-colors', {
  variants: {
    hoverable: {
      true: 'hover:shadow-accent-inset hover:bg-elevated',
      false: '',
    },
  },
  defaultVariants: {
    hoverable: true,
  },
})

// ─── Table (root) ────────────────────────────────────────────────────────────

interface TableProps extends React.HTMLAttributes<HTMLDivElement> {}

function Table({ className, children, ...rest }: TableProps) {
  const childArray = React.Children.toArray(children)
  const headerChild = childArray.find(
    (child) => React.isValidElement(child) && child.type === TableHeader,
  )
  const tableChildren = childArray.filter(
    (child) => !(React.isValidElement(child) && child.type === TableHeader),
  )

  return (
    <div
      className={cn(
        'rounded-lg border border-border overflow-hidden font-mono text-sm w-full bg-surface',
        className,
      )}
      {...rest}
    >
      {headerChild}
      <table className="w-full">{tableChildren}</table>
    </div>
  )
}

// ─── TableHeader ─────────────────────────────────────────────────────────────

interface TableHeaderProps {
  title: string
  description?: string
  className?: string
}

function TableHeader({ title, description, className }: TableHeaderProps) {
  return (
    <div className={cn('bg-elevated border-b border-border px-4 py-3', className)}>
      <div className="flex items-center">
        <span aria-hidden="true" className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red" />
          <span className="w-3 h-3 rounded-full bg-yellow" />
          <span className="w-3 h-3 rounded-full bg-green" />
        </span>
        <span className="ml-2 text-subtle text-sm">{title}</span>
      </div>
      {description && <p className="text-muted text-sm mt-2">{description}</p>}
    </div>
  )
}

// ─── TableHead ───────────────────────────────────────────────────────────────

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

function TableHead({ className, children, ...rest }: TableHeadProps) {
  return (
    <thead className={cn('bg-elevated', className)} {...rest}>
      {children}
    </thead>
  )
}

// ─── TableBody ───────────────────────────────────────────────────────────────

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

function TableBody({ className, children, ...rest }: TableBodyProps) {
  return (
    <tbody className={cn(className)} {...rest}>
      {children}
    </tbody>
  )
}

// ─── TableRow ────────────────────────────────────────────────────────────────

interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {
  hoverable?: boolean
}

function TableRow({ className, hoverable = true, children, ...rest }: TableRowProps) {
  return (
    <tr className={cn(tableRowVariants({ hoverable }), className)} {...rest}>
      {children}
    </tr>
  )
}

// ─── TableHeadCell ───────────────────────────────────────────────────────────

interface TableHeadCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

function TableHeadCell({ className, children, ...rest }: TableHeadCellProps) {
  return (
    <th
      className={cn(
        'px-4 py-2.5 text-left text-xs uppercase tracking-wider text-muted font-medium',
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  )
}

// ─── TableCell ───────────────────────────────────────────────────────────────

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

function TableCell({ className, children, ...rest }: TableCellProps) {
  return (
    <td className={cn('px-4 py-2 text-sm text-primary', className)} {...rest}>
      {children}
    </td>
  )
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export type {
  TableBodyProps,
  TableCellProps,
  TableHeadCellProps,
  TableHeaderProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
}
export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeader,
  TableRow,
  tableRowVariants,
}
