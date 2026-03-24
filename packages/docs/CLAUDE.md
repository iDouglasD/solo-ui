# @solo-ui/docs

Storybook 8 documentation package. Private — not published to NPM.

## Stack

- **Storybook 10** with `@storybook/react-vite` framework
- Stories live in `packages/react/src/` (not here)
- This package only contains Storybook configuration

## Running

```bash
pnpm dev                          # from root — starts Storybook on port 6006
pnpm --filter @solo-ui/docs dev   # directly
```

## Building

```bash
pnpm build                        # from root
pnpm --filter @solo-ui/docs build # directly — outputs to storybook-static/
```

## Stories Location

Stories are colocated with components in `packages/react/src/`:

```
packages/react/src/
  components/
    Button/
      index.tsx
      Button.stories.tsx   ← story lives here
```

The glob pattern in `.storybook/main.ts` picks them up automatically:
```
../../react/src/**/*.stories.@(ts|tsx)
```

## Adding Storybook Addons

Install in this package (`--filter @solo-ui/docs`), then register in `.storybook/main.ts`.
