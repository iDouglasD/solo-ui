# GitHub Pages Deployment — Design Spec

**Date:** 2026-03-26
**Status:** Approved

## Goal

Publish the Storybook (`@solo-ui/docs`) to GitHub Pages at `https://idouglasd.github.io/solo-ui/` automatically on every push to `main`.

## Approach

Use the native GitHub Pages deployment method via `actions/upload-pages-artifact` and `actions/deploy-pages`. No `gh-pages` branch, no third-party actions.

## Changes

### 1. `packages/docs/.storybook/main.ts`

Set `config.base = '/solo-ui/'` inside `viteFinal` when `NODE_ENV === 'production'`. This ensures all Storybook assets are referenced with the correct path prefix on GitHub Pages.

```ts
viteFinal: async (config) => {
  if (process.env.NODE_ENV === 'production') {
    config.base = '/solo-ui/'
  }
  // existing plugins and alias config
}
```

### 2. `.github/workflows/deploy-pages.yml`

New workflow triggered on push to `main`:

- Installs dependencies with `pnpm --frozen-lockfile`
- Builds packages in order: `@solo-ui/tokens` → `@solo-ui/ui` → `@solo-ui/docs`
- Uploads `packages/docs/storybook-static` as a Pages artifact
- Deploys via `actions/deploy-pages@v4`

Permissions: `contents: read`, `pages: write`, `id-token: write` (minimum required).

Concurrency: group `pages`, cancel-in-progress — prevents duplicate deploys on rapid pushes.

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
