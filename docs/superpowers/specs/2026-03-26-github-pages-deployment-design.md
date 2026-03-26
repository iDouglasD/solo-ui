# GitHub Pages Deployment — Design Spec

**Date:** 2026-03-26
**Status:** Draft

## Goal

Publish the Storybook (`@solo-ui/docs`) to GitHub Pages at `https://idouglasd.github.io/solo-ui/` automatically on every push to `main`.

## Approach

Use the native GitHub Pages deployment method via `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`. No `gh-pages` branch, no third-party actions.

## Changes

### 1. `packages/docs/.storybook/main.ts`

Set `config.base = '/solo-ui/'` inside `viteFinal` using `config.mode === 'production'` — this is reliably set by Vite during a production build (which `storybook build` triggers). Do not use `process.env.NODE_ENV`, as it is not guaranteed to be set to `'production'` in CI.

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

### 2. `.github/workflows/deploy-pages.yml`

New workflow triggered on push to `main`:

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

**Build order rationale:** `@solo-ui/tokens` must be pre-built (CSS tokens). `@solo-ui/ui` is resolved directly via source alias in `main.ts`, but is pre-built for consistency with `pr.yml`. `@solo-ui/docs` runs last.

**Permissions:** `contents: read`, `pages: write`, `id-token: write` — minimum required for OIDC-based Pages deployment.

**Concurrency:** group `pages`, `cancel-in-progress: true` — prevents duplicate deploys on rapid pushes to `main`.

### 3. Manual GitHub configuration (one-time)

In **Settings → Pages → Source**, select **"GitHub Actions"**. No `.nojekyll` file needed — handled automatically by `upload-pages-artifact`.

## Constraints

- Storybook version: 10 (`@storybook/react-vite`)
- Node: 22, pnpm: 10.7.0 (matches existing `pr.yml`)
- No custom domain

## Out of Scope

- NPM package publishing
- Preview deployments on PRs
- Custom domain / CNAME
