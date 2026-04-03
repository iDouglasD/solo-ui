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
- Renders a `<div>` with `flex flex-col gap-1.5`
- No visual styling of its own (no border, no background)

---

### `InputLabel`

Left-aligned label for an input field. Maps directly to a `<label>` element. Has no CVA — styling is entirely static.

**Props:**
- Extends `React.LabelHTMLAttributes<HTMLLabelElement>`

**Styling:** `font-mono text-xs text-subtle`

**Note:** Label-to-input association (`htmlFor` / `id`) is wired manually by the consumer. Auto-wiring via context is deferred to a future enhancement.

---

### `Input`

The styled `<input>` primitive. Reads `state` from `InputFieldContext`.

**Props:**
- `size?: 'sm' | 'md' | 'lg'` — default `'md'`
- `leftIcon?: React.ReactNode` — icon slot before the input text
- `rightIcon?: React.ReactNode` — icon slot after the input text
- Extends `React.InputHTMLAttributes<HTMLInputElement>`

**State priority:** When both `InputField` provides `state` via context and the consumer explicitly passes a `state` prop through a className or data attribute, the context value is the source of truth for styling. The `state` CVA variant is derived from context (`useContext(InputFieldContext).state`), never from a direct prop on `Input`.

**CVA variants:**

| Variant | Values |
|---------|--------|
| `size` | `sm`, `md`, `lg` |
| `state` | `default`, `error`, `success` |

`state` defaults to `'default'` when `InputFieldContext` provides `undefined` (i.e., `Input` is used standalone, outside of `InputField`).

**Size definitions:**

| Size | Text | Padding | Height (approx) |
|------|------|---------|-----------------|
| `sm` | `text-xs` | `py-1.5 px-2.5` | 28px |
| `md` | `text-sm` | `py-2 px-3` | 36px |
| `lg` | `text-sm` | `py-2.5 px-4` | 40px |

**Visual states:**

| State | Border color |
|-------|-------------|
| default | `border-border` |
| focus | `focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent` |
| error | `border-red` |
| success | `border-green` |
| disabled | `disabled:opacity-30 disabled:cursor-not-allowed` (native `disabled` prop) |

Focus ring uses `focus-visible:ring-accent` without an opacity modifier, consistent with the Button component.

**Icon rendering:**

When `leftIcon` or `rightIcon` is provided, the component renders a wrapper `<div class="relative flex items-center">`. All spread props (`...rest`) are applied to the inner `<input>` element — never to the wrapper — so that `id`, `aria-*`, and other attributes always target the input. `className` is also applied to the `<input>`, not the wrapper.

Icon slots are `<span>` elements with `pointer-events-none text-muted shrink-0` and absolute/flex positioning.

Icon padding is handled via **CVA compound variants** to keep all sizing logic declarative:

```ts
compoundVariants: [
  { size: 'sm', leftIcon: true,  class: 'pl-7' },
  { size: 'sm', rightIcon: true, class: 'pr-7' },
  { size: 'md', leftIcon: true,  class: 'pl-9' },
  { size: 'md', rightIcon: true, class: 'pr-9' },
  { size: 'lg', leftIcon: true,  class: 'pl-10' },
  { size: 'lg', rightIcon: true, class: 'pr-10' },
]
```

CVA requires `hasLeftIcon` and `hasRightIcon` to be declared as explicit boolean variants (e.g., `hasLeftIcon: { true: '' }`) even if they carry no standalone classes — only then can they be referenced in `compoundVariants`. The implementer derives these from `!!leftIcon` / `!!rightIcon`.

**Structure (with icons):**
```
<div class="relative flex items-center w-full">
  {leftIcon && <span class="absolute left-slot pointer-events-none text-muted">...</span>}
  <input class={cn(inputVariants({ size, state, hasLeftIcon, hasRightIcon }), className)} {...rest} />
  {rightIcon && <span class="absolute right-slot pointer-events-none text-muted">...</span>}
</div>
```

When no icons are provided, the component renders just the `<input>` with no wrapper.

---

### `InputHint`

Left-aligned helper/error text rendered below the input. Reads `state` from `InputFieldContext`.

**Props:**
- Extends `React.HTMLAttributes<HTMLParagraphElement>`

**Color by state (read from context):**

| State | Color |
|-------|-------|
| none | `text-muted` |
| error | `text-red` |
| success | `text-green` |

**Styling:** `font-mono text-xs`

**Accessibility:** When `state === 'error'`, renders with `role="alert"` so screen readers announce the error message automatically.

---

## Context

```ts
interface InputFieldContextValue {
  state?: 'error' | 'success'
}
const InputFieldContext = createContext<InputFieldContextValue>({})
```

`Input` and `InputHint` call `useContext(InputFieldContext)` to read state. `state` is `undefined` when used outside `InputField`, which maps to the `'default'` CVA variant.

---

## Usage

```tsx
// Standalone (no wrapper)
<Input placeholder="Enter value..." />

// With field wrapper — error state
<InputField state="error">
  <InputLabel htmlFor="email">Email</InputLabel>
  <Input id="email" leftIcon={<MailIcon />} placeholder="user@example.com" />
  <InputHint>Invalid email address</InputHint>
</InputField>

// With field wrapper — success state
<InputField state="success">
  <InputLabel htmlFor="pass">Password</InputLabel>
  <Input id="pass" leftIcon={<LockIcon />} rightIcon={<EyeIcon />} type="password" />
  <InputHint>Strong password</InputHint>
</InputField>

// Standalone with icon and size
<Input size="sm" placeholder="Search..." leftIcon={<SearchIcon />} />
```

---

## File Structure

```
packages/react/src/components/ui/Input/
  index.tsx                              ← all 4 components + context

packages/docs/src/components/ui/Input/
  Input.stories.tsx                      ← Storybook stories
```

## Exports

### Component file (`index.tsx`)

```ts
export type { InputProps, InputLabelProps, InputHintProps, InputFieldProps }
export { Input, InputLabel, InputHint, InputField, inputVariants }
```

`InputFieldContextValue` remains internal — not exported, as it is an implementation detail not needed by consumers.

### Barrel (`src/index.ts`)

```ts
export * from './components/ui/Input'
```

Consistent with the existing barrel pattern (`export * from './components/ui/Badge'`, etc.).

## Conventions

- CVA for `Input` variants (`size`, `state`, compound icon padding)
- `cn()` for class merging
- `font-mono` on all text elements (consistent with design system)
- No inline styles, no hex colors, no arbitrary text sizes
- No `"use client"` directive (handled by tsup banner)
- Stories in English only
