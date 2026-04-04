# Design: @storybook/addon-vitest Setup

**Date:** 2026-04-03
**Package:** `@solo-ui/docs`
**Status:** Approved

## Goal

Configure `@storybook/addon-vitest` in the `packages/docs` package so that existing Storybook stories automatically run as Vitest tests. The setup covers smoke tests (all stories render without error) and interaction tests (`play` functions with `userEvent` and `expect`).

## Scope

- Changes are confined to `packages/docs`. No changes to `@solo-ui/ui`, `@solo-ui/tokens`, or the Turborepo root.
- No CI integration at this stage. Tests run locally via `pnpm --filter @solo-ui/docs test`.

## Approach

**@storybook/addon-vitest** (official addon, Storybook 10 + Vite).

The `storybookTest` plugin reads the existing `.storybook/main.ts` (which already configures Tailwind via `@tailwindcss/vite` and the `@solo-ui/ui → src/index.ts` alias) and reuses that Vite config via `extends: true` in the project config. No duplication of Vite configuration is needed.

Tests run in **browser mode with Playwright (Chromium headless)** — the official recommendation over jsdom/HappyDom, which are simulations that can mask real browser behaviour.

## Files Changed / Created

```
packages/docs/
├── vitest.config.ts              # new — Vitest config with storybookTest plugin
└── .storybook/
    ├── vitest.setup.ts           # new — test setup file (inside .storybook/ by convention)
    ├── main.ts                   # modified — register @storybook/addon-vitest addon
    ├── preview.ts                # unchanged
    └── manager.ts                # unchanged

packages/docs/src/components/ui/Button/
└── Button.stories.tsx            # modified — add play function examples
```

## New Dependencies (`packages/docs` devDependencies)

| Package | Purpose |
|---------|---------|
| `vitest` | Test runner |
| `@storybook/addon-vitest` | Storybook plugin + Vitest integration |
| `@vitest/browser` | Browser mode support for Vitest |
| `playwright` | Playwright browser provider for Vitest 4 |

After installing, download the Chromium binary (one-time step):

```bash
pnpm exec playwright install chromium
```

## Configuration Details

### `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser/providers/playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            storybookScript: 'pnpm storybook dev -p 6006 --no-open',
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
```

- `extends: true` — inherits the Vite config resolved from `.storybook/main.ts` (Tailwind plugin + `@solo-ui/ui` alias), so no duplication is needed.
- `storybookScript` — enables the "Run tests" button in the Storybook UI sidebar.

### `.storybook/main.ts` (diff)

Add `'@storybook/addon-vitest'` to the `addons` array.

### `.storybook/vitest.setup.ts`

```ts
import { setProjectAnnotations } from '@storybook/react-vite'
import * as previewAnnotations from './preview'

setProjectAnnotations([previewAnnotations])
```

This ensures global decorators, parameters, and loaders defined in `preview.ts` (dark theme, background config) are applied during test runs.

### `package.json` script

```json
"test": "vitest"
```

## Interaction Test Examples (Button)

Two new story exports in `Button.stories.tsx` demonstrate `play` functions.

**`Clickable`** — verifies the button is enabled and interactable via a spy on `onClick`:
```ts
export const Clickable: Story = {
  args: {
    variant: 'primary',
    children: 'submit',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /submit/i })
    await expect(button).toBeEnabled()
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}
```

**`DisabledIsNotClickable`** — verifies the `disabled` attribute is applied:
```ts
export const DisabledIsNotClickable: Story = {
  args: { variant: 'primary', disabled: true, children: 'submit' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /submit/i })
    await expect(button).toBeDisabled()
  },
}
```

Imports (`userEvent`, `within`, `expect`, `fn`) come from `@storybook/test`, already bundled with Storybook 10.

## What Is Not Included

- Turborepo `test` pipeline task
- Accessibility tests (`@storybook/addon-a11y`)
- Coverage reporting
- CI/GitHub Actions integration
