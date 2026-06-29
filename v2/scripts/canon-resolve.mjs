#!/usr/bin/env node
/**
 * CANON RESOLVE — collapse every source into one flat slot -> winner map that
 * artifacts (deck, one-pager, cards, the kit) read. This is what "closes the loop":
 * whatever you pin on /admin/canon (or set via canon-assign) becomes the asset the
 * artifacts pull, with no second decision.
 *
 * Precedence per slot (design/canon-slots.json):
 *   1. local canon entry tagged with that slot   (design/image-canon.json, slot field)
 *   2. an EL pick saved under the slot key        (v2/data/canon-el-picks.json)
 *   3. the slot's seed                            (current best guess)
 *   4. nothing -> status "empty"
 *
 * Out: design/canon-resolved.json  { slot: { source, path|url, consent, status, ... } }
 * Run after editing picks, or wire into a build step. READ-ONLY except the output file.
 *
 * Usage: cd v2 && node scripts/canon-resolve.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve(process.cwd(), '..');
const read = (p, def) => { try { return JSON.parse(fs.readFileSync(path.join(REPO, p), 'utf8')); } catch { return def; } };

const slotsDoc = read('design/canon-slots.json', { slots: [] });
const canon = read('design/image-canon.json', { images: [] });
const elPicks = read('v2/data/canon-el-picks.json', {}); // bucket key -> [{elId,url,title,consent,kind,thumb}]

const localBySlot = {};
for (const im of canon.images || []) if (im.slot) localBySlot[im.slot] = im;

const resolved = {};
let filled = 0;
for (const s of slotsDoc.slots || []) {
  const local = localBySlot[s.key];
  const picks = elPicks[s.key] || [];
  const base = { label: s.label, group: s.group, type: s.type, dataClass: s.dataClass, areas: s.areas || [] };
  if (local) {
    resolved[s.key] = { ...base, source: local.source === 'empathy-ledger' ? 'el-canon' : 'local',
      path: local.canonicalPath, elId: local.elId, consent: local.consentCleared ? 'cleared' : (s.dataClass === 'red' ? 'gated' : 'public'), status: 'canon' };
    filled++;
  } else if (picks.length) {
    const p = picks[picks.length - 1]; // most-recent pin wins
    resolved[s.key] = { ...base, source: 'el-pick', url: p.url, elId: p.elId, kind: p.kind || 'image',
      consent: p.consent || 'el:not-flagged', alternates: picks.length - 1, status: 'el-pick' };
    filled++;
  } else if (s.seed) {
    resolved[s.key] = { ...base, source: 'seed', path: s.seed, consent: s.dataClass === 'red' ? 'gated' : 'public', status: 'seed' };
  } else {
    resolved[s.key] = { ...base, source: 'none', status: 'empty' };
  }
}

const out = { asOf: new Date().toISOString().slice(0, 10), filled, total: (slotsDoc.slots || []).length, resolved };
fs.writeFileSync(path.join(REPO, 'design/canon-resolved.json'), JSON.stringify(out, null, 2) + '\n');

const byStatus = Object.values(resolved).reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
console.log(`canon-resolved: ${filled}/${out.total} slots have a confirmed pick`);
console.log('  ' + Object.entries(byStatus).map(([k, v]) => `${k} ${v}`).join(' · '));
console.log('-> design/canon-resolved.json');
