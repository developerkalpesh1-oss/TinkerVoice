# `@repo/typescript-config`

Shared TypeScript presets for TinkerVoice packages.

## Presets

### Base

```json
{
  "extends": "@repo/typescript-config/base"
}
```

Runtime-neutral defaults for shared TypeScript packages. This preset does not
include browser or Node globals.

### Browser

```json
{
  "extends": "@repo/typescript-config/browser"
}
```

Adds DOM libraries for browser-focused packages.

### Node

```json
{
  "extends": "@repo/typescript-config/node"
}
```

Adds Node types without DOM libraries for server packages.

### Next.js

```json
{
  "extends": "@repo/typescript-config/next-js"
}
```

Browser runtime defaults plus the Next TypeScript plugin and bundler module
resolution.

### React Library

```json
{
  "extends": "@repo/typescript-config/react-library"
}
```

Browser runtime defaults plus `react-jsx` JSX emit for shared React libraries.

### Strict

```json
{
  "extends": "@repo/typescript-config/strict"
}
```

Optional stricter checks for unused code, missing returns, fallthrough switches,
and exact optional property types.

## Preset Naming

| Purpose         | Preferred subpath                       | Backwards-compatible aliases                                                           |
| --------------- | --------------------------------------- | -------------------------------------------------------------------------------------- |
| Base            | `@repo/typescript-config/base`          | `@repo/typescript-config/base.json`                                                    |
| Browser runtime | `@repo/typescript-config/browser`       | `@repo/typescript-config/browser.json`                                                 |
| Node runtime    | `@repo/typescript-config/node`          | `@repo/typescript-config/node.json`                                                    |
| Next.js app     | `@repo/typescript-config/next-js`       | `@repo/typescript-config/nextjs`, `@repo/typescript-config/nextjs.json`                |
| React library   | `@repo/typescript-config/react-library` | `@repo/typescript-config/react-internal`, `@repo/typescript-config/react-library.json` |
| Strict checks   | `@repo/typescript-config/strict`        | `@repo/typescript-config/strict.json`                                                  |

## Consumer Dependencies

Consumers should depend on this package with `workspace:*`. Node consumers need
`@types/node` available in the consuming package when extending the Node preset.

## Troubleshooting

- `ERR_PACKAGE_PATH_NOT_EXPORTED`: use one of the subpaths in the preset naming
  table. The `.json` exports remain available for existing configs.
- Missing Node globals: install `@types/node` in the consuming package before
  extending the Node preset.
- Choosing `base` versus `strict`: start with `base` for runtime-neutral
  defaults, then layer `strict` when a package is ready to fail on unused code,
  missing returns, fallthrough switches, and exact optional property types.
- Next app manifests should declare `@repo/typescript-config` with
  `workspace:*` so dependency ownership is visible even when framework-generated
  `tsconfig.json` files need app-local overrides.
