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

All internal workspace references updated accordingly. Files that reference `@solo-ui/react` and must be updated:

- `packages/docs/package.json` — `dependencies`
- `packages/docs/CLAUDE.md` — component example reference

This is a breaking change — a changeset must be created for the rename before merging to main.

### New export paths

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
          index.tsx           ← Card + all sub-components
          Card.stories.tsx    ← colocated story (picked up by Storybook glob)
    lib/
      cn.ts                   ← cn() utility (clsx + tailwind-merge)
    styles/
      index.css               ← Tailwind CSS entry point for the package build
    index.ts                  ← re-exports Card
  package.json                ← name: "@solo-ui/ui"
```

The Storybook glob in `packages/docs/.storybook/main.ts` already covers this path:
```ts
stories: ['../../react/src/**/*.stories.@(ts|tsx)']
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
| `Card` | `children` | `ReactNode` | yes | |
| `Card` | `variant` | `"default"` | no | CVA variant, defaults to `"default"` |
| `Card` | `className` | `string` | no | Merged via `cn()` |
| `Card.Header` | `title` | `string` | yes | |
| `Card.Header` | `description` | `string` | no | Consumer is responsible for the `//` prefix if desired |
| `Card.Header` | `className` | `string` | no | |
| `Card.Content` | `children` | `ReactNode` | yes | |
| `Card.Content` | `className` | `string` | no | |
| `Card.Footer` | `children` | `ReactNode` | yes | |
| `Card.Footer` | `className` | `string` | no | |

**The 3 colored dots (red, yellow, green) are always rendered in `Card.Header` — no prop, no toggle.** They are decorative and will have `aria-hidden="true"`.

### HTML elements

| Component | Element | Notes |
|---|---|---|
| `Card` | `<div>` | Spreads `...rest` HTML div props |
| `Card.Header` | `<div>` | |
| `Card.Content` | `<div>` | |
| `Card.Footer` | `<div>` | |

### Valid compositions

- `Card` + `Card.Header` + `Card.Content` — minimum valid usage
- `Card.Footer` is optional
- `Card.Header description` is optional

---

## Utilities

### `cn()` — `src/lib/cn.ts`

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Styling

### Stack

- **Tailwind v4** — utility classes, CSS-first config via `@theme`
- **CVA** (`class-variance-authority`) — variant API, extensible for future variants
- **cn** (`clsx` + `tailwind-merge`) — conditional class merging and override support

### New dependencies for `@solo-ui/ui`

```
class-variance-authority   (dep)
clsx                       (dep)
tailwind-merge             (dep)
tailwindcss                (devDep — for CSS build step)
@tailwindcss/cli           (devDep — for CSS build step)
```

Pin all versions with `^X.Y.Z` per project convention. Check the installed version after adding.

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

### Tailwind CSS entry point — `src/styles/index.css`

```css
@import "tailwindcss";
@import "@solo-ui/tokens/styles/tokens.css";
```

### Shipped CSS artefact

The package build generates `dist/styles.css` — a pre-compiled CSS file containing all Tailwind utilities used by the components plus the `@theme` token definitions. This makes the package self-contained: consumers do not need to configure Tailwind in their own project.

Consumer usage:
```ts
import '@solo-ui/ui/styles.css'
```

### Build sequence and `clean: true`

The `build` script runs two steps in order:

```json
"build": "tsup && tailwindcss -i src/styles/index.css -o dist/styles.css --minify"
```

`tsup` runs first with `clean: true`, which wipes `dist/`. The Tailwind CLI then outputs `dist/styles.css` into the already-built `dist/`. This order is correct. Running `tsup` alone (without the full build script) will produce a `dist/` without `dist/styles.css` — this is expected for local development.

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

Update `src/index.ts` to re-export:
```ts
export { colors } from './colors'
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

### `@solo-ui/tokens` package.json changes

Add `"styles"` to the `files` array (so the CSS file is included in the published package):

```json
"files": ["dist", "styles"],
"exports": {
  ".": { ... },
  "./styles/tokens.css": "./styles/tokens.css"
}
```

---

## Storybook (`@solo-ui/docs`)

### Tailwind setup

Add `tailwindcss` and `@tailwindcss/vite` as devDeps in `packages/docs`. Add the Vite plugin in `.storybook/main.ts` via `viteFinal`.

Global CSS (`packages/docs/src/styles.css`):
```css
@import "tailwindcss";
@import "@solo-ui/tokens/styles/tokens.css";
```

> **Note:** Storybook builds Tailwind from source (scanning `packages/react/src/**`), not from `dist/styles.css`. This means Storybook is not testing the shipped CSS artifact directly. The trade-off is acceptable for development speed — the shipped CSS is validated at publish time via the build step.

### Stories

Stories are colocated with the component at:
```
packages/react/src/components/ui/Card/Card.stories.tsx
```

Cases covered:
- `Default` — header with title + description + content + footer
- `SemFooter` — no footer
- `SemDescricao` — header title only

---

## Versioning

The package rename (`@solo-ui/react` → `@solo-ui/ui`) is a breaking change. Create a changeset before merging:

```bash
pnpm changeset
# type: major
# packages: all public packages (fixed versioning)
# summary: rename @solo-ui/react to @solo-ui/ui
```

---

## Out of scope

- Card variants beyond `default` (future)
- Dark/light mode toggling (fixed dark for now)
- Animation/transition on Card
- Build script to auto-generate tokens CSS from TS
- Accessibility beyond decorative `aria-hidden` on the 3 dots
