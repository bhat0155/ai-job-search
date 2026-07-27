---
name: jobbank-gc-search
version: 1.0.0
description: >
  Search live job listings from the Government of Canada Job Bank (jobbank.gc.ca) —
  Canada's official federal job board. Covers all provinces and territories, with
  strong coverage of government, crown corp, and federally-regulated employer postings.
  Use this for any Canadian job search, especially Ottawa/federal roles.
context: fork
enabled: true
allowed-tools: Bash(~/.bun/bin/bun run .agents/skills/jobbank-gc-search/cli/src/cli.ts *)
---

# Government of Canada Job Bank Search

Search live Canadian job listings from [jobbank.gc.ca](https://www.jobbank.gc.ca) — the
Government of Canada's official job board. Covers federal, provincial, and private-sector
employers posting across all provinces.

## Commands

### Search jobs

```bash
~/.bun/bin/bun run .agents/skills/jobbank-gc-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--query, -q <text>` — keyword search (title, skill). Recommended.
- `--location, -l <text>` — location string (e.g. `"Ottawa, Ontario"`, `"Vancouver, BC"`)
- `--province, -p <code>` — province code: `ON`, `BC`, `AB`, `QC`, `MB`, `SK`, `NS`, `NB`, `NL`, `PE`, `NT`, `YT`, `NU`
- `--remote` — filter for remote / anywhere in Canada jobs
- `--jobage <days>` — client-side filter: only show results posted within N days
- `--limit, -n <n>` — cap results returned
- `--format <fmt>` — `json` (default) | `table` | `plain`

### Full job detail

```bash
~/.bun/bin/bun run .agents/skills/jobbank-gc-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`id` is the numeric job posting ID from search results (e.g. `49950540`), or paste the full URL.

---

## Usage examples

### Software developer jobs in Ottawa

```bash
~/.bun/bin/bun run .agents/skills/jobbank-gc-search/cli/src/cli.ts search \
  --query "software developer" \
  --province ON \
  --location "Ottawa, Ontario" \
  --jobage 14 \
  --format table
```

### Remote full-stack developer roles in Canada

```bash
~/.bun/bin/bun run .agents/skills/jobbank-gc-search/cli/src/cli.ts search \
  --query "full stack developer" \
  --remote \
  --jobage 14 \
  --format json
```

### Cloud / DevOps jobs, any province, recent

```bash
~/.bun/bin/bun run .agents/skills/jobbank-gc-search/cli/src/cli.ts search \
  --query "DevOps engineer" \
  --jobage 14 \
  --limit 20 \
  --format json
```

### Get full details for a specific posting

```bash
~/.bun/bin/bun run .agents/skills/jobbank-gc-search/cli/src/cli.ts detail 49950540 --format plain
```

---

## Output

All commands write to **stdout**. Errors go to **stderr** as `{ "error": "...", "code": "..." }`.

| Format | Best for |
|--------|----------|
| `json` | Default — `{ meta: { count, page }, results: [...] }` |
| `table` | Quick human-readable list |
| `plain` | Detail view — full description text |

JSON result fields: `id`, `title`, `company`, `location`, `salary`, `date`, `url`

Detail adds: `description`, `deadline`, `employmentType`, `applyUrl`

---

## Notes

- Data is from the public jobbank.gc.ca HTML pages. No API key required.
- `--jobage` is a client-side filter; results are fetched sorted by date, then trimmed.
- `--remote` sets `anywhereInCanada=1` in the search request.
- Province codes must be the two-letter abbreviation (e.g. `ON` not `Ontario`).
- If the page structure changes and parsing degrades, check the URL anchors in this skill's directory.
