// Generate a standalone photo-picker HTML page. Reads every JPG/JPEG/HEIC in
// the two trip folders, generates a ~300px-wide JPEG thumbnail embedded as
// base64, lays them out as a clickable grid. User clicks photos to mark as
// "hero" -- bottom panel updates with deck-ready markdown.

import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';

const sharp = (await import('sharp')).default;
const exifrMod = await import('exifr');
const exifr = exifrMod.default || exifrMod;

const FOLDERS = [
  '/Users/benknight/Code/Goods Asset Register/Goods Beds Utpoia - QR Codes',
  '/Users/benknight/Code/Goods Asset Register/Goods Beds Utopia day 2 QR code',
];
const OUT = '/tmp/utopia-photo-picker.html';

// Reuse decoded bed_ids from the two batch JSONs so picker can show "bed:
// GB0-156-X" on each tile.
function loadBatchJson(path) {
  try { return JSON.parse(require('node:fs').readFileSync(path, 'utf-8')).results || []; }
  catch { return []; }
}
const day1 = loadBatchJson('/tmp/utopia-batch.json');
const day2 = loadBatchJson('/tmp/utopia-day2-batch.json');
const fileToBed = new Map();
for (const r of [...day1, ...day2]) {
  if (r.file && r.bed_id) fileToBed.set(r.file, r.bed_id);
}

async function toJpegBuffer(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') {
    return (await import('node:fs')).readFileSync(filePath);
  }
  // HEIC -> JPEG via sips
  const tmp = mkdtempSync(join(tmpdir(), 'heic-'));
  const out = join(tmp, basename(filePath, ext) + '.jpg');
  execFileSync('sips', ['-s', 'format', 'jpeg', filePath, '--out', out], { stdio: 'pipe' });
  return (await import('node:fs')).readFileSync(out);
}

async function makeThumb(buf, width = 360) {
  const out = await sharp(buf).rotate().resize({ width, withoutEnlargement: true }).jpeg({ quality: 70 }).toBuffer();
  return `data:image/jpeg;base64,${out.toString('base64')}`;
}

const tiles = [];
for (const folder of FOLDERS) {
  if (!existsSync(folder)) continue;
  const files = readdirSync(folder).filter((f) => /\.(jpg|jpeg|heic)$/i.test(f));
  for (const f of files) {
    const full = join(folder, f);
    process.stderr.write(`thumb ${f}... `);
    try {
      const buf = await toJpegBuffer(full);
      const tags = await exifr.parse(buf, { gps: true }).catch(() => null);
      const thumb = await makeThumb(buf);
      const bedId = fileToBed.get(f) || null;
      tiles.push({
        file: f,
        path: full,
        folder: basename(folder),
        bed_id: bedId,
        caption: tags?.ImageDescription || null,
        lat: tags?.latitude ?? null,
        lng: tags?.longitude ?? null,
        when: tags?.DateTimeOriginal?.toISOString?.() || null,
        thumb,
      });
      process.stderr.write('ok\n');
    } catch (e) {
      process.stderr.write(`ERR ${e.message}\n`);
    }
  }
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Utopia Trip Photo Picker — pick hero shots for the Centrecorp deck</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { margin: 0; font-family: -apple-system, system-ui, sans-serif; background: #f6f3ee; color: #1c1917; }
  header { padding: 12px 18px; background: #1c1917; color: #fef3c7; position: sticky; top: 0; z-index: 10; }
  header h1 { margin: 0 0 2px 0; font-size: 17px; }
  header p { margin: 0; font-size: 12px; opacity: 0.7; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; padding: 14px; }
  .tile { background: #fff; border: 2px solid transparent; border-radius: 8px; overflow: hidden; cursor: pointer; transition: all 0.15s; position: relative; }
  .tile.selected { border-color: #b45309; box-shadow: 0 4px 12px rgba(180,83,9,0.3); transform: translateY(-2px); }
  .tile img { width: 100%; display: block; aspect-ratio: 4/3; object-fit: cover; }
  .tile .meta { padding: 6px 8px; font-size: 11px; color: #57534e; }
  .tile .meta b { color: #b45309; font-family: ui-monospace, Menlo, monospace; }
  .tile .check { position: absolute; top: 6px; right: 6px; background: #b45309; color: white; border-radius: 50%; width: 22px; height: 22px; display: none; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; }
  .tile.selected .check { display: flex; }
  .badge { display: inline-block; font-size: 9px; padding: 1px 5px; border-radius: 8px; background: #fef3c7; color: #78350f; margin-left: 4px; }
  .badge.day2 { background: #d1fae5; color: #065f46; }
  #panel { position: fixed; bottom: 0; left: 0; right: 0; background: #1c1917; color: #fef3c7; padding: 12px 18px; box-shadow: 0 -4px 16px rgba(0,0,0,0.2); max-height: 50vh; overflow-y: auto; transition: transform 0.2s; transform: translateY(calc(100% - 42px)); }
  #panel.expanded { transform: translateY(0); }
  #panel-header { font-size: 13px; cursor: pointer; user-select: none; display: flex; justify-content: space-between; align-items: center; }
  #panel-header span { color: #fbbf24; font-weight: 700; }
  #out { background: #292524; color: #fef3c7; padding: 10px; border-radius: 6px; font-family: ui-monospace, Menlo, monospace; font-size: 11px; line-height: 1.5; max-height: 260px; overflow-y: auto; margin-top: 8px; white-space: pre-wrap; }
  #copy { background: #b45309; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
  #copy:hover { background: #92400e; }
  body { padding-bottom: 60px; }
</style>
</head>
<body>
  <header>
    <h1>Utopia Trip Photo Picker</h1>
    <p>Click photos to mark as deck-hero. Aim for 6-8 across the cohort. Bottom panel shows deck-ready Markdown.</p>
  </header>
  <div class="grid" id="grid"></div>

  <div id="panel">
    <div id="panel-header">
      <span><span id="count">0</span> selected · click to expand ↑</span>
      <button id="copy">Copy Markdown</button>
    </div>
    <pre id="out"></pre>
  </div>

  <script>
    const tiles = ${JSON.stringify(tiles)};
    const grid = document.getElementById('grid');
    const out = document.getElementById('out');
    const panel = document.getElementById('panel');
    const header = document.getElementById('panel-header');
    const countEl = document.getElementById('count');
    const selected = new Set();

    for (const t of tiles) {
      const el = document.createElement('div');
      el.className = 'tile';
      el.dataset.file = t.file;
      el.innerHTML = \`
        <img src="\${t.thumb}" loading="lazy" alt="\${t.file}" />
        <div class="meta">
          <b>\${t.bed_id || 'no-qr'}</b>
          <span class="badge \${t.folder.includes('day 2') ? 'day2' : ''}">\${t.folder.includes('day 2') ? 'D2' : 'D1'}</span>
          \${t.caption ? '<br>👤 '+t.caption : ''}
          <br>\${t.file}
        </div>
        <div class="check">✓</div>
      \`;
      el.addEventListener('click', () => {
        el.classList.toggle('selected');
        if (selected.has(t.file)) selected.delete(t.file);
        else selected.add(t.file);
        updateOut();
      });
      grid.appendChild(el);
    }

    function updateOut() {
      const items = tiles.filter(t => selected.has(t.file));
      countEl.textContent = items.length;
      const md = items.map(t => {
        const ctx = [
          t.bed_id ? \`bed \${t.bed_id}\` : null,
          t.caption ? \`recipient \${t.caption}\` : null,
          t.lat ? \`@ \${t.lat.toFixed(4)},\${t.lng.toFixed(4)}\` : null,
        ].filter(Boolean).join(' · ');
        return \`![\${ctx || t.file}](\${t.path})\`;
      }).join('\\n\\n');
      out.textContent = md || '(no photos selected yet — click tiles to add)';
    }

    header.addEventListener('click', (e) => {
      if (e.target.id !== 'copy') panel.classList.toggle('expanded');
    });
    document.getElementById('copy').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(out.textContent);
        document.getElementById('copy').textContent = 'Copied ✓';
        setTimeout(() => { document.getElementById('copy').textContent = 'Copy Markdown'; }, 1500);
      } catch (e) { alert('Copy failed - select the text manually.'); }
    });

    updateOut();
  </script>
</body>
</html>`;

writeFileSync(OUT, html);
console.log(`\nWrote ${OUT} (${tiles.length} thumbnails, ${Math.round(Buffer.byteLength(html)/1024)}KB)`);
