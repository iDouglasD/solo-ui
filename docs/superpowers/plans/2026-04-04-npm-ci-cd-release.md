# NPM CI/CD Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automate NPM publishing via Changesets GitHub Action with the "Version Packages" PR flow.

**Architecture:** A single GitHub Actions workflow listens to pushes on `main`. When changesets are pending, it creates a version PR. When that PR is merged (no more changesets), it runs `pnpm release` to build and publish. An `.npmrc` at the project root provides NPM auth via environment variable interpolation.

**Tech Stack:** GitHub Actions, Changesets Action v1, pnpm 10.7.0, Node 22

**Spec:** `docs/superpowers/specs/2026-04-04-npm-ci-cd-release-design.md`

---

### Task 1: Create `.npmrc` for NPM authentication

**Files:**
- Create: `.npmrc`

- [ ] **Step 1: Create `.npmrc` at project root**

```
# Used by CI only — NPM_TOKEN is set as a GitHub Actions secret
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

- [ ] **Step 2: Verify `.npmrc` is not in `.gitignore`**

Run: `grep -n "npmrc" .gitignore`
Expected: No match (file should be committed)

---

### Task 2: Create release workflow

**Files:**
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Create the release workflow**

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

- [ ] **Step 2: Validate YAML syntax**

Run: `npx yaml-lint .github/workflows/release.yml || node -e "const y=require('yaml'); const fs=require('fs'); y.parse(fs.readFileSync('.github/workflows/release.yml','utf8')); console.log('Valid YAML')"`
Expected: No syntax errors

---

### Task 3: Manual setup instructions (not code — user action required)

These steps must be done by the maintainer in the browser:

- [ ] **Step 1: Create NPM access token**
  1. Go to https://www.npmjs.com → Access Tokens → Generate New Token
  2. Select **Granular Access Token**
  3. Set permissions: **Read and Write** for packages under `@solo-ds` scope
  4. Copy the generated token

- [ ] **Step 2: Add `NPM_TOKEN` secret to GitHub**
  1. Go to the GitHub repo → Settings → Secrets and variables → Actions
  2. Create a new repository secret named `NPM_TOKEN`
  3. Paste the token value

- [ ] **Step 3: Verify end-to-end**
  1. Create a changeset: `pnpm changeset` (select a minor bump)
  2. Commit and push to `main`
  3. Verify the "Version Packages" PR is created automatically
  4. Merge the PR
  5. Verify packages appear on NPM under `@solo-ds` scope
