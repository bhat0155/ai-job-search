---
name: himalayas-search
version: 1.0.0
description: >
  Search remote job listings from Himalayas (himalayas.app) — a curated remote job
  board aggregating tech, product, and design roles. Uses Himalayas' public JSON API.
  Filters to Canada-eligible positions (empty location = worldwide, or Canada listed).
  Trigger phrases: himalayas jobs, remote developer himalayas, remote Canada tech jobs.
context: fork
enabled: false
allowed-tools: Bash(bun run .agents/skills/himalayas-search/cli/src/cli.ts *)
---

# Himalayas Search Skill

Search live remote tech listings from **[himalayas.app](https://himalayas.app)** via
its public JSON API. No authentication or API key required.

## Commands

### Search jobs

```bash
bun run .agents/skills/himalayas-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--query, -q <text>` — keyword search. Recommended.
- `--jobage <days>` — only show results posted within N days (client-side).
- `--limit, -n <n>` — cap results returned (default 20).
- `--format <fmt>` — `json` (default) | `table` | `plain`.

### Fetch full job detail

```bash
bun run .agents/skills/himalayas-search/cli/src/cli.ts detail <url> [--format json|plain]
```

Pass the full `himalayas.app/jobs/...` URL from search results.

## Usage examples

```bash
# Junior full-stack developer roles
bun run .agents/skills/himalayas-search/cli/src/cli.ts search -q "full stack developer" --jobage 14 --format table

# TypeScript / Node.js roles
bun run .agents/skills/himalayas-search/cli/src/cli.ts search -q "TypeScript Node.js" --jobage 14

# Cloud / DevOps roles
bun run .agents/skills/himalayas-search/cli/src/cli.ts search -q "DevOps Kubernetes" --jobage 14

# React developer roles
bun run .agents/skills/himalayas-search/cli/src/cli.ts search -q "React developer" --jobage 14 --limit 15
```

## Location filtering

Only jobs whose `locationRestrictions` list is empty (= worldwide/anywhere) or
contains "Canada" or "North America" are returned. US-only and other
geographically restricted roles are excluded.

## Notes

- Data is from Himalayas' public API — no auth required.
- `--jobage` is client-side, filtered by `pubDate`.
- All positions are remote by definition.
- `locationRestrictions` is an array; empty means unrestricted (all countries).
