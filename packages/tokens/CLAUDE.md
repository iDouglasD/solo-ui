# @solo-ui/tokens

Design tokens package. TypeScript is the source of truth; CSS variables are maintained in sync manually until a build script is added.

## Architecture

- **Source:** TypeScript objects in `src/` (typed, tree-shakeable)
- **CSS:** `styles/tokens.css` — Tailwind v4 `@theme` block, maintained manually in sync with TS source
- **Build output:** ESM + CJS via tsup

## Token Structure

Tokens are organized by category:

```
src/
  colors.ts     ← implemented
  spacing.ts    ← future
  typography.ts ← future
  radii.ts      ← future
  shadows.ts    ← future
  index.ts      ← re-exports all categories
styles/
  tokens.css    ← Tailwind v4 @theme block
```

## Build

```bash
pnpm --filter @solo-ui/tokens build
```

Output: `dist/index.js` (ESM), `dist/index.cjs` (CJS), `dist/index.d.ts`

## TypeScript

Extends `@solo-ui/ts-config/base.json`. The `ignoreDeprecations: "6.0"` in `tsconfig.json` is required for TypeScript 6.x compatibility with tsup's DTS generation.

## Consuming Tokens

```ts
import { colors } from '@solo-ui/tokens'
```

CSS (Tailwind v4):
```css
@import '@solo-ui/tokens/styles/tokens.css';
```
