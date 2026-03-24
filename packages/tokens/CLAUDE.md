# @solo-ui/tokens

Design tokens package. TypeScript is the source of truth; CSS variables are generated from it.

## Architecture

- **Source:** TypeScript objects in `src/` (typed, tree-shakeable)
- **Build output:** ESM + CJS via tsup
- **Future:** A build script will generate `styles/tokens.css` (CSS variables) from the TS source — not implemented yet

## Token Structure (future)

Tokens should be organized by category:

```
src/
  colors.ts
  spacing.ts
  typography.ts
  radii.ts
  shadows.ts
  index.ts      ← re-exports all categories
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
import { tokens } from '@solo-ui/tokens'
```

CSS variables (future): `import '@solo-ui/tokens/styles/tokens.css'`
