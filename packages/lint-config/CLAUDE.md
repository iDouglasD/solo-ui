# @solo-ds/lint-config

Shared Biome configuration. All packages extend this.

## How Consumers Use It

Each package has a `biome.json` that extends this config:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.8/schema.json",
  "extends": ["@solo-ds/lint-config/biome"]
}
```

The root `biome.json` also extends it.

## Modifying Rules

Edit `biome.json` in this package. Changes propagate to all consumers automatically (no build step needed).

After changing, run from root to verify:
```bash
pnpm lint
pnpm format
```

## Schema Version

When upgrading Biome, run `biome migrate --write` in this directory to update the schema and migrate deprecated options, then bump the version in all `$schema` URLs across the monorepo.

## Exports

The `biome.json` is exported as `@solo-ds/lint-config/biome` via the `exports` field in `package.json`.
