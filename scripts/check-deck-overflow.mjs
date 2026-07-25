/**
 * Overflow gate for the deck. A slide is a fixed 1600x900 box; anything that spills past it
 * silently disappears from the PNG and the PDF, which is exactly how a funder ends up looking
 * at a slide with the last line of the argument missing.
 *
 * Checks, per slide:
 *   1. content taller than the box (scrollHeight > clientHeight)
 *   2. content wider than the box (scrollWidth > clientWidth)
 *   3. any element whose box extends past the slide's right or bottom edge
 *   4. the absolutely-positioned .wordmark / .tag being collided with by flow content
 *
 * Usage: NODE_PATH="$(npm root -g)/@playwright/mcp/node_modules" node scripts/check-deck-overflow.mjs
 * Exits non-zero if any slide fails, so it can gate a render.
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
const SRC = path.join(ROOT, 'v2/public/deck-slides/slides-source.html');

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
const page = await browser.newPage({ viewport: { width: 1700, height: 1000 } });
await page.goto('file://' + SRC);
await page.waitForLoadState('networkidle');

const report = await page.evaluate(() => {
  const TOL = 2; // sub-pixel rounding
  return [...document.querySelectorAll('.slide')].map((slide, i) => {
    const box = slide.getBoundingClientRect();
    const problems = [];

    if (slide.scrollHeight - slide.clientHeight > TOL) {
      problems.push(`content ${slide.scrollHeight - slide.clientHeight}px taller than the 900px box`);
    }
    if (slide.scrollWidth - slide.clientWidth > TOL) {
      problems.push(`content ${slide.scrollWidth - slide.clientWidth}px wider than the 1600px box`);
    }

    // Anything sticking out past the edges.
    for (const el of slide.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const overRight = r.right - box.right;
      const overBottom = r.bottom - box.bottom;
      if (overRight > TOL) {
        problems.push(`<${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''}> spills ${Math.round(overRight)}px past the right edge`);
      }
      if (overBottom > TOL) {
        problems.push(`<${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''}> spills ${Math.round(overBottom)}px past the bottom edge`);
      }
    }

    // The wordmark and tag are absolutely positioned at the bottom; flow content must not reach them.
    for (const markSel of ['.wordmark', '.tag']) {
      const mark = slide.querySelector(markSel);
      if (!mark) continue;
      const m = mark.getBoundingClientRect();
      for (const el of slide.children) {
        if (el === mark || el.classList.contains('wordmark') || el.classList.contains('tag') || el.classList.contains('accentbar')) continue;
        const r = el.getBoundingClientRect();
        const vOverlap = Math.min(r.bottom, m.bottom) - Math.max(r.top, m.top);
        const hOverlap = Math.min(r.right, m.right) - Math.max(r.left, m.left);
        if (vOverlap > TOL && hOverlap > TOL) {
          problems.push(`flow content overlaps ${markSel} by ${Math.round(vOverlap)}px`);
        }
      }
    }

    const eyebrow = slide.querySelector('.eyebrow');
    return {
      n: i + 1,
      id: slide.id,
      label: eyebrow ? eyebrow.textContent.trim() : '(no eyebrow)',
      problems: [...new Set(problems)],
    };
  });
});

await browser.close();

let failed = 0;
for (const s of report) {
  if (s.problems.length === 0) {
    console.log(`  ok   ${String(s.n).padStart(2, '0')} ${s.id}  ${s.label}`);
  } else {
    failed++;
    console.log(`  FAIL ${String(s.n).padStart(2, '0')} ${s.id}  ${s.label}`);
    for (const p of s.problems) console.log(`         - ${p}`);
  }
}
console.log(`\n${report.length - failed}/${report.length} slides clean`);
process.exit(failed ? 1 : 0);
