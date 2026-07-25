/**
 * Render the one-sheet Pathway Board leave-behind.
 *
 *   /export/leave-behind  (A4 landscape, two sides)
 *     -> v2/public/leave-behind/goods-pathway-board-leave-behind.pdf   (print, 297x210mm)
 *     -> v2/public/leave-behind/leave-behind-side-a.png                (2x, screen/email)
 *     -> v2/public/leave-behind/leave-behind-side-b.png
 *
 * The page is a route, not a hand-built HTML file, so the stages, modules and figures come
 * from pathway-stages.ts, canon.ts and cost-story.ts and cannot drift from them.
 *
 * OVERFLOW GATE: a sheet is a fixed 297x210mm box with overflow:hidden. Content that spills is
 * silently cropped out of the PDF, exactly the failure the deck gate was built to catch. This
 * script asserts before it writes, and exits non-zero rather than shipping a cropped leave-behind.
 *
 * Needs the dev server up. Usage:
 *   cd v2 && npm run dev            # in another shell
 *   NODE_PATH="$(npm root -g)/@playwright/mcp/node_modules" node scripts/render-leave-behind.mjs [port]
 */
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright-core'));
} catch {
  const globalRoot = execSync('npm root -g').toString().trim();
  ({ chromium } = require(path.join(globalRoot, '@playwright/mcp/node_modules/playwright-core')));
}

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'v2/public/leave-behind');
const PORT = process.argv[2] || '3000';
const URL = `http://localhost:${PORT}/export/leave-behind`;

fs.mkdirSync(OUT, { recursive: true });

const cache = path.join(os.homedir(), 'Library/Caches/ms-playwright');
const candidates = fs
  .readdirSync(cache)
  .filter((d) => /^chromium(_headless_shell)?-\d+$/.test(d))
  .sort((a, b) => Number(b.match(/\d+$/)[0]) - Number(a.match(/\d+$/)[0]));
let executablePath;
for (const d of candidates) {
  for (const rel of [
    'chrome-headless-shell-mac-arm64/chrome-headless-shell',
    'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
  ]) {
    const p = path.join(cache, d, rel);
    if (fs.existsSync(p)) { executablePath = p; break; }
  }
  if (executablePath) break;
}

const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });

// The Next dev-mode badge renders as a black circle in the export if it is left alone.
await page.addStyleTag({ content: '#__next-build-watcher,nextjs-portal{display:none!important;}' }).catch(() => {});
await page.goto(URL, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: '#__next-build-watcher,nextjs-portal{display:none!important;}' });
await page.waitForSelector('.sheet');
await page.waitForTimeout(400); // let the wordmark SVG paint

// ---- overflow gate -------------------------------------------------------
const problems = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('.sheet').forEach((sheet) => {
    const id = sheet.id || '(unnamed)';
    const cs = getComputedStyle(sheet);
    const padL = parseFloat(cs.paddingLeft);
    const padR = parseFloat(cs.paddingRight);
    const padT = parseFloat(cs.paddingTop);
    const padB = parseFloat(cs.paddingBottom);

    if (sheet.scrollHeight > sheet.clientHeight + 1) {
      out.push(`${id}: content is ${Math.round(sheet.scrollHeight - sheet.clientHeight)}px taller than the sheet`);
    }
    if (sheet.scrollWidth > sheet.clientWidth + 1) {
      out.push(`${id}: content is ${Math.round(sheet.scrollWidth - sheet.clientWidth)}px wider than the sheet`);
    }

    const box = sheet.getBoundingClientRect();
    const inner = {
      left: box.left + padL,
      right: box.right - padR,
      top: box.top + padT,
      bottom: box.bottom - padB,
    };
    sheet.querySelectorAll('*').forEach((el) => {
      if (getComputedStyle(el).position === 'absolute') return; // the accent bar is meant to bleed
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.bottom > inner.bottom + 1.5 || r.top < inner.top - 1.5 || r.left < inner.left - 1.5 || r.right > inner.right + 1.5) {
        const desc = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '');
        out.push(`${id}: ${desc} spills the content box ("${(el.textContent || '').trim().slice(0, 48)}")`);
      }
    });
  });
  return out;
});

if (problems.length) {
  console.error(`\nOVERFLOW GATE FAILED (${problems.length}):\n`);
  // Collapse the parent-chain noise: one line per distinct message.
  [...new Set(problems)].forEach((p) => console.error('  ✗ ' + p));
  console.error('\nNothing written. Fix the spill, or the PDF ships silently cropped.\n');
  await browser.close();
  process.exit(1);
}
console.log('overflow gate: 2/2 sheets clean');

// ---- write ---------------------------------------------------------------
const sheets = [
  { id: 'sideA', file: 'leave-behind-side-a.png' },
  { id: 'sideB', file: 'leave-behind-side-b.png' },
];
for (const s of sheets) {
  const el = await page.$(`#${s.id}`);
  await el.screenshot({ path: path.join(OUT, s.file) });
  console.log(`wrote ${s.file}`);
}

await page.pdf({
  path: path.join(OUT, 'goods-pathway-board-leave-behind.pdf'),
  width: '297mm',
  height: '210mm',
  printBackground: true,
  pageRanges: '1-2',
});
console.log('wrote goods-pathway-board-leave-behind.pdf (A4 landscape, 2 sides)');

await browser.close();
