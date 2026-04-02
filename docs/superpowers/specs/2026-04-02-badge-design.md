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
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger'
  dot?: boolean
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Visual style and semantic meaning |
| `dot` | `boolean` | `false` | When true, renders a pulsing colored dot before the text |
| `...rest` | `HTMLAttributes<HTMLSpanElement>` | — | className, id, aria-*, etc. |

### Usage

```tsx
<Badge>neutral</Badge>
<Badge variant="success">deployed</Badge>
<Badge variant="warning" dot>pending</Badge>
<Badge variant="danger" dot>error</Badge>
```

---

## Rendering

- Element: `<span>` — inline, non-interactive
- No size prop — single fixed size

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

### Dot

When `dot={true}`, renders a `<span>` before the badge text:

```
w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0
```

- Uses `bg-current` to inherit the variant's text color
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

### Export pattern (`packages/react/src/index.ts`)

```ts
export type { BadgeProps } from './components/ui/Badge'
export { Badge, badgeVariants } from './components/ui/Badge'
```

---

## Stories

| Story | Description |
|-------|-------------|
| `Default` | Interactive controls (variant, dot, children) |
| `Variants` | All 4 variants without dot |
| `WithDot` | All 4 variants with `dot` enabled |
| `Inline` | Badge used inside a sentence to show real-world inline usage |

---

## Conventions Followed

- CVA for variant-based styling
- `cn()` for class merging
- No inline styles
- No hex colors in classNames — all via design tokens
- No arbitrary text size values
- Export pattern: `export type { ... }` then `export { ... }`, no default exports
- Stories in English only (identifiers and content)
