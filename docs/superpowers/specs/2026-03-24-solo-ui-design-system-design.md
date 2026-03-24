# Solo UI — Design System Specification

## Overview

Solo UI is a React design system built as a Turborepo monorepo, published to NPM under the `@solo-ui` scope. It uses Base UI components with CVA and cn for variant-based styling, Biome for linting and formatting, and Storybook 8 for documentation.

This spec covers the **initial scaffolding** — monorepo structure, tooling configuration, and package setup. No components or tokens are implemented in this phase.

## Monorepo Structure

```
solo-ui/
├── packages/
│   ├── react/          # @solo-ui/react — React components
│   ├── tokens/         # @solo-ui/tokens — Design tokens (TS + CSS)
│   ├── docs/           # @solo-ui/docs — Storybook 8 (private)
│   ├── ts-config/      # @solo-ui/ts-config — Shared TypeScript configs
│   └── lint-config/    # @solo-ui/lint-config — Shared Biome config
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── biome.json          # Root biome config extending lint-config
├── .changeset/
│   └── config.json
└── LICENSE
```

## Package Details

### `@solo-ui/lint-config`

- **Purpose:** Shared Biome configuration for linting and formatting.
- **Build:** None — config-only package.
- **Exports:** `biome.json` base config with rules for React, hooks, a11y, and formatting.
- **Consumers extend via:** `"extends": ["@solo-ui/lint-config/biome"]` in their `biome.json`.

### `@solo-ui/ts-config`

- **Purpose:** Shared TypeScript configurations.
- **Build:** None — config-only package.
- **Exports:** `base.json` (general TS config), `react.json` (React-specific with JSX support).
- **Consumers extend via:** `"extends": "@solo-ui/ts-config/react.json"` in their `tsconfig.json`.

### `@solo-ui/tokens`

- **Purpose:** Design tokens as the single source of truth.
- **Build:** tsup — generates ESM + CJS.
- **Source format:** TypeScript objects (typed, importable).
- **Generated output:** CSS variables file (`styles/tokens.css`) generated from TS source during build.
- **Exports:** TS token objects + CSS variables file.
- **Dependencies:** `@solo-ui/ts-config`.

### `@solo-ui/react`

- **Purpose:** React component library.
- **Build:** tsup — generates ESM + CJS with `"use client"` banner.
- **Styling approach:** Base UI + CVA (class-variance-authority) + cn (clsx + tailwind-merge).
- **Dependencies:** `@solo-ui/tokens`, `@solo-ui/ts-config`.
- **Note:** Component implementation is deferred. Initial setup includes package config and build pipeline only.

### `@solo-ui/docs` (private)

- **Purpose:** Component documentation and playground.
- **Tool:** Storybook 8 (Vite-based).
- **Dependencies:** `@solo-ui/react`, `@solo-ui/tokens`.
- **Not published to NPM.**

## Tooling

### Package Manager — pnpm

- Workspace defined in `pnpm-workspace.yaml` pointing to `packages/*`.
- Lockfile: `pnpm-lock.yaml`.

### Monorepo Orchestration — Turborepo

`turbo.json` pipelines:

| Pipeline | Description | Cache | Depends On |
|----------|-------------|-------|------------|
| `build` | Build all packages | Yes | `^build` (topological) |
| `lint` | Run `biome check` | Yes | — |
| `format` | Run `biome format --write` | No | — |
| `dev` | Storybook dev server | No (persistent) | `^build` |

### Bundler — tsup

- Used by `tokens` and `react` packages.
- Generates dual ESM + CJS output.
- `react` package includes `"use client"` banner for RSC compatibility.

### Linting & Formatting — Biome

- Shared config in `@solo-ui/lint-config`.
- Root `biome.json` extends the shared config.
- Covers: linting (React, hooks, a11y) + formatting (replaces Prettier).

### Versioning — Changesets (fixed mode)

- Config: `.changeset/config.json`.
- **Fixed versioning:** all `@solo-ui/*` public packages version together.
- `@solo-ui/docs` excluded from publishing via `"ignore"`.
- Root scripts: `changeset`, `changeset version`, `changeset publish`.

## Build Dependency Graph

```
ts-config ─────┬──→ tokens (build) ──→ react (build) ──→ docs (build)
               │
lint-config ───┴──→ all packages (no build)
```

Turborepo resolves build order automatically via `package.json` dependencies.

## NPM Publishing

| Package | Published | Scope |
|---------|-----------|-------|
| `@solo-ui/react` | Yes | `@solo-ui` |
| `@solo-ui/tokens` | Yes | `@solo-ui` |
| `@solo-ui/ts-config` | Yes | `@solo-ui` |
| `@solo-ui/lint-config` | Yes | `@solo-ui` |
| `@solo-ui/docs` | No (private) | — |

## Technology Summary

| Concern | Choice |
|---------|--------|
| Monorepo | Turborepo |
| Package manager | pnpm |
| Bundler | tsup (Vite) |
| Linting + Formatting | Biome |
| Components | Base UI + CVA + cn (clsx + twMerge) |
| Tokens | TS source of truth + generated CSS variables |
| Documentation | Storybook 8 |
| Versioning | Changesets (fixed) |
| NPM scope | `@solo-ui/*` |
| License | MIT |

## Scope — Initial Phase

### In scope (this phase)

- Monorepo structure with all 5 packages configured
- Turborepo, pnpm workspaces, Biome, tsup, Storybook working
- Changesets installed and configured (fixed versioning)
- Each package with `package.json`, `tsconfig.json`, and minimal config
- Build pipeline functional end-to-end

### Out of scope (future phases)

- Design token implementation
- React component implementation
- Storybook stories
- CI/CD and automated publish pipeline
