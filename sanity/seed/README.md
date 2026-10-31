# Seed dataset

Sample content for a fresh Sanity dataset: the `settings` singleton, one author, three categories, three posts (with cover images, headings, lists, links, an inline image and code blocks) and three experiences.

## Import

1. Create a Sanity project and dataset, then fill `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local` (see `.env.example`).
2. Log in to the Sanity CLI with `pnpm exec sanity login`, and allow the local Studio to sign in: `pnpm exec sanity cors add http://localhost:3000 --credentials`.
3. Run `pnpm seed`. It imports into the `production` dataset. To use another dataset, run `pnpm exec sanity dataset import sanity/seed/data.ndjson --dataset <name> --replace` instead.

> **Warning:** `pnpm seed` always targets `production`. On a dataset with real content it overwrites `settings` and any document whose `_id` matches the seed.

> **Warning:** `pnpm seed` always targets `production`. On a dataset with real content it overwrites `settings` and any document whose `_id` matches the seed.

`--replace` makes the import repeatable: documents are matched by `_id` and overwritten. Images in `images/` are uploaded on import and referenced through `_sanityAsset`.

## Editing the seed

`data.ndjson` holds one document per line. Keep `_id`s stable so re-imports replace rather than duplicate, and give every array item and Portable Text block a unique `_key`. After editing, check it with `pnpm exec sanity documents validate` once imported.
