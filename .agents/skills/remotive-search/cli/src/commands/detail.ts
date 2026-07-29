import { API_BASE, apiFetch, toJobCard, writeError, type RemotiveJob } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

function extractId(input: string): string | null {
  // Full URL: https://remotive.com/remote-jobs/software-dev/title-12345
  const urlMatch = input.match(/[-/](\d+)\/?$/)
  if (urlMatch) return urlMatch[1]
  if (/^\d+$/.test(input.trim())) return input.trim()
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const id = extractId(opts.id)
  if (!id) {
    writeError(`Could not parse a job ID from "${opts.id}"`, "BAD_ID")
    return 1
  }
  try {
    // Remotive API: fetch all jobs with no filter and find by ID
    // (no per-ID endpoint in the public API)
    const data = (await apiFetch(`${API_BASE}?limit=200`)) as { jobs: RemotiveJob[] }
    const job = data.jobs?.find((j) => String(j.id) === id)
    if (!job) {
      writeError(`Job ${id} not found (may have expired or ID is incorrect)`, "NOT_FOUND")
      return 1
    }

    const card = toJobCard(job)
    const detail = { ...card, description: job.description || null, category: job.category, jobType: job.job_type }

    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.company_name} · ${job.candidate_required_location || "Worldwide"}`,
        job.salary ? `Salary: ${job.salary}` : "",
        `Posted: ${card.date || "—"}`,
        `Category: ${job.category}`,
        `Tags: ${job.tags.join(", ") || "—"}`,
        "",
        job.description ? job.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "(no description)",
        "",
        `URL: ${job.url}`,
      ].filter((l) => l !== "").join("\n")
      process.stdout.write(lines + "\n")
    } else {
      process.stdout.write(JSON.stringify(detail, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}
