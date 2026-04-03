# Storybook Docs MDX Design Spec

## Overview

Add MDX documentation pages to `@solo-ui/docs` for all four current components (Badge, Button, Card, Table). Each page is "attached" to its existing stories file via `<Meta of={...} />`, appears as the **Docs** tab in Storybook, and shows a one-line description, an interactive Canvas with the Default story, and an auto-generated Controls/props table.

## Approach

MDX "attached" mode (Storybook 8+ / 10 official pattern). The MDX file references an existing stories export object, which connects it to Storybook's component controls infrastructure. No standalone pages — docs live alongside stories in the same folder.

## Setup Changes

### Install

```bash
pnpm add @storybook/addon-docs --filter @solo-ui/docs
```

Pin version to match the installed Storybook version (`^10.3.3`).

### `.storybook/main.ts`

Two changes:
1. Add `'@storybook/addon-docs'` to the `addons` array.
2. Update the `stories` glob to include `.mdx` files.

**Before:**
```ts
stories: ['../src/**/*.stories.@(ts|tsx)'],
```

**After:**
```ts
addons: ['@storybook/addon-docs'],
stories: ['../src/**/*.@(stories.@(ts|tsx)|mdx)'],
```

## MDX File Structure

All four MDX files follow the same template. Imports come from `@storybook/blocks` (bundled with `@storybook/addon-docs`).

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks'
import * as ComponentStories from './Component.stories'

<Meta of={ComponentStories} />

# Component

[One-line description in English.]

<Canvas of={ComponentStories.Default} />

<Controls of={ComponentStories.Default} />
```

The `<Meta of={ComponentStories} />` tag attaches the MDX page to the component, so it appears as the **Docs** tab rather than a separate nav item.

## Files

| Action | Path |
|--------|------|
| Modify | `packages/docs/package.json` |
| Modify | `packages/docs/.storybook/main.ts` |
| Create | `packages/docs/src/components/ui/Badge/Badge.mdx` |
| Create | `packages/docs/src/components/ui/Button/Button.mdx` |
| Create | `packages/docs/src/components/ui/Card/Card.mdx` |
| Create | `packages/docs/src/components/ui/Table/Table.mdx` |

## Component Descriptions

### Badge
```
Inline label for semantic status: default, success, warning, danger. Supports an optional pulsing dot indicator.
```

### Button
```
Action trigger with 6 variants (primary, destructive, secondary, outline, ghost, link), 3 sizes, loading state, and an optional icon slot.
```

### Card
```
Composition container with a terminal-style header (traffic-light dots), a flexible content area, and an optional footer.
```

### Table
```
Composable data table with a Card-style header, column headers, and body rows with a left-accent hover effect.
```

## Full MDX Content Per File

### `Badge.mdx`
```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as BadgeStories from './Badge.stories'

<Meta of={BadgeStories} />

# Badge

Inline label for semantic status: default, success, warning, danger. Supports an optional pulsing dot indicator.

<Canvas of={BadgeStories.Default} />

<Controls of={BadgeStories.Default} />
```

### `Button.mdx`
```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as ButtonStories from './Button.stories'

<Meta of={ButtonStories} />

# Button

Action trigger with 6 variants (primary, destructive, secondary, outline, ghost, link), 3 sizes, loading state, and an optional icon slot.

<Canvas of={ButtonStories.Default} />

<Controls of={ButtonStories.Default} />
```

### `Card.mdx`
```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as CardStories from './Card.stories'

<Meta of={CardStories} />

# Card

Composition container with a terminal-style header (traffic-light dots), a flexible content area, and an optional footer.

<Canvas of={CardStories.Default} />

<Controls of={CardStories.Default} />
```

### `Table.mdx`
```mdx
import { Canvas, Controls, Meta } from '@storybook/blocks'
import * as TableStories from './Table.stories'

<Meta of={TableStories} />

# Table

Composable data table with a Card-style header, column headers, and body rows with a left-accent hover effect.

<Canvas of={TableStories.Default} />

<Controls of={TableStories.Default} />
```

## Implementation Notes

- `@storybook/blocks` is bundled with `@storybook/addon-docs` — no separate install needed.
- Imports in MDX files must be sorted alphabetically (`Canvas, Controls, Meta`) to satisfy Biome.
- The `addons` array in `main.ts` must be added as a new key — the current config has no `addons` key.
- After installing, run `pnpm --filter @solo-ui/docs dev` and verify each component shows a **Docs** tab with the Canvas and Controls rendering correctly.
- The `Controls` block only shows props that have `args` defined in the Default story. Components whose Default story uses `render()` without `args` (Card, Table) will show an empty or minimal props table — this is expected behavior and not a bug.
