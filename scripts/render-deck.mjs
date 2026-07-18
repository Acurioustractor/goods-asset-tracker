/**
 * Render the canonical simple deck from its HTML source.
 *
 *   v2/public/deck-slides/slides-source.html
 *     -> v2/public/deck-slides/goods-slide-NN-<slug>.png  (3200x1800, 2x)
 *     -> v2/public/deck-slides/goods-simple-deck.pdf      (16:9, one page per slide)
 *
 * Uses playwright-core from the globally installed @playwright/mcp package
 * (no repo dependency):
 *   NODE_PATH="$(npm root -g)/@playwright/mcp/node_modules" node scripts/render-deck.mjs
 */
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright-core'));
} catch {
  const globalRoot = execSync('npm root -g').toString().trim();
  ({ chromium } = require(path.join(globalRoot, '@playwright/mcp/node_modules/playwright-core')));
}

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIR = path.join(ROOT, 'v2/public/deck-slides');
const SRC = path.join(DIR, 'slides-source.html');

// Use whatever chromium build is already in the ms-playwright cache (avoids
// a mismatch between the bundled playwright-core and downloaded browsers).
import fs from 'fs';
import os from 'os';
const cache = path.join(os.homedir(), 'Library/Caches/ms-playwright');
const candidates = fs
  .readdirSync(cache)
  .filter((d) => /^chromium(_headless_shell)?-\d+$/.test(d))
  .sort((a, b) => Number(b.match(/\d+$/)[0]) - Number(a.match(/\d+$/)[0]));
let executablePath;
for (const d of candidates) {
  for (const rel of ['chrome-headless-shell-mac-arm64/chrome-headless-shell', 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
    const p = path.join(cache, d, rel);
    if (fs.existsSync(p)) { executablePath = p; break; }
  }
  if (executablePath) break;
}
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 2 });
await page.goto('file://' + SRC);
await page.waitForLoadState('networkidle');

const slides = page.locator('.slide');
const n = await slides.count();
const slug = (t) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').split('-').slice(0, 4).join('-');

for (let i = 0; i < n; i++) {
  const s = slides.nth(i);
  const eyebrow = (await s.locator('.eyebrow').first().textContent().catch(() => '')) || `slide-${i + 1}`;
  const file = path.join(DIR, `goods-slide-${String(i + 1).padStart(2, '0')}-${slug(eyebrow)}.png`);
  await s.screenshot({ path: file });
  console.log('wrote', path.basename(file));
}

// One page per slide: kill the screen-only gap and dark body for print.
await page.addStyleTag({ content: 'body{background:none;} .slide+.slide{margin-top:0;} .slide{page-break-after:always;}' });
await page.pdf({ path: path.join(DIR, 'goods-simple-deck.pdf'), width: '1600px', height: '900px', printBackground: true, pageRanges: `1-${n}` });
console.log(`wrote goods-simple-deck.pdf (${n} slides)`);
await browser.close();
