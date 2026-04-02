# Button Component — Design Spec

**Date:** 2026-04-02
**Package:** `@solo-ui/ui`
**File:** `packages/react/src/components/ui/Button/index.tsx`

---

## Overview

A single `Button` component for the solo-ui design system. Follows the terminal/hacker aesthetic established in the Pencil design (JetBrains Mono, dark theme, accent green). Built with CVA + `cn()`, consistent with the existing `Card` pattern.

---

## Visual Style

Sourced from the Pencil design (node `NXvr8` — "Submit Button"):

- **Font:** JetBrains Mono, weight 500
- **Border radius:** `rounded` (4px)
- **Base padding (md):** `py-2.5 px-6` — 10px vertical, 24px horizontal
- **Gap between icon and text:** `gap-1.5` (6px)
- **Transitions:** `transition-all` on all interactive properties

---

## Variants

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| `primary` | `bg-accent` (#00ff41) | `text-base` (#0d0d0d) | — | `opacity-85` |
| `destructive` | `bg-red` (#ff5f57) | `text-base` (#0d0d0d) | — | `opacity-85` |
| `secondary` | `bg-elevated` (#1a1a1a) | `text-primary` (#cccccc) | — | `bg-border` |
| `outline` | transparent | `text-primary` (#cccccc) | `border border-muted` (#444444) | `border-accent text-accent` |
| `ghost` | transparent | `text-subtle` (#666666) | — | `bg-elevated text-primary` |
| `link` | transparent | `text-accent` (#00ff41) | — | `opacity-70` + underline |

Default variant: `primary`.

---

## Sizes

Compact scale, faithful to the Pencil design.

| Size | Font size | Padding Y | Padding X |
|---|---|---|---|
| `sm` | `text-[11px]` | `py-1.5` | `px-3.5` |
| `md` *(default)* | `text-[13px]` | `py-2.5` | `px-6` |
| `lg` | `text-[15px]` | `py-3.5` | `px-8` |

---

## Props

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'destructive' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  loading?: boolean
}
```

All native `<button>` HTML attributes are forwarded via `...rest`.

### Behavior

- **`icon`** — renders a `ReactNode` to the left of children. When `loading=true` and `icon` is present, the icon is replaced by the spinner.
- **`loading`** — sets `disabled` on the `<button>`, adds `aria-busy="true"` and `aria-disabled="true"`, and renders a spinner to the left of children.
- **`disabled`** — native HTML attribute; handled entirely by CSS (`disabled:opacity-30 disabled:cursor-not-allowed`).

### Spinner

- Rendered as `<span aria-hidden="true">` with `animate-spin`
- Sizes: 10px (`sm`), 12px (`md`), 14px (`lg`)
- Color inherits from `currentColor`
- No external dependency

---

## Base Classes (all variants)

```
font-mono font-medium rounded cursor-pointer inline-flex items-center gap-1.5
transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
disabled:opacity-30 disabled:cursor-not-allowed
```

---

## Accessibility

- Native `<button>` element — keyboard focus and ARIA semantics are free
- `loading=true` adds `aria-busy="true"` and `aria-disabled="true"`
- Spinner has `aria-hidden="true"` — decorative; button text communicates state
- `focus-visible` ring uses `ring-accent` for keyboard navigation visibility

---

## File Structure

```
packages/react/src/
  components/ui/
    Button/
      index.tsx          ← component + CVA variants
  index.ts               ← add Button export
packages/docs/src/
  components/ui/
    Button/
      Button.stories.tsx ← Storybook stories
```

### Export pattern (`index.tsx`)

```tsx
export type { ButtonProps }
export { Button, buttonVariants }
```

`buttonVariants` is exported for reuse in future components (e.g. `MenuItem`, `Badge`) that need the same Tailwind classes without rendering a `<button>`.

---

## Storybook Stories

All stories in `packages/docs/src/components/ui/Button/Button.stories.tsx`:

- `Default` — primary, md
- `Variants` — all 6 variants side by side
- `Sizes` — sm / md / lg
- `WithIcon` — outline + icon prop
- `Loading` — primary with loading=true
- `Disabled` — primary with disabled=true

---

## Usage Examples

```tsx
// Basic
<Button>$ submit</Button>

// Variant + size
<Button variant="destructive" size="sm">$ delete</Button>

// With icon (Lucide)
<Button variant="outline" icon={<Settings size={13} />}>$ configure</Button>

// Loading
<Button variant="primary" loading>$ processing</Button>

// Disabled
<Button disabled>$ submit</Button>
```

---

## Out of Scope

- `asChild` / polymorphic rendering — always renders as `<button>`
- Right-side icon (`iconPosition`) — can be added later if needed
- Icon-only variant — out of scope for this iteration
