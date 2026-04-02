# Table Component Design Spec

## Overview

A composable `Table` component for `@solo-ui/ui` that renders tabular data with a terminal-dark aesthetic. Follows the same composition pattern as `Card`, with a decorative header using traffic-light dots and a hover effect that reveals a left accent border on body rows.

## Visual Design

- **Container:** rounded border, `bg-surface`, `overflow-hidden`, monospace font — identical framing to `Card`
- **TableHeader:** `bg-elevated` strip with traffic-light dots (red/yellow/green) + title text + optional description — identical to `CardHeader` visually
- **Column headers (TableHeadCell):** uppercase, muted color, `text-xs`, compact padding; `bg-elevated` background (visually connected to the dots header above — intentional unified header region)
- **Body rows (TableRow):** on hover, `shadow-accent-inset` (a new shadow token: `inset 3px 0 0 var(--color-accent)`) + `bg-elevated` background; separated by `border-b border-border`
- **Head rows (TableRow inside TableHead):** hover is suppressed via `hoverable={false}` — column header rows are not interactive
- **Cells (TableCell):** `text-primary`, `text-sm`, compact padding `py-2 px-4`

## Token Addition

Add to `packages/tokens/styles/tokens.css` inside the `@theme` block:

```css
--shadow-accent-inset: inset 3px 0 0 var(--color-accent);
```

This is referenced as `shadow-accent-inset` in Tailwind v4. Avoids arbitrary CSS values in class strings and follows the token-first approach.

## Architecture

Single file: `packages/react/src/components/ui/Table/index.tsx`

`Table` renders an outer `<div>` container and an inner `<table>` element. Direct children of type `TableHeader` are placed before the `<table>`; all other direct children are placed inside the `<table>`. This produces valid HTML while keeping the user-facing API clean.

**Child separation contract:**
- Only one `TableHeader` is supported as a direct child of `Table`. If multiple are passed, only the first is rendered above the `<table>`; the rest are dropped silently.
- Non-React-element children (strings, numbers) at the `Table` level are ignored — they would produce invalid HTML if placed inside `<table>`.
- `TableHeader` nested deeper than a direct child of `Table` is not hoisted — it renders wherever it appears.
- Implementation uses `React.Children.toArray` + `React.isValidElement(child) && child.type === TableHeader`.

## Components

### `Table`
- Renders: outer `<div>` + inner `<table>`
- Classes (div): `rounded-lg border border-border overflow-hidden font-mono text-sm w-full bg-surface`
- Classes (table): `w-full`
- Props: `React.HTMLAttributes<HTMLDivElement>` + `className?`

### `TableHeader`
- Renders: `<div>`
- Classes: `bg-elevated border-b border-border px-4 py-3`
- Props: `{ title: string; description?: string; className?: string }`
- No `children` prop — intentional. Content is controlled entirely by `title` and `description` props, matching the CardHeader contract.
- Markup (matches CardHeader structure exactly):
  ```tsx
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
  ```
- Note: `aria-hidden="true"` on the dots span is required — the dots are purely decorative.

### `TableHead`
- Renders: `<thead>`
- Classes: `bg-elevated`
- Props: `React.HTMLAttributes<HTMLTableSectionElement>` + `className?`
- Background is intentionally `bg-elevated` — forms a unified visual header region together with `TableHeader` above it.

### `TableBody`
- Renders: `<tbody>`
- Classes: none (semantic wrapper only)
- Props: `React.HTMLAttributes<HTMLTableSectionElement>` + `className?`

### `TableRow`
- Renders: `<tr>`
- Default classes: `border-b border-border transition-colors hover:shadow-accent-inset hover:bg-elevated`
- When `hoverable={false}`: hover classes are omitted — used for rows inside `TableHead`
- Props: `React.HTMLAttributes<HTMLTableRowElement>` + `className?` + `hoverable?: boolean` (default `true`)
- CVA variant key: `hoverable: { true: 'hover:shadow-accent-inset hover:bg-elevated', false: '' }`
- `hoverable` must be **destructured and excluded from `...rest`** before spreading to `<tr>` — it is not a valid HTML attribute and will cause a React DOM warning if forwarded.

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
  tableRowVariants,
  TableHeadCell,
  TableCell,
}
```

Barrel re-export added to `packages/react/src/index.ts`.

## Storybook Stories

File: `packages/docs/src/components/ui/Table/Table.stories.tsx`

All stories follow the same backgrounds parameter pattern as `Card.stories.tsx` (dark background, `value: '#0d0d0d'`) and use English-only content.

- **`Default`** — full table with `TableHeader` (title + description), 4 columns, 3 body rows of deployment data; head row uses `hoverable={false}`
- **`WithoutHeader`** — table without `TableHeader`, just `TableHead` + `TableBody`; demonstrates that `TableHeader` is optional
- **`WithBadges`** — status cells use `<Badge>` (imported from `@solo-ui/ui`) to demonstrate cell composition

## File Map

| Action | Path |
|--------|------|
| Modify | `packages/tokens/styles/tokens.css` |
| Create | `packages/react/src/components/ui/Table/index.tsx` |
| Modify | `packages/react/src/index.ts` |
| Create | `packages/docs/src/components/ui/Table/Table.stories.tsx` |

## Implementation Notes

- `shadow-accent-inset` is used for the row hover accent because `border-left` on `<tr>` is unreliable with `border-collapse: collapse`. The token is defined in `tokens.css` — do not use an arbitrary class string.
- `TableHeader` and `Table` must stay in the same file to avoid circular imports when checking `child.type === TableHeader`.
- Follow the two-line export pattern: one `export type` line, one `export` line, no default exports.
- Do not add `"use client"` — it is injected automatically by tsup as a banner.
