# Card Component — Design Spec

**Date:** 2026-03-25
**Branch:** feat/card-component
**Status:** Approved

---

## Overview

First component of the solo-ui design system. Establishes the terminal/hacker dark mode aesthetic and the foundation patterns (Tailwind v4, CVA, tokens) that all future components will follow.

---

## Package Changes

### Rename `@solo-ui/react` → `@solo-ui/ui`

The directory `packages/react/` stays as-is. Only `package.json` changes:

```json
{
  "name": "@solo-ui/ui"
}
```

All internal workspace references updated accordingly.

### New export path for CSS

```json
"exports": {
  ".": {
    "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
  },
  "./styles.css": "./dist/styles.css"
}
```

---

## File Structure

```
packages/react/
  src/
    components/
      ui/
        Card/
          index.tsx       ← Card + all sub-components
    index.ts              ← re-exports Card
  package.json            ← name: "@solo-ui/ui"
```

---

## Visual Design

Terminal/hacker dark mode aesthetic. Reference: macOS-style window frame with colored traffic-light dots, monospace font, dark surfaces, subtle borders.

**Color palette** (defined in `@solo-ui/tokens`):

| Token | Value | Usage |
|---|---|---|
| `base` | `#0d0d0d` | Deepest background |
| `surface` | `#111111` | Card background |
| `elevated` | `#1a1a1a` | Card header background |
| `border` | `#222222` | Card border, dividers |
| `muted` | `#444444` | Secondary text, row descriptions |
| `subtle` | `#666666` | Tertiary text |
| `primary` | `#cccccc` | Primary text |
| `accent` | `#00ff41` | Accent (green terminal) |

---

## Component API

### Composition structure

```tsx
<Card>
  <Card.Header
    title="git — conventional commits"
    description="// o custo real de um histórico bagunçado"
  />
  <Card.Content>
    {/* free children */}
  </Card.Content>
  <Card.Footer>
    5 commits
  </Card.Footer>
</Card>
```

### Props

| Component | Prop | Type | Required | Notes |
|---|---|---|---|---|
| `Card` | `className` | `string` | no | Merged via `cn()` |
| `Card` | `children` | `ReactNode` | yes | |
| `Card.Header` | `title` | `string` | yes | |
| `Card.Header` | `description` | `string` | no | Rendered as comment-style text |
| `Card.Header` | `className` | `string` | no | |
| `Card.Content` | `children` | `ReactNode` | yes | |
| `Card.Content` | `className` | `string` | no | |
| `Card.Footer` | `children` | `ReactNode` | yes | |
| `Card.Footer` | `className` | `string` | no | |

**The 3 colored dots (red, yellow, green) are always rendered in `Card.Header` — no prop, no toggle.** They are part of the visual identity.

### Valid compositions

- `Card` + `Card.Header` + `Card.Content` — minimum valid usage
- `Card.Footer` is optional
- `Card.Header description` is optional

---

## Styling

### Stack

- **Tailwind v4** — utility classes, CSS-first config via `@theme`
- **CVA** (`class-variance-authority`) — variant API, extensible for future variants
- **cn** (`clsx` + `tailwind-merge`) — conditional class merging and override support

### New dependencies for `@solo-ui/ui`

```
class-variance-authority
clsx
tailwind-merge
tailwindcss        (devDep — for CSS build)
@tailwindcss/cli   (devDep — for CSS build step)
```

### CVA usage (Card root example)

```ts
const cardVariants = cva(
  'rounded-lg border overflow-hidden font-mono text-sm',
  {
    variants: {
      variant: {
        default: 'bg-surface border-border text-primary',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)
```

### Shipped CSS artefact

The package build generates `dist/styles.css` — a pre-compiled CSS file containing all Tailwind utilities used by the components plus the `@theme` token definitions. This makes the package self-contained: consumers do not need to configure Tailwind in their own project.

Consumer usage:
```ts
import '@solo-ui/ui/styles.css'
```

---

## Tokens (`@solo-ui/tokens`)

### TypeScript source (`src/colors.ts`)

```ts
export const colors = {
  base: '#0d0d0d',
  surface: '#111111',
  elevated: '#1a1a1a',
  border: '#222222',
  muted: '#444444',
  subtle: '#666666',
  primary: '#cccccc',
  accent: '#00ff41',
} as const
```

### CSS output (`styles/tokens.css`)

```css
@theme {
  --color-base: #0d0d0d;
  --color-surface: #111111;
  --color-elevated: #1a1a1a;
  --color-border: #222222;
  --color-muted: #444444;
  --color-subtle: #666666;
  --color-primary: #cccccc;
  --color-accent: #00ff41;
}
```

Both are maintained manually for now. A build script to auto-generate the CSS from TS is a future concern — the structure is already in place.

### New export path for `@solo-ui/tokens`

```json
"exports": {
  ".": { ... },
  "./styles/tokens.css": "./styles/tokens.css"
}
```

---

## Storybook (`@solo-ui/docs`)

### Tailwind setup

Add `@tailwindcss/vite` plugin to `.storybook/main.ts` via `viteFinal`.

Global CSS imports:
```css
/* packages/docs/src/styles.css */
@import "tailwindcss";
@import "@solo-ui/tokens/styles/tokens.css";
```

### Stories

```
packages/docs/src/stories/Card.stories.tsx
```

Cases covered:
- `Default` — header with title + description + content + footer
- `SemFooter` — no footer
- `SemDescricao` — header title only

---

## Build

The build for `@solo-ui/ui` runs two steps:

1. **tsup** — JS/TS bundle (existing, unchanged)
2. **Tailwind CSS build** — compiles `src/styles/index.css` → `dist/styles.css`, scanning `src/**/*.tsx` for class names

The `build` script in `package.json` runs both in sequence.

---

## Out of scope

- Card variants beyond `default` (future)
- Dark/light mode toggling (fixed dark for now)
- Animation/transition on Card
- Build script to auto-generate tokens CSS from TS
