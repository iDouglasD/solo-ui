# Vitest Addon Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure `@storybook/addon-vitest` in `packages/docs` so all existing stories run as smoke tests automatically, and add interaction tests (`play` functions) to `Button.stories.tsx` as examples.

**Architecture:** The `storybookTest` Vitest plugin reads `.storybook/main.ts` and transforms story exports into Vitest test cases. Tests run in Chromium headless via Playwright browser mode (not jsdom). The Vite config (Tailwind + `@solo-ui/ui` alias) is inherited from the Storybook config via `extends: true` — no duplication needed.

**Tech Stack:** Storybook 10, `@storybook/addon-vitest`, Vitest 4, `@vitest/browser`, `@vitest/browser-playwright`, Playwright Chromium, `@storybook/test` (bundled with Storybook 10)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `packages/docs/vitest.config.ts` | Vitest entry point; configures `storybookTest` plugin + browser mode |
| Create | `packages/docs/.storybook/vitest.setup.ts` | Applies global Storybook annotations (decorators, parameters from `preview.ts`) to test runs |
| Modify | `packages/docs/.storybook/main.ts` | Registers `@storybook/addon-vitest` so the addon's UI panel works in Storybook |
| Modify | `packages/docs/package.json` | Adds `"test": "vitest"` script and new devDependencies |
| Modify | `packages/docs/src/components/ui/Button/Button.stories.tsx` | Adds `Clickable` and `DisabledIsNotClickable` stories with `play` functions |

---

## Task 1: Install Dependencies

**Files:**
- Modify: `packages/docs/package.json`

- [ ] **Step 1: Install the four new devDependencies**

Run from the **repo root**:

```bash
pnpm add -D vitest @storybook/addon-vitest @vitest/browser playwright --filter @solo-ui/docs
```

- [ ] **Step 2: Verify packages are in `packages/docs/package.json`**

Open `packages/docs/package.json` and confirm the `devDependencies` block contains all four packages with `^X.Y.Z` semver pins (pnpm sets them automatically). Example of what to look for:

```json
"@storybook/addon-vitest": "^X.Y.Z",
"@vitest/browser": "^X.Y.Z",
"@vitest/browser-playwright": "^X.Y.Z",
"vitest": "^X.Y.Z"
```

- [ ] **Step 3: Download the Playwright Chromium binary (one-time)**

Run from `packages/docs`:

```bash
pnpm exec playwright install chromium
```

Expected output: `Downloading Chromium ...` followed by a success message. This downloads ~150MB.

---

## Task 2: Create `vitest.config.ts`

**Files:**
- Create: `packages/docs/vitest.config.ts`

- [ ] **Step 1: Create the file**

Create `packages/docs/vitest.config.ts` with this content:

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

**What each part does:**
- `extends: true` — inherits the Vite config resolved from `.storybook/main.ts`, including the `@tailwindcss/vite` plugin and the `@solo-ui/ui → ../../react/src/index.ts` alias.
- `storybookTest({ configDir })` — tells the plugin where your `.storybook/` folder is so it can discover stories.
- `storybookScript` — enables the "Run tests" button in the Storybook sidebar UI.
- `provider: playwright({})` — uses `@vitest/browser-playwright`'s named export (note: function call, not a string).
- `setupFiles` — runs `.storybook/vitest.setup.ts` before each test file.

---

## Task 3: Create `.storybook/vitest.setup.ts`

**Files:**
- Create: `packages/docs/.storybook/vitest.setup.ts`

- [ ] **Step 1: Create the setup file**

Create `packages/docs/.storybook/vitest.setup.ts`:

```ts
import { setProjectAnnotations } from '@storybook/react-vite'
import * as previewAnnotations from './preview'

setProjectAnnotations([previewAnnotations])
```

**Why this is necessary:** Without it, stories render in isolation — without the global dark theme, background parameters, and controls matchers configured in `preview.ts`. The `setProjectAnnotations` call registers those globals so test runs behave exactly like the Storybook UI.

**Why `import * as`:** `preview.ts` uses `export default preview`. Importing with `* as` captures both the default export and any named exports, which is what `setProjectAnnotations` expects.

---

## Task 4: Register the Addon and Add the Test Script

**Files:**
- Modify: `packages/docs/.storybook/main.ts`
- Modify: `packages/docs/package.json`

- [ ] **Step 1: Register `@storybook/addon-vitest` in `main.ts`**

In `packages/docs/.storybook/main.ts`, find the `addons` array and add `'@storybook/addon-vitest'`:

```ts
addons: ['@storybook/addon-docs', '@storybook/addon-vitest'],
```

This enables the "Tests" panel in the Storybook sidebar so you can run and watch tests from inside the UI.

- [ ] **Step 2: Add the `test` script to `package.json`**

In `packages/docs/package.json`, add `"test"` to the `scripts` block:

```json
"scripts": {
  "dev": "storybook dev -p 6006",
  "build": "storybook build",
  "test": "vitest",
  "typecheck": "tsc --noEmit",
  "lint": "biome check .",
  "format": "biome format --write ."
},
```

---

## Task 5: Run Smoke Tests

All existing stories become smoke tests automatically. Run them now to validate the configuration before adding `play` functions.

- [ ] **Step 1: Run the tests from the repo root**

```bash
pnpm --filter @solo-ui/docs test --run
```

The `--run` flag runs once and exits (no watch mode).

Expected output:

```
✓ storybook > UI/Button > Default
✓ storybook > UI/Button > Variants
✓ storybook > UI/Button > Sizes
✓ storybook > UI/Button > WithIcon
✓ storybook > UI/Button > Loading
✓ storybook > UI/Button > Disabled
✓ storybook > UI/Badge > ...
✓ storybook > UI/Input > ...
✓ storybook > UI/Card > ...
✓ storybook > UI/Table > ...

Test Files  5 passed (5)
Tests       X passed (X)
```

If any test fails:
- Check that `pnpm exec playwright install chromium` completed successfully.
- Check that the `@solo-ui/ui` alias resolves: open `packages/docs/.storybook/main.ts` and confirm the `viteFinal` alias points to `../../react/src/index.ts`.
- Check that `extends: true` is in the project config in `vitest.config.ts`.

- [ ] **Step 2: Commit the working infrastructure**

```bash
git add packages/docs/vitest.config.ts packages/docs/.storybook/vitest.setup.ts packages/docs/.storybook/main.ts packages/docs/package.json pnpm-lock.yaml
git commit -m "feat(docs): add @storybook/addon-vitest with Playwright browser mode"
```

---

## Task 6: Add `play` Functions to `Button.stories.tsx`

**Files:**
- Modify: `packages/docs/src/components/ui/Button/Button.stories.tsx`

- [ ] **Step 1: Add the `@storybook/test` imports at the top of the file**

`Button.stories.tsx` currently imports only from `@solo-ui/ui` and `@storybook/react`. Add the testing utilities at the top:

```ts
import { expect, fn, userEvent, within } from '@storybook/test'
```

These are bundled with Storybook 10 — no extra package installation needed.

- [ ] **Step 2: Add the `Clickable` story**

Append at the end of `Button.stories.tsx`:

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

**What this tests:**
- `toBeEnabled()` — button is not disabled before clicking.
- `userEvent.click()` — simulates a real click event in the Chromium browser.
- `toHaveBeenCalledOnce()` — the `onClick` spy was called exactly once.

**`fn()`** creates a Storybook-managed spy function (like `vi.fn()` but integrated with the Storybook controls panel so you can see call history in the UI).

**`playwright` provider** comes from `@vitest/browser/providers/playwright` (a subpath export of `@vitest/browser`) and wraps the `playwright` binary installed as a direct dependency.

- [ ] **Step 3: Add the `DisabledIsNotClickable` story**

Append after `Clickable`:

```ts
export const DisabledIsNotClickable: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'submit',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /submit/i })
    await expect(button).toBeDisabled()
  },
}
```

**What this tests:** The `disabled` prop correctly sets the HTML `disabled` attribute, which prevents interaction.

---

## Task 7: Run Interaction Tests

- [ ] **Step 1: Run only the Button story tests**

```bash
pnpm --filter @solo-ui/docs test --run Button
```

Expected output:

```
✓ storybook > UI/Button > Default
✓ storybook > UI/Button > Variants
✓ storybook > UI/Button > Sizes
✓ storybook > UI/Button > WithIcon
✓ storybook > UI/Button > Loading
✓ storybook > UI/Button > Disabled
✓ storybook > UI/Button > Clickable
✓ storybook > UI/Button > DisabledIsNotClickable

Test Files  1 passed (1)
Tests       8 passed (8)
```

If `Clickable` fails with "onClick is not a function": verify the Button component forwards the `onClick` prop to the underlying `<button>` element (check `packages/react/src/components/ui/Button/index.tsx`).

If `DisabledIsNotClickable` fails with "element is not disabled": verify the Button component sets the `disabled` attribute on the `<button>` element when `disabled={true}` is passed.

- [ ] **Step 2: Run the full test suite to confirm no regressions**

```bash
pnpm --filter @solo-ui/docs test --run
```

Expected: all story tests pass.

- [ ] **Step 3: Commit**

```bash
git add packages/docs/src/components/ui/Button/Button.stories.tsx
git commit -m "test(docs): add play function examples to Button stories"
```
