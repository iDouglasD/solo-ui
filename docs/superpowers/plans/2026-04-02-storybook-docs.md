# Storybook Docs MDX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add MDX documentation pages for all four components (Badge, Button, Card, Table) in the solo-ui Storybook, showing a description, interactive Canvas, and props table in the Docs tab.

**Architecture:** Install `@storybook/addon-docs`, update the Storybook config to register the addon and include `.mdx` in the stories glob, then create one `.mdx` file per component using the "attached" pattern (`<Meta of={Stories} />`).

**Tech Stack:** Storybook 10, `@storybook/addon-docs@^10.3.3`, `@storybook/blocks`, MDX, pnpm.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `packages/docs/package.json` | Add `@storybook/addon-docs` dependency |
| Modify | `packages/docs/.storybook/main.ts` | Register addon + expand stories glob to include `.mdx` |
| Create | `packages/docs/src/components/ui/Badge/Badge.mdx` | Badge docs page |
| Create | `packages/docs/src/components/ui/Button/Button.mdx` | Button docs page |
| Create | `packages/docs/src/components/ui/Card/Card.mdx` | Card docs page |
| Create | `packages/docs/src/components/ui/Table/Table.mdx` | Table docs page |

---

## Task 1: Install addon and update Storybook config

**Files:**
- Modify: `packages/docs/package.json`
- Modify: `packages/docs/.storybook/main.ts`

- [ ] **Step 1: Install `@storybook/addon-docs`**

Run from the repo root:
```bash
pnpm add @storybook/addon-docs@^10.3.3 --filter @solo-ui/docs
```

Expected: `packages/docs/package.json` now has `"@storybook/addon-docs": "^10.3.3"` in `devDependencies` and the lockfile is updated.

- [ ] **Step 2: Update `packages/docs/.storybook/main.ts`**

Current content of `main.ts`:
```ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    if (config.mode === 'production') {
      config.base = '/solo-ui/'
    }
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@solo-ui/ui': path.resolve(__dirname, '../../react/src/index.ts'),
      },
    }
    return config
  },
}

export default config
```

Replace with:
```ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config: StorybookConfig = {
  stories: ['../src/**/*.@(stories.@(ts|tsx)|mdx)'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    if (config.mode === 'production') {
      config.base = '/solo-ui/'
    }
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@solo-ui/ui': path.resolve(__dirname, '../../react/src/index.ts'),
      },
    }
    return config
  },
}

export default config
```

Two things changed:
1. `stories` glob now includes `.mdx` files
2. `addons: ['@storybook/addon-docs']` added as second key

- [ ] **Step 3: Commit**

```bash
git add packages/docs/package.json packages/docs/.storybook/main.ts
git commit -m "feat(docs): install and register @storybook/addon-docs"
```

---

## Task 2: Create MDX documentation pages

**Files:**
- Create: `packages/docs/src/components/ui/Badge/Badge.mdx`
- Create: `packages/docs/src/components/ui/Button/Button.mdx`
- Create: `packages/docs/src/components/ui/Card/Card.mdx`
- Create: `packages/docs/src/components/ui/Table/Table.mdx`

All four files follow the same pattern: imports from `@storybook/blocks` (alphabetically sorted to satisfy Biome), namespace import of the stories file, `<Meta of={} />` to attach the page to the component's Docs tab, heading, one-line description, Canvas, and Controls.

Note: `Controls` only shows props that have `args` in the Default story. Card and Table use `render()` without `args` — their Controls table will be empty. This is expected.

- [ ] **Step 1: Create `packages/docs/src/components/ui/Badge/Badge.mdx`**

```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as BadgeStories from './Badge.stories'

<Meta of={BadgeStories} />

# Badge

Inline label for semantic status: default, success, warning, danger. Supports an optional pulsing dot indicator.

<Canvas of={BadgeStories.Default} />

<Controls of={BadgeStories.Default} />
```

- [ ] **Step 2: Create `packages/docs/src/components/ui/Button/Button.mdx`**

```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as ButtonStories from './Button.stories'

<Meta of={ButtonStories} />

# Button

Action trigger with 6 variants (primary, destructive, secondary, outline, ghost, link), 3 sizes, loading state, and an optional icon slot.

<Canvas of={ButtonStories.Default} />

<Controls of={ButtonStories.Default} />
```

- [ ] **Step 3: Create `packages/docs/src/components/ui/Card/Card.mdx`**

```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as CardStories from './Card.stories'

<Meta of={CardStories} />

# Card

Composition container with a terminal-style header (traffic-light dots), a flexible content area, and an optional footer.

<Canvas of={CardStories.Default} />

<Controls of={CardStories.Default} />
```

- [ ] **Step 4: Create `packages/docs/src/components/ui/Table/Table.mdx`**

```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as TableStories from './Table.stories'

<Meta of={TableStories} />

# Table

Composable data table with a Card-style header, column headers, and body rows with a left-accent hover effect.

<Canvas of={TableStories.Default} />

<Controls of={TableStories.Default} />
```

- [ ] **Step 5: Commit**

```bash
git add packages/docs/src/components/ui/Badge/Badge.mdx \
        packages/docs/src/components/ui/Button/Button.mdx \
        packages/docs/src/components/ui/Card/Card.mdx \
        packages/docs/src/components/ui/Table/Table.mdx
git commit -m "docs(docs): add MDX documentation pages for all components"
```

---

## Task 3: Verify and lint

- [ ] **Step 1: Run lint**

```bash
pnpm lint
```

Expected: no errors across all packages. The MDX files themselves are not checked by Biome (Biome does not lint `.mdx`), so only the modified `.ts` files need to pass.

If there are formatting issues in `main.ts`, run:
```bash
pnpm format
```

Then re-run `pnpm lint` to confirm clean.

- [ ] **Step 2: Commit if format made changes**

```bash
git add packages/docs/.storybook/main.ts
git commit -m "chore(docs): apply biome format to main.ts"
```

Skip if lint was already clean.
