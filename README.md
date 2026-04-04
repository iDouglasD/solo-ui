# solo-ui

React design system built with CVA, Tailwind CSS v4, and TypeScript.

## Packages

| Package | Description |
|---------|-------------|
| `@solo-ds/ui` | React component library |
| `@solo-ds/tokens` | Design tokens (TS + CSS variables) |
| `@solo-ds/ts-config` | Shared TypeScript configs |
| `@solo-ds/lint-config` | Shared Biome configs |

## Usage

### Installation

```bash
pnpm add @solo-ds/ui @solo-ds/tokens
```

### Setup

Import the styles in your app entry point:

```css
@import '@solo-ds/tokens/styles/tokens.css';
@import '@solo-ds/ui/styles.css';
```

### Components

```tsx
import { Button } from '@solo-ds/ui'

export function App() {
  return <Button variant="primary">Click me</Button>
}
```

### Tokens (TypeScript)

```ts
import { colors } from '@solo-ds/tokens'
```

## Development

**Requirements:** Node.js 18+, pnpm 10.7+

```bash
pnpm install       # install dependencies
pnpm dev           # Storybook dev server
pnpm build         # build all packages
pnpm lint          # lint all packages
pnpm format        # format all packages
```

## Publishing

Releases use [Changesets](https://github.com/changesets/changesets) with fixed versioning — all public packages version together.

```bash
# 1. Document your changes
pnpm changeset

# 2. Bump versions
pnpm version-packages

# 3. Publish to NPM
pnpm release
```

## License

MIT
