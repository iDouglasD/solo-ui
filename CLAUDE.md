# solo-ui — Global Conventions

## Project Overview

Turborepo monorepo for the solo-ui React design system, published to NPM under `@solo-ui/*`.

## Package Manager

Always use **pnpm**. Never use npm or yarn.

- Install a dep in a specific package: `pnpm add <pkg> --filter @solo-ui/<name>`
- Install a root devDep: `pnpm add -Dw <pkg>`
- Install all: `pnpm install`

## Git Commits

- English only
- Conventional Commits with scope: `feat(react):`, `fix(tokens):`, `chore(root):`, etc.
- No Co-Authored-By lines

## Turborepo Scripts (run from root)

| Script | Command | Description |
|--------|---------|-------------|
| Build all | `pnpm build` | Topological: tokens → react → docs |
| Lint all | `pnpm lint` | Biome check across all packages |
| Format all | `pnpm format` | Biome format --write across all packages |
| Dev | `pnpm dev` | Storybook dev server |

## Package Naming

All packages use the `@solo-ui/` scope. Published packages: `@solo-ui/react`, `@solo-ui/tokens`, `@solo-ui/ts-config`, `@solo-ui/lint-config`. The `@solo-ui/docs` package is private (not published).

## Versioning

Uses **Changesets** with fixed versioning — all public packages version together.

- Add a changeset: `pnpm changeset`
- Bump versions: `pnpm version-packages`
- Publish: `pnpm release`

## Dependency Versions

Always pin with `^X.Y.Z`, never use `latest`. When adding new dependencies, check the installed version and pin it.

## Internal Workspace Dependencies

Use `"workspace:*"` for internal package references (e.g., `"@solo-ui/tokens": "workspace:*"`).
