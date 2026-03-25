# Stories Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all Storybook stories from `packages/react/src/` into `packages/docs/src/`, so the component library contains only source code and the docs package owns all documentation.

**Architecture:** Stories are recreated at `packages/docs/src/components/ui/<ComponentName>/` mirroring the component path. The Storybook glob and TypeScript config are updated to point at the new location. Component imports in stories switch from relative (`'.'`) to package name (`'@solo-ui/ui'`).

**Tech Stack:** Storybook 10, `@storybook/react-vite`, TypeScript, pnpm workspaces, Turborepo

---

## File Map

| Action | Path |
|--------|------|
| Modify | `packages/docs/.storybook/main.ts` |
| Modify | `packages/docs/tsconfig.json` |
| Create | `packages/docs/src/components/ui/Card/Card.stories.tsx` |
| Delete | `packages/react/src/components/ui/Card/Card.stories.tsx` |
| Modify | `packages/react/CLAUDE.md` |
| Modify | `packages/docs/CLAUDE.md` |

---

### Task 1: Update Storybook glob and TypeScript config

**Files:**
- Modify: `packages/docs/.storybook/main.ts`
- Modify: `packages/docs/tsconfig.json`

- [ ] **Step 1: Update the stories glob in `main.ts`**

  In `packages/docs/.storybook/main.ts`, change:
  ```ts
  stories: ['../../react/src/**/*.stories.@(ts|tsx)'],
  ```
  to:
  ```ts
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  ```

- [ ] **Step 2: Update `tsconfig.json` to include `src/**/*`**

  Replace the entire contents of `packages/docs/tsconfig.json`:
  ```json
  {
    "extends": "@solo-ui/ts-config/react.json",
    "include": [".storybook/**/*", "src/**/*"]
  }
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add packages/docs/.storybook/main.ts packages/docs/tsconfig.json
  git commit -m "chore(docs): update storybook glob and tsconfig for src/ stories"
  ```

---

### Task 2: Move Card story to docs

**Files:**
- Create: `packages/docs/src/components/ui/Card/Card.stories.tsx`
- Delete: `packages/react/src/components/ui/Card/Card.stories.tsx`

- [ ] **Step 1: Create the new story file**

  Create `packages/docs/src/components/ui/Card/Card.stories.tsx` with the following content (same as the original, with the import updated):

  ```tsx
  import type { Meta, StoryObj } from '@storybook/react'
  import { Card } from '@solo-ui/ui'

  const meta: Meta<typeof Card> = {
    title: 'UI/Card',
    component: Card,
    parameters: {
      layout: 'centered',
      backgrounds: {
        default: 'dark',
        values: [{ name: 'dark', value: '#0d0d0d' }],
      },
    },
  }

  export default meta
  type Story = StoryObj<typeof Card>

  export const Default: Story = {
    render: () => (
      <Card style={{ width: 400 }}>
        <Card.Header
          title="git — conventional commits"
          description="// o custo real de um histórico de git bagunçado"
        />
        <Card.Content>
          <p className="text-muted text-xs">Conteúdo livre do card.</p>
        </Card.Content>
        <Card.Footer>5 commits</Card.Footer>
      </Card>
    ),
  }

  export const SemFooter: Story = {
    render: () => (
      <Card style={{ width: 400 }}>
        <Card.Header
          title="git — conventional commits"
          description="// o custo real de um histórico de git bagunçado"
        />
        <Card.Content>
          <p className="text-muted text-xs">Card sem footer.</p>
        </Card.Content>
      </Card>
    ),
  }

  export const SemDescricao: Story = {
    render: () => (
      <Card style={{ width: 400 }}>
        <Card.Header title="apenas título" />
        <Card.Content>
          <p className="text-muted text-xs">Header sem description.</p>
        </Card.Content>
      </Card>
    ),
  }
  ```

- [ ] **Step 2: Delete the original story file**

  ```bash
  rm packages/react/src/components/ui/Card/Card.stories.tsx
  ```

- [ ] **Step 3: Verify Storybook builds**

  ```bash
  pnpm build --filter @solo-ui/ui
  pnpm --filter @solo-ui/docs build
  ```

  Expected: build completes with no errors and `storybook-static/` is generated. If it fails with "Cannot find module '@solo-ui/ui'", run `pnpm build --filter @solo-ui/ui` first.

- [ ] **Step 4: Commit**

  ```bash
  git add packages/docs/src/components/ui/Card/Card.stories.tsx
  git rm packages/react/src/components/ui/Card/Card.stories.tsx
  git commit -m "feat(docs): move Card stories from react to docs package"
  ```

---

### Task 3: Update CLAUDE.md documentation

**Files:**
- Modify: `packages/react/CLAUDE.md`
- Modify: `packages/docs/CLAUDE.md`

- [ ] **Step 1: Update `packages/react/CLAUDE.md` — Component Conventions**

  In the `## Component Conventions` section, replace:
  ```
  - Stories colocated: `src/components/ui/<ComponentName>/<ComponentName>.stories.tsx`
  ```
  with:
  ```
  - Stories live in `@solo-ui/docs` — see `packages/docs/src/components/ui/<ComponentName>/`
  ```

- [ ] **Step 2: Update `packages/react/CLAUDE.md` — Adding Components steps**

  In the `## Adding Components` section, replace the four-step list:
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

- [ ] **Step 3: Update `packages/docs/CLAUDE.md` — Stack section**

  In the `## Stack` section, replace the two lines:
  ```
  - Stories live in `packages/react/src/` (not here)
  - This package only contains Storybook configuration
  ```
  with:
  ```
  - Stories live in `src/components/ui/<ComponentName>/`, imported via `@solo-ui/ui`
  ```

- [ ] **Step 4: Update `packages/docs/CLAUDE.md` — Stories Location section**

  Replace the entire `## Stories Location` section (from the heading line through and including the blank line after the glob code block's closing triple-backtick) with:

  ```
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

- [ ] **Step 5: Update `packages/docs/CLAUDE.md` — Running section**

  After the closing triple-backtick of the bash block in `## Running` (before `## Building`), add:

  ```
  > When running directly with `--filter`, ensure `@solo-ui/ui` is built first:
  > `pnpm build --filter @solo-ui/ui`
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add packages/react/CLAUDE.md packages/docs/CLAUDE.md
  git commit -m "docs: update CLAUDE.md files to reflect stories location change"
  ```
