# Search Queries for Job Scraper — Ekam Bhatia

<!-- Canada-focused job search: Ottawa, remote Canada, and Toronto -->

## Installed portal CLIs (primary for `/scrape`)

`/scrape` discovers every portal skill under `.agents/skills/*/SKILL.md` and runs its CLI first.
Country-agnostic CLIs: `linkedin-search`, `freehire-search`.
The `site:` query templates below are the **WebSearch fallback** for portals without a CLI, company career pages, or when a CLI fails.

## Search Sites

Primary (Canadian job boards):
- **ca.indeed.com** - Canada's largest general job board
- **linkedin.com/jobs** - LinkedIn job listings (filter: Canada / Ottawa / remote); also covered by `linkedin-search` CLI
- **jobbank.gc.ca** - Government of Canada Job Bank (federal, public sector, and private)
- **workopolis.com** - Canadian job board

Secondary (company career pages via Google):
- Direct `site:` searches for specific target companies

## Query Categories

### Priority 1: Full-Stack / Software Developer (Strongest fit)

These match the core JS/TS/React/Node.js stack and are the most likely to land interviews.

```
site:ca.indeed.com "software developer" "TypeScript" Ottawa
site:ca.indeed.com "full-stack developer" "React" Ottawa
site:ca.indeed.com "full-stack developer" "Node.js" Canada remote
site:ca.indeed.com "junior software developer" "TypeScript" Canada
site:linkedin.com/jobs "software developer" TypeScript Ottawa Canada
site:linkedin.com/jobs "full-stack developer" React "Node.js" Canada
site:linkedin.com/jobs "associate software developer" TypeScript Canada
site:jobbank.gc.ca "software developer" "JavaScript" Ottawa
```

### Priority 2: Cloud / DevOps / Platform Engineer (Strong differentiator)

Ekam's Azure + Terraform + Kubernetes depth makes him competitive at junior/associate level.

```
site:ca.indeed.com "cloud engineer" "Azure" Ottawa Canada
site:ca.indeed.com "DevOps engineer" "Terraform" Canada
site:ca.indeed.com "junior DevOps" "Azure" Canada
site:ca.indeed.com "platform engineer" "Kubernetes" Canada remote
site:linkedin.com/jobs "cloud engineer" Azure Terraform Canada
site:linkedin.com/jobs "DevOps engineer" "junior" Azure Canada
site:linkedin.com/jobs "platform engineer" Kubernetes "junior" Canada
site:jobbank.gc.ca "cloud developer" "Azure" Canada
```

### Priority 3: SRE / Production Support / Technical Support Engineer (Leverages Amazon background)

Bridges the support background + cloud skills for reliability/operations-focused roles.

```
site:ca.indeed.com "site reliability engineer" "junior" Canada
site:ca.indeed.com "production support" "developer" Canada
site:ca.indeed.com "technical support engineer" "cloud" Ottawa Canada
site:ca.indeed.com "application support" "TypeScript" OR "Node.js" Canada
site:linkedin.com/jobs "SRE" "junior" "Canada"
site:linkedin.com/jobs "production support engineer" "developer" Canada
site:linkedin.com/jobs "technical support engineer" "Azure" Canada
```

### Priority 4: Adjacent / Broader Net

Wider sweep for roles that match partial stack or adjacent skills.

```
site:ca.indeed.com "backend developer" "Node.js" Canada
site:ca.indeed.com "frontend developer" "React" Ottawa
site:ca.indeed.com "React developer" "junior" Canada
site:ca.indeed.com "systems analyst" "junior" Ottawa Canada
site:ca.indeed.com "implementation engineer" "SaaS" Canada
site:ca.indeed.com "solutions engineer" "junior" Canada
site:linkedin.com/jobs "backend developer" "Node.js" Canada
site:linkedin.com/jobs "React developer" Canada remote
site:linkedin.com/jobs "junior systems analyst" Ottawa Canada
```

### Priority 5: Federal / Government (Ottawa advantage)

Ottawa's federal government and GC contractors are a strong geographic fit.

```
site:jobbank.gc.ca "IT analyst" Ottawa "junior"
site:jobbank.gc.ca "software developer" Ottawa federal
site:ca.indeed.com "federal government" "developer" Ottawa
site:ca.indeed.com "government of Canada" "IT" "junior" Ottawa
site:linkedin.com/jobs "government of Canada" developer Ottawa
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
