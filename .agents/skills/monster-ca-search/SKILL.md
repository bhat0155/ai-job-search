---
name: monster-ca-search
version: 1.0.0
description: >
  Search job listings from Monster Canada (monster.ca) — one of Canada's major
  legacy job boards with broad employer coverage across tech sectors.
  No CLI: Monster.ca is a Next.js SPA with no accessible public API.
  Uses WebSearch with site: queries. Trigger phrases: monster canada jobs, monster.ca.
context: fork
enabled: true
search-method: websearch
allowed-tools: WebSearch, WebFetch
---

# Monster Canada Search Skill

Search job listings from **[monster.ca](https://monster.ca)** — a major Canadian job
board with broad employer coverage.

## Why no CLI

Monster.ca is a Next.js SPA (returns a JS shell with no embedded job data).
A CLI is not feasible. This skill uses `WebSearch` with `site:monster.ca` queries.

**Note on WebFetch:** Monster.ca individual job pages may return JS-rendered shells.
Store the URL for manual browser visit where WebFetch fails.

## How `/scrape` should use this skill

There is no `bun run` command. When `/scrape` reads this SKILL.md in Step 1b, use
`WebSearch` with the queries below.

## Search queries

### Priority 1: Full-Stack / Software Developer

```
site:monster.ca "software developer" "TypeScript" Ottawa
site:monster.ca "full stack developer" "React" Canada
site:monster.ca "junior developer" "Node.js" Canada
site:monster.ca "application developer" Ottawa Ontario
```

### Priority 2: Cloud / DevOps

```
site:monster.ca "cloud engineer" "Azure" Canada
site:monster.ca "DevOps engineer" Canada
site:monster.ca "junior DevOps" Canada
site:monster.ca "platform engineer" Canada
```

### Priority 3: Support / IT

```
site:monster.ca "technical support engineer" Canada
site:monster.ca "cloud support" Canada
site:monster.ca "IT analyst" Ottawa Canada
```

## Output format

Extract from each WebSearch result:
- `title` — from snippet heading
- `company` — usually in the snippet
- `location` — from snippet
- `url` — the `monster.ca/...` URL

## Health check

For `/scrape health`, run:
```
site:monster.ca developer Ottawa Canada
```
Zero results = broken.
