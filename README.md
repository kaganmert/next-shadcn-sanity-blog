# next-shadcn-sanity-blog

A personal blog and portfolio built with **Next.js 16**, **Sanity**, **Tailwind CSS v4** and **shadcn/ui**. It is minimal and typography-led, and it is easy to fork as a template: the site's name, navigation, links and tech stack all live in Sanity, not in code.

## Stack

| Area        | Choice                                                                        |
| ----------- | ----------------------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router, Cache Components, Partial Prefetching), React 19      |
| Content     | Sanity with an embedded Studio at `/studio`, Live Content API, Visual Editing |
| Styling     | Tailwind CSS v4, shadcn/ui, Geist Sans and Mono, `@tailwindcss/typography`    |
| Code blocks | Shiki, highlighted on the server (no highlighter JavaScript in the browser)   |
| Tooling     | pnpm, Node.js 24, TypeScript, Biome, Vitest, Sanity TypeGen                   |
| Hosting     | Vercel, with Web Analytics and Speed Insights                                 |

## Routes

| Route                                     | What it shows                                             |
| ----------------------------------------- | --------------------------------------------------------- |
| `/`                                       | Intro from Settings and the latest posts                  |
| `/blog`                                   | All posts, newest first, with category links              |
| `/blog/[slug]`                            | A post: Portable Text body, code blocks, cover and author |
| `/blog/category/[slug]`                   | Posts in one category                                     |
| `/work`                                   | Experience timeline and tech stack                        |
| `/studio`                                 | Embedded Sanity Studio                                    |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt` | Feed and SEO files                                        |

## Local setup

Requirements: Node.js (the version in `.nvmrc`) and pnpm (`corepack enable`).

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Create a Sanity project and dataset. If you don't have one yet:

   ```sh
   pnpm exec sanity login
   pnpm exec sanity projects create "my-blog" --dataset production --dataset-visibility public
   ```

3. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.

4. Create a viewer token for draft mode and Visual Editing, then put it in `SANITY_API_READ_TOKEN`:

   ```sh
   pnpm exec sanity tokens add "next-app-viewer" --role viewer
   ```

5. Let the local Studio sign in:

   ```sh
   pnpm exec sanity cors add http://localhost:3000 --credentials
   ```

6. Optionally, import the sample content (Settings, an author, categories, posts and experiences). See [`sanity/seed/README.md`](./sanity/seed/README.md).

   ```sh
   pnpm seed
   ```

   `pnpm seed` imports into the `production` dataset with `--replace`, so it overwrites documents that have the same IDs.

7. Start the dev server. The site runs on <http://localhost:3000> and the Studio on <http://localhost:3000/studio>.

   ```sh
   pnpm dev
   ```

## Scripts

| Command          | What it does                                               |
| ---------------- | ---------------------------------------------------------- |
| `pnpm dev`       | Start the dev server                                       |
| `pnpm build`     | Production build                                           |
| `pnpm start`     | Serve the production build                                 |
| `pnpm lint`      | Biome lint + format check                                  |
| `pnpm format`    | Apply Biome fixes and formatting                           |
| `pnpm typecheck` | Generate route types and run tsc                           |
| `pnpm test`      | Run the Vitest suite                                       |
| `pnpm typegen`   | Extract the Sanity schema and regenerate `sanity.types.ts` |
| `pnpm seed`      | Import the sample content in `sanity/seed`                 |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests and build on every pull request and on pushes to `master`.

## Environment variables

| Name                            | Where                         | Notes                                                            |
| ------------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `.env.local`, Vercel, CI vars | Public                                                           |
| `NEXT_PUBLIC_SANITY_DATASET`    | `.env.local`, Vercel, CI vars | Public, usually `production`                                     |
| `SANITY_API_READ_TOKEN`         | `.env.local`, Vercel (secret) | Viewer token, server-only; enables draft mode and Visual Editing |
| `NEXT_PUBLIC_SITE_URL`          | Optional                      | Canonical URL; on Vercel it defaults to the production domain    |

`.env.example` lists the same variables. The build never needs the token, so CI only sets the two public values (as repository variables).

## Content model

- `settings` (singleton): site name, description, home intro, navigation, social links, tech stack
- `post`: title, slug, excerpt, cover image, author, categories, published date, Portable Text body
- `category`, `author`, `experience`

Schemas live in `sanity/schemaTypes`, and GROQ queries live in `sanity/lib/queries.ts`. Every query uses `defineQuery`, and TypeGen types them. Run `pnpm typegen` after changing either.

## Editing and previews

- Published content changes appear on the live site without a redeploy (Sanity Live).
- In the Studio, open **Presentation** to edit with click-to-edit overlays. Drafts show only in draft mode. Outside Presentation, an "Exit draft mode" banner appears.

## Deploying to Vercel

1. Import the repository in Vercel and set the project's Node.js version to 24.x (`vercel project update <name> --node-version 24.x`). `engines.node` in `package.json` pins it too.
2. Add the environment variables above for Production, Preview and Development, so `vercel env pull` works locally. Mark `SANITY_API_READ_TOKEN` as sensitive for Production and Preview; sensitive variables can't target Development, so add it there as a normal variable.
3. Add your Vercel domains to Sanity CORS with credentials, for example `https://your-app.vercel.app` and `https://your-app-*-your-team.vercel.app` for previews.
4. Optionally, turn on Web Analytics and Speed Insights for the project. The components are already in the site layout.

## Forking as a template

1. Create your own Sanity project and follow **Local setup**.
2. Edit **Settings** in the Studio: site name, description, intro, navigation, social links and tech stack.
3. Translate or rewrite UI strings in `lib/strings.ts`. Every string that isn't content lives there.
4. Change the accent color with `--primary` (light and dark) in `app/globals.css`. shadcn's `--accent` is only a neutral hover surface.

## License

See [LICENSE](./LICENSE).
