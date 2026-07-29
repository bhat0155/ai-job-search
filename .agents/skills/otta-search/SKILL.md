---
name: otta-search
version: 1.0.0
description: >
  Search job listings from Otta (otta.com) — a tech-focused job board popular with
  software engineers and product people, with strong Canadian company coverage.
  No CLI: Otta is a Next.js SPA with no public API. Uses WebSearch with site: queries.
  Trigger phrases: otta jobs, find jobs on otta, otta.com.
context: fork
enabled: true
search-method: websearch
allowed-tools: WebSearch, WebFetch
---

# Otta Search Skill

Search job listings from **[otta.com](https://otta.com)** — a tech-focused job board
with a curated selection of roles at product companies, startups, and scale-ups,
including a growing number of Canadian companies.

## Why no CLI

Otta is a Next.js SPA with no public API and all search results are dynamically
rendered. A CLI is not feasible. This skill uses `WebSearch` with `site:otta.com`
queries.

**Note on WebFetch:** Otta job detail pages redirect and return Next.js shell HTML
— they are not WebFetchable for structured data. Store the URL for the user to open
manually.

## How `/scrape` should use this skill

There is no `bun run` command. When `/scrape` reads this SKILL.md in Step 1b, use
`WebSearch` with the queries below.

## Search queries

```
site:otta.com "software developer" Canada
site:otta.com "full stack" developer Canada
site:otta.com "TypeScript" developer Canada
site:otta.com "React" "Node.js" Canada
site:otta.com "DevOps" "cloud" Canada
site:otta.com "cloud engineer" Canada
site:otta.com "junior" developer Canada
site:otta.com "associate" engineer Canada
```

## Output format

Extract from each WebSearch result:
- `title` — from snippet heading
- `company` — usually in the snippet
- `location` — from snippet (many Otta roles include remote/hybrid info)
- `url` — the `otta.com/jobs/...` URL

Store the URL for manual browser visit. Do not attempt WebFetch on Otta job URLs.

## Health check

For `/scrape health`, run:
```
site:otta.com developer Canada
```
Zero results = broken (Google may have stopped indexing this domain).
