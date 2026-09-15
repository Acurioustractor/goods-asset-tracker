#!/usr/bin/env node
/**
 * Writes the QBE Q3 structure and funding-flow diagram to the diagram catalog
 * as SVG and PNG, and to deliverables/qbe-stage2/ as a one-page A4 landscape
 * PDF, from the same renderer the /admin/model/structure page uses. Run from v2/:
 *
 *   node --import ./scripts/lib/register-ts.mjs scripts/render-structure.mjs
 *
 * The PDF is written by hand: one page, one JPEG image object (from sharp),
 * because the repo carries no PDF library. It opens in any reader.
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
const PDF_DIR = resolve(REPO, 'deliverables/qbe-stage2');

const { renderMoneyFlowSvg } = await import('../src/lib/model/money-flow-svg.ts');
const { FLOW_READ_AT: STRUCTURE_READ_AT, FLOW_W: STRUCTURE_W, FLOW_H: STRUCTURE_H } = await import('../src/lib/data/money-flow.ts');

const svg = renderMoneyFlowSvg({ standalone: true });
await mkdir(OUT_DIR, { recursive: true });
const svgPath = resolve(OUT_DIR, 'money-flows.svg');
await writeFile(svgPath, svg, 'utf8');
const sha256 = createHash('sha256').update(svg).digest('hex');
console.log(`wrote ${svgPath} (${svg.length} bytes, sha256 ${sha256.slice(0, 12)})`);

let pngPath = null;
let pdfPath = null;
try {
  const sharp = (await import('sharp')).default;
  pngPath = resolve(OUT_DIR, 'money-flows.png');
  await sharp(Buffer.from(svg), { density: 144 }).png().toFile(pngPath);
  console.log(`wrote ${pngPath}`);
  const deckPng = resolve(REPO, '..', 'Goods Asset Register/v2/public/strategy/exports/money-flows-2026-09-15.png');
  await writeFile(deckPng, await readFile(pngPath));
  console.log(`wrote ${deckPng}`);

  // A4 landscape is 842 by 595 points. The image is rendered at 3x the sheet size for a crisp print.
  const jpeg = await sharp(Buffer.from(svg), { density: 288 }).flatten({ background: '#FBF8F1' }).jpeg({ quality: 92 }).toBuffer();
  const meta = await sharp(jpeg).metadata();
  pdfPath = resolve(PDF_DIR, 'Goods-money-flows.pdf');
  await mkdir(PDF_DIR, { recursive: true });
  await writeFile(pdfPath, onePagePdf(jpeg, meta.width, meta.height, 842, 595));
  console.log(`wrote ${pdfPath}`);
} catch (err) {
  console.log(`PNG/PDF skipped: ${err.message}`);
}

const entry = {
  id: 'money-flows',
  name: 'Money flows, deck S15',
  version: '1.0',
  status: 'review',
  approval: null,
  use: 'Slide S15 body, 1920 by 700: funders and lender on the left, Goods on Country in the centre, community organisations and customers on the right, the two community facilities below. Money in green, beds in terracotta, dashed means not yet signed.',
  file: 'v2/money-flows.svg',
  png: pngPath ? 'v2/money-flows.png' : null,
  pdf: pdfPath ? 'deliverables/qbe-stage2/Goods-money-flows.pdf' : null,
  sha256,
  sourceDate: STRUCTURE_READ_AT,
  renderedAt: new Date().toISOString().slice(0, 10),
  source: 'v2/src/lib/data/money-flow.ts',
  renderer: 'v2/src/lib/model/money-flow-svg.ts',
  sheet: { w: STRUCTURE_W, h: STRUCTURE_H },
};

let catalog;
if (existsSync(CATALOG)) {
  catalog = JSON.parse(await readFile(CATALOG, 'utf8'));
} else {
  catalog = { schemaVersion: 1, library: 'Goods on Country model diagrams', sourceDate: STRUCTURE_READ_AT, defaultModel: 'whole-model', models: [] };
}
catalog.models = catalog.models.filter((m) => !(m.id === entry.id && m.version === entry.version));
catalog.models.push(entry);
await writeFile(CATALOG, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
console.log(`catalog updated: ${CATALOG} (${catalog.models.length} models)`);

/** A minimal PDF: one page of pageW by pageH points, filled by one DCT (JPEG) image. */
function onePagePdf(jpeg, imgW, imgH, pageW, pageH) {
  const objects = [];
  const add = (s) => objects.push(s);
  add('<< /Type /Catalog /Pages 2 0 R >>');
  add('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>`);
  add({ head: `<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>`, stream: jpeg });
  const content = Buffer.from(`q ${pageW} 0 0 ${pageH} 0 0 cm /Im1 Do Q`, 'latin1');
  add({ head: `<< /Length ${content.length} >>`, stream: content });

  const parts = [Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'latin1')];
  const offsets = [];
  let length = parts[0].length;
  objects.forEach((o, i) => {
    offsets.push(length);
    const chunks = typeof o === 'string'
      ? [Buffer.from(`${i + 1} 0 obj\n${o}\nendobj\n`, 'latin1')]
      : [Buffer.from(`${i + 1} 0 obj\n${o.head}\nstream\n`, 'latin1'), o.stream, Buffer.from('\nendstream\nendobj\n', 'latin1')];
    for (const c of chunks) {
      parts.push(c);
      length += c.length;
    }
  });
  const xref = offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('');
  parts.push(Buffer.from(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${xref}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${length}\n%%EOF\n`, 'latin1'));
  return Buffer.concat(parts);
}
