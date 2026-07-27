// Data source: Government of Canada Job Bank public HTML pages (jobbank.gc.ca).
// No authentication required. Search returns a server-rendered HTML results page;
// detail returns a single job's HTML page. Both are parsed with regex.

export const SEARCH_URL = "https://www.jobbank.gc.ca/jobsearch/jobsearch"
export const DETAIL_BASE = "https://www.jobbank.gc.ca/jobsearch/jobposting"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

/** Fetch HTML with exponential backoff on 429/5xx. Returns "" on 404. */
export async function htmlFetch(url: string): Promise<string> {
  const maxRetries = 5
  let delay = 800
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-CA,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 600)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 10000)
      continue
    }
    if (response.status === 404) return ""
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return response.text()
  }
  throw new Error("Request failed after max retries")
}

function numericEntity(cp: number): string {
  return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => numericEntity(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => numericEntity(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ")
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

export function clean(html: string): string {
  return decodeHtmlEntities(stripTags(html)).trim()
}

export interface JobCard {
  id: string
  title: string
  company: string | null
  location: string | null
  salary: string | null
  date: string | null
  url: string
}

export interface JobDetail extends JobCard {
  description: string | null
  deadline: string | null
  employmentType: string | null
  applyUrl: string | null
}

/** Convert "July 24, 2026" → "2026-07-24". Returns null on failure. */
const MONTHS: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08",
  september: "09", october: "10", november: "11", december: "12",
}

function parseHumanDate(text: string): string | null {
  const m = text.match(/(\w+)\s+(\d{1,2}),?\s+(\d{4})/i)
  if (m) {
    const month = MONTHS[m[1].toLowerCase()]
    if (month) return `${m[3]}-${month}-${m[2].padStart(2, "0")}`
  }
  const iso = text.match(/(\d{4}-\d{2}-\d{2})/)
  return iso ? iso[1] : null
}

/**
 * Parse GC Job Bank search results HTML.
 * Each result sits inside an <article> element. GC Job Bank uses:
 *   <li class="date">July 24, 2026</li>
 *   <li class="business">Company Name</li>
 *   <li class="location">...<span class="wb-inv">Location</span> City (ON)</li>
 *   <li class="salary">...$X hourly</li>
 *   <span class="noctitle">Job Title</span>
 */
export function parseJobCards(html: string): JobCard[] {
  const results: JobCard[] = []
  const seen = new Set<string>()

  const blocks = html.split(/<article\b/i).slice(1)

  for (const block of blocks) {
    const urlMatch = block.match(/href="(\/jobsearch\/jobposting\/(\d+)[^"]*)"/i)
    if (!urlMatch) continue

    const id = urlMatch[2]
    if (seen.has(id)) continue
    seen.add(id)

    const url = `https://www.jobbank.gc.ca/jobsearch/jobposting/${id}`
    const ctx = block.slice(0, 3500)

    // Title: <span class="noctitle">
    let title = ""
    const noctitle = ctx.match(/<span\s+class="noctitle"[^>]*>([\s\S]*?)<\/span>/i)
    if (noctitle) {
      title = clean(noctitle[1])
    } else {
      const linkText = ctx.match(/class="resultJobItem[^"]*"[^>]*>([\s\S]*?)<\/a>/i)
      if (linkText) title = clean(linkText[1])
    }
    if (!title) continue

    // Company: <li class="business">Name</li>
    let company: string | null = null
    const bizMatch = ctx.match(/<li\s+class="business"[^>]*>([\s\S]*?)<\/li>/i)
    if (bizMatch) company = clean(bizMatch[1]) || null

    // Location: <li class="location">...icon spans... City (ON) \n</li>
    let location: string | null = null
    const locMatch = ctx.match(/<li\s+class="location"[^>]*>([\s\S]*?)<\/li>/i)
    if (locMatch) {
      // Strip icon spans and screen-reader text, keep the bare location text
      const stripped = locMatch[1]
        .replace(/<span[^>]*class="[^"]*fa-[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "")
        .replace(/<span[^>]*class="wb-inv"[^>]*>[\s\S]*?<\/span>/gi, "")
      location = clean(stripped) || null
    }

    // Date: <li class="date">July 24, 2026</li>
    let date: string | null = null
    const dateMatch = ctx.match(/<li\s+class="date"[^>]*>([\s\S]*?)<\/li>/i)
    if (dateMatch) date = parseHumanDate(clean(dateMatch[1]))

    // Salary: <li class="salary">...Salary $X hourly</li>
    let salary: string | null = null
    const salMatch = ctx.match(/<li\s+class="salary"[^>]*>([\s\S]*?)<\/li>/i)
    if (salMatch) {
      const salText = clean(salMatch[1])
      const amountMatch = salText.match(
        /\$[\d,]+(?:\.\d+)?(?:\s*(?:to|–|-)\s*\$[\d,]+(?:\.\d+)?)?(?:\s+\w+)?/i,
      )
      salary = amountMatch ? amountMatch[0].trim() : null
    }

    results.push({ id, title, company, location, salary, date, url })
  }

  return results
}

/**
 * Parse a GC Job Bank individual job posting page.
 *
 * The detail page uses schema.org microdata attributes (property="*") for
 * structured fields, and an HTML-encoded <span property="description"> for
 * the full job ad body.
 */
export function parseJobDetail(html: string, id: string): JobDetail {
  const url = `https://www.jobbank.gc.ca/jobsearch/jobposting/${id}`

  // Title: <span property="title">Job Title</span>
  let title = "(untitled)"
  const titleMatch =
    html.match(/<span\s+property="title"[^>]*>([\s\S]*?)<\/span>/i) ||
    html.match(/<h1[^>]*class="title"[^>]*>([\s\S]*?)<\/h1>/i)
  if (titleMatch) title = clean(titleMatch[1]) || title

  // Company: <span property="hiringOrganization"><span property="name"><strong>Co</strong></span></span>
  // Strip wb-inv screen-reader spans before cleaning.
  let company: string | null = null
  const hiringOrg = html.match(/<span\s+property="hiringOrganization"[^>]*>([\s\S]*?)<\/span>\s*<\/span>/i)
  if (hiringOrg) {
    const stripped = hiringOrg[1].replace(/<span[^>]*class="wb-inv"[^>]*>[\s\S]*?<\/span>/gi, "")
    company = clean(stripped) || null
  } else {
    const nameMatch = html.match(/<span\s+property="name"[^>]*>([\s\S]*?)<\/span>/i)
    if (nameMatch) company = clean(nameMatch[1]) || null
  }

  // Location: <span property="addressLocality">City</span>, <span property="addressRegion">ON</span>
  let location: string | null = null
  const cityMatch = html.match(/<span\s+property="addressLocality"[^>]*>([\s\S]*?)<\/span>/i)
  const regionMatch = html.match(/<span\s+property="addressRegion"[^>]*>([\s\S]*?)<\/span>/i)
  if (cityMatch && regionMatch) {
    location = `${clean(cityMatch[1])}, ${clean(regionMatch[1])}`
  } else if (cityMatch) {
    location = clean(cityMatch[1]) || null
  }

  // Date: <span property="datePosted" class="date">Posted on July 23, 2026</span>
  let date: string | null = null
  const dateMatch = html.match(/<span\s+property="datePosted"[^>]*>([\s\S]*?)<\/span>/i)
  if (dateMatch) date = parseHumanDate(clean(dateMatch[1]))

  // Salary: <span property="minValue" content="60.52">60.52</span> ... hourly
  // Also look for maxValue if present
  let salary: string | null = null
  const minValMatch = html.match(/property="minValue"\s+content="([\d.]+)"/i)
  const maxValMatch = html.match(/property="maxValue"\s+content="([\d.]+)"/i)
  const unitMatch = html.match(/property="unitText"\s+class="hidden"[^>]*>([^<]+)<\/span>\s*(hourly|weekly|monthly|annually)/i)
    || html.match(/property="unitText"\s+content="([A-Z]+)"/i)
  if (minValMatch) {
    const unit = unitMatch ? unitMatch[1].toLowerCase() : ""
    const periodWords: Record<string, string> = { hour: "hourly", week: "weekly", month: "monthly", year: "annually" }
    const period = periodWords[unit] ?? unit
    if (maxValMatch) {
      salary = `$${minValMatch[1]} to $${maxValMatch[1]}${period ? " " + period : ""}`
    } else {
      // Try to grab the surrounding text for "hourly/weekly/annually"
      const surroundMatch = html.match(new RegExp(`content="${minValMatch[1]}"[^>]*>[\\s\\S]{0,60}?(hourly|weekly|monthly|annually)`, "i"))
      const periodWord = surroundMatch ? surroundMatch[1] : period
      salary = `$${minValMatch[1]}${periodWord ? " " + periodWord : ""}`
    }
  }

  // Description: HTML-encoded inside <span class="hidden" property="description">
  let description: string | null = null
  const descMatch = html.match(/<span\s+class="hidden"\s+property="description"[^>]*>([\s\S]*?)<\/span>/i)
  if (descMatch) {
    // Content is double-encoded: &lt;p&gt; etc. Decode once to get inner HTML, then strip tags.
    const innerHtml = decodeHtmlEntities(descMatch[1])
    const withBreaks = innerHtml
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<\/(p|li|ul|ol|div|section|h\d)>/gi, "\n")
    description = decodeHtmlEntities(stripTags(withBreaks)).replace(/\n{3,}/g, "\n\n").trim() || null
  }

  // Deadline: look for "Apply before" or "Closing" date text
  let deadline: string | null = null
  const dlMatch =
    html.match(/(?:apply before|closing date|deadline)[^<]*:?\s*<[^>]+>([\s\S]*?)<\/[^>]+>/i) ||
    html.match(/(?:apply before|closing date|deadline)[^<]*(\w+ \d{1,2},?\s*\d{4}|\d{4}-\d{2}-\d{2})/i)
  if (dlMatch) deadline = clean(dlMatch[1]) || null

  // Employment type: <span property="employmentType">Permanent employment</span>
  let employmentType: string | null = null
  const empMatch = html.match(/<span\s+property="employmentType"[^>]*>([\s\S]*?)<\/span>/i)
  if (empMatch) employmentType = clean(empMatch[1]) || null

  // External apply URL
  let applyUrl: string | null = url
  const extApply = html.match(/id="externalJobLink"[^>]*href="([^"]+)"/i)
  if (extApply) applyUrl = decodeHtmlEntities(extApply[1])

  return {
    id,
    title,
    company,
    location,
    salary,
    date,
    url,
    description,
    deadline,
    employmentType,
    applyUrl,
  }
}
