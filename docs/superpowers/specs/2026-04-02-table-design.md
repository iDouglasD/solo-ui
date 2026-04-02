# Table Component Design Spec

## Overview

A composable `Table` component for `@solo-ui/ui` that renders tabular data with a terminal-dark aesthetic. Follows the same composition pattern as `Card`, with a decorative header using traffic-light dots and a hover effect that reveals a left accent border on rows.

## Visual Design

- **Container:** rounded border, `bg-surface`, `overflow-hidden`, monospace font — identical framing to `Card`
- **TableHeader:** `bg-elevated` strip with traffic-light dots (red/yellow/green) + title text + optional description — identical to `CardHeader`
- **Column headers (TableHeadCell):** uppercase, muted color, `text-xs`, compact padding
- **Rows (TableRow):** on hover, `box-shadow: inset 3px 0 0 var(--color-accent)` + `bg-elevated` background; separated by `border-b border-border`
- **Cells (TableCell):** `text-primary`, `text-sm`, compact padding `py-2 px-4`

## Architecture

Single file: `packages/react/src/components/ui/Table/index.tsx`

`Table` renders an outer `<div>` container and an inner `<table>` element. Children of type `TableHeader` are hoisted above the `<table>`; all other children (`TableHead`, `TableBody`) are placed inside the `<table>`. This keeps the user-facing API clean while producing valid HTML.

## Components

### `Table`
- Renders: outer `<div>` + inner `<table>`
- Classes (div): `rounded-lg border border-border overflow-hidden font-mono text-sm w-full bg-surface`
- Classes (table): `w-full`
- Props: `React.HTMLAttributes<HTMLDivElement>` + `className?`
- Behavior: separates `TableHeader` children from table-content children using `React.Children` + `React.isValidElement` type check

### `TableHeader`
- Renders: `<div>`
- Classes: `bg-elevated border-b border-border px-4 py-3`
- Props: `{ title: string; description?: string; className?: string }`
- Content: traffic-light dots (`bg-red`, `bg-yellow`, `bg-green`, `w-3 h-3 rounded-full`) + title (`text-subtle text-sm`) + optional description (`text-muted text-sm mt-2`)
- Note: decorative only — not a `<thead>`

### `TableHead`
- Renders: `<thead>`
- Classes: `bg-elevated`
- Props: `React.HTMLAttributes<HTMLTableSectionElement>` + `className?`

### `TableBody`
- Renders: `<tbody>`
- Classes: none (semantic wrapper only)
- Props: `React.HTMLAttributes<HTMLTableSectionElement>` + `className?`

### `TableRow`
- Renders: `<tr>`
- Classes: `border-b border-border transition-colors hover:[box-shadow:inset_3px_0_0_var(--color-accent)] hover:bg-elevated`
- Props: `React.HTMLAttributes<HTMLTableRowElement>` + `className?`

### `TableHeadCell`
- Renders: `<th>`
- Classes: `px-4 py-2.5 text-left text-xs uppercase tracking-wider text-muted font-medium`
- Props: `React.ThHTMLAttributes<HTMLTableCellElement>` + `className?`

### `TableCell`
- Renders: `<td>`
- Classes: `px-4 py-2 text-sm text-primary`
- Props: `React.TdHTMLAttributes<HTMLTableCellElement>` + `className?`

## Exports

```ts
export type {
  TableProps,
  TableHeaderProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableHeadCellProps,
  TableCellProps,
}
export {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
}
```

Barrel re-export added to `packages/react/src/index.ts`.

## Storybook Stories

File: `packages/docs/src/components/ui/Table/Table.stories.tsx`

- **`Default`** — full table with `TableHeader`, 4 columns, 3 rows of deployment data
- **`WithoutHeader`** — table without `TableHeader`, just thead + tbody
- **`WithBadges`** — status cells use `<Badge>` component to demonstrate cell composition

All stories use the dark background (`#0d0d0d`) and English-only content, consistent with existing stories.

## File Map

| Action | Path |
|--------|------|
| Create | `packages/react/src/components/ui/Table/index.tsx` |
| Modify | `packages/react/src/index.ts` |
| Create | `packages/docs/src/components/ui/Table/Table.stories.tsx` |

## Implementation Notes

- Do not use inline styles or arbitrary hex colors — use token classes only
- `box-shadow` inset is used for the row hover accent because `border-left` on `<tr>` is unreliable with `border-collapse: collapse`
- `TableHeader` is identified in `Table`'s child-separation logic by checking `child.type === TableHeader` — keep both in the same file to avoid circular imports
- Follow the two-line export pattern: one `export type` line, one `export` line
