# @solo-ui/ui

React component library package. Built with tsup (JS) + Tailwind CLI (CSS), published as ESM + CJS.

## Tech Stack

- **CVA** (class-variance-authority) — variant-based styling API
- **cn** (clsx + tailwind-merge) — conditional class merging
- **Tailwind CSS v4** — utility classes via `@theme` tokens
- **tsup** — bundler (ESM + CJS + DTS)
- **TypeScript** — extends `@solo-ui/ts-config/react.json`

## Component Conventions

- Components live in `src/components/ui/<ComponentName>/index.tsx`
- Stories live in `@solo-ui/docs` — see `packages/docs/src/components/ui/<ComponentName>/`
- Export all components from `src/index.ts`
- Define variants with CVA, apply classes with `cn()`
- The `"use client"` directive is handled by the tsup banner — do not add it manually per file

### Export pattern

Every `index.tsx` must end with two named export lines — types first, then components:

```ts
export type { FooProps, FooBarProps }
export { Foo, FooBar }
```

- One `export type` line listing all public prop interfaces
- One `export` line listing all exported components
- No default exports

## Build

```bash
pnpm --filter @solo-ui/ui build
```

Output: `dist/index.js` (ESM), `dist/index.cjs` (CJS), `dist/index.d.ts`, `dist/styles.css`

The `"use client"` directive is injected automatically by tsup as a banner.

## TypeScript

Extends `@solo-ui/ts-config/react.json`. The `ignoreDeprecations: "6.0"` in `tsconfig.json` is required for TypeScript 6.x compatibility with tsup's DTS generation.

## Adding Components

1. Create `src/components/ui/<ComponentName>/index.tsx`
2. Export from `src/index.ts`
3. Run `pnpm --filter @solo-ui/ui build` to verify
