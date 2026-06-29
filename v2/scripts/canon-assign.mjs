#!/usr/bin/env node
/**
 * CANON ASSIGN — set the winner for one or more slots from a canon-build review.
 *
 * The image canon (design/image-canon.json) is REFERENCE-ONLY. Repo picks are
 * referenced in place; EL picks are downloaded once into v2/public/images/el/
 * (videos into v2/public/video/el/) so there is one canonical on-disk file.
 *
 * Each assignment OVERWRITES whatever the slot held before (replace semantics) and
 * tags the entry with its slot key so artifacts can pull "the asset for slot X".
 *
 * Consent gate: RED slots (storytellers / identifiable people) are written only
 * because you named the pick. The script prints a RED warning; cross-check the
 * cleared-voices list before any external use. It never auto-fills a RED slot.
 *
 * Usage (batch pairs PICK=SLOT, any number):
 *   node scripts/canon-assign.mjs E14=cover-hero EP7=storyteller-mykel RV12=video-build
 * Single with a caption override:
 *   node scripts/canon-assign.mjs R042 --slot plant-hero --caption "The line on Country."
 *
 * Run canon-build.mjs first (it writes canon-build-index.json with the pick map).
 */
import fs from 'node:fs';
import path from 'node:path';

const ENV = path.join(process.cwd(), '.env.local');
if (fs.existsSync(ENV)) for (const line of fs.readFileSync(ENV, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const K = process.env.EMPATHY_LEDGER_API_KEY || '';
const REPO = path.resolve(process.cwd(), '..');
const KIT = path.join(REPO, 'design/brand/kit');
const IDX = path.join(KIT, 'canon-build-index.json');
const SLOTSF = path.join(REPO, 'design/canon-slots.json');
const CANONF = path.join(REPO, 'design/image-canon.json');

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const captionOv = flag('caption');
const pairs = args.filter((a) => a.includes('=')).map((a) => a.split('='));
const single = flag('slot'); if (single && args[0] && !args[0].startsWith('--')) pairs.push([args[0], single]);
if (!pairs.length) { console.error('Usage: canon-assign.mjs PICK=SLOT [PICK=SLOT ...]   |   PICK --slot KEY [--caption ".."]'); process.exit(1); }

const dl = async (url, destAbs) => {
  const r = await fetch(url, { redirect: 'follow', headers: { 'X-API-Key': K } });
  if (!r.ok) throw new Error(`download ${r.status}`);
  fs.mkdirSync(path.dirname(destAbs), { recursive: true });
  fs.writeFileSync(destAbs, Buffer.from(await r.arrayBuffer()));
  return r.headers.get('content-type') || '';
};

const main = async () => {
  if (!fs.existsSync(IDX)) { console.error('No canon-build-index.json — run: node scripts/canon-build.mjs'); process.exit(1); }
  const index = JSON.parse(fs.readFileSync(IDX, 'utf8')).picks;
  const slots = JSON.parse(fs.readFileSync(SLOTSF, 'utf8')).slots;
  const canon = JSON.parse(fs.readFileSync(CANONF, 'utf8'));
  const today = new Date().toISOString().slice(0, 10);
  let reds = 0;

  for (const [pickId, slotKey] of pairs) {
    const pick = index[pickId]; const slot = slots.find((s) => s.key === slotKey);
    if (!pick) { console.error(`SKIP ${pickId}=${slotKey}: pick not found`); continue; }
    if (!slot) { console.error(`SKIP ${pickId}=${slotKey}: slot key not found`); continue; }

    let canonicalPath, source, elId;
    if (pick.kind === 'repo-image' || pick.kind === 'repo-video') {
      canonicalPath = pick.path; // reference in place
    } else {
      // EL pick: download once into the canonical web store
      const isVid = pick.kind === 'el-video';
      const r = await fetch(pick.url, { method: 'HEAD', headers: { 'X-API-Key': K } }).catch(() => null);
      const ct = r?.headers.get('content-type') || (isVid ? 'video/mp4' : 'image/jpeg');
      const ext = isVid ? 'mp4' : ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
      canonicalPath = isVid ? `v2/public/video/el/${slotKey}.${ext}` : `v2/public/images/el/${slotKey}.${ext}`;
      await dl(pick.url, path.join(REPO, canonicalPath));
      source = 'empathy-ledger'; elId = pick.elId;
    }

    const isRed = slot.dataClass === 'red';
    canon.images = canon.images.filter((im) => im.slot !== slotKey && im.canonicalPath !== canonicalPath);
    const entry = { subject: slot.label, slot: slotKey, type: slot.type, dataClass: slot.dataClass,
      caption: captionOv || slot.note || '', qbeAreas: slot.areas || [], canonicalPath };
    if (isRed) entry.consentCleared = true;
    if (source) { entry.source = source; entry.elId = elId; }
    if (pick.name && isRed) entry.person = pick.name;
    canon.images.push(entry);

    console.log(`SET ${slotKey} <- ${pickId} (${pick.kind})  ${canonicalPath}`);
    if (isRed) { reds++; }
  }

  canon.asOf = today;
  fs.writeFileSync(CANONF, JSON.stringify(canon, null, 2) + '\n');
  console.log(`\nimage-canon.json updated (asOf ${today}).`);
  if (reds) console.log(`RED: ${reds} consent-gated slot(s) set because you named the pick. Cross-check the cleared-voices list before external use.`);
};
main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
