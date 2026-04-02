# Badge Component — Design Spec

**Date:** 2026-04-02
**Status:** Approved
**Package:** `@solo-ui/ui`

---

## Overview

A `Badge` component for the solo-ui design system. Displays short labels or status indicators inline, with optional pulsing dot. Follows the terminal/monospace aesthetic of the system.

---

## API

```tsx
// CVA variants are defined first; BadgeProps extends VariantProps to stay in sync
const badgeVariants = cva(/* ... */, { variants: { variant: { ... } } })

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Visual style and semantic meaning. Derived from CVA via `VariantProps`. |
| `dot` | `boolean` | `false` | When true, renders a pulsing colored dot before the text |
| `...rest` | `HTMLAttributes<HTMLSpanElement>` | — | className, id, aria-*, etc. |

### Usage

```tsx
<Badge>neutral</Badge>
<Badge variant="success">deployed</Badge>
<Badge variant="warning" dot>pending</Badge>
<Badge variant="danger" dot>error</Badge>

{/* dot-only — requires an aria-label for accessibility */}
<Badge variant="success" dot aria-label="Status: online" />
```

### className passthrough

The component must merge the consumer's `className` using `cn()`:

```tsx
function Badge({ className, variant, dot, ...rest }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...rest}>
      {dot && <span aria-hidden="true" className="..." />}
      {children}
    </span>
  )
}
```

---

## Rendering

- Element: `<span>` — inline, non-interactive
- No size prop — single fixed size
- **Dot-only (no children):** Supported. When `dot={true}` and no `children` are provided, the badge renders as a standalone pulsing indicator. In this case, consumers **must** provide an `aria-label` on the badge so screen readers have a description (the dot is `aria-hidden`).

---

## Styling

### Base classes

```
font-mono text-xs font-medium rounded inline-flex items-center gap-1.5 py-0.5 px-2 border
```

### Variants (CVA)

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| `default` | `bg-elevated` | `text-primary` | `border-muted` |
| `success` | `bg-accent/10` | `text-accent` | `border-accent` |
| `warning` | `bg-yellow/10` | `text-yellow` | `border-yellow` |
| `danger` | `bg-red/10` | `text-red` | `border-red` |

> **Note:** `success` intentionally uses the `accent` token (`#00ff10`) rather than `green` (`#28c840`). `accent` is the system's primary signal color and carries the strongest visual weight for positive states. `green` is reserved for decorative use (e.g., the Card traffic-light dots).

### Dot

When `dot={true}`, renders a `<span>` before the badge text:

```
w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0
```

- Uses `bg-current` to inherit the variant's text color automatically
- `aria-hidden="true"` — decorative only
- Always pulsing (no static option)

---

## File Structure

```
packages/react/src/components/ui/Badge/
  index.tsx                  ← component + CVA variants + exports

packages/docs/src/components/ui/Badge/
  Badge.stories.tsx          ← Storybook stories
```

### Re-export in `packages/react/src/index.ts`

Add one barrel line, matching the existing pattern:

```ts
export * from './components/ui/Badge'
```

### Export pattern inside `index.tsx`

```ts
export type { BadgeProps }
export { Badge, badgeVariants }
```

---

## Stories

**Shared meta parameters** (all stories use):

```ts
parameters: {
  layout: 'centered',
  backgrounds: {
    default: 'dark',
    values: [{ name: 'dark', value: '#0d0d0d' }],
  },
},
```

**`argTypes` for `Default` story:**

```ts
argTypes: {
  variant: {
    control: 'select',
    options: ['default', 'success', 'warning', 'danger'],
  },
  dot: { control: 'boolean' },
  children: { control: 'text' },
},
```

| Story | Description |
|-------|-------------|
| `Default` | Interactive controls (variant, dot, children). Default args: `variant: 'default'`, `dot: false`, `children: 'badge'`. |
| `Variants` | All 4 variants without dot, rendered in a `flex gap-2` row |
| `WithDot` | All 4 variants with `dot`, rendered in a `flex gap-2` row |
| `Inline` | Badge inline with text: `<p>Deploy status: <Badge variant="success">deployed</Badge> — last run 2m ago.</p>` |

---

## Conventions Followed

- CVA for variant-based styling; `BadgeProps` uses `VariantProps<typeof badgeVariants>`
- `cn()` for class merging, including consumer `className`
- No inline styles
- No hex colors in classNames — all via design tokens
- No arbitrary text size values
- Barrel re-export via `export *` in `src/index.ts`
- Export pattern inside `index.tsx`: `export type { ... }` then `export { ... }`, no default exports
- Stories in English only (identifiers and content)
