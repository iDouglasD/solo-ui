# Input Component System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 4-component Input system (`Input`, `InputLabel`, `InputHint`, `InputField`) for the solo-ui design system.

**Architecture:** `InputField` provides a React Context with `state` ('error' | 'success'). `Input` reads that context to apply CVA border variants; `InputHint` reads it to apply text color. `InputLabel` is a static styled label. All components live in a single `index.tsx` file.

**Tech Stack:** React, CVA (class-variance-authority), cn (clsx + tailwind-merge), Tailwind CSS v4, TypeScript, Storybook 10.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `packages/react/src/components/ui/Input/index.tsx` | All 4 components + context |
| Modify | `packages/react/src/index.ts` | Barrel export |
| Create | `packages/docs/src/components/ui/Input/Input.stories.tsx` | Storybook stories |

---

## Task 1: Context + InputField

**Files:**
- Create: `packages/react/src/components/ui/Input/index.tsx`

- [ ] **Step 1: Create the file with context + InputField**

```tsx
import type React from 'react'
import { createContext, useContext } from 'react'
import { cn } from '../../../lib/cn'

// ─── Context ─────────────────────────────────────────────────────────────────

interface InputFieldContextValue {
  state?: 'error' | 'success'
}

const InputFieldContext = createContext<InputFieldContextValue>({})

// ─── InputField ──────────────────────────────────────────────────────────────

interface InputFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: 'error' | 'success'
}

function InputField({ state, className, children, ...rest }: InputFieldProps) {
  return (
    <InputFieldContext.Provider value={{ state }}>
      <div className={cn('flex flex-col gap-1.5', className)} {...rest}>
        {children}
      </div>
    </InputFieldContext.Provider>
  )
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export type { InputFieldProps }
export { InputField }
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm --filter @solo-ui/ui build
```

Expected: build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/react/src/components/ui/Input/index.tsx
git commit -m "feat(react): add InputField with context"
```

---

## Task 2: InputLabel + InputHint

**Files:**
- Modify: `packages/react/src/components/ui/Input/index.tsx`

- [ ] **Step 1: Add InputLabel after the InputField section**

Add this block before the `// ─── Exports` comment:

```tsx
// ─── InputLabel ──────────────────────────────────────────────────────────────

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

function InputLabel({ className, children, ...rest }: InputLabelProps) {
  return (
    <label className={cn('font-mono text-xs text-subtle', className)} {...rest}>
      {children}
    </label>
  )
}
```

- [ ] **Step 2: Add InputHint after InputLabel**

Add this block before the `// ─── Exports` comment:

```tsx
// ─── InputHint ───────────────────────────────────────────────────────────────

const hintColors: Record<'default' | 'error' | 'success', string> = {
  default: 'text-muted',
  error: 'text-red',
  success: 'text-green',
}

interface InputHintProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function InputHint({ className, children, ...rest }: InputHintProps) {
  const { state } = useContext(InputFieldContext)
  const colorClass = hintColors[state ?? 'default']

  return (
    <p
      className={cn('font-mono text-xs', colorClass, className)}
      role={state === 'error' ? 'alert' : undefined}
      {...rest}
    >
      {children}
    </p>
  )
}
```

- [ ] **Step 3: Update the exports block to include all components so far**

Replace the existing exports block with:

```tsx
// ─── Exports ─────────────────────────────────────────────────────────────────

export type { InputFieldProps, InputLabelProps, InputHintProps }
export { InputField, InputLabel, InputHint }
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm --filter @solo-ui/ui build
```

Expected: build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/components/ui/Input/index.tsx
git commit -m "feat(react): add InputLabel and InputHint components"
```

---

## Task 3: Input (base, no icons)

**Files:**
- Modify: `packages/react/src/components/ui/Input/index.tsx`

- [ ] **Step 1: Add the CVA import at the top of the file**

Add to the existing import block at the top:

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
```

- [ ] **Step 2: Add inputVariants CVA definition before the `// ─── InputField` comment**

```tsx
// ─── Variants ────────────────────────────────────────────────────────────────

const inputVariants = cva(
  'w-full rounded-lg border bg-elevated font-mono text-primary outline-none transition-all placeholder:text-muted disabled:opacity-30 disabled:cursor-not-allowed focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent',
  {
    variants: {
      size: {
        sm: 'text-xs py-1.5 px-2.5',
        md: 'text-sm py-2 px-3',
        lg: 'text-sm py-2.5 px-4',
      },
      state: {
        default: 'border-border',
        error: 'border-red',
        success: 'border-green',
      },
      hasLeftIcon: {
        true: '',
      },
      hasRightIcon: {
        true: '',
      },
    },
    compoundVariants: [
      { size: 'sm', hasLeftIcon: true, class: 'pl-7' },
      { size: 'sm', hasRightIcon: true, class: 'pr-7' },
      { size: 'md', hasLeftIcon: true, class: 'pl-9' },
      { size: 'md', hasRightIcon: true, class: 'pr-9' },
      { size: 'lg', hasLeftIcon: true, class: 'pl-10' },
      { size: 'lg', hasRightIcon: true, class: 'pr-10' },
    ],
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  },
)
```

- [ ] **Step 3: Add Input component (base, no icon rendering yet) before the Exports comment**

```tsx
// ─── Input ───────────────────────────────────────────────────────────────────

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Pick<VariantProps<typeof inputVariants>, 'size'> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

function Input({ className, size, leftIcon, rightIcon, ...rest }: InputProps) {
  const { state } = useContext(InputFieldContext)
  const resolvedState = state ?? 'default'
  const hasLeftIcon = !!leftIcon
  const hasRightIcon = !!rightIcon

  const inputEl = (
    <input
      className={cn(
        inputVariants({ size, state: resolvedState, hasLeftIcon, hasRightIcon }),
        className,
      )}
      {...rest}
    />
  )

  if (!hasLeftIcon && !hasRightIcon) return inputEl

  return (
    <div className="relative flex w-full items-center">
      {leftIcon && (
        <span className="pointer-events-none absolute left-2.5 flex shrink-0 items-center text-muted">
          {leftIcon}
        </span>
      )}
      {inputEl}
      {rightIcon && (
        <span className="pointer-events-none absolute right-2.5 flex shrink-0 items-center text-muted">
          {rightIcon}
        </span>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Update the exports block to include Input and inputVariants**

Replace the existing exports block with:

```tsx
// ─── Exports ─────────────────────────────────────────────────────────────────

export type { InputFieldProps, InputLabelProps, InputHintProps, InputProps }
export { InputField, InputLabel, InputHint, Input, inputVariants }
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
pnpm --filter @solo-ui/ui build
```

Expected: build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add packages/react/src/components/ui/Input/index.tsx
git commit -m "feat(react): add Input primitive with CVA variants"
```

---

## Task 4: Add barrel export

**Files:**
- Modify: `packages/react/src/index.ts`

- [ ] **Step 1: Add Input to the barrel**

Add this line to `packages/react/src/index.ts` after the existing exports:

```ts
export * from './components/ui/Input'
```

- [ ] **Step 2: Verify full build**

```bash
pnpm --filter @solo-ui/ui build
```

Expected: `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts` all generated with no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/react/src/index.ts
git commit -m "feat(react): export Input component system"
```

---

## Task 5: Storybook stories

**Files:**
- Create: `packages/docs/src/components/ui/Input/Input.stories.tsx`

- [ ] **Step 1: Create the stories file**

```tsx
import { Input, InputField, InputHint, InputLabel } from '@solo-ui/ui'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0d0d0d' }],
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    size: 'md',
    placeholder: 'Enter value...',
    disabled: false,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Input size="sm" placeholder="small" />
      <Input size="md" placeholder="medium" />
      <Input size="lg" placeholder="large" />
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Input
        placeholder="Search..."
        leftIcon={
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        }
      />
      <Input
        placeholder="Enter email..."
        leftIcon={
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        }
        rightIcon={
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        }
      />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <InputField>
        <InputLabel htmlFor="default-input">Default</InputLabel>
        <Input id="default-input" placeholder="Enter value..." />
        <InputHint>This is a helper text</InputHint>
      </InputField>

      <InputField state="error">
        <InputLabel htmlFor="error-input">Email</InputLabel>
        <Input id="error-input" defaultValue="invalid@" />
        <InputHint>Invalid email address</InputHint>
      </InputField>

      <InputField state="success">
        <InputLabel htmlFor="success-input">Username</InputLabel>
        <Input id="success-input" defaultValue="john_doe" />
        <InputHint>Username is available</InputHint>
      </InputField>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Input disabled placeholder="Disabled input" />
      <Input disabled defaultValue="Readonly value" />
    </div>
  ),
}

export const FullExample: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <InputField state="error">
        <InputLabel htmlFor="email-full">Email</InputLabel>
        <Input
          id="email-full"
          type="email"
          defaultValue="invalid@"
          leftIcon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          }
        />
        <InputHint>Invalid email address</InputHint>
      </InputField>

      <InputField state="success">
        <InputLabel htmlFor="pass-full">Password</InputLabel>
        <Input
          id="pass-full"
          type="password"
          defaultValue="supersecret"
          leftIcon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />
        <InputHint>Strong password</InputHint>
      </InputField>
    </div>
  ),
}
```

- [ ] **Step 2: Start Storybook and verify all stories render correctly**

```bash
pnpm dev
```

Open `http://localhost:6006` — navigate to UI/Input and verify:
- Default story renders a plain input
- Sizes story shows three heights
- WithIcons story shows icon slots positioned correctly
- States story shows default/error/success border colors and hint text colors
- Disabled story shows reduced opacity
- FullExample story shows the compound usage

- [ ] **Step 3: Commit**

```bash
git add packages/docs/src/components/ui/Input/Input.stories.tsx
git commit -m "docs(ui): add Input component stories"
```
