---
name: weworkremotely-search
version: 1.0.0
description: >
  Search remote job listings from We Work Remotely (weworkremotely.com) — one of
  the largest remote-only job boards for tech roles. Uses public RSS feeds. Filters
  to Canada-eligible positions (Anywhere, North America, Canada, Worldwide).
  Trigger phrases: we work remotely, remote programming jobs, WWR, remote Canada jobs.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/weworkremotely-search/cli/src/cli.ts *)
---

# We Work Remotely Search Skill

Search live remote tech listings from **[weworkremotely.com](https://weworkremotely.com)**
via its public RSS feeds. No authentication or API key required.

## Commands

### Search jobs

```bash
bun run .agents/skills/weworkremotely-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--query, -q <text>` — keyword filter applied client-side to job titles (case-insensitive substring match).
- `--category, -c <slug>` — RSS feed category (see below). Default: `programming`.
- `--jobage <days>` — only show results posted within N days (client-side).
- `--limit, -n <n>` — cap results returned (default 20).
- `--format <fmt>` — `json` (default) | `table` | `plain`.

Category slugs (maps to RSS feed URL):
- `programming` — software / full-stack / backend / frontend
- `devops-sysadmin` — DevOps, SRE, cloud, infrastructure
- `product` — product management
- `all` — all categories combined

### Fetch full job detail

```bash
bun run .agents/skills/weworkremotely-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`id` is the slug from the job URL (e.g. `coinbase-senior-software-engineer`) or the
full `weworkremotely.com/remote-jobs/...` URL.

## Usage examples

```bash
# Full-stack / software developer roles, last 14 days
bun run .agents/skills/weworkremotely-search/cli/src/cli.ts search -q "developer" --jobage 14 --format table

# TypeScript roles in programming category
bun run .agents/skills/weworkremotely-search/cli/src/cli.ts search -q "TypeScript" -c programming --jobage 14

# DevOps / cloud / Kubernetes roles
bun run .agents/skills/weworkremotely-search/cli/src/cli.ts search -q "DevOps" -c devops-sysadmin --jobage 14

# Node.js roles, last 7 days
bun run .agents/skills/weworkremotely-search/cli/src/cli.ts search -q "Node.js" --jobage 7 --limit 15
```

## Location filtering

Only jobs whose `region` field contains one of these strings are returned:
`Anywhere`, `Worldwide`, `North America`, `Canada`, or is empty.
Europe-only, US-only, and other geographically restricted roles are excluded.

## Notes

- Data is from WWR's public RSS feeds — no auth required.
- RSS feeds are per-category; keyword filtering is client-side on job titles.
- `--jobage` is client-side, filtered by `pubDate`.
- All positions are remote by definition.
