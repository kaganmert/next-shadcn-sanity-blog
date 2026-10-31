# next-shadcn-sanity-blog

A personal blog and portfolio built with Next.js 16, Sanity, Tailwind CSS v4 and shadcn/ui.

> The project is being rebuilt from scratch. Track progress in [NSB-01](https://github.com/kaganmert/next-shadcn-sanity-blog/issues/1). Full setup docs land with NSB-11.

## Requirements

- Node.js: the version in `.nvmrc`
- pnpm (via `corepack enable`)

## Scripts

| Command          | What it does                                               |
| ---------------- | ---------------------------------------------------------- |
| `pnpm dev`       | Start the dev server                                       |
| `pnpm build`     | Production build                                           |
| `pnpm lint`      | Biome lint + format check                                  |
| `pnpm format`    | Apply Biome fixes and formatting                           |
| `pnpm typecheck` | Generate route types and run tsc                           |
| `pnpm typegen`   | Extract the Sanity schema and regenerate `sanity.types.ts` |
| `pnpm seed`      | Import the sample content in `sanity/seed`                 |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests (once a `test` script exists) and build on every pull request and on pushes to `master`.

## Sanity

The Studio is embedded at `/studio`. Schemas live in `sanity/schemaTypes`, and `settings` is a singleton (see `sanity/structure.ts`). To start from sample content, follow `sanity/seed/README.md`.

## License

See [LICENSE](./LICENSE).
