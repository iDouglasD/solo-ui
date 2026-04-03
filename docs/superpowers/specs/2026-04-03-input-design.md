# Input Component System — Design Spec

**Date:** 2026-04-03
**Status:** Approved

## Overview

A 4-component system for building form inputs in solo-ui. The `Input` is the primitive; `InputLabel` and `InputHint` are standalone text components; `InputField` is the layout wrapper that distributes visual state via React Context.

## Components

### `InputField`

Flex column wrapper that enforces consistent vertical spacing between label, input, and hint text. Provides `InputFieldContext` so child components can read `state` without prop drilling.

**Props:**
- `state?: 'error' | 'success'` — propagated via context
- Extends `React.HTMLAttributes<HTMLDivElement>`

**Behavior:**
- Renders a `<div>` with `flex flex-col gap-1.5` (or equivalent)
- No visual styling of its own (no border, no background)

---

### `InputLabel`

Left-aligned label for an input field.

**Props:**
- Extends `React.LabelHTMLAttributes<HTMLLabelElement>`

**Styling:** `font-mono text-xs text-subtle`

---

### `Input`

The styled `<input>` primitive. Reads `state` from `InputFieldContext`.

**Props:**
- `size?: 'sm' | 'md' | 'lg'` — default `'md'`
- `leftIcon?: React.ReactNode` — icon slot before the input text
- `rightIcon?: React.ReactNode` — icon slot after the input text
- Extends `React.InputHTMLAttributes<HTMLInputElement>`

**CVA variants:**

| Variant | Values |
|---------|--------|
| `size` | `sm`, `md`, `lg` |
| `state` | `default`, `error`, `success` |

**Visual states:**

| State | Border color |
|-------|-------------|
| default | `border-border` |
| focus | `border-accent` + ring `ring-accent/15` |
| error | `border-red` |
| success | `border-green` |
| disabled | `opacity-30 cursor-not-allowed` (native `disabled` prop) |

**Icon rendering:** When `leftIcon` or `rightIcon` is provided, the component renders a wrapper `<div>` with `relative` or `flex` layout, placing the icon inside with `text-muted` coloring and `pointer-events-none`. The `<input>` gets left/right padding adjusted accordingly via CVA or inline class logic.

**Structure (with icons):**
```
<div class="relative flex items-center ...">
  {leftIcon && <span class="left-slot">...</span>}
  <input ... />
  {rightIcon && <span class="right-slot">...</span>}
</div>
```

---

### `InputHint`

Left-aligned helper/error text rendered below the input.

**Props:**
- Extends `React.HTMLAttributes<HTMLParagraphElement>`

**Color by state (read from context):**

| State | Color |
|-------|-------|
| none | `text-muted` |
| error | `text-red` |
| success | `text-green` |

**Styling:** `font-mono text-xs`

---

## Context

```ts
interface InputFieldContextValue {
  state?: 'error' | 'success'
}
const InputFieldContext = createContext<InputFieldContextValue>({})
```

`Input` and `InputHint` call `useContext(InputFieldContext)` to read state.

---

## Usage

```tsx
// Default
<Input placeholder="Enter value..." />

// With field wrapper
<InputField state="error">
  <InputLabel htmlFor="email">Email</InputLabel>
  <Input id="email" leftIcon={<MailIcon />} placeholder="user@example.com" />
  <InputHint>Invalid email address</InputHint>
</InputField>

// Success
<InputField state="success">
  <InputLabel htmlFor="pass">Password</InputLabel>
  <Input id="pass" leftIcon={<LockIcon />} rightIcon={<EyeIcon />} type="password" />
  <InputHint>Strong password</InputHint>
</InputField>

// Standalone (no wrapper)
<Input size="sm" placeholder="Search..." leftIcon={<SearchIcon />} />
```

---

## File Structure

```
packages/react/src/components/ui/Input/
  index.tsx          ← all 4 components + context
packages/docs/src/components/ui/Input/
  Input.stories.tsx  ← Storybook stories
```

## Exports

From `packages/react/src/index.ts`:

```ts
export type { InputProps, InputLabelProps, InputHintProps, InputFieldProps }
export { Input, InputLabel, InputHint, InputField, inputVariants }
```

## Conventions

- CVA for `Input` variants (`size`, `state`)
- `cn()` for class merging
- `font-mono` on all text elements (consistent with design system)
- No inline styles, no hex colors, no arbitrary text sizes
- No `"use client"` directive (handled by tsup banner)
- Stories in English only
