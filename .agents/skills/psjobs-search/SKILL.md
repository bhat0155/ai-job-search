---
name: psjobs-search
version: 1.0.0
description: >
  Search job listings from the Government of Canada GC Jobs portal
  (psjobs-emploisfp.psc-cfp.gc.ca) — the official federal public service job board.
  No CLI: the site requires JavaScript-managed session state that cannot be replicated
  in a stateless HTTP client. This skill uses WebSearch with site: queries instead.
  Trigger phrases: federal jobs, government of Canada jobs, GC Jobs, PS Jobs,
  public service jobs, psjobs.
context: fork
enabled: true
search-method: websearch
allowed-tools: WebSearch, WebFetch
---

# GC Jobs (PS Jobs) Search Skill

Search job listings from **[psjobs-emploisfp.psc-cfp.gc.ca](https://psjobs-emploisfp.psc-cfp.gc.ca)**
— the Government of Canada's official public service job board (GC Jobs / PS Jobs).

## Why no CLI

GC Jobs requires an active JavaScript-managed session (`jsessionid` cookie + JS state).
AJAX search calls return "Lost Connection" without a valid browser session. The site
is a Java/WET-Boew application — all job results are dynamically rendered and gated
behind session management that cannot be replicated in a stateless HTTP client.

This skill uses `WebSearch` with `site:` queries instead. Google indexes individual
GC Jobs postings and returns them via `site:psjobs-emploisfp.psc-cfp.gc.ca` queries.

## How `/scrape` should use this skill

There is no `bun run` command. When `/scrape` reads this SKILL.md in Step 1b, it
must use `WebSearch` with the queries below.

**Do not attempt `WebFetch` on psjobs-emploisfp.psc-cfp.gc.ca URLs without a valid
session — they require browser-side JavaScript. Store the URL for the user to open
manually in a browser.**

Note: GC Jobs postings also appear on `emploisfp-psjobs.cfp-psc.gc.ca` (the older
URL alias). Both domains are covered by the queries below.

## Search queries

### Priority 1: Full-Stack / Software Developer (federal IT roles)

```
site:psjobs-emploisfp.psc-cfp.gc.ca "developer" "Ottawa"
site:psjobs-emploisfp.psc-cfp.gc.ca "IT analyst" "Ottawa"
site:psjobs-emploisfp.psc-cfp.gc.ca "software" "EN" Ottawa
site:psjobs-emploisfp.psc-cfp.gc.ca "application developer" Ottawa
site:psjobs-emploisfp.psc-cfp.gc.ca "CS-02" OR "CS-03" developer Ottawa
```

### Priority 2: Cloud / DevOps / IT Operations (federal)

```
site:psjobs-emploisfp.psc-cfp.gc.ca "cloud" Ottawa
site:psjobs-emploisfp.psc-cfp.gc.ca "DevOps" Ottawa
site:psjobs-emploisfp.psc-cfp.gc.ca "IT infrastructure" Ottawa
site:psjobs-emploisfp.psc-cfp.gc.ca "systems analyst" Ottawa
```

### Priority 3: Broader federal IT net

```
site:psjobs-emploisfp.psc-cfp.gc.ca "IT-02" OR "IT-03" Ottawa
site:psjobs-emploisfp.psc-cfp.gc.ca "junior" developer Ottawa
site:psjobs-emploisfp.psc-cfp.gc.ca "information technology" analyst Ottawa
```

## Output format

Extract from each WebSearch result:
- `title` — from the snippet (GC Jobs titles often include classification e.g. "IT Analyst (CS-03)")
- `company` — the federal department (e.g. "Treasury Board of Canada", "Department of National Defence")
- `location` — usually Ottawa, ON; remote/hybrid sometimes stated
- `date` — from snippet if visible
- `url` — the `psjobs-emploisfp.psc-cfp.gc.ca/...` URL from the search result

**Important GC Jobs conventions:**
- Classification codes like `CS-02`, `IT-03` indicate seniority — CS-02/IT-02 are
  roughly junior/intermediate. Flag CS-04+ or IT-04+ as potentially too senior.
- "Indeterminate" = permanent; "Term" = fixed-term contract. Both are valid to include.
- Security clearance: most external postings require only "Reliability Status"
  (obtainable post-hire, not a blocker). Flag "Secret" or "Top Secret" clearance
  requirements as they require existing clearance.
- Many GC Jobs postings have both English and French versions — deduplicate by
  reference number visible in the URL or snippet.

## Health check

For `/scrape health`, run one sentinel WebSearch query:
```
site:psjobs-emploisfp.psc-cfp.gc.ca "IT" Ottawa
```
If WebSearch returns zero results, mark as **broken** (Google may have stopped
indexing this domain). A handful of results is normal — not every posting gets indexed.
