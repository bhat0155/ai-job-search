#!/usr/bin/env bun
import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"
import { writeError } from "./helpers.js"

interface Flags { _: string[]; [k: string]: string | boolean | string[] }

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", c: "category", n: "limit" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || (a.startsWith("-") && a.length === 2)) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) { flags[key] = true } else { flags[key] = next; i++ }
    } else { (flags._ as string[]).push(a) }
  }
  return flags
}

const HELP = `remotive-cli — search Remotive.com remote tech jobs

USAGE
  bun run src/cli.ts search [flags]
  bun run src/cli.ts detail <id|url> [--format json|plain]

SEARCH FLAGS
  --query, -q <text>      Keywords (title, tags).
  --category, -c <slug>   Category: software-development, devops, data, artificial-intelligence, engineering, information-technology, product.
  --jobage <days>         Only show results posted within N days.
  --limit, -n <n>         Cap results (default 20).
  --format <fmt>          json (default) | table | plain.

EXAMPLES
  bun run src/cli.ts search -q "TypeScript developer" --jobage 14 --format table
  bun run src/cli.ts search -q "DevOps" --category devops --jobage 14
  bun run src/cli.ts detail 12345
`

async function main(): Promise<number> {
  const flags = parseFlags(process.argv.slice(2))
  const cmd = (flags._ as string[])[0]
  if (!cmd || flags.help || flags.h) { process.stdout.write(HELP); return cmd ? 0 : 1 }

  if (cmd === "search") {
    const fmt = (flags.format as string) || "json"
    const parseNum = (k: string) => flags[k] !== undefined ? parseInt(flags[k] as string, 10) : undefined
    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      category: typeof flags.category === "string" ? flags.category : undefined,
      jobage: parseNum("jobage"),
      limit: parseNum("limit") ?? 20,
      format: (["json","table","plain"].includes(fmt) ? fmt : "json") as SearchOpts["format"],
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const id = (flags._ as string[])[1]
    if (!id) { writeError("detail requires an <id|url>", "NO_ID"); return 1 }
    const fmt = (flags.format as string) || "json"
    return runDetail({ id, format: fmt === "plain" ? "plain" : "json" } as DetailOpts)
  }

  writeError(`Unknown command "${cmd}"`, "BAD_CMD"); return 1
}

main().then(process.exit).catch((e) => { process.stderr.write(JSON.stringify({ error: String(e), code: "INTERNAL_ERROR" }) + "\n"); process.exit(1) })
