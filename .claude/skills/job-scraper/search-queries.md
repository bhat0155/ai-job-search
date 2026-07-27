# Search Queries for Job Scraper — Ekam Bhatia

<!-- Canada-focused job search: Ottawa, remote Canada, and Toronto -->

## Installed portal CLIs (primary for `/scrape`)

`/scrape` discovers every portal skill under `.agents/skills/*/SKILL.md` and runs its CLI first.

**Installed and enabled CLIs:**
- `linkedin-search` — LinkedIn jobs (worldwide, supports `--location`, `--jobage`, `--remote`)
- `freehire-search` — Freehire.me (remote-first tech jobs, `--country CA`, `--seniority junior`)
- `jobbank-gc-search` — Government of Canada Job Bank (jobbank.gc.ca, `--province`, `--jobage`, `--remote`)

**Coverage gaps (not feasible as CLIs — use WebSearch fallback):**
- **Indeed Canada** — hard 403 on all endpoints including individual job pages; covered via `site:ca.indeed.com/viewjob` WebSearch (Google snippets only — URL saved for manual application)
- **PS Jobs** — fully JavaScript-rendered, no accessible API; covered via `site:psjobs-emploisfp.psc-cfp.gc.ca` WebSearch
- **Workopolis / Glassdoor** — 403 on all requests; no viable fallback
- **hiring.cafe** — keyword search is 100% client-side Algolia; not accessible without API credentials

The `site:` query templates below are the **WebSearch fallback**. For Indeed, use `site:ca.indeed.com/viewjob` (individual posting pages) not `site:ca.indeed.com` (returns category pages). WebFetch on Indeed URLs will 403 — treat WebSearch snippets as read-only leads.

## Installed portal CLIs

Active: `linkedin-search`, `freehire-search`, `jobbank-gc-search`
Disabled: `jobbank-search` (targets jobbank.dk — Denmark, not Canada).
Removed Danish portals (`jobdanmark-search`, `jobindex-search`, `jobnet-search`) — irrelevant for Canada.

## Search Sites

Primary (Canadian job boards):
- **ca.indeed.com** - Canada's largest general job board
- **linkedin.com/jobs** - LinkedIn job listings; also covered by `linkedin-search` CLI
- **jobbank.gc.ca** - Government of Canada Job Bank; also covered by `jobbank-search` CLI
- **workopolis.com** - Canadian job board
- **ca.talent.com** - Canadian aggregator (pulls from Indeed, Monster, and company boards)
- **eluta.ca** - Canadian job board that indexes company career pages directly
- ~~**goodwork.ca**~~ — environmental/conservation sector only; no tech dev roles; removed from rotation

Secondary (company career pages — Ottawa/Canada tech targets):
- **Shopify:** careers.shopify.com
- **Kinaxis:** kinaxis.com/en/careers
- **OpenText:** opentext.com/about/careers
- **Clio:** clio.com/careers
- **Pythian:** pythian.com/company/careers
- **CGI Group:** cgi.com/en/careers
- **Ciena:** ciena.com/about/careers
- **QNX/BlackBerry:** blackberry.com/us/en/company/careers

## Query Categories

### Priority 1: Full-Stack / Software Developer (Strongest fit)

These match the core JS/TS/React/Node.js stack and are the most likely to land interviews.

**jobbank-gc-search CLI queries (run these via the CLI):**
```
--query "software developer" --province ON --jobage 14
--query "full stack developer" --jobage 14
--query "full stack developer" --remote --jobage 14
--query "junior software developer" --jobage 14
--query "React developer" --jobage 14
--query "Node.js developer" --jobage 14
```

**WebSearch fallback (for boards not covered by CLIs):**
```
site:ca.indeed.com/viewjob "software developer" "TypeScript" Ottawa
site:ca.indeed.com/viewjob "full-stack developer" "React" Ottawa
site:ca.indeed.com/viewjob "junior software developer" "Node.js" Canada
site:workopolis.com/job "full-stack developer" "TypeScript" Ottawa Canada
site:eluta.ca/jobs "software developer" "TypeScript" Ottawa
site:goodwork.ca/jobs "developer" "React" "Node.js"
site:wellfound.com/jobs "full stack" "TypeScript" Canada remote
```

### Priority 2: Cloud / DevOps / Platform Engineer (Strong differentiator)

Ekam's Azure + Terraform + Kubernetes depth makes him competitive at junior/associate level.

**jobbank-gc-search CLI queries:**
```
--query "cloud engineer" --jobage 14
--query "DevOps engineer" --province ON --jobage 14
--query "cloud developer" --jobage 14
--query "DevOps" --remote --jobage 14
```

**WebSearch fallback:**
```
site:ca.indeed.com/viewjob "cloud engineer" "Azure" Ottawa Canada
site:ca.indeed.com/viewjob "DevOps engineer" "Terraform" Canada
site:ca.indeed.com/viewjob "junior DevOps" "Azure" Canada
site:workopolis.com/job "cloud engineer" "Azure" Canada
```

### Priority 3: SRE / Production Support / Technical Support Engineer (Leverages Amazon background)

Bridges the support background + cloud skills for reliability/operations-focused roles.

**jobbank-gc-search CLI queries:**
```
--query "site reliability engineer" --jobage 14
--query "production support developer" --jobage 14
--query "technical support engineer" --jobage 14
```

**WebSearch fallback (Google-indexed Indeed pages — snippets only, pages may 403 on fetch):**
```
site:ca.indeed.com/viewjob "site reliability engineer" "junior" Canada
site:ca.indeed.com/viewjob "production support" "developer" Canada
site:ca.indeed.com/viewjob "technical support engineer" "cloud" Ottawa Canada
site:ca.indeed.com/viewjob "application support" "TypeScript" Canada
```

### Priority 4: Adjacent / Broader Net

Wider sweep for roles that match partial stack or adjacent skills.

```
site:ca.indeed.com/viewjob "backend developer" "Node.js" Canada
site:ca.indeed.com/viewjob "frontend developer" "React" Ottawa
site:ca.indeed.com/viewjob "React developer" "junior" Canada
site:ca.indeed.com/viewjob "implementation engineer" "SaaS" Canada
site:linkedin.com/jobs "backend developer" "Node.js" Canada
site:linkedin.com/jobs "React developer" Canada remote
site:linkedin.com/jobs "junior systems analyst" Ottawa Canada
```

### Priority 5: Federal / Government (Ottawa advantage)

Ottawa's federal government and GC contractors are a strong geographic fit.
**Coverage note:** PS Jobs (`psjobs-emploisfp.psc-cfp.gc.ca`) is fully JavaScript-rendered — no CLI possible. Use the two-pronged approach below: GC Job Bank CLI for non-internal postings + WebSearch for Google-indexed PS Jobs pages.

**jobbank-gc-search CLI queries (covers GC contractors and gov-adjacent employers):**
```
--query "IT analyst" --province ON --location "Ottawa, Ontario" --jobage 14
--query "software developer" --province ON --location "Ottawa, Ontario" --jobage 14
--query "application developer" --province ON --jobage 14
--query "systems analyst" --province ON --jobage 14
```

**WebSearch — PS Jobs portal (Google indexes individual postings here):**
```
site:psjobs-emploisfp.psc-cfp.gc.ca "developer" "Ottawa"
site:psjobs-emploisfp.psc-cfp.gc.ca "IT analyst" "Ottawa"
site:psjobs-emploisfp.psc-cfp.gc.ca "software" "EN"
```

**WebSearch — GC contractors (non-clearance roles):**
```
site:ca.indeed.com/viewjob "CGI" "developer" Ottawa
site:ca.indeed.com/viewjob "Pythian" developer Ottawa
site:ca.indeed.com/viewjob "government of Canada" "IT analyst" Ottawa
site:ca.indeed.com/viewjob "federal" "developer" "Node.js" OR "React" Canada
```

### Priority 6: Ottawa Tech Company Career Pages (direct targeting)

High-value Ottawa/Canadian tech employers that hire junior devs on your stack. Search their career pages directly rather than waiting for board postings.

```
site:careers.shopify.com "developer" "junior" OR "associate"
site:kinaxis.com "software developer" junior
site:clio.com "developer" junior associate
site:opentext.com "developer" "junior" OR "associate" Canada
site:ciena.com "software" "developer" junior Ottawa
site:blackberry.com "software" "developer" junior Ottawa
site:eluta.ca "software developer" "TypeScript" Ottawa
# site:goodwork.ca removed — confirmed environmental jobs board; no tech dev roles
```

### Priority 7: Canadian Banks & Consulting (fintech + IT consulting)

Big 5 banks and IT consultancies hire junior devs and cloud engineers on your stack regularly. Lower competition than product companies.

```
site:jobs.rbc.com "software developer" junior associate
site:jobs.td.com "software developer" junior associate
site:careers.cibc.com "developer" junior associate
site:bmo.com/en/jobs "developer" junior
site:careers.accenture.com "developer" "junior" Canada
site:amazon.jobs "developer" Canada "junior" OR "associate"
site:bell.ca/Careers "developer" junior
site:telus.com/en/about/careers "developer" junior
```

### Priority 8: Startup & New Grad Boards

Canadian-focused boards with strong new-grad inventory. Lower applicant volume than LinkedIn/Indeed.
Note: hiring.cafe requires browser automation (JS-rendered) — use WebFetch on specific job URLs if found via LinkedIn/Indeed.

```
site:hatchways.io "developer" "TypeScript" Canada
site:wellfound.com/jobs "software developer" "TypeScript" Canada remote
site:wellfound.com/jobs "junior developer" "React" "Node.js" Canada
site:ca.indeed.com/viewjob "junior developer" "TypeScript" "React" Canada remote
site:ca.indeed.com/viewjob "new grad" "software developer" Canada
```

## Location Filter

When evaluating results, apply this tier priority:
- **Ideal:** Ottawa, Kanata, Gatineau (on-site or hybrid) — any salary ≥ CAD 60k
- **Acceptable:** Remote-Canada (any province) — any salary ≥ CAD 60k
- **Relocation-open:** Toronto, Vancouver, Calgary, Montreal (hybrid/on-site) — flag for salary ≥ CAD 65k given cost of living
- **US roles:** FAIL — no work authorization. Do not include even if "remote"
- **French-primary:** FLAG if posting requires professional/bilingual French proficiency as hard requirement

## Date Filter

Only include jobs posted within the last **14 days**, or with an application deadline that has not yet passed.
If a posting date cannot be determined, include it but flag as "date unknown."

## Hard Filters (auto-exclude)

Exclude postings that match any of these:
- Require US work authorization or are US-only
- Title contains: Senior, Lead, Staff, Principal, Director, Manager, VP, Architect (unless "junior" or "associate" also appears)
- Primary language is Java, Go, or C++ (without JS/TS mentioned)
- Require professional/bilingual French proficiency as a hard requirement
- Unpaid / internship-only with no hire path stated

## Salary Context

Target range: **CAD 60,000 – 90,000** base.
- Below CAD 55k: flag as low — ask user before including
- Above CAD 90k: flag — likely requires more experience than Ekam has; check job level

## Adapting Queries

If the user specifies a focus area:
- `/scrape cloud` → run Priority 2 queries + generate 2-3 custom Azure/Kubernetes queries
- `/scrape fullstack` → run Priority 1 queries + generate 2-3 custom React/Node queries
- `/scrape ottawa` → run all priorities but filter to Ottawa/Kanata/Gatineau results only
- `/scrape remote` → run all priorities filtered to remote-Canada results
