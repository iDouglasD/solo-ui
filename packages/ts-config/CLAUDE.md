# @solo-ds/ts-config

Shared TypeScript configurations. No build step — config-only package.

## Configs

| File | Extends | Use for |
|------|---------|---------|
| `base.json` | — | Non-React packages (e.g., `@solo-ds/tokens`) |
| `react.json` | `base.json` | React packages (e.g., `@solo-ds/react`, `@solo-ds/docs`) |

## How Consumers Use It

In each package's `tsconfig.json`:

```json
{ "extends": "@solo-ds/ts-config/react.json" }
```

or

```json
{ "extends": "@solo-ds/ts-config/base.json" }
```

## Key Settings

- `moduleResolution: "bundler"` — required for tsup/Vite compatibility
- `isolatedModules: true` — required for tsup/esbuild
- `strict: true` — enforced across all packages
- `declaration: true` + `declarationMap: true` — for published packages
