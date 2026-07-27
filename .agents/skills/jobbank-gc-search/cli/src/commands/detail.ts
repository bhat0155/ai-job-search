import { DETAIL_BASE, htmlFetch, parseJobDetail, writeError } from "../helpers.js"

export interface DetailOpts {
  id: string
  format: "json" | "plain"
}

/** Accept a raw job ID or a full jobbank.gc.ca posting URL. */
function normalizeId(input: string): string | null {
  // Full URL: https://www.jobbank.gc.ca/jobsearch/jobposting/49950540
  const urlMatch = input.match(/\/jobposting\/(\d+)/)
  if (urlMatch) return urlMatch[1]
  // Bare numeric ID
  if (/^\d+$/.test(input.trim())) return input.trim()
  return null
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const id = normalizeId(opts.id)
  if (!id) {
    writeError(`Could not parse a job ID from "${opts.id}"`, "BAD_ID")
    return 1
  }
  try {
    const html = await htmlFetch(`${DETAIL_BASE}/${id}`)
    if (!html) {
      writeError("Job posting not found", "NOT_FOUND")
      return 1
    }
    const job = parseJobDetail(html, id)

    if (opts.format === "plain") {
      const lines = [
        job.title,
        `${job.company || "—"} · ${job.location || "—"}`,
        job.salary ? `Salary: ${job.salary}` : "",
        job.date ? `Posted: ${job.date}` : "",
        job.deadline ? `Deadline: ${job.deadline}` : "",
        job.employmentType ? `Employment type: ${job.employmentType}` : "",
        "",
        job.description || "(no description)",
        "",
        `URL: ${job.url}`,
      ]
        .filter((l) => l !== "")
        .join("\n")
      process.stdout.write(lines + "\n")
    } else {
      process.stdout.write(JSON.stringify(job, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}
