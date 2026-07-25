/**
 * Render the chrome-free deck maps to PNG.
 *
 * The old design/deck-photos/map.png was an admin UI screenshot: it carried the Menu button,
 * the search box and the "Country names" toggle straight into a funder deck. The /export/map/*
 * routes exist precisely to avoid that (they render the map view with chrome={false}).
 *
 * Needs the dev server up. Usage:
 *   cd v2 && npm run dev          # in another shell
 *   NODE_PATH="$(npm root -g)/@playwright/mcp/node_modules" node scripts/render-map-export.mjs [port]
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
const OUT = path.join(ROOT, 'design/deck-photos');
const PORT = process.argv[2] || '3000';

const VIEWS = [
  { slug: 'deployed', file: 'map-deployed.png' },
  { slug: 'need', file: 'map-need.png' },
  { slug: 'ask', file: 'map-ask.png' },
];

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
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });

for (const view of VIEWS) {
  const url = `http://localhost:${PORT}/export/map/${view.slug}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 });
  } catch {
    console.log(`  skip ${view.slug}: did not settle at ${url}`);
    continue;
  }
  // Map tiles and markers finish after networkidle; give them a beat.
  await page.waitForTimeout(6000);
  // The Next dev-mode indicator renders in a shadow portal and would otherwise land in the
  // deck as a black circle in the corner. This is the whole point of a "chrome-free" export.
  await page.addStyleTag({
    content: 'nextjs-portal,[data-nextjs-toast],#__next-build-watcher{display:none !important;}',
  });
  await page.waitForTimeout(300);
  const dest = path.join(OUT, view.file);
  await page.screenshot({ path: dest });
  console.log(`  wrote design/deck-photos/${view.file}`);
}

await browser.close();
