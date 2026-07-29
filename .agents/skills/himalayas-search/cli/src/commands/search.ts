import { API_BASE, apiFetch, isCanadaEligible, toJobCard, withinDays, writeError, type HimalayasJob, type JobCard } from "../helpers.js"

export interface SearchOpts {
  query?: string
  jobage?: number
  limit?: number
  format: "json" | "table" | "plain"
}

interface ApiResponse {
  jobs: HimalayasJob[]
  totalCount: number
  offset: number
  limit: number
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 44).padEnd(44)
    const company = (c.company || "—").slice(0, 24).padEnd(24)
    const loc = (c.location || "—").slice(0, 22).padEnd(22)
    const date = (c.date || "—").slice(0, 10)
    return `${title} ${company} ${loc} ${date}`
  })
  const header = "TITLE".padEnd(44) + " " + "COMPANY".padEnd(24) + " " + "LOCATION".padEnd(22) + " DATE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const params = new URLSearchParams()
    if (opts.query) params.set("q", opts.query)
    params.set("limit", "50")

    const data = (await apiFetch(`${API_BASE}?${params.toString()}`)) as ApiResponse
    let cards = (data.jobs || []).filter((j) => isCanadaEligible(j.locationRestrictions)).map(toJobCard)

    if (opts.jobage && opts.jobage > 0) {
      cards = cards.filter((c) => withinDays(c.date, opts.jobage!))
    }

    if (opts.limit !== undefined && opts.limit >= 0) {
      cards = cards.slice(0, opts.limit)
    }

    if (opts.format === "table") {
      process.stdout.write(renderTable(cards) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards.map((c) => `${c.title}\n  ${c.company} · ${c.location} · ${c.date || "—"}\n  seniority: ${c.seniority || "—"}\n  salary: ${c.salary || "—"}\n  ${c.url}`).join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(JSON.stringify({ meta: { count: cards.length }, results: cards }, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}
