// Data source: We Work Remotely public RSS feeds (weworkremotely.com).
// No authentication required.

export const FEED_BASE = "https://weworkremotely.com"

export const CATEGORY_FEEDS: Record<string, string> = {
  programming: `${FEED_BASE}/categories/remote-programming-jobs.rss`,
  "devops-sysadmin": `${FEED_BASE}/categories/remote-devops-sysadmin-jobs.rss`,
  product: `${FEED_BASE}/categories/remote-product-jobs.rss`,
  all: `${FEED_BASE}/remote-jobs.rss`,
}

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

export interface JobCard {
  id: string
  title: string
  company: string | null
  region: string
  date: string | null
  url: string
  category: string
}

/** Keep only jobs eligible for Canada-based remote workers. */
export function isCanadaEligible(region: string): boolean {
  if (!region || region.trim() === "") return true
  const r = region.toLowerCase()
  return (
    r.includes("anywhere") ||
    r.includes("worldwide") ||
    r.includes("world") ||
    r.includes("north america") ||
    r.includes("canada") ||
    r.includes("global") ||
    r.includes("remote")
  )
}

/** Parse RFC 2822 date (from RSS pubDate) → YYYY-MM-DD or null. */
export function parseRssDate(raw: string): string | null {
  if (!raw) return null
  const d = new Date(raw)
  if (isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

/** Return true if date is within the last N days. */
export function withinDays(dateStr: string | null, days: number): boolean {
  if (!dateStr) return true
  const posted = new Date(dateStr)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return posted >= cutoff
}

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

export async function fetchRss(url: string): Promise<string> {
  const maxRetries = 3
  let delay = 1000
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml" },
      signal: AbortSignal.timeout(20000),
    })
    if (res.status === 429 || res.status >= 500) {
      if (attempt === maxRetries) throw new Error(`Request failed: ${res.status}`)
      await new Promise((r) => setTimeout(r, delay + Math.random() * 500))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`)
    return res.text()
  }
  throw new Error("Request failed after max retries")
}

/** Extract text content of the first matching XML tag. */
function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([^<]*)</${tag}>`, "i"))
  if (!m) return ""
  return (m[1] ?? m[2] ?? "").trim()
}

/** Parse WWR RSS XML into JobCard list. Title format: "Company: Job Title" */
export function parseRss(xml: string, category: string): JobCard[] {
  const results: JobCard[] = []
  const seen = new Set<string>()

  // Split on <item> tags
  const blocks = xml.split(/<item[\s>]/i).slice(1)
  for (const block of blocks) {
    const rawTitle = extractTag(block, "title")
    if (!rawTitle || rawTitle.includes("We Work Remotely")) continue

    // Extract URL from <link> — WWR RSS uses text node after </title>
    // Pattern: <link>https://weworkremotely.com/remote-jobs/slug</link>
    const linkMatch = block.match(/<link>(https:\/\/weworkremotely\.com\/remote-jobs\/[^<]+)<\/link>/i)
    const url = linkMatch ? linkMatch[1].trim() : ""
    if (!url || seen.has(url)) continue
    seen.add(url)

    const slugMatch = url.match(/remote-jobs\/([^/?#]+)/)
    const id = slugMatch ? slugMatch[1] : url

    // Parse "Company: Job Title" format
    const colonIdx = rawTitle.indexOf(": ")
    const company = colonIdx > 0 ? rawTitle.slice(0, colonIdx).trim() : null
    const title = colonIdx > 0 ? rawTitle.slice(colonIdx + 2).trim() : rawTitle

    const region = extractTag(block, "region") || ""
    const pubDate = extractTag(block, "pubDate")
    const date = parseRssDate(pubDate)

    results.push({ id, title, company, region: region || "Anywhere", date, url, category })
  }

  return results
}
