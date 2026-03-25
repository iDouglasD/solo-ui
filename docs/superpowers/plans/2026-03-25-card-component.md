# Card Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Card composition component in `@solo-ui/ui` with terminal/hacker dark mode aesthetic, Tailwind v4, CVA, and design tokens from `@solo-ui/tokens`.

**Architecture:** Color tokens are defined in `@solo-ui/tokens` (TS + CSS) and consumed by `@solo-ui/ui` via a Tailwind v4 `@theme` block. The `@solo-ui/ui` package ships a pre-compiled `dist/styles.css` so consumers don't need Tailwind configured. Storybook builds Tailwind from source for development.

**Tech Stack:** React 19, Tailwind CSS v4, CVA (class-variance-authority), clsx, tailwind-merge, tsup, @tailwindcss/cli, @tailwindcss/vite, Storybook 10.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `packages/tokens/src/colors.ts` | Create | Color token constants (TS source of truth) |
| `packages/tokens/styles/tokens.css` | Create | CSS `@theme` block consumed by Tailwind |
| `packages/tokens/src/index.ts` | Modify | Re-export `colors` |
| `packages/tokens/package.json` | Modify | Add `"styles"` to `files`, add CSS export path |
| `packages/react/package.json` | Modify | Rename to `@solo-ui/ui`, update exports + build script, add new deps |
| `packages/docs/package.json` | Modify | Update `@solo-ui/react` dep to `@solo-ui/ui` |
| `packages/docs/CLAUDE.md` | Modify | Update `@solo-ui/react` reference |
| `packages/react/src/lib/cn.ts` | Create | `cn()` utility (clsx + tailwind-merge) |
| `packages/react/src/styles/index.css` | Create | Tailwind CSS entry point for package build |
| `packages/react/src/components/ui/Card/index.tsx` | Create | Card + Card.Header + Card.Content + Card.Footer |
| `packages/react/src/index.ts` | Modify | Re-export Card |
| `packages/docs/.storybook/main.ts` | Modify | Add `viteFinal` with `@tailwindcss/vite` plugin |
| `packages/docs/.storybook/preview.ts` | Modify | Import global styles CSS |
| `packages/docs/styles.css` | Create | Storybook global CSS (Tailwind + tokens import) |
| `packages/react/src/components/ui/Card/Card.stories.tsx` | Create | Card Storybook stories |

---

## Task 1: Add color tokens to `@solo-ui/tokens`

**Files:**
- Create: `packages/tokens/src/colors.ts`
- Create: `packages/tokens/styles/tokens.css`
- Modify: `packages/tokens/src/index.ts`
- Modify: `packages/tokens/package.json`

- [ ] **Step 1: Create the color constants file**

Create `packages/tokens/src/colors.ts`:

```ts
export const colors = {
  base: '#0d0d0d',
  surface: '#111111',
  elevated: '#1a1a1a',
  border: '#222222',
  muted: '#444444',
  subtle: '#666666',
  primary: '#cccccc',
  accent: '#00ff41',
} as const
```

- [ ] **Step 2: Create the CSS theme file**

Create `packages/tokens/styles/tokens.css` (note: `styles/` is at package root, not inside `src/`):

```css
@theme {
  --color-base: #0d0d0d;
  --color-surface: #111111;
  --color-elevated: #1a1a1a;
  --color-border: #222222;
  --color-muted: #444444;
  --color-subtle: #666666;
  --color-primary: #cccccc;
  --color-accent: #00ff41;
}
```

- [ ] **Step 3: Re-export colors from the package entry**

Replace the contents of `packages/tokens/src/index.ts` (the existing `export const tokens = {} as const` is a placeholder — remove it):

```ts
export { colors } from './colors'
```

- [ ] **Step 4: Update `packages/tokens/package.json`**

Add `"styles"` to `files` and the CSS export path:

```json
{
  "name": "@solo-ui/tokens",
  "version": "0.0.0",
  "private": false,
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./styles/tokens.css": "./styles/tokens.css"
  },
  "files": [
    "dist",
    "styles"
  ],
  "scripts": {
    "build": "tsup",
    "lint": "biome check .",
    "format": "biome format --write ."
  },
  "devDependencies": {
    "@solo-ui/ts-config": "workspace:*",
    "tsup": "^8.5.1",
    "typescript": "^6.0.2",
    "@biomejs/biome": "^2.4.8"
  }
}
```

- [ ] **Step 5: Build tokens to verify TS compiles**

Run from repo root:
```bash
pnpm --filter @solo-ui/tokens build
```
Expected: `packages/tokens/dist/` is created with `index.js`, `index.cjs`, `index.d.ts`. No errors.

- [ ] **Step 6: Commit**

```bash
git add packages/tokens/src/colors.ts packages/tokens/styles/tokens.css packages/tokens/src/index.ts packages/tokens/package.json
git commit -m "feat(tokens): add color palette tokens with CSS theme"
```

---

## Task 2: Rename `@solo-ui/react` → `@solo-ui/ui` and add dependencies

**Files:**
- Modify: `packages/react/package.json`
- Modify: `packages/docs/package.json`
- Modify: `packages/docs/CLAUDE.md`

- [ ] **Step 1: Install new runtime dependencies**

Run from repo root:
```bash
pnpm add class-variance-authority clsx tailwind-merge --filter @solo-ui/react
```

- [ ] **Step 2: Install build dependencies for the CSS step**

```bash
pnpm add -D tailwindcss @tailwindcss/cli --filter @solo-ui/react
```

After installing, check the exact versions added to `packages/react/package.json` and confirm they follow `^X.Y.Z` convention.

- [ ] **Step 3: Update `packages/react/package.json`**

Apply these changes (keep all existing devDeps, just update name, exports, and scripts):

```json
{
  "name": "@solo-ui/ui",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./styles.css": "./dist/styles.css"
  },
  "scripts": {
    "build": "tsup && tailwindcss -i src/styles/index.css -o dist/styles.css --minify",
    "lint": "biome check .",
    "format": "biome format --write ."
  }
}
```

- [ ] **Step 4: Update `packages/docs/package.json`**

Change the dependency reference from `@solo-ui/react` to `@solo-ui/ui`:

```json
"dependencies": {
  "@solo-ui/ui": "workspace:*",
  "@solo-ui/tokens": "workspace:*"
}
```

- [ ] **Step 5: Update `packages/docs/CLAUDE.md`**

Find all references to `@solo-ui/react` and replace with `@solo-ui/ui`. The stories location example uses `packages/react/src/` — that directory path stays the same, only the package name reference changes.

- [ ] **Step 6: Run `pnpm install` to sync the lockfile**

```bash
pnpm install
```
Expected: lockfile updated, no errors. The package `@solo-ui/ui` resolves to `packages/react/`.

- [ ] **Step 7: Commit**

```bash
git add packages/react/package.json packages/docs/package.json packages/docs/CLAUDE.md pnpm-lock.yaml
git commit -m "chore(react): rename package to @solo-ui/ui and add styling deps"
```

---

## Task 3: Add `cn()` utility and CSS entry point

**Files:**
- Create: `packages/react/src/lib/cn.ts`
- Create: `packages/react/src/styles/index.css`

- [ ] **Step 1: Create `cn()` utility**

Create `packages/react/src/lib/cn.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Create Tailwind CSS entry point**

Create `packages/react/src/styles/index.css`:

```css
@import "tailwindcss";
@import "@solo-ui/tokens/styles/tokens.css";
```

- [ ] **Step 3: Verify lint passes**

```bash
pnpm --filter @solo-ui/ui lint
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/react/src/lib/cn.ts packages/react/src/styles/index.css
git commit -m "feat(ui): add cn utility and Tailwind CSS entry point"
```

---

## Task 4: Implement the Card component

**Files:**
- Create: `packages/react/src/components/ui/Card/index.tsx`
- Modify: `packages/react/src/index.ts`

- [ ] **Step 1: Create the Card component**

Create `packages/react/src/components/ui/Card/index.tsx`:

```tsx
import { type VariantProps, cva } from 'class-variance-authority'
import type React from 'react'
import { cn } from '../../../lib/cn'

// ─── Variants ───────────────────────────────────────────────────────────────

const cardVariants = cva('rounded-lg border overflow-hidden font-mono text-sm', {
  variants: {
    variant: {
      default: 'bg-surface border-border text-primary',
    },
  },
  defaultVariants: { variant: 'default' },
})

// ─── Card (root) ─────────────────────────────────────────────────────────────

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, children, ...rest }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...rest}>
      {children}
    </div>
  )
}

// ─── Card.Header ─────────────────────────────────────────────────────────────

interface CardHeaderProps {
  title: string
  description?: string
  className?: string
}

function CardHeader({ title, description, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'bg-elevated border-b border-border px-4 py-3',
        className,
      )}
    >
      {/* Traffic-light dots — decorative */}
      <div className="flex items-center gap-2 mb-3" aria-hidden="true">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-subtle text-xs">{title}</span>
      </div>
      {description && (
        <p className="text-muted text-xs">{description}</p>
      )}
    </div>
  )
}

// ─── Card.Content ────────────────────────────────────────────────────────────

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  )
}

// ─── Card.Footer ─────────────────────────────────────────────────────────────

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        'px-4 py-3 border-t border-border text-muted text-xs',
        className,
      )}
    >
      {children}
    </div>
  )
}

// ─── Composition ─────────────────────────────────────────────────────────────

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export { Card }
export type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps }
```

- [ ] **Step 2: Export Card from the package entry**

Update `packages/react/src/index.ts`:

```ts
export { Card } from './components/ui/Card'
export type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps } from './components/ui/Card'
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm --filter @solo-ui/ui build
```
Expected: `dist/` created with `index.js`, `index.cjs`, `index.d.ts`, and `styles.css`. No type errors.

> **Note on the CSS build:** The build script runs `tsup` (cleans dist) then `tailwindcss -i src/styles/index.css -o dist/styles.css --minify`. If `tailwindcss` command is not found, check that `@tailwindcss/cli` is in devDeps and use `npx tailwindcss` or add `./node_modules/.bin/tailwindcss` to PATH. In Tailwind v4 the CLI binary may be provided by the `tailwindcss` package directly — verify after install.

- [ ] **Step 4: Verify lint**

```bash
pnpm --filter @solo-ui/ui lint
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/components/ui/Card/index.tsx packages/react/src/index.ts
git commit -m "feat(ui): implement Card composition component"
```

---

## Task 5: Set up Tailwind v4 in Storybook

**Files:**
- Modify: `packages/docs/.storybook/main.ts`
- Modify: `packages/docs/.storybook/preview.ts`
- Create: `packages/docs/styles.css`

- [ ] **Step 1: Install Tailwind deps in the docs package**

```bash
pnpm add -D tailwindcss @tailwindcss/vite --filter @solo-ui/docs
```

After installing, confirm versions follow `^X.Y.Z` in `packages/docs/package.json`.

- [ ] **Step 2: Update `.storybook/main.ts` to add Tailwind plugin**

Replace the contents of `packages/docs/.storybook/main.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../../react/src/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    return config
  },
}

export default config
```

- [ ] **Step 3: Create global Storybook CSS**

Create `packages/docs/styles.css`:

```css
@import "tailwindcss";
@import "@solo-ui/tokens/styles/tokens.css";
```

- [ ] **Step 4: Import global CSS in Storybook preview**

Update `packages/docs/.storybook/preview.ts`:

```ts
import '../styles.css'
import type { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

- [ ] **Step 5: Start Storybook to verify the setup works**

```bash
pnpm dev
```

Expected: Storybook opens on `http://localhost:6006`. No build errors. (No stories yet — that's fine.)

- [ ] **Step 6: Commit**

```bash
git add packages/docs/.storybook/main.ts packages/docs/.storybook/preview.ts packages/docs/styles.css packages/docs/package.json pnpm-lock.yaml
git commit -m "chore(docs): add Tailwind v4 setup to Storybook"
```

---

## Task 6: Write Card stories

**Files:**
- Create: `packages/react/src/components/ui/Card/Card.stories.tsx`

- [ ] **Step 1: Create the stories file**

Create `packages/react/src/components/ui/Card/Card.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '.'

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

- [ ] **Step 2: Open Storybook and verify all 3 stories render correctly**

```bash
pnpm dev
```

Open `http://localhost:6006`. Navigate to `UI/Card`. Verify:
- `Default`: card with 3 dots, title, description (with `//`), content, footer
- `SemFooter`: no footer section visible
- `SemDescricao`: only title in header (no description line)
- Dark background applied, terminal aesthetic visible (monospace font, dark surface, subtle border)

- [ ] **Step 3: Commit**

```bash
git add packages/react/src/components/ui/Card/Card.stories.tsx
git commit -m "docs(ui): add Card stories to Storybook"
```

---

## Task 7: Full build verification

- [ ] **Step 1: Run the full monorepo build**

```bash
pnpm build
```

Expected: all packages build in order (`tokens` → `ui` → `docs`). No errors.

- [ ] **Step 2: Verify `dist/styles.css` exists**

```bash
ls packages/react/dist/
```

Expected: `index.js`, `index.cjs`, `index.d.ts`, `index.d.cts`, `index.js.map`, `index.cjs.map`, **`styles.css`** present.

- [ ] **Step 3: Spot-check `dist/styles.css` contains token variables and card classes**

Open `packages/react/dist/styles.css` and confirm it contains:
- `--color-surface`, `--color-elevated`, etc. (from `@theme`)
- Utility classes like `rounded-lg`, `border`, `font-mono` (Tailwind utilities used by Card)

---

## Task 8: Create changeset for package rename

- [ ] **Step 1: Create changeset**

```bash
pnpm changeset
```

At the prompts:
- **Changed packages:** select all public packages (`@solo-ui/tokens`, `@solo-ui/ui`, `@solo-ui/ts-config`, `@solo-ui/lint-config`) — fixed versioning bumps all together
- **Bump type:** major (breaking rename)
- **Summary:** `rename @solo-ui/react to @solo-ui/ui; add Card composition component with terminal dark mode aesthetic`

- [ ] **Step 2: Commit the changeset**

```bash
git add .changeset/
git commit -m "chore(changeset): major bump for @solo-ui/react → @solo-ui/ui rename and Card component"
```

---

## Done

At this point:
- `@solo-ui/tokens` ships color tokens as TS constants and a Tailwind v4 `@theme` CSS file
- `@solo-ui/ui` ships the Card component + pre-compiled `dist/styles.css`
- Storybook shows 3 Card stories with the terminal dark mode aesthetic
- A changeset is ready for versioning and publish
