# Search Queries for Job Scraper — Ekam Bhatia

<!-- Canada-wide job search: Ottawa preferred, remote Canada, open to relocate anywhere in Canada -->

## Installed portal CLIs (primary for `/scrape`)

`/scrape` discovers every portal skill under `.agents/skills/*/SKILL.md` and runs its CLI first.

**Installed and enabled CLIs (bash):**
- `linkedin-search` — LinkedIn jobs (worldwide, `--location`, `--jobage`, `--remote`)
- `freehire-search` — Freehire.me (remote-first tech, `--country CA`, `--seniority junior`)
- `jobbank-gc-search` — Government of Canada Job Bank (jobbank.gc.ca, `--province`, `--jobage`, `--remote`)
- `remotive-search` — Remotive.com (remote tech JSON API, `--query`, `--category`, `--jobage`; auto-filters Canada/Worldwide)
- `weworkremotely-search` — We Work Remotely RSS (`--query`, `--category all|programming|devops-sysadmin`, `--jobage`; auto-filters Anywhere/North America/Canada)
- `himalayas-search` — Himalayas.app (remote tech JSON API, `--query`, `--jobage`; auto-filters Canada/Worldwide)

**Installed and enabled (WebSearch-based — no CLI, see each SKILL.md for queries):**
- `indeed-ca-search` — Indeed Canada (ca.indeed.com); Cloudflare blocks all HTTP — uses `site:ca.indeed.com/viewjob` WebSearch
- `psjobs-search` — GC Jobs / PS Jobs (psjobs-emploisfp.psc-cfp.gc.ca); JS session required — uses `site:psjobs-emploisfp.psc-cfp.gc.ca` WebSearch
- `otta-search` — Otta.com (tech-focused board); Next.js SPA — uses `site:otta.com` WebSearch
- `monster-ca-search` — Monster Canada (monster.ca); Next.js SPA — uses `site:monster.ca` WebSearch

**No viable coverage (skip entirely):**
- **Workopolis / Glassdoor** — 403 on all requests; no viable fallback
- **ca.talent.com** — Next.js shell, no embedded job data, no public API
- **hiring.cafe** — 100% client-side Algolia; not accessible without API credentials

## Installed portal skills

CLI portals: `linkedin-search`, `freehire-search`, `jobbank-gc-search`, `remotive-search`, `weworkremotely-search`, `himalayas-search`
WebSearch portals: `indeed-ca-search`, `psjobs-search`, `otta-search`, `monster-ca-search`
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
--query "software developer" --province BC --jobage 14
--query "software developer" --province AB --jobage 14
--query "full stack developer" --province QC --jobage 14
```

**linkedin-search CLI queries (run these via the CLI):**
```
--query "software developer" --location "Ottawa, Ontario, Canada" --jobage 14
--query "full stack developer" --location "Canada" --remote remote --jobage 14
--query "junior software developer" --location "Canada" --jobage 14
--query "TypeScript developer" --location "Canada" --jobage 14
--query "React developer" --location "Toronto, Ontario, Canada" --jobage 14
--query "Node.js developer" --location "Vancouver, British Columbia, Canada" --jobage 14
--query "application developer" --location "Canada" --remote hybrid --jobage 14
```

**freehire-search CLI queries (run these via the CLI):**
```
--category fullstack --country CA --seniority junior --jobage 14
--category fullstack --remote remote --seniority junior --jobage 14
--query "TypeScript" --category fullstack --seniority junior --jobage 14
```
Note: use `--category fullstack` not `--query "full stack developer" --country CA --seniority junior` — the latter returns non-tech results because freehire's seniority tag spans all roles.

**remotive-search CLI queries:**
```
--query "full stack developer" --category software-development --jobage 14
--query "TypeScript developer" --jobage 14
--query "React Node.js" --category software-development --jobage 14
--query "junior developer" --category software-development --jobage 14
```

**weworkremotely-search CLI queries:**
```
--query "developer" --category all --jobage 14
--query "TypeScript" --category all --jobage 14
--query "React" --category all --jobage 14
--query "Node.js" --category all --jobage 14
```

**himalayas-search CLI queries:**
```
--query "full stack developer" --jobage 14
--query "TypeScript React" --jobage 14
--query "junior software developer" --jobage 14
```

**indeed-ca-search (WebSearch portal skill — see `.agents/skills/indeed-ca-search/SKILL.md` for queries)**
**otta-search (WebSearch portal skill — see `.agents/skills/otta-search/SKILL.md` for queries)**
**monster-ca-search (WebSearch portal skill — see `.agents/skills/monster-ca-search/SKILL.md` for queries)**

**WebSearch fallback (non-portal boards):**
```
site:workopolis.com/job "full-stack developer" "TypeScript" Ottawa Canada
site:eluta.ca/jobs "software developer" "TypeScript" Ottawa
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
--query "DevOps engineer" --province BC --jobage 14
--query "DevOps engineer" --province AB --jobage 14
--query "platform engineer" --jobage 14
```

**linkedin-search CLI queries:**
```
--query "cloud engineer" --location "Canada" --jobage 14
--query "DevOps engineer" --location "Ottawa, Ontario, Canada" --jobage 14
--query "DevOps engineer" --location "Canada" --remote remote --jobage 14
--query "platform engineer" --location "Canada" --jobage 14
--query "junior cloud engineer" --location "Canada" --jobage 14
--query "Azure developer" --location "Canada" --jobage 14
--query "infrastructure developer" --location "Toronto, Ontario, Canada" --jobage 14
```

**freehire-search CLI queries:**
```
--category devops --country CA --seniority junior --jobage 14
--category devops --remote remote --seniority junior --jobage 14
--query "kubernetes" --category devops --seniority junior --jobage 14
```

**remotive-search CLI queries:**
```
--query "DevOps" --category devops --jobage 14
--query "cloud engineer" --jobage 14
--query "Kubernetes" --category devops --jobage 14
```

**weworkremotely-search CLI queries:**
```
--query "DevOps" --category devops-sysadmin --jobage 14
--query "cloud engineer" --category devops-sysadmin --jobage 14
--query "Terraform" --category all --jobage 14
```

**himalayas-search CLI queries:**
```
--query "DevOps engineer" --jobage 14
--query "cloud engineer Azure" --jobage 14
```

**indeed-ca-search (WebSearch portal skill — see `.agents/skills/indeed-ca-search/SKILL.md` for queries)**

**WebSearch fallback (non-portal boards):**
```
site:workopolis.com/job "cloud engineer" "Azure" Canada
```

### Priority 3: SRE / Cloud Support / Technical Support Engineer (Side-door + Amazon background)

These are "side-door" roles — support titles that provide production cloud exposure and a proven internal promotion path to SRE/cloud engineer within 12–18 months. Ekam's Amazon support background (1,000+ tickets, 95% SLA) + cloud stack makes him genuinely competitive here. Run these alongside Priority 1 and 2, not after them.

**jobbank-gc-search CLI queries:**
```
--query "technical support engineer" --jobage 14
--query "application support analyst" --jobage 14
--query "IT operations analyst" --jobage 14
--query "cloud support" --jobage 14
--query "cloud operations" --province ON --jobage 14
--query "cloud administrator" --jobage 14
--query "platform support" --jobage 14
```

**linkedin-search CLI queries:**
```
--query "cloud support engineer" --location "Canada" --jobage 14
--query "technical support engineer" --location "Canada" --jobage 14
--query "application support analyst" --location "Ottawa, Ontario, Canada" --jobage 14
--query "IT operations analyst" --location "Ottawa, Ontario, Canada" --jobage 14
--query "cloud operations analyst" --location "Canada" --jobage 14
--query "junior site reliability engineer" --location "Canada" --jobage 14
--query "cloud administrator" --location "Canada" --jobage 14
--query "platform support engineer" --location "Canada" --jobage 14
```

**remotive-search CLI queries:**
```
--query "technical support engineer" --category information-technology --jobage 14
--query "cloud support" --jobage 14
```

**weworkremotely-search CLI queries:**
```
--query "support engineer" --category devops-sysadmin --jobage 14
--query "SRE" --category all --jobage 14
```

**indeed-ca-search (WebSearch portal skill — see `.agents/skills/indeed-ca-search/SKILL.md` for queries)**

**WebSearch fallback (non-portal boards):**
```
site:careers.microsoft.com "cloud support engineer" Canada
site:pythian.com/company/careers "cloud" support
site:cgi.com/en/careers "cloud" "support" Ottawa
```

### Priority 4: Adjacent / Broader Net

Wider sweep for roles that match partial stack or adjacent skills.

**linkedin-search CLI queries:**
```
--query "backend developer" --location "Canada" --remote remote --jobage 14
--query "frontend developer" --location "Ottawa, Ontario, Canada" --jobage 14
--query "React developer" --location "Canada" --jobage 14
--query "junior systems analyst" --location "Ottawa, Ontario, Canada" --jobage 14
--query "solutions engineer" --location "Canada" --jobage 14
--query "implementation engineer" --location "Canada" --jobage 14
```

**indeed-ca-search (WebSearch portal skill — see `.agents/skills/indeed-ca-search/SKILL.md` for queries)**

**WebSearch fallback (non-portal boards):**
```
site:linkedin.com/jobs "backend developer" "Node.js" Canada
site:linkedin.com/jobs "React developer" Canada remote
site:linkedin.com/jobs "junior systems analyst" Ottawa Canada
```

### Priority 5: Federal / Government (Ottawa advantage)

Ottawa's federal government and GC contractors are a strong geographic fit.

**jobbank-gc-search CLI queries (covers GC contractors and gov-adjacent employers):**
```
--query "IT analyst" --province ON --location "Ottawa, Ontario" --jobage 14
--query "software developer" --province ON --location "Ottawa, Ontario" --jobage 14
--query "application developer" --province ON --jobage 14
--query "systems analyst" --province ON --jobage 14
--query "IT consultant" --province ON --jobage 14
```

**linkedin-search CLI queries:**
```
--query "IT analyst" --location "Ottawa, Ontario, Canada" --jobage 14
--query "junior developer" --location "Ottawa, Ontario, Canada" --jobage 14
--query "application developer" --location "Ottawa, Ontario, Canada" --jobage 14
```

**psjobs-search (WebSearch portal skill — see `.agents/skills/psjobs-search/SKILL.md` for queries)**

**indeed-ca-search (WebSearch portal skill — GC contractor roles):**
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

Candidate is based in Ottawa but **open to relocating anywhere in Canada** for the right role. Never exclude a job solely because it is outside Ottawa.

When evaluating results, apply this tier priority:
- **Ideal:** Ottawa, Kanata, Gatineau (on-site or hybrid) — any salary ≥ CAD 60k
- **Ideal:** Remote-Canada (any province) — any salary ≥ CAD 60k
- **Relocation-open:** Toronto, Vancouver, Calgary, Montreal, Edmonton, Waterloo (hybrid/on-site) — include and flag salary ≥ CAD 65k given cost of living difference
- **US roles:** FAIL — no work authorization. Exclude even if labelled "remote" unless the posting explicitly says "Canada remote"
- **French-primary:** FLAG if posting requires professional/bilingual French proficiency as a hard requirement (conversational French is fine)

## Date Filter

Only include jobs posted within the last **14 days**, or with an application deadline that has not yet passed.
If a posting date cannot be determined, include it but flag as "date unknown."

## Hard Filters (auto-exclude)

Exclude postings that match any of these:
- Require US work authorization or are US-only
- Title contains: Senior, Lead, Staff, Principal, Director, Manager, VP, Architect (unless "junior" or "associate" also appears) — **exception: support/operations titles like "Senior Support Analyst" where the "senior" reflects tenure tier, not a software engineering seniority level. Use judgment.**
- Primary language is Java, Go, or C++ (without JS/TS mentioned) — **exception: support/cloud ops roles where the stack is infrastructure tooling (Terraform, Azure, Kubernetes) and coding is secondary**
- Require professional/bilingual French proficiency as a hard requirement
- Unpaid / internship-only with no hire path stated
- Require active Secret or Top Secret security clearance (Reliability Level clearance is acceptable — it is obtainable post-hire)

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
