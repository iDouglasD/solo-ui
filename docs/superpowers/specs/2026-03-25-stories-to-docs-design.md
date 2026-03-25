# Stories Migration: packages/react → packages/docs

## Context

Storybook stories were colocated with components in `packages/react/src/`. This couples the documentation package to the component source tree and makes the `@solo-ui/ui` library carry story files in its source. Stories belong in `packages/docs`, which is the dedicated Storybook package.

## Goal

Move all `.stories.tsx` files out of `packages/react` into `packages/docs`, mirroring the component directory structure. The `packages/react` package should contain only component source code.

## Design

### Directory Structure

Stories in `packages/docs` mirror the path of the corresponding component in `packages/react/src`:

```
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
```

For a component at `packages/react/src/components/ui/Foo/index.tsx`, its story lives at `packages/docs/src/components/ui/Foo/Foo.stories.tsx`.

### Import Convention

Stories import components via the published package name:

```ts
import { Card } from '@solo-ui/ui'
```

This reflects how consumers use the library and ensures the built `dist/` is exercised.

### Changes Required

1. **`packages/docs/.storybook/main.ts`** — update the stories glob:
   ```ts
   // before
   stories: ['../../react/src/**/*.stories.@(ts|tsx)']
   // after
   stories: ['../src/**/*.stories.@(ts|tsx)']
   ```

2. **`packages/docs/tsconfig.json`** — ensure `src/**` is included so TypeScript resolves `@solo-ui/ui` imports in stories.

3. **Move files** — `packages/react/src/components/ui/Card/Card.stories.tsx` → `packages/docs/src/components/ui/Card/Card.stories.tsx`.

4. **Update `packages/react/CLAUDE.md`** — remove the mention of colocated stories.

5. **Update `packages/docs/CLAUDE.md`** — document the `src/components/ui/<ComponentName>/` pattern.

## Out of Scope

- Moving or changing the component implementations in `packages/react/src`
- Changing how components are exported from `@solo-ui/ui`
- Adding new stories or modifying existing story content
