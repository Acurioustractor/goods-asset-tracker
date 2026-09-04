/**
 * Render each QBE model drawing BODY ONLY: the frame chrome (kicker, title, rule, footer, stamp)
 * is stripped so the Pencil slide can carry its own editable headline over a module-derived drawing.
 *
 * Works by swapping kit.frame() for a capture function, so the body string and its own bounds are
 * recovered without re-implementing the layout. `meta.json` carries each body's height and the
 * aspect ratio to give the Pencil frame.
 *
 *   STORY_V2=<worktree>/v2  DIAGRAM_MODULE=src/lib/diagrams/qbe-diagrams.deck.ts \
 *     node render-diagram-bodies.mjs <outdir>
 */
import path from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

const ROOT = process.env.STORY_V2 || process.cwd();
const MODULE = process.env.DIAGRAM_MODULE || 'src/lib/diagrams/qbe-diagrams.ts';
const OUT = process.argv[2];
if (!OUT) throw new Error('usage: render-diagram-bodies.mjs <outdir>');

const { createJiti } = await import(path.join(ROOT, 'node_modules/jiti/lib/jiti.mjs'));
const jiti = createJiti(path.join(ROOT, 'noop.js'), {
  interopDefault: true,
  fsCache: false,
  alias: { '@': path.join(ROOT, 'src') },
});

const kit = await jiti.import(path.join(ROOT, 'src/lib/diagrams/kit.ts'));
const realFrame = kit.frame;
let captured = null;
kit.frame = (o) => { captured = o; return realFrame(o); };
if (kit.frame === realFrame) throw new Error('kit.frame is not patchable, cannot capture bodies');

const DEFS = `<defs>
  <marker id="ah-t" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="#C45C3E"/></marker>
  <marker id="ah-i" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="#2B2A26"/></marker>
</defs>`;

mkdirSync(OUT, { recursive: true });
const D = await jiti.import(path.join(ROOT, MODULE));
const meta = {};
for (const d of D.QBE_DIAGRAMS) {
  captured = null;
  d.svg('working');
  if (!captured) { console.log('NO CAPTURE', d.id); continue; }
  const { page, title, sub, body, footer, stamp } = captured;
  const ys = [...body.matchAll(/\b(?:y|y1|y2|cy)="(-?[\d.]+)"/g)].map((m) => parseFloat(m[1]));
  const y = Math.max(0, Math.floor(Math.min(...ys) - 22));
  const h = Math.min(900, Math.ceil(Math.max(...ys) + 34)) - y;
  writeFileSync(
    path.join(OUT, `${d.id}-body.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${h}" viewBox="0 ${y} 1600 ${h}">${DEFS}<rect x="0" y="${y}" width="1600" height="${h}" fill="#FBF8F1"/>${body}</svg>`,
  );
  meta[d.id] = { page, title, sub, footer, stamp, y, h, aspect: +(1600 / h).toFixed(4) };
  console.log(d.id, '| y', y, '| h', h, '| aspect', (1600 / h).toFixed(3));
}
writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 2));
