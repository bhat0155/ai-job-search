import { FEED_BASE, writeError } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

function normalizeUrl(input: string): string {
  if (input.startsWith("http")) return input
  return `${FEED_BASE}/remote-jobs/${input}`
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const url = normalizeUrl(opts.id)
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) { writeError(`HTTP ${res.status} for ${url}`, "FETCH_FAILED"); return 1 }
    const html = await res.text()

    // Extract description from listing page
    const descMatch = html.match(/<div[^>]*class="[^"]*listing-container[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
    const description = descMatch ? stripHtml(descMatch[1]).slice(0, 3000) : "(description unavailable — open URL in browser)"

    // Extract title
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
    const title = titleMatch ? stripHtml(titleMatch[1]) : opts.id

    const result = { url, title, description }
    if (opts.format === "plain") {
      process.stdout.write(`${title}\n\n${description}\n\nURL: ${url}\n`)
    } else {
      process.stdout.write(JSON.stringify(result, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}
