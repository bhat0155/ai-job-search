// Data source: Himalayas public JSON API (himalayas.app/jobs/api).
// No authentication required.

export const API_BASE = "https://himalayas.app/jobs/api"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

export interface HimalayasJob {
  title: string
  excerpt: string
  companyName: string
  companySlug: string
  companyLogo: string
  employmentType: string
  minSalary: number | null
  maxSalary: number | null
  salaryPeriod: string | null
  currency: string | null
  seniority: string
  locationRestrictions: string[]
  timezoneRestrictions: string[]
  categories: string[]
  parentCategories: string[]
  description: string
  pubDate: number | string  // Unix timestamp in seconds
  expiryDate: string | null
  applicationLink: string
  guid: string
}

export interface JobCard {
  id: string
  title: string
  company: string
  location: string
  salary: string | null
  date: string | null
  url: string
  seniority: string
  categories: string[]
}

/** Keep only jobs eligible for Canada-based applicants. */
export function isCanadaEligible(restrictions: string[]): boolean {
  if (!restrictions || restrictions.length === 0) return true // worldwide
  const lower = restrictions.map((r) => r.toLowerCase())
  return lower.some(
    (r) =>
      r.includes("canada") ||
      r.includes("north america") ||
      r.includes("americas") ||
      r.includes("worldwide") ||
      r.includes("anywhere") ||
      r.includes("global"),
  )
}

/** Parse date — handles both Unix timestamps (seconds) and ISO strings. */
export function parseDate(raw: string | number): string | null {
  if (raw === null || raw === undefined || raw === "") return null
  const n = typeof raw === "number" ? raw : Number(raw)
  // Himalayas returns Unix timestamps in seconds (10-digit); JS Date needs milliseconds
  if (!isNaN(n) && n > 1_000_000_000) {
    const d = new Date(n * 1000)
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }
  const d = new Date(raw as string)
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

export async function apiFetch(url: string): Promise<unknown> {
  const maxRetries = 3
  let delay = 1000
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 (compatible; job-search-tool/1.0)" },
      signal: AbortSignal.timeout(20000),
    })
    if (res.status === 429 || res.status >= 500) {
      if (attempt === maxRetries) throw new Error(`API request failed: ${res.status}`)
      await new Promise((r) => setTimeout(r, delay + Math.random() * 500))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (!res.ok) throw new Error(`API request failed: ${res.status} ${res.statusText}`)
    return res.json()
  }
  throw new Error("Request failed after max retries")
}

export function toJobCard(job: HimalayasJob): JobCard {
  const loc = job.locationRestrictions.length === 0 ? "Worldwide" : job.locationRestrictions.join(", ")
  let salary: string | null = null
  if (job.minSalary && job.maxSalary) {
    salary = `${job.currency || ""}${job.minSalary.toLocaleString()}–${job.maxSalary.toLocaleString()} ${job.salaryPeriod || ""}`.trim()
  } else if (job.minSalary) {
    salary = `${job.currency || ""}${job.minSalary.toLocaleString()}+ ${job.salaryPeriod || ""}`.trim()
  }
  return {
    id: job.guid || job.applicationLink,
    title: job.title,
    company: job.companyName,
    location: loc,
    salary,
    date: parseDate(job.pubDate),
    url: job.applicationLink,
    seniority: job.seniority,
    categories: job.categories || [],
  }
}
