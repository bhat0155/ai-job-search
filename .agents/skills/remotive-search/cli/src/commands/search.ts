import { API_BASE, apiFetch, isCanadaEligible, toJobCard, withinDays, writeError, type JobCard, type RemotiveJob } from "../helpers.js"

export interface SearchOpts {
  query?: string
  category?: string
  jobage?: number
  limit?: number
  format: "json" | "table" | "plain"
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 46).padEnd(46)
    const company = (c.company || "—").slice(0, 26).padEnd(26)
    const loc = (c.location || "—").slice(0, 20).padEnd(20)
    const date = (c.date || "—").slice(0, 10)
    return `${c.id.padEnd(8)} ${title} ${company} ${loc} ${date}`
  })
  const header = "ID".padEnd(8) + " " + "TITLE".padEnd(46) + " " + "COMPANY".padEnd(26) + " " + "LOCATION".padEnd(20) + " DATE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const params = new URLSearchParams()
    if (opts.query) params.set("search", opts.query)
    if (opts.category) params.set("category", opts.category)
    params.set("limit", "100") // fetch more, filter client-side

    const url = `${API_BASE}?${params.toString()}`
    const data = (await apiFetch(url)) as { jobs: RemotiveJob[] }
    let cards = (data.jobs || []).filter((j) => isCanadaEligible(j.candidate_required_location)).map(toJobCard)

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
        cards.map((c) => `${c.title}\n  ${c.company} · ${c.location} · ${c.date || "—"}\n  id: ${c.id}\n  salary: ${c.salary || "—"}\n  tags: ${c.tags.join(", ") || "—"}\n  ${c.url}`).join("\n\n") + "\n",
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
