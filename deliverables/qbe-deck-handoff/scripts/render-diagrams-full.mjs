/**
 * Render each QBE model drawing to a whole-page 16:9 SVG, both audiences.
 *
 * Figures are read from the guarded modules, never typed: jiti imports the TypeScript directly,
 * so no dev server and no investors gate is involved.
 *
 *   STORY_V2=<worktree>/v2  DIAGRAM_MODULE=src/lib/diagrams/qbe-diagrams.deck.ts \
 *     node render-diagrams-full.mjs <outdir>
 */
import path from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

const ROOT = process.env.STORY_V2 || process.cwd();
const MODULE = process.env.DIAGRAM_MODULE || 'src/lib/diagrams/qbe-diagrams.ts';
const OUT = process.argv[2];
if (!OUT) throw new Error('usage: render-diagrams-full.mjs <outdir>');

const { createJiti } = await import(path.join(ROOT, 'node_modules/jiti/lib/jiti.mjs'));
const jiti = createJiti(path.join(ROOT, 'noop.js'), {
  interopDefault: true,
  fsCache: false,
  alias: { '@': path.join(ROOT, 'src') },
});

mkdirSync(OUT, { recursive: true });
const D = await jiti.import(path.join(ROOT, MODULE));
console.log('diagrams:', D.QBE_DIAGRAMS.length);
for (const d of D.QBE_DIAGRAMS) {
  for (const audience of ['public', 'working']) {
    writeFileSync(path.join(OUT, `${d.id}--${audience}.svg`), d.svg(audience));
  }
  console.log(' -', d.id, '|', d.title);
}
