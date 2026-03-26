# GitHub Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy Storybook automatically to `https://idouglasd.github.io/solo-ui/` on every push to `main` using native GitHub Pages Actions.

**Architecture:** Two changes — a `config.base` addition to `viteFinal` in the Storybook config so assets are served under the correct path prefix, and a new GitHub Actions workflow that builds the monorepo packages in order and publishes the static output via `upload-pages-artifact` + `deploy-pages`.

**Tech Stack:** Storybook 10, Vite, pnpm 10.7.0, Node 22, GitHub Actions (`actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`)

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `packages/docs/.storybook/main.ts` | Add `config.base = '/solo-ui/'` in production builds |
| Create | `.github/workflows/deploy-pages.yml` | CI workflow: build + deploy to GitHub Pages |

---

### Task 1: Add base URL to Storybook Vite config

**Files:**
- Modify: `packages/docs/.storybook/main.ts:12-21`

- [ ] **Step 1: Verify current build output has no base prefix**

Run a production build and confirm assets use `/` as base:

```bash
pnpm build --filter @solo-ui/tokens --filter @solo-ui/ui && pnpm build --filter @solo-ui/docs
grep -r "assets/" packages/docs/storybook-static/index.html | head -5
```

Expected: asset paths like `assets/main-XXX.js` (no `/solo-ui/` prefix).

- [ ] **Step 2: Add `config.base` to `viteFinal`**

Edit `packages/docs/.storybook/main.ts`. Replace the existing `viteFinal` function:

```ts
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
```

- [ ] **Step 3: Rebuild and verify base prefix is applied**

```bash
pnpm build --filter @solo-ui/docs
grep -r "assets/" packages/docs/storybook-static/index.html | head -5
```

Expected: asset paths now include `/solo-ui/assets/main-XXX.js`.

- [ ] **Step 4: Verify dev mode is unaffected**

```bash
pnpm --filter @solo-ui/docs dev &
sleep 5
curl -s http://localhost:6006 | grep -o 'src="[^"]*"' | head -3
kill %1
```

Expected: dev assets use `/` (no `/solo-ui/` prefix) — `config.mode` is `'development'` in dev.

- [ ] **Step 5: Commit**

```bash
git add packages/docs/.storybook/main.ts
git commit -m "feat(docs): set base URL to /solo-ui/ for GitHub Pages"
```

---

### Task 2: Create GitHub Actions deployment workflow

**Files:**
- Create: `.github/workflows/deploy-pages.yml`

- [ ] **Step 1: Create the workflow file**

Create `.github/workflows/deploy-pages.yml` with this exact content:

```yaml
name: Deploy Storybook to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10.7.0

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm build --filter @solo-ui/tokens --filter @solo-ui/ui

      - name: Build Storybook
        run: pnpm build --filter @solo-ui/docs

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: packages/docs/storybook-static

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Validate YAML syntax**

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy-pages.yml'))" && echo "YAML valid"
```

Expected: `YAML valid`

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy-pages.yml
git commit -m "feat(ci): add GitHub Pages deployment workflow for Storybook"
```

---

### Task 3: Enable GitHub Pages in repository settings (manual)

- [ ] **Step 1: Go to repository settings**

Open `https://github.com/iDouglasD/solo-ui/settings/pages`

- [ ] **Step 2: Set source to GitHub Actions**

Under **Build and deployment → Source**, select **"GitHub Actions"**.

Save. No branch or folder selection is needed.

- [ ] **Step 3: Verify deployment triggered**

After the commit from Task 2 is pushed to `main`, check the workflow run at:
`https://github.com/iDouglasD/solo-ui/actions/workflows/deploy-pages.yml`

Expected: workflow completes successfully and the deployment URL is `https://idouglasd.github.io/solo-ui/`.
