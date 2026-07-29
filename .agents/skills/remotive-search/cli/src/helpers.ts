// Data source: Remotive public JSON API (remotive.com/api/remote-jobs).
// No authentication required.

export const API_BASE = "https://remotive.com/api/remote-jobs"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

export interface RemotiveJob {
  id: number
  url: string
  title: string
  company_name: string
  company_logo: string
  category: string
  tags: string[]
  job_type: string
  publication_date: string
  candidate_required_location: string
  salary: string
  description: string
  company_logo_url: string
}

export interface JobCard {
  id: string
  title: string
  company: string
  location: string
  salary: string | null
  date: string | null
  url: string
  tags: string[]
}

/** Keep only jobs eligible for Canada-based applicants. */
export function isCanadaEligible(location: string): boolean {
  if (!location || location.trim() === "") return true
  const loc = location.toLowerCase()
  return (
    loc.includes("canada") ||
    loc.includes("worldwide") ||
    loc.includes("world") ||
    loc.includes("north america") ||
    loc.includes("americas") ||
    loc.includes("anywhere") ||
    loc.includes("global")
  )
}

/** Parse ISO date string, return YYYY-MM-DD or null. */
export function parseDate(raw: string): string | null {
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

export async function apiFetch(url: string): Promise<unknown> {
  const maxRetries = 3
  let delay = 1000
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; job-search-tool/1.0)",
      },
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

export function toJobCard(job: RemotiveJob): JobCard {
  return {
    id: String(job.id),
    title: job.title,
    company: job.company_name,
    location: job.candidate_required_location || "Worldwide",
    salary: job.salary || null,
    date: parseDate(job.publication_date),
    url: job.url,
    tags: job.tags || [],
  }
}
