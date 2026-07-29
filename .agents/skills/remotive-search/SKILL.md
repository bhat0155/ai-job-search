---
name: remotive-search
version: 1.0.0
description: >
  Search remote tech job listings from Remotive (remotive.com) — a curated remote
  job board for software, DevOps, AI, and data roles. Uses Remotive's public JSON
  API. Filters to Canada-eligible positions (Canada, Worldwide, North America, Americas).
  Trigger phrases: remote tech jobs, remote developer jobs, remotive, remote Canada,
  remote software jobs.
context: fork
enabled: false
allowed-tools: Bash(bun run .agents/skills/remotive-search/cli/src/cli.ts *)
---

# Remotive Search Skill

Search live remote tech listings from **[remotive.com](https://remotive.com)** via
its public JSON API. No authentication or API key required.

## Commands

### Search jobs

```bash
bun run .agents/skills/remotive-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--query, -q <text>` — keyword search (title, tags). Recommended.
- `--category, -c <slug>` — filter by category slug (see below). Omit for all.
- `--jobage <days>` — only show results posted within N days (client-side).
- `--limit, -n <n>` — cap results returned (default 20).
- `--format <fmt>` — `json` (default) | `table` | `plain`.

Category slugs: `software-development`, `devops`, `artificial-intelligence`,
`data`, `information-technology`, `product`, `engineering`.

### Fetch full job detail

```bash
bun run .agents/skills/remotive-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`id` is the numeric job ID from search results, or paste the full Remotive job URL.

## Usage examples

```bash
# Junior full-stack roles, last 14 days
bun run .agents/skills/remotive-search/cli/src/cli.ts search -q "full stack developer" --jobage 14 --format table

# DevOps / cloud roles
bun run .agents/skills/remotive-search/cli/src/cli.ts search -q "DevOps" --category devops --jobage 14

# TypeScript roles, any category
bun run .agents/skills/remotive-search/cli/src/cli.ts search -q "TypeScript" --jobage 14 --limit 20

# Fetch full detail for a job
bun run .agents/skills/remotive-search/cli/src/cli.ts detail 12345
```

## Location filtering

Only jobs whose `candidate_required_location` contains one of these strings are returned:
`Canada`, `Worldwide`, `World`, `North America`, `Americas`, or is empty/blank.
US-only and other region-restricted roles are excluded.

## Notes

- Data is from Remotive's public API — no auth required.
- `--jobage` is client-side: results are filtered by `publication_date`.
- All positions are remote by definition (Remotive only lists remote roles).
