import {
  SEARCH_URL,
  htmlFetch,
  parseJobCards,
  writeError,
  type JobCard,
} from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  province?: string
  remote?: boolean
  jobage?: number
  limit?: number
  format: "json" | "table" | "plain"
}

function buildUrl(opts: SearchOpts): string {
  const params = new URLSearchParams()
  if (opts.query) params.set("searchstring", opts.query)
  if (opts.location) params.set("locationstring", opts.location)
  if (opts.province) params.set("fprov", opts.province.toUpperCase())
  if (opts.remote) params.set("anywhereInCanada", "1")
  params.set("sort", "D") // date descending — most recent first
  params.set("action", "search")
  return `${SEARCH_URL}?${params.toString()}`
}

/** Filter cards to those posted within jobage days. */
function withinDays(date: string | null, days: number): boolean {
  if (!date) return true // unknown date → include
  const posted = new Date(date)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return posted >= cutoff
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 44).padEnd(44)
    const company = (c.company || "—").slice(0, 28).padEnd(28)
    const loc = (c.location || "—").slice(0, 22).padEnd(22)
    const date = (c.date || "—").slice(0, 10)
    return `${c.id.padEnd(10)} ${title} ${company} ${loc} ${date}`
  })
  const header =
    "ID".padEnd(10) +
    " " +
    "TITLE".padEnd(44) +
    " " +
    "COMPANY".padEnd(28) +
    " " +
    "LOCATION".padEnd(22) +
    " DATE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const url = buildUrl(opts)
    const html = await htmlFetch(url)
    if (!html) {
      writeError("No response from jobbank.gc.ca", "EMPTY_RESPONSE")
      return 1
    }

    let cards = parseJobCards(html)

    // Client-side recency filter
    if (opts.jobage && opts.jobage > 0 && opts.jobage < 9999) {
      cards = cards.filter((c) => withinDays(c.date, opts.jobage!))
    }

    if (opts.limit !== undefined && opts.limit >= 0) {
      cards = cards.slice(0, opts.limit)
    }

    if (opts.format === "table") {
      process.stdout.write(renderTable(cards) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map(
            (c) =>
              `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.date || "—"}\n  id: ${c.id}\n  salary: ${c.salary || "—"}\n  ${c.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify({ meta: { count: cards.length }, results: cards }, null, 2) + "\n",
      )
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}
