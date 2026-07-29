---
name: indeed-ca-search
version: 1.0.0
description: >
  Search job listings from Indeed Canada (ca.indeed.com) — Canada's largest general
  job board. No CLI: Indeed blocks all automated HTTP access via Cloudflare. This
  skill uses WebSearch with site: queries instead. Trigger phrases: find jobs on
  Indeed, Indeed Canada jobs, search Indeed, ca.indeed.com.
context: fork
enabled: true
search-method: websearch
allowed-tools: WebSearch, WebFetch
---

# Indeed Canada Search Skill

Search job listings from **[ca.indeed.com](https://ca.indeed.com)** — Canada's
largest general job board.

## Why no CLI

Indeed Canada blocks all automated HTTP requests via Cloudflare (returns a CAPTCHA
challenge page regardless of User-Agent). A CLI is not feasible. This skill uses
`WebSearch` with `site:ca.indeed.com/viewjob` queries instead — individual posting
pages are indexed by Google and can be found this way.

## How `/scrape` should use this skill

There is no `bun run` command. When `/scrape` reads this SKILL.md in Step 1b, it
must use `WebSearch` with the queries below. The `site:ca.indeed.com/viewjob`
operator targets individual job posting pages (not category/search pages, which
return no useful snippets).

**Do not attempt `WebFetch` on `ca.indeed.com` URLs — they 403 or return a captcha.
Store the URL as-is for the user to open manually.**

## Search queries

Run these via `WebSearch`. Adjust `--jobage` equivalent by appending `after:YYYY-MM-DD`
in the query if the WebSearch tool supports date filtering; otherwise include the date
window in the query text.

### Priority 1: Full-Stack / Software Developer

```
site:ca.indeed.com/viewjob "software developer" "TypeScript" Ottawa
site:ca.indeed.com/viewjob "full-stack developer" "React" Ottawa
site:ca.indeed.com/viewjob "junior software developer" "Node.js" Canada
site:ca.indeed.com/viewjob "full stack developer" "TypeScript" Canada remote
site:ca.indeed.com/viewjob "application developer" "React" "Node.js" Canada
```

### Priority 2: Cloud / DevOps

```
site:ca.indeed.com/viewjob "cloud engineer" "Azure" Ottawa Canada
site:ca.indeed.com/viewjob "DevOps engineer" "Terraform" Canada
site:ca.indeed.com/viewjob "junior DevOps" "Azure" Canada
site:ca.indeed.com/viewjob "platform engineer" "Kubernetes" Canada
```

### Priority 3: Cloud Support / Technical Support Engineer

```
site:ca.indeed.com/viewjob "cloud support engineer" Canada
site:ca.indeed.com/viewjob "technical support engineer" "Azure" OR "AWS" Canada
site:ca.indeed.com/viewjob "application support analyst" "Node.js" OR "TypeScript" Canada
site:ca.indeed.com/viewjob "cloud operations" "junior" OR "associate" Canada
```

### Priority 4: Adjacent / Broader

```
site:ca.indeed.com/viewjob "backend developer" "Node.js" Canada
site:ca.indeed.com/viewjob "frontend developer" "React" Ottawa
site:ca.indeed.com/viewjob "implementation engineer" "SaaS" Canada
site:ca.indeed.com/viewjob "junior developer" "TypeScript" "React" Canada remote
site:ca.indeed.com/viewjob "new grad" "software developer" Canada
```

## Output format

WebSearch returns snippets only. Extract from each result:
- `title` — from the page title or snippet heading
- `company` — usually in the snippet ("Company Name - Ottawa, ON")
- `location` — from the snippet
- `date` — from the snippet if visible ("3 days ago", "Posted July 25")
- `url` — the `ca.indeed.com/viewjob?jk=...` URL from the search result

Do **not** attempt to `WebFetch` the job URL — it will 403. Store the URL for the
user to open in a browser. Set `applyUrl` to the same URL.

## Health check

For `/scrape health`, run one sentinel WebSearch query:
```
site:ca.indeed.com/viewjob "developer" Canada
```
If WebSearch returns zero results with this query, mark as **broken** (Google may
have de-indexed the site: operator for this domain). A small number of results (1–3)
is normal — Google doesn't index every posting. **Never** test with a direct HTTP
fetch to ca.indeed.com.
