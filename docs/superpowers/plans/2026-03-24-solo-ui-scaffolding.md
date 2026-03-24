# Solo UI Monorepo Scaffolding — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the solo-ui Turborepo monorepo with 5 packages (lint-config, ts-config, tokens, react, docs), all tooling configured, and build pipeline functional end-to-end.

**Architecture:** Turborepo monorepo with pnpm workspaces. Config-only packages (lint-config, ts-config) are consumed by buildable packages (tokens, react) and docs (Storybook 8). tsup bundles library packages. Biome handles linting and formatting. Changesets manages fixed versioning.

**Tech Stack:** Turborepo, pnpm, tsup, Biome, Storybook 8 (react-vite), Changesets, TypeScript, React 19

---

## File Map

```
solo-ui/
├── package.json                          # Root: private, turbo scripts, devDeps
├── pnpm-workspace.yaml                   # Workspace: packages/*
├── turbo.json                            # Pipelines: build, lint, format, dev
├── biome.json                            # Root biome extending lint-config
├── .changeset/
│   └── config.json                       # Fixed versioning config
├── .gitignore                            # Node, dist, turbo, storybook ignores
├── LICENSE                               # (exists)
├── packages/
│   ├── lint-config/
│   │   ├── package.json                  # @solo-ui/lint-config
│   │   └── biome.json                    # Shared biome rules
│   ├── ts-config/
│   │   ├── package.json                  # @solo-ui/ts-config
│   │   ├── base.json                     # Base TS config
│   │   └── react.json                    # React TS config (extends base)
│   ├── tokens/
│   │   ├── package.json                  # @solo-ui/tokens
│   │   ├── tsconfig.json                 # Extends ts-config/base.json
│   │   ├── tsup.config.ts                # ESM + CJS output
│   │   └── src/
│   │       └── index.ts                  # Placeholder export
│   ├── react/
│   │   ├── package.json                  # @solo-ui/react
│   │   ├── tsconfig.json                 # Extends ts-config/react.json
│   │   ├── tsup.config.ts                # ESM + CJS + "use client" banner
│   │   └── src/
│   │       └── index.ts                  # Placeholder export
│   └── docs/
│       ├── package.json                  # @solo-ui/docs (private)
│       ├── tsconfig.json                 # Extends ts-config/react.json
│       └── .storybook/
│           ├── main.ts                   # Storybook config (react-vite)
│           └── preview.ts                # Storybook preview config
```

---

## Task 1: Initialize root package.json and pnpm workspace

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `.gitignore`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "solo-ui",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "turbo run format"
  },
  "devDependencies": {
    "turbo": "latest"
  },
  "packageManager": "pnpm@10.7.0"
}
```

- [ ] **Step 2: Create pnpm-workspace.yaml**

```yaml
packages:
  - "packages/*"
```

- [ ] **Step 3: Create .gitignore**

```
node_modules
dist
.turbo
*.tsbuildinfo
storybook-static
```

- [ ] **Step 4: Install turbo**

Run: `pnpm install`
Expected: `pnpm-lock.yaml` created, `turbo` installed in `node_modules`

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml pnpm-lock.yaml .gitignore
git commit -m "chore(root): initialize pnpm workspace and turborepo"
```

---

## Task 2: Create lint-config package (Biome shared config)

**Files:**
- Create: `packages/lint-config/package.json`
- Create: `packages/lint-config/biome.json`

- [ ] **Step 1: Create packages/lint-config/package.json**

```json
{
  "name": "@solo-ui/lint-config",
  "version": "0.0.0",
  "private": false,
  "license": "MIT",
  "files": ["biome.json"],
  "devDependencies": {
    "@biomejs/biome": "latest"
  }
}
```

- [ ] **Step 2: Create packages/lint-config/biome.json**

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "files": {
    "ignore": ["**/node_modules/**", "**/dist/**"]
  },
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true,
    "defaultBranch": "main"
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error"
      },
      "style": {
        "useConst": "error",
        "noVar": "error"
      },
      "a11y": {
        "recommended": true
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "semicolons": "asNeeded",
      "trailingCommas": "all",
      "arrowParentheses": "always"
    }
  },
  "json": {
    "formatter": {
      "indentStyle": "space",
      "indentWidth": 2
    }
  }
}
```

- [ ] **Step 3: Install dependencies**

Run: `pnpm install`

- [ ] **Step 4: Commit**

```bash
git add packages/lint-config/ pnpm-lock.yaml
git commit -m "feat(lint-config): add shared biome configuration"
```

---

## Task 3: Create root biome.json extending lint-config

**Files:**
- Create: `biome.json` (root)

- [ ] **Step 1: Create root biome.json**

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "extends": ["@solo-ui/lint-config/biome"]
}
```

- [ ] **Step 2: Add lint and format scripts to all packages**

Add to root `package.json` devDependencies:
```json
"@solo-ui/lint-config": "workspace:*"
```

- [ ] **Step 3: Install and verify**

Run: `pnpm install`

- [ ] **Step 4: Commit**

```bash
git add biome.json package.json pnpm-lock.yaml
git commit -m "chore(root): extend shared biome config"
```

---

## Task 4: Create ts-config package

**Files:**
- Create: `packages/ts-config/package.json`
- Create: `packages/ts-config/base.json`
- Create: `packages/ts-config/react.json`

- [ ] **Step 1: Create packages/ts-config/package.json**

```json
{
  "name": "@solo-ui/ts-config",
  "version": "0.0.0",
  "private": false,
  "license": "MIT",
  "files": ["base.json", "react.json"]
}
```

- [ ] **Step 2: Create packages/ts-config/base.json**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create packages/ts-config/react.json**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
```

- [ ] **Step 4: Install**

Run: `pnpm install`

- [ ] **Step 5: Commit**

```bash
git add packages/ts-config/ pnpm-lock.yaml
git commit -m "feat(ts-config): add shared typescript configurations"
```

---

## Task 5: Create tokens package

**Files:**
- Create: `packages/tokens/package.json`
- Create: `packages/tokens/tsconfig.json`
- Create: `packages/tokens/tsup.config.ts`
- Create: `packages/tokens/src/index.ts`

- [ ] **Step 1: Create packages/tokens/package.json**

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
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "lint": "biome check .",
    "format": "biome format --write ."
  },
  "devDependencies": {
    "@solo-ui/ts-config": "workspace:*",
    "tsup": "latest",
    "typescript": "latest",
    "@biomejs/biome": "latest"
  }
}
```

- [ ] **Step 2: Create packages/tokens/tsconfig.json**

```json
{
  "extends": "@solo-ui/ts-config/base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create packages/tokens/tsup.config.ts**

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
})
```

- [ ] **Step 4: Create packages/tokens/src/index.ts**

```typescript
export const tokens = {} as const
```

- [ ] **Step 5: Install and test build**

Run: `pnpm install && pnpm --filter @solo-ui/tokens build`
Expected: `dist/` folder created with `index.js`, `index.cjs`, `index.d.ts`

- [ ] **Step 6: Commit**

```bash
git add packages/tokens/ pnpm-lock.yaml
git commit -m "feat(tokens): scaffold tokens package with tsup build"
```

---

## Task 6: Create react package

**Files:**
- Create: `packages/react/package.json`
- Create: `packages/react/tsconfig.json`
- Create: `packages/react/tsup.config.ts`
- Create: `packages/react/src/index.ts`

- [ ] **Step 1: Create packages/react/package.json**

```json
{
  "name": "@solo-ui/react",
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
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "lint": "biome check .",
    "format": "biome format --write ."
  },
  "dependencies": {
    "@solo-ui/tokens": "workspace:*"
  },
  "devDependencies": {
    "@solo-ui/ts-config": "workspace:*",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "react": "latest",
    "tsup": "latest",
    "typescript": "latest",
    "@biomejs/biome": "latest"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

- [ ] **Step 2: Create packages/react/tsconfig.json**

```json
{
  "extends": "@solo-ui/ts-config/react.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create packages/react/tsup.config.ts**

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  banner: {
    js: "'use client'",
  },
})
```

- [ ] **Step 4: Create packages/react/src/index.ts**

```typescript
export {}
```

- [ ] **Step 5: Install and test build**

Run: `pnpm install && pnpm --filter @solo-ui/react build`
Expected: `dist/` folder created with `index.js` (containing `'use client'` banner), `index.cjs`, `index.d.ts`

- [ ] **Step 6: Commit**

```bash
git add packages/react/ pnpm-lock.yaml
git commit -m "feat(react): scaffold react package with tsup build and use client banner"
```

---

## Task 7: Create docs package (Storybook 8)

**Files:**
- Create: `packages/docs/package.json`
- Create: `packages/docs/tsconfig.json`
- Create: `packages/docs/.storybook/main.ts`
- Create: `packages/docs/.storybook/preview.ts`

- [ ] **Step 1: Create packages/docs/package.json**

```json
{
  "name": "@solo-ui/docs",
  "version": "0.0.0",
  "private": true,
  "license": "MIT",
  "type": "module",
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build",
    "lint": "biome check .",
    "format": "biome format --write ."
  },
  "dependencies": {
    "@solo-ui/react": "workspace:*",
    "@solo-ui/tokens": "workspace:*"
  },
  "devDependencies": {
    "@solo-ui/ts-config": "workspace:*",
    "@storybook/react": "latest",
    "@storybook/react-vite": "latest",
    "storybook": "latest",
    "react": "latest",
    "react-dom": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "typescript": "latest",
    "@biomejs/biome": "latest"
  }
}
```

- [ ] **Step 2: Create packages/docs/tsconfig.json**

```json
{
  "extends": "@solo-ui/ts-config/react.json",
  "include": [".storybook/**/*"]
}
```

- [ ] **Step 3: Create packages/docs/.storybook/main.ts**

```typescript
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../../react/src/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/react-vite',
}

export default config
```

- [ ] **Step 4: Create packages/docs/.storybook/preview.ts**

```typescript
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

- [ ] **Step 5: Install**

Run: `pnpm install`

- [ ] **Step 6: Commit**

```bash
git add packages/docs/ pnpm-lock.yaml
git commit -m "feat(docs): scaffold storybook 8 with react-vite framework"
```

---

## Task 8: Configure Turborepo pipelines

**Files:**
- Create: `turbo.json`

- [ ] **Step 1: Create turbo.json**

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "storybook-static/**"]
    },
    "lint": {
      "outputs": []
    },
    "format": {
      "cache": false
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    }
  }
}
```

- [ ] **Step 2: Test full build pipeline**

Run: `pnpm build`
Expected: tokens builds first, then react, then docs — all succeed

- [ ] **Step 3: Test lint**

Run: `pnpm lint`
Expected: biome check runs across all packages

- [ ] **Step 4: Commit**

```bash
git add turbo.json
git commit -m "chore(turbo): configure build, lint, format, and dev pipelines"
```

---

## Task 9: Configure Changesets (fixed versioning)

**Files:**
- Create: `.changeset/config.json`
- Modify: `package.json` (root — add changeset scripts and devDep)

- [ ] **Step 1: Install changesets**

Run: `pnpm add -Dw @changesets/cli`

- [ ] **Step 2: Create .changeset/config.json**

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [["@solo-ui/*"]],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@solo-ui/docs"]
}
```

- [ ] **Step 3: Add changeset scripts to root package.json**

Add to `scripts`:
```json
"changeset": "changeset",
"version-packages": "changeset version",
"release": "pnpm build && changeset publish"
```

- [ ] **Step 4: Install**

Run: `pnpm install`

- [ ] **Step 5: Commit**

```bash
git add .changeset/ package.json pnpm-lock.yaml
git commit -m "chore(changeset): configure fixed versioning for all public packages"
```

---

## Task 10: End-to-end verification

- [ ] **Step 1: Clean and rebuild everything**

Run: `pnpm build`
Expected: All packages build successfully in correct order (tokens → react → docs)

- [ ] **Step 2: Run lint across monorepo**

Run: `pnpm lint`
Expected: All packages pass linting

- [ ] **Step 3: Run format**

Run: `pnpm format`
Expected: Biome formats all files

- [ ] **Step 4: Verify changeset works**

Run: `pnpm changeset status`
Expected: No changesets found (clean state)

- [ ] **Step 5: Final commit (if any formatting changes)**

```bash
git add -A
git commit -m "style(root): apply biome formatting across monorepo"
```
