# @solo-ui/react

React component library package. Built with tsup, published as ESM + CJS.

## Tech Stack

- **Base UI** — headless component primitives
- **CVA** (class-variance-authority) — variant-based styling API
- **cn** (clsx + tailwind-merge) — conditional class merging
- **tsup** — bundler (ESM + CJS + DTS)
- **TypeScript** — extends `@solo-ui/ts-config/react.json`

## Component Conventions

- One component per file: `src/components/<ComponentName>/index.tsx`
- Export all components from `src/index.ts`
- Use Base UI primitives as the unstyled base
- Define variants with CVA, apply classes with `cn()`
- Always add `"use client"` is handled by the tsup banner — do not add it manually per file

## Build

```bash
pnpm --filter @solo-ui/react build
```

Output: `dist/index.js` (ESM), `dist/index.cjs` (CJS), `dist/index.d.ts`

The `"use client"` directive is injected automatically by tsup as a banner.

## TypeScript

Extends `@solo-ui/ts-config/react.json`. The `ignoreDeprecations: "6.0"` in `tsconfig.json` is required for TypeScript 6.x compatibility with tsup's DTS generation.

## Adding Components (future)

1. Create `src/components/<ComponentName>/index.tsx`
2. Export from `src/index.ts`
3. Add a story in `packages/docs`
4. Run `pnpm --filter @solo-ui/react build` to verify
