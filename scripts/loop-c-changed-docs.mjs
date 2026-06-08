#!/usr/bin/env node
/**
 * Loop C incremental file-list helper.
 *
 * Prints a JSON object { repo, files } of backlog docs (wiki/outputs +
 * thoughts/shared/handoffs, *.md/*.txt, media dirs excluded) that have changed
 * since the last Loop C run. Keys off file mtime vs a stored marker, because most
 * backlog docs are untracked (so `git diff` would miss them).
 *
 * Usage:
 *   node scripts/loop-c-changed-docs.mjs            # print {repo, files} changed since marker (all if no marker)
 *   node scripts/loop-c-changed-docs.mjs --stamp    # also write the marker = now (call AFTER a successful run)
 *   node scripts/loop-c-changed-docs.mjs --all      # ignore marker, list everything
 *
 * Feed the JSON straight into the workflow:
 *   Workflow({ scriptPath: 'scripts/loop-c-ingestion.workflow.js', args: <this JSON> })
 */
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const REPO = process.cwd()
const ROOTS = ['wiki/outputs', 'thoughts/shared/handoffs']
const EXCLUDE = /(^|\/)(brand-review-2026-05-28|utopia-media)(\/|$)/
const MARKER = join(REPO, 'wiki/canon/.loop-c-lastrun')
const argv = new Set(process.argv.slice(2))

function walk(dir, out) {
  let entries
  try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) walk(full, out)
    else if (/\.(md|txt)$/.test(e.name)) out.push(full)
  }
  return out
}

const since = !argv.has('--all') && existsSync(MARKER) ? Number(readFileSync(MARKER, 'utf8').trim()) || 0 : 0
const all = ROOTS.flatMap((r) => walk(join(REPO, r), []))
const files = all
  .map((f) => relative(REPO, f))
  .filter((rel) => !EXCLUDE.test(rel))
  .filter((rel) => since === 0 || statSync(join(REPO, rel)).mtimeMs > since)
  .sort()

if (argv.has('--stamp')) {
  writeFileSync(MARKER, String(Date.now()))
  process.stderr.write(`[loop-c] marker stamped to now; ${files.length} docs were in scope this run\n`)
}

process.stdout.write(JSON.stringify({ repo: REPO, files }))
process.stderr.write(`\n[loop-c] ${files.length} ${since === 0 ? 'docs (full — no marker)' : 'changed docs since last run'}\n`)
