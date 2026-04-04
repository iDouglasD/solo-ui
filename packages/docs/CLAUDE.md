# @solo-ds/docs

Storybook 10 documentation package. Private — not published to NPM.

## Stack

- **Storybook 10** with `@storybook/react-vite` framework
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- Stories live in `src/components/ui/<ComponentName>/`, imported via `@solo-ds/ui`

## Running

```bash
pnpm dev                          # from root — starts Storybook on port 6006
pnpm --filter @solo-ds/docs dev   # directly
```

> When running directly with `--filter`, ensure `@solo-ds/ui` is built first:
> `pnpm build --filter @solo-ds/ui`

## Building

```bash
pnpm build                        # from root
pnpm --filter @solo-ds/docs build # directly — outputs to storybook-static/
```

## Stories Location

Stories live in `src/components/ui/<ComponentName>/` and are imported via `@solo-ds/ui`:

```
packages/docs/src/
  components/
    ui/
      Card/
        Card.stories.tsx   ← story lives here
```

The glob pattern in `.storybook/main.ts` picks them up automatically:

```
../src/**/*.stories.@(ts|tsx)
```

## Adding Storybook Addons

Install in this package (`--filter @solo-ds/docs`), then register in `.storybook/main.ts`.
