import { writeError } from "../helpers.js"

export interface DetailOpts {
  url: string
  format: "json" | "plain"
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  // Himalayas job URLs link directly to the application page (company ATS or Himalayas apply page).
  // There is no per-job public API endpoint. Return the URL with a note.
  const result = {
    url: opts.url,
    note: "Open the URL in a browser to view the full job description. Himalayas does not expose a per-job detail API.",
  }
  if (opts.format === "plain") {
    process.stdout.write(`URL: ${opts.url}\n\nNote: ${result.note}\n`)
  } else {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n")
  }
  return 0
}
