#!/usr/bin/env node
/**
 * Writes the model placemat to the diagram catalog as a static SVG (and a PNG
 * when sharp is installed), from the same renderer the /admin/model page
 * uses. Photographs and the container drawing are embedded as data URIs. Run from v2/:
 *
 *   node --import ./scripts/lib/register-ts.mjs scripts/render-placemat.mjs
 *
 * Output: design/brand/goods-diagrams/models/v2/whole-model.svg (+ .png), and a
 * `whole-model` version 2.0 entry in design/brand/goods-diagrams/models/catalog.json
 * (status review, approval null). The catalog is created if the branch has none.
 */

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const V2 = resolve(here, '..');
const REPO = resolve(V2, '..');
const MODELS = resolve(REPO, 'design/brand/goods-diagrams/models');
const OUT_DIR = resolve(MODELS, 'v2');
const CATALOG = resolve(MODELS, 'catalog.json');
const DRAWING = resolve(V2, 'public/images/model/harvest-container.svg');

const { renderPlacematSvg } = await import('../src/lib/model/placemat-svg.ts');
const { PLACEMAT_READ_AT, PANELS, LOGOS } = await import('../src/lib/data/model-placemat.ts');

const drawingFile = await readFile(DRAWING, 'utf8');
const inlineDrawing = drawingFile.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1];
if (!inlineDrawing) throw new Error(`Could not read the container drawing at ${DRAWING}`);

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const photoHrefs = {};
for (const p of PANELS) {
  const file = resolve(V2, 'public', p.photo.src.replace(/^\//, ''));
  const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
  const mime = MIME[ext];
  if (!mime) throw new Error(`No media type for ${file}`);
  photoHrefs[p.id] = `data:${mime};base64,${(await readFile(file)).toString('base64')}`;
}

const logoHrefs = {};
for (const [k, l] of Object.entries(LOGOS)) {
  const file = resolve(V2, 'public', l.src.replace(/^\//, ''));
  logoHrefs[k] = `data:image/svg+xml;base64,${(await readFile(file)).toString('base64')}`;
}
const svg = renderPlacematSvg({ inlineDrawing, photoHrefs, logoHrefs, standalone: true });
await mkdir(OUT_DIR, { recursive: true });
const svgPath = resolve(OUT_DIR, 'whole-model.svg');
await writeFile(svgPath, svg, 'utf8');
const sha256 = createHash('sha256').update(svg).digest('hex');
console.log(`wrote ${svgPath} (${svg.length} bytes, sha256 ${sha256.slice(0, 12)})`);

let pngPath = null;
try {
  const sharp = (await import('sharp')).default;
  pngPath = resolve(OUT_DIR, 'whole-model.png');
  await sharp(Buffer.from(svg), { density: 192 }).png().toFile(pngPath);
  console.log(`wrote ${pngPath}`);
} catch (err) {
  console.log(`PNG skipped: ${err.message}`);
}

const entry = {
  id: 'whole-model',
  name: 'The whole Goods model',
  version: '2.0',
  status: 'review',
  approval: null,
  use: 'The placemat as one SVG from src/lib/model/placemat-svg.ts: the raise, the eight stations on a 12 by 13 grid, computed arrows and labels, the four photograph panels, the support band. Photographs and the drawing are embedded.',
  file: 'v2/whole-model.svg',
  png: pngPath ? 'v2/whole-model.png' : null,
  sha256,
  sourceDate: PLACEMAT_READ_AT,
  renderedAt: new Date().toISOString().slice(0, 10),
  source: 'v2/src/lib/data/model-placemat.ts',
  renderer: 'v2/src/lib/model/placemat-svg.ts',
};

let catalog;
if (existsSync(CATALOG)) {
  catalog = JSON.parse(await readFile(CATALOG, 'utf8'));
} else {
  catalog = { schemaVersion: 1, library: 'Goods on Country model diagrams', sourceDate: PLACEMAT_READ_AT, defaultModel: 'whole-model', models: [] };
  console.log(`no catalog on this branch; creating ${CATALOG}`);
}
catalog.models = catalog.models.filter((m) => !(m.id === 'whole-model' && m.version === '2.0'));
catalog.models.push(entry);
await writeFile(CATALOG, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
console.log(`catalog updated: ${CATALOG} (${catalog.models.length} models)`);
