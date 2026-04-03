# Home.mdx Design Spec

**Date:** 2026-04-03
**Status:** Approved

## Goal

Create a `Home.mdx` page in the `@solo-ui/docs` Storybook that serves as the entry point for developers who want to use the design system. The page communicates what solo-ui is, how to install it, and which components are available — using the terminal aesthetic established by the project's color tokens and typography.

## Audience

Other developers who want to adopt solo-ui in their projects.

## File Location

`packages/docs/src/Home.mdx`

## Content Sections

Three sections, in order:

### 1. Hero
- `● ● ●` decorative dots (monospace terminal window feel)
- `❯ solo-ui` as the main heading
- Tagline: `A minimal React design system built for solo projects.`
- No version badge (version is `0.0.0` and unstable)

### 2. Install (`$ install`)
A single fenced code block with shell syntax containing both steps and a comment:
```sh
pnpm add @solo-ui/ui

# then import the styles
import '@solo-ui/ui/styles.css'
```

### 3. Components (`$ ls components/`)
Tree-style list with one-line descriptions. All five components are confirmed implemented in `packages/react/src/components/ui/`:
```
├─ Button   6 variants · 3 sizes · loading state · icon slot
├─ Input    3 states · 3 sizes · icon slots · field system
├─ Card     header · content · footer slots
├─ Badge    5 variants · 2 sizes
└─ Table    composable rows + cells
```

## Visual Style

Terminal aesthetic using Tailwind utility classes and `@solo-ui/tokens` color tokens — no inline styles, no raw hex values.

Key classes:
- Background: `bg-default` (maps to `#0d0d0d`)
- Accent: `text-accent` (maps to `#00ff41`) — used for `❯` and `$` prefixes
- Borders: `border-border` for subtle separators
- Text: `text-primary`, `text-muted`, `text-subtle`
- Font: `font-mono` throughout
- Code blocks: `bg-elevated` backgrounds

Sections separated by `border-t border-border`.

## Implementation Notes

- MDX file uses `<Meta title="Home" />` (unattached — not bound to any story)
- Layout built with JSX `<div>` elements using `className` with Tailwind classes
- No external dependencies beyond `@storybook/addon-docs/blocks`
- No inline `style` attributes — all styling via Tailwind utilities

## Out of Scope

- Stack/tech section (removed by user preference)
- Interactive component previews on the home page
- Dark/light theme toggle
- Dynamic version reading from `package.json`
