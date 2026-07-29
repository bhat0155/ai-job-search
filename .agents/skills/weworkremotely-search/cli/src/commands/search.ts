import { CATEGORY_FEEDS, fetchRss, isCanadaEligible, parseRss, withinDays, writeError, type JobCard } from "../helpers.js"

export interface SearchOpts {
  query?: string
  category: string
  jobage?: number
  limit?: number
  format: "json" | "table" | "plain"
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 46).padEnd(46)
    const company = (c.company || "—").slice(0, 24).padEnd(24)
    const region = (c.region || "—").slice(0, 22).padEnd(22)
    const date = (c.date || "—").slice(0, 10)
    return `${title} ${company} ${region} ${date}`
  })
  const header = "TITLE".padEnd(46) + " " + "COMPANY".padEnd(24) + " " + "REGION".padEnd(22) + " DATE"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const feedUrl = CATEGORY_FEEDS[opts.category] ?? CATEGORY_FEEDS["programming"]
    const xml = await fetchRss(feedUrl)
    let cards = parseRss(xml, opts.category).filter((c) => isCanadaEligible(c.region))

    // Keyword filter (client-side on title)
    if (opts.query) {
      const q = opts.query.toLowerCase()
      cards = cards.filter((c) => c.title.toLowerCase().includes(q) || (c.company ?? "").toLowerCase().includes(q))
    }

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
        cards.map((c) => `${c.title}\n  ${c.company || "—"} · ${c.region} · ${c.date || "—"}\n  ${c.url}`).join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(JSON.stringify({ meta: { count: cards.length, category: opts.category }, results: cards }, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}
