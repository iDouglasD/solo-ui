# Stories Migration: packages/react → packages/docs

## Context

Storybook stories were colocated with components in `packages/react/src/`. This couples the documentation package to the component source tree and makes the `@solo-ui/ui` library carry story files in its source. Stories belong in `packages/docs`, which is the dedicated Storybook package.

## Goal

Move all `.stories.tsx` files out of `packages/react` into `packages/docs`, mirroring the component directory structure. The `packages/react` package should contain only component source code.

## Design

### Directory Structure

Stories in `packages/docs` mirror the path of the corresponding component in `packages/react/src`:

    packages/docs/
      src/
        components/
          ui/
            Card/
              Card.stories.tsx
      .storybook/
        main.ts
      styles.css
      package.json
      tsconfig.json

For a component at `packages/react/src/components/ui/Foo/index.tsx`, its story lives at `packages/docs/src/components/ui/Foo/Foo.stories.tsx`.

### Import Convention

Stories import components via the published package name:

```ts
import { Card } from '@solo-ui/ui'
```

This reflects how consumers use the library and ensures the built `dist/` is exercised.

> **Note:** `@solo-ui/ui` resolves via workspace symlink to `packages/react/dist/`. Running `pnpm dev` from the root is safe — Turbo's `dependsOn` ensures `@solo-ui/ui` is built first. However, running `pnpm --filter @solo-ui/docs dev` directly bypasses Turbo and will fail with a module-not-found error if `dist/` is absent. In that case, run `pnpm build --filter @solo-ui/ui` first.

### Changes Required

**1. `packages/docs/.storybook/main.ts`** — update the stories glob:

```ts
// before
stories: ['../../react/src/**/*.stories.@(ts|tsx)']
// after
stories: ['../src/**/*.stories.@(ts|tsx)']
```

**2. `packages/docs/tsconfig.json`** — replace the entire file contents:

```json
// before
{
  "extends": "@solo-ui/ts-config/react.json",
  "include": [".storybook/**/*"]
}

// after
{
  "extends": "@solo-ui/ts-config/react.json",
  "include": [".storybook/**/*", "src/**/*"]
}
```

**3. Move, update, and delete `Card.stories.tsx`:**

- Create `packages/docs/src/components/ui/Card/Card.stories.tsx` with the content of the original file
- In the new file, update the component import:
  ```ts
  // before
  import { Card } from '.'
  // after
  import { Card } from '@solo-ui/ui'
  ```
- Delete `packages/react/src/components/ui/Card/Card.stories.tsx`

**4. Update `packages/react/CLAUDE.md`:**

In the `## Component Conventions` section, replace:

```
- Stories colocated: `src/components/ui/<ComponentName>/<ComponentName>.stories.tsx`
```

with:

```
- Stories live in `@solo-ui/docs` — see `packages/docs/src/components/ui/<ComponentName>/`
```

In the `## Adding Components` section, replace the current four-step list:

```
1. Create `src/components/ui/<ComponentName>/index.tsx`
2. Create `src/components/ui/<ComponentName>/<ComponentName>.stories.tsx`
3. Export from `src/index.ts`
4. Run `pnpm --filter @solo-ui/ui build` to verify
```

with:

```
1. Create `src/components/ui/<ComponentName>/index.tsx`
2. Export from `src/index.ts`
3. Run `pnpm --filter @solo-ui/ui build` to verify
```

**5. Update `packages/docs/CLAUDE.md`:**

In the `## Stack` section, replace the two lines:

```
- Stories live in `packages/react/src/` (not here)
- This package only contains Storybook configuration
```

with:

```
- Stories live in `src/components/ui/<ComponentName>/`, imported via `@solo-ui/ui`
```

Replace the entire `## Stories Location` section — from the `## Stories Location` heading line through (and including) the blank line that follows the glob code block's closing triple-backtick — with:

```markdown
## Stories Location

Stories live in `src/components/ui/<ComponentName>/` and are imported via `@solo-ui/ui`:

    packages/docs/src/
      components/
        ui/
          Card/
            Card.stories.tsx   ← story lives here

The glob pattern in `.storybook/main.ts` picks them up automatically:

    ../src/**/*.stories.@(ts|tsx)
```

In the `## Running` section, add the following after the closing triple-backtick of the bash block (before `## Building`):

```
> When running directly with `--filter`, ensure `@solo-ui/ui` is built first:
> `pnpm build --filter @solo-ui/ui`
```

## Out of Scope

- Moving or changing the component implementations in `packages/react/src`
- Changing how components are exported from `@solo-ui/ui`
- Adding new stories or modifying existing story content
