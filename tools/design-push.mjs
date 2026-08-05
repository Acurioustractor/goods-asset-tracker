#!/usr/bin/env node
/**
 * DESIGN PUSH — the one method, applied to the Claude Design project.
 *
 * The Design project (claude.ai/design, "Goods on Country — Investor Materials",
 * b333c5aa-2dfa-4043-ab5f-ef7460692623) is a RENDER TARGET of the repo spine, never a
 * source. This script makes that true mechanically: it stages the cards + README, bakes
 * canon tokens from canon.ts, refuses to stage anything that breaks the claim ceiling,
 * and emits a push plan the Claude session executes with the DesignSync tool.
 *
 * Pipeline:
 *   1. Regenerate design/canon-numbers.json from canon.ts (drift dies here, not in a card).
 *   2. Stage README.md + preview HTML into design/brand/claude-design/.push/, running
 *      canon-render.mjs on each HTML (CANON:num:<id> and CANON:<slot> tokens bake) and a
 *      plain token pass over the README.
 *   3. CLAIM-CEILING GATE over every staged file: retired figures and banned phrases fail
 *      the run with file:line. A figure hand-typed into a card dies here when it drifts.
 *   4. Write .push/push-plan.json + the _ds_needs_recompile sentinel. The Claude session
 *      then runs: DesignSync finalize_plan (localDir = .push, writes from the plan) →
 *      write_files per chunk (≤10 files/call, images larger) → sentinel last.
 *
 * The sentinel is what makes the app rebuild _ds_manifest.json from @dsCard markers on
 * next open (solved 2026-08-05). Never use register_assets — legacy, does nothing.
 *
 * Usage: node tools/design-push.mjs [--check-only]
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(REPO, 'design/brand/claude-design');
const STAGE = path.join(SRC, '.push');
const PROJECT_ID = 'b333c5aa-2dfa-4043-ab5f-ef7460692623';
const checkOnly = process.argv.includes('--check-only');

// Files that exist locally but must NEVER be pushed. invest-funder-pipeline.html was
// deleted from the project on 2026-08-05 (named funders with amounts — same leak class
// as the /pitch/deck presenter script); the local copy is retained as a record only.
const NEVER_PUSH = new Set(['invest-funder-pipeline.html']);

// The claim ceiling, as greps. Sources: ruling V (2026-08-01), ruling G/H (2026-07-25),
// Ben's Centrecorp call (2026-08-02), canon as of 2026-08-05. Case-insensitive.
// A hit = the staged bundle is lying to a funder; the push refuses.
const BANNED = [
  [/accountant.signed/i, 'ruling G/H: the revenue figure is a workpaper'],
  [/co.design/i, 'voice: designed in/with community, never co-designed'],
  [/dollar.for.dollar/i, 'ruling V: QBE money is catalytic, not matched'],
  [/1:1 match|matched at least/i, 'ruling V: no 1:1 match exists'],
  [/\$?150k\s*floor/i, 'ruling V: no $150K floor exists'],
  [/\$475/, 'stack is $400K — Centrecorp ($75K) is a buyer, not a funder'],
  [/496\s*beds/i, 'canon: 540 beds'],
  [/\b9 communities/i, 'canon: 11 communities'],
  [/2,?660\s*kg/i, 'canon: 3,540kg HDPE'],
  [/\$607[.,]?5/, 'retired figure: the $607.5K counted a bed buyer'],
  [/centrecorp[^.]{0,60}(grant|funder|stack|pledge)/i, 'Centrecorp is a BUYER (Ben 2026-08-02)'],
];

// Negation awareness (same problem check-retired-figures.mjs solves): the corrected
// cards and the README's claim-ceiling section QUOTE the banned claims to refute them.
// A line that is denying the claim is not making it.
const NEGATED = /\b(never|not|no longer|no floor|there is no|isn'?t|is not|was not|wrong|error|retired|struck|superseded|reclassified|correction|instead of|rather than|does not exist|creates no|obliges .{0,20}nothing)\b/i;

const run = (cmd, args) => execFileSync(cmd, args, { cwd: REPO, stdio: ['ignore', 'pipe', 'pipe'] }).toString();

// 1. Canon numbers regenerate from the spine.
run('node', ['v2/scripts/canon-numbers.mjs']);
const canon = JSON.parse(fs.readFileSync(path.join(REPO, 'design/canon-numbers.json'), 'utf8')).numbers;

// 2. Stage.
fs.rmSync(STAGE, { recursive: true, force: true });
fs.mkdirSync(path.join(STAGE, 'preview'), { recursive: true });

const staged = [];
for (const f of fs.readdirSync(path.join(SRC, 'preview'))) {
  if (NEVER_PUSH.has(f)) continue;
  if (!f.endsWith('.html') && f !== '_base.css') continue;
  const src = path.join(SRC, 'preview', f);
  const out = path.join(STAGE, 'preview', f);
  if (f.endsWith('.html')) {
    run('node', ['v2/scripts/canon-render.mjs', src, '-o', out]);
  } else {
    fs.copyFileSync(src, out);
  }
  staged.push(`preview/${f}`);
}

// README: plain CANON:num token pass (canon-render is HTML-shaped; the README is md).
let readme = fs.readFileSync(path.join(SRC, 'README.md'), 'utf8');
readme = readme.replace(/CANON:num:([a-z0-9-]+)/g, (m, id) => canon[id]?.value ?? m);
const unresolved = readme.match(/CANON:num:[a-z0-9-]+/g);
if (unresolved) fail(`README has unresolved canon tokens: ${unresolved.join(', ')}`);
fs.writeFileSync(path.join(STAGE, 'README.md'), readme);
staged.push('README.md');

// 3. Claim-ceiling gate over the staged output (the thing that actually ships).
const hits = [];
for (const rel of staged) {
  if (!rel.endsWith('.html') && !rel.endsWith('.md')) continue;
  const lines = fs.readFileSync(path.join(STAGE, rel), 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (NEGATED.test(line) || NEGATED.test(lines[i - 1] ?? '')) return;
    for (const [re, why] of BANNED) {
      if (re.test(line)) hits.push(`  ${rel}:${i + 1}  [${re}]  ${why}`);
    }
  });
}
if (hits.length) fail(`claim-ceiling violations in staged bundle:\n${hits.join('\n')}`);

// README figure tie-out: hand-typed figures must match canon or the push refuses.
const tieOut = [
  ['beds-deployed', /\b(\d{3}) beds/],
  ['communities-served', /\b(\d{1,2}) communities/],
  ['plastic-kg', /([\d,]+)\s?kg/i],
];
for (const [id, re] of tieOut) {
  const m = readme.match(re);
  if (m && m[1].replace(/,/g, '') !== String(canon[id].raw)) {
    fail(`README says "${m[0]}" but canon ${id} = ${canon[id].value} — fix the README or canon.ts`);
  }
}

// 4. Sentinel + plan.
fs.writeFileSync(path.join(STAGE, '_ds_needs_recompile'), '');
staged.push('_ds_needs_recompile');
const plan = {
  projectId: PROJECT_ID,
  localDir: STAGE,
  writes: ['preview/**', 'README.md', '_ds_needs_recompile'],
  files: staged.map((p) => ({ path: p, localPath: p })),
  note: 'DesignSync: finalize_plan with these writes, write_files in ≤10-file chunks, sentinel LAST.',
  generatedAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(STAGE, 'push-plan.json'), JSON.stringify(plan, null, 2));

console.log(`design-push: ${staged.length} files staged clean -> ${path.relative(REPO, STAGE)}/`);
console.log(checkOnly ? 'check-only: no plan consumed.' : `plan: ${path.relative(REPO, STAGE)}/push-plan.json — hand to the Claude session to execute via DesignSync.`);

function fail(msg) {
  console.error(`design-push: REFUSED — ${msg}`);
  process.exit(1);
}
