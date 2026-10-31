<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Agent skills

### Issue tracker

Issues live in GitHub Issues for `kaganmert/next-shadcn-sanity-blog`, managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

Every issue, branch, and PR uses an `NSB-XX` key: issue and PR titles are `NSB-XX: <Task title>`, branches are `feature|fix|chore/NSB-XX`. Sub-issue PRs target their parent's integration branch. Full rules in `docs/agents/issue-tracker.md` → **NSB ticket convention**.

### Triage labels

Uses the five default triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
