# solo-ui

A modern React design system for building beautiful, accessible user interfaces at scale.

solo-ui provides a comprehensive collection of unstyled, composable component primitives built on Base UI, styled with class-variance-authority (CVA) for flexible variant-based theming. Designed for design teams and developers who want maximum control over component behavior and appearance.

## Features

- **Headless Components** — Unstyled, accessible primitives from Base UI
- **Variant-Based Styling** — CVA for predictable, composable component variants
- **TypeScript First** — Fully typed for excellent developer experience
- **Design Tokens** — Centralized design token system for consistency
- **Documentation** — Storybook for interactive component exploration
- **Monorepo** — Turborepo structure for independent package versioning and publishing

## Getting Started

### Installation

```bash
npm install @solo-ui/react @solo-ui/tokens
```

Or with pnpm (recommended):

```bash
pnpm add @solo-ui/react @solo-ui/tokens
```

### Basic Usage

```tsx
import { Button } from '@solo-ui/react'

export function App() {
  return <Button variant="primary">Click me</Button>
}
```

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@solo-ui/react` | Component library | Published |
| `@solo-ui/tokens` | Design tokens | Published |
| `@solo-ui/ts-config` | Shared TypeScript configs | Published |
| `@solo-ui/lint-config` | Shared Biome configs | Published |
| `@solo-ui/docs` | Storybook documentation | Private |

## Development

### Prerequisites

- **Node.js** 18+
- **pnpm** 10.7+

### Scripts

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run Storybook
pnpm dev

# Lint all packages
pnpm lint

# Format code
pnpm format
```

### Architecture

solo-ui is organized as a Turborepo monorepo with 5 packages:

- **Config packages** (`ts-config`, `lint-config`) — Shared configuration consumed by all other packages
- **Token package** (`tokens`) — Design tokens as TypeScript objects and CSS variables
- **Component library** (`react`) — React components built with Base UI and CVA
- **Documentation** (`docs`) — Storybook for component stories and usage examples

The build pipeline is topologically ordered: tokens are built first, then react (which depends on tokens), then docs. Biome handles linting and formatting across all packages.

## Tech Stack

- **Build System:** Turborepo
- **Package Manager:** pnpm
- **Bundler:** tsup (ESM + CJS)
- **Component Primitives:** Base UI
- **Styling:** CVA + Tailwind CSS (recommended)
- **Type Checking:** TypeScript 6.0
- **Linting & Formatting:** Biome
- **Documentation:** Storybook 10
- **Versioning:** Changesets (fixed versioning)

## Philosophy

solo-ui is built on the principle of **composition over prescription**. We provide unstyled, accessible component primitives that you style to match your brand. This approach offers maximum flexibility while maintaining a consistent component API across your application.

The design system prioritizes:

- **Accessibility** — WCAG 2.1 compliant components
- **Composition** — Components work together seamlessly
- **Type Safety** — Full TypeScript support
- **Performance** — Tree-shakeable, minimal bundle impact
- **Maintainability** — Clear patterns and conventions

## Publishing

Releases follow Semantic Versioning using Changesets. All packages version together (fixed versioning) to ensure compatibility.

```bash
# Add a changeset
pnpm changeset

# Version all packages
pnpm version-packages

# Publish to NPM
pnpm release
```

## License

MIT

## Contributing

See [CLAUDE.md](./CLAUDE.md) for development conventions and guidelines.
