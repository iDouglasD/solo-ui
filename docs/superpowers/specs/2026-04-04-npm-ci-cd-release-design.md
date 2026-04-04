# NPM CI/CD Release with Changesets

**Date:** 2026-04-04
**Status:** Approved

## Goal

Automate NPM publishing for `@solo-ds/ui` and `@solo-ds/tokens` using Changesets GitHub Action, with version control via the "Version Packages" PR flow.

## Release Flow

```
Developer adds changeset (pnpm changeset)
  → Push/merge to main
    → GitHub Action detects pending changesets
      → Creates/updates "Version Packages" PR (version bumps + CHANGELOGs)
        → Maintainer reviews and merges the PR
          → GitHub Action runs `pnpm release` (build + changeset publish)
            → Packages published to NPM
```

## Deliverables

### 1. `.github/workflows/release.yml`

New GitHub Actions workflow triggered on push to `main`.

**Behavior:**
- When pending changesets exist: creates/updates a PR titled `chore(release): version packages` with version bumps and CHANGELOG entries
- When no pending changesets (i.e., the Version Packages PR was just merged): runs `pnpm release` which builds all packages and publishes to NPM

**Full workflow YAML:**

```yaml
name: Release

on:
  push:
    branches:
      - main

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
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

      - name: Create Release Pull Request or Publish to NPM
        id: changesets
        uses: changesets/action@v1
        with:
          version: pnpm version-packages
          publish: pnpm release
          commit: "chore(release): version packages"
          title: "chore(release): version packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Key details:**
- Explicit `permissions` block for `contents: write` and `pull-requests: write` — required for repos with restricted default token permissions
- `--frozen-lockfile` on install, matching the existing `pr.yml` convention
- `cancel-in-progress: false` to avoid interrupting an in-progress publish

**Secrets required:**
- `GITHUB_TOKEN` — provided automatically by GitHub Actions
- `NPM_TOKEN` — must be manually configured (see section 3)

### 2. `.npmrc` (project root)

Required for `changeset publish` to authenticate with NPM in CI:

```
# Used by CI only — NPM_TOKEN is set as a GitHub Actions secret
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

This file uses environment variable interpolation — it does NOT contain the actual token. Safe to commit. Locally, if `NPM_TOKEN` is not set, pnpm may log a warning — this is harmless.

### 3. NPM Token Setup Guide (manual steps)

Steps the maintainer must follow before the workflow can publish:

1. Go to https://www.npmjs.com → Access Tokens → Generate New Token
2. Select **Granular Access Token**
3. Set permissions: **Read and Write** for packages under `@solo-ds` scope
4. Copy the generated token
5. Go to the GitHub repo → Settings → Secrets and variables → Actions
6. Create a new repository secret named `NPM_TOKEN` with the token value

## What Does NOT Change

- `.changeset/config.json` — already correctly configured (fixed versioning, public access, docs ignored)
- Root `package.json` scripts — `release`, `version-packages`, `changeset` already exist
- Existing workflows — `pr.yml` (lint/typecheck) and `deploy-pages.yml` (Storybook) remain untouched
- Package versions — remain at `0.0.0` until the first changeset is consumed

## Packages Affected by Releases

| Package | Published | Notes |
|---------|-----------|-------|
| `@solo-ds/ui` | Yes | `private: false` |
| `@solo-ds/tokens` | Yes | `private: false` |
| `@solo-ds/docs` | No | Ignored in changesets config |
| `@solo-ds/ts-config` | Yes | `private: false` (config package) |
| `@solo-ds/lint-config` | Yes | `private: false` (config package) |

## Success Criteria

1. Pushing a changeset to `main` triggers creation of a "Version Packages" PR
2. Merging that PR publishes the affected packages to NPM with correct versions
3. CHANGELOGs are generated automatically
4. All `@solo-ds/*` public packages version together (fixed versioning)
