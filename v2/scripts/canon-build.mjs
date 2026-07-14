#!/usr/bin/env node
/**
 * CANON BUILD — one master review surface for the whole asset pool.
 *
 * Shows, in a single scrollable page:
 *   1. SLOTS BOARD  — every purpose the raise needs (design/canon-slots.json),
 *      each card showing its CURRENT canon pick (or EMPTY in red) + target QBE areas.
 *   2. ALL CANDIDATES — every asset in the pool, each with a pick id:
 *        R#  repo image      RV# repo video
 *        E#  EL project photo  EP# EL portrait (RED)   EV# EL video
 *
 * Review by eye, then assign winners:
 *   node scripts/canon-assign.mjs <PickId> --slot <slot-key> [--caption "..."]
 * which writes the pick into design/image-canon.json tagged with the slot, overwriting
 * the weaker pick. Canon stays reference-only: repo picks are referenced in place; EL
 * picks are downloaded once into v2/public/images/el/.
 *
 * READ-ONLY against EL (caches thumbnails locally). Run el-photo-review.mjs first so the
 * EL image/portrait cache exists; EL video thumbnails are cached here.
 *
 * Usage: cd v2 && node scripts/canon-build.mjs   ->  design/brand/kit/canon-build.html
 */
import fs from 'node:fs';
import path from 'node:path';

const ENV = path.join(process.cwd(), '.env.local');
if (fs.existsSync(ENV)) for (const line of fs.readFileSync(ENV, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const U = process.env.EMPATHY_LEDGER_API_URL || 'https://empathy-ledger-v2.vercel.app';
const K = process.env.EMPATHY_LEDGER_API_KEY || '';
const PCODE = process.env.EMPATHY_LEDGER_PROJECT_CODE || 'goods-on-country';

const REPO = path.resolve(process.cwd(), '..');
const KIT = path.join(REPO, 'design/brand/kit');
const CACHE = path.join(KIT, '.el-cache');
const SLOTS = JSON.parse(fs.readFileSync(path.join(REPO, 'design/canon-slots.json'), 'utf8'));
const CANON = JSON.parse(fs.readFileSync(path.join(REPO, 'design/image-canon.json'), 'utf8'));
const ELIDX = fs.existsSync(path.join(KIT, 'el-photo-index.json')) ? JSON.parse(fs.readFileSync(path.join(KIT, 'el-photo-index.json'), 'utf8')) : { picks: {} };

const IMG_EXT = /\.(jpe?g|png|webp)$/i;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;');
// src relative to design/brand/kit/canon-build.html
const relSrc = (p) => p.startsWith('.el-cache/') ? p : `../../../${p}`;

const walk = (dir) => {
  const abs = path.join(REPO, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { recursive: true })
    .filter((f) => IMG_EXT.test(f)).map((f) => `${dir}/${f}`.replace(/\\/g, '/')).sort();
};

const main = async () => {
  const index = {}; // pickId -> {kind, path|url, name}
  let R = 0, E = 0, EP = 0, EV = 0, RV = 0;

  // ---- repo images, grouped by top folder ----
  const repoImgs = [...walk('v2/public/images'), ...walk('design/deck-assets')];
  const repoGroups = {};
  for (const p of repoImgs) {
    const id = `R${String(++R).padStart(3, '0')}`;
    index[id] = { kind: 'repo-image', path: p, name: p.split('/').pop() };
    const cat = p.startsWith('design/deck-assets') ? 'deck-assets' : p.split('/')[3] || 'images';
    (repoGroups[cat] ||= []).push({ id, src: relSrc(p), name: p.split('/').pop(), sub: p });
  }

  // ---- EL portraits + photos from the existing cache/index ----
  const elPortraits = [], elPhotos = [];
  for (const [pick, v] of Object.entries(ELIDX.picks || {})) {
    if (v.kind === 'portrait') {
      const id = `EP${++EP}`; const cache = `.el-cache/portrait-${v.id}.jpg`;
      index[id] = { kind: 'el-portrait', url: v.url, elId: v.id, name: v.name };
      if (fs.existsSync(path.join(KIT, cache))) elPortraits.push({ id, src: cache, name: v.name || pick, sub: `EL ${pick}` });
    } else {
      const id = `E${++E}`; const cache = `.el-cache/media-${v.id}.jpg`;
      index[id] = { kind: 'el-image', url: v.url, elId: v.id, name: pick };
      if (fs.existsSync(path.join(KIT, cache))) elPhotos.push({ id, src: cache, name: pick, sub: `EL ${pick}` });
    }
  }

  // ---- EL videos (cache thumbnails here) ----
  const elVideos = [];
  if (K) {
    try {
      const r = await fetch(`${U}/api/v1/content-hub/media?project_code=${PCODE}&type=video&limit=100`, { headers: { 'X-API-Key': K } });
      const vids = (await r.json()).media || [];
      fs.mkdirSync(CACHE, { recursive: true });
      for (const v of vids) {
        const id = `EV${++EV}`;
        index[id] = { kind: 'el-video', url: v.url, elId: v.id, name: (v.altText || v.title || v.id) };
        const cache = `.el-cache/elvideo-${v.id}.jpg`, abs = path.join(KIT, cache);
        if (v.thumbnailUrl && !(fs.existsSync(abs) && fs.statSync(abs).size > 1024)) {
          try { const t = await fetch(v.thumbnailUrl, { redirect: 'follow', headers: { 'X-API-Key': K } });
            if (t.ok) { const b = Buffer.from(await t.arrayBuffer()); if (b.length > 1024) fs.writeFileSync(abs, b); } } catch {}
        }
        elVideos.push({ id, src: fs.existsSync(abs) ? cache : '', name: (v.altText || v.title || '').replace(/^Video:\s*/, '') || id, sub: `EL ${id}`, film: true });
      }
    } catch (e) { console.warn('EL video fetch skipped:', e.message); }
  }

  // ---- repo videos (poster thumb if a sibling exists) ----
  const repoVidPaths = [];
  for (const d of ['v2/public/video', 'media/raw']) {
    const abs = path.join(REPO, d); if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs, { recursive: true })) if (/\.mp4$/i.test(f)) repoVidPaths.push(`${d}/${f}`.replace(/\\/g, '/'));
  }
  const repoVideos = repoVidPaths.sort().map((p) => {
    const id = `RV${++RV}`; index[id] = { kind: 'repo-video', path: p, name: p.split('/').pop() };
    const base = p.replace(/\.mp4$/i, '').replace(/-(desktop|mobile)$/, '');
    const poster = [`${base}-poster.jpg`, `${path.dirname(p)}/poster.jpg`].find((q) => fs.existsSync(path.join(REPO, q)));
    return { id, src: poster ? relSrc(poster) : '', name: p.split('/').pop(), sub: p, film: true };
  });

  // ---- resolve current pick per slot ----
  const bySlot = {}; for (const im of CANON.images) if (im.slot) bySlot[im.slot] = im;
  const slotCard = (s) => {
    const cur = bySlot[s.key];
    const p = cur ? cur.canonicalPath : s.seed;
    const exists = p && (p.startsWith('.el-cache/') || fs.existsSync(path.join(REPO, p)));
    const filled = !!cur, hasImg = exists && s.type !== 'video';
    const status = filled ? 'canon' : (p ? 'seed' : 'empty');
    return `<div class="slot ${status} ${s.dataClass}">
      <div class="sthumb">${hasImg ? `<img loading="lazy" src="${esc(relSrc(p))}">` : `<span class="sph">${s.type === 'video' ? '▶ video' : 'EMPTY'}</span>`}</div>
      <div class="sbody"><div class="skey">${esc(s.key)}</div><div class="slabel">${esc(s.label)}</div>
      <div class="smeta">${esc(s.type)} · ${s.dataClass === 'red' ? 'RED' : 'green'} · areas ${esc((s.areas || []).join(','))}</div>
      <div class="snote">${esc(s.note || '')}</div>
      <div class="sstatus st-${status}">${status === 'canon' ? 'canon set' : status === 'seed' ? 'seed (not yet confirmed)' : 'needs a pick'}</div>
      ${p ? `<div class="spath">${esc(p)}</div>` : ''}</div></div>`;
  };
  const slotBoard = SLOTS.groups.map((g) => {
    const ss = SLOTS.slots.filter((s) => s.group === g);
    if (!ss.length) return '';
    return `<h3 class="sgrp">${esc(g)}</h3><div class="slots">${ss.map(slotCard).join('')}</div>`;
  }).join('');

  // ---- candidate grids ----
  const tile = (t) => `<div class="tile${t.film ? ' film' : ''}">
    <div class="th">${t.src ? `<img loading="lazy" src="${esc(t.src)}">` : `<span class="ph">${t.film ? '▶' : '—'}</span>`}<span class="pid">${esc(t.id)}</span></div>
    <div class="cap"><div class="nm">${esc(t.name)}</div><div class="sb">${esc(t.sub)}</div></div></div>`;
  const grid = (title, tone, items, cls = '') => items.length ? `<h2 class="sec ${tone}">${esc(title)} <span>(${items.length})</span></h2><div class="grid ${cls}">${items.map(tile).join('')}</div>` : '';

  const repoCats = Object.keys(repoGroups).sort();
  const candidateHTML = [
    grid('EL — storyteller portraits (RED)', 'red', elPortraits),
    grid('EL — project photos', 'warn', elPhotos),
    grid('EL — videos', 'warn', elVideos, 'vid'),
    ...repoCats.map((c) => grid(`Repo — ${c}`, 'ok', repoGroups[c])),
    grid('Repo — videos', 'ok', repoVideos, 'vid'),
  ].join('');

  fs.writeFileSync(path.join(KIT, 'canon-build-index.json'),
    JSON.stringify({ asOf: SLOTS.asOf, counts: { repoImages: R, elPhotos: E, elPortraits: EP, elVideos: EV, repoVideos: RV }, picks: index }, null, 2));

  const filled = SLOTS.slots.filter((s) => bySlot[s.key]).length;
  const total = R + E + EP + EV + RV;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Goods — canon build</title>
<link rel="stylesheet" href="https://use.typekit.net/bys2ofg.css">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#FBF8F1;color:#2B2A26;font-family:"sinter",system-ui,sans-serif;padding:48px 56px 140px;max-width:1840px;margin:0 auto}
h1{font-family:"georgia",Georgia,serif;font-weight:400;font-size:52px;letter-spacing:-.01em}
.lead{color:#7A7363;font-size:19px;margin:12px 0 4px;max-width:1240px;line-height:1.55}.lead b{color:#2B2A26}
.rule{height:1px;background:#E6DFD1;margin:34px 0}
h2.bigsec{font-family:"georgia",Georgia,serif;font-weight:400;font-size:38px;color:#2B2A26;margin:8px 0 4px}
.sgrp{font-family:"georgia",Georgia,serif;font-weight:400;font-size:25px;color:#C45C3E;margin:30px 0 14px}
.slots{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.slot{display:flex;gap:13px;background:#fff;border:1px solid #E6DFD1;border-radius:14px;padding:13px;border-left:5px solid #E6DFD1}
.slot.canon{border-left-color:#5E7A4C}.slot.seed{border-left-color:#BBA255}.slot.empty{border-left-color:#C45C3E}
.sthumb{width:84px;height:84px;border-radius:9px;overflow:hidden;background:#F1ECE4;flex:none;display:flex;align-items:center;justify-content:center}
.sthumb img{width:100%;height:100%;object-fit:cover}
.sph{font-size:11px;font-weight:700;color:#C45C3E;letter-spacing:.04em}
.sbody{min-width:0}
.skey{font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#A8643F;background:#F1ECE4;padding:2px 6px;border-radius:5px;display:inline-block}
.slabel{font-weight:700;font-size:15px;margin:5px 0 2px}
.smeta{font-size:11px;color:#7A7363}
.snote{font-size:12px;color:#2B2A26;margin:5px 0;line-height:1.3}
.sstatus{font-size:11px;font-weight:700;margin-top:3px}.st-canon{color:#5E7A4C}.st-seed{color:#8a7320}.st-empty{color:#C45C3E}
.spath{font-size:10px;color:#a59a86;margin-top:3px;word-break:break-all}
.sec{font-family:"georgia",Georgia,serif;font-weight:400;font-size:24px;margin:40px 0 14px;border-bottom:1px solid #E6DFD1;padding-bottom:10px;color:#5E7A4C}
.sec.red{color:#C45C3E}.sec.warn{color:#A8643F}.sec span{color:#7A7363;font-size:18px}
.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:12px}.grid.vid{grid-template-columns:repeat(5,1fr)}
.tile{background:#fff;border:1px solid #E6DFD1;border-radius:11px;overflow:hidden}
.th{position:relative;height:120px;background:#F1ECE4;display:flex;align-items:center;justify-content:center}
.th img{width:100%;height:100%;object-fit:cover}
.ph{font-size:26px;color:#C45C3E}
.tile.film .th{background:#2B2A26}.tile.film .ph{color:#FBF8F1}
.pid{position:absolute;top:6px;right:6px;background:#2B2A26;color:#fff;font-family:ui-monospace,Menlo,monospace;font-weight:700;font-size:11px;padding:2px 7px;border-radius:6px}
.cap{padding:8px 9px}.nm{font-size:11px;font-weight:600;line-height:1.2;word-break:break-word}.sb{font-size:10px;color:#9a8f7c;margin-top:3px;word-break:break-all}
</style></head><body>
<h1>Goods — canon build</h1>
<p class="lead">One surface for the whole pool. Top: <b>every slot the raise needs</b> with its current pick (green = canon set, gold = seed not yet confirmed, red = empty). Below: <b>every candidate</b> with a pick id. To set a slot, tell me the <b>pick id + slot key</b>, e.g. <b>"E14 -&gt; cover-hero, EP7 -&gt; storyteller-mykel, RV12 -&gt; video-build"</b>. I run <b>canon-assign</b> which writes it into image-canon.json (overwriting the weaker pick) and swaps it into the deck. RED slots/tiles are consent-gated; <b>you are the gate</b>.</p>
<p class="lead">${filled}/${SLOTS.slots.length} slots set in canon · ${total} candidates (${R} repo images, ${E} EL photos, ${EP} EL portraits, ${EV} EL videos, ${RV} repo videos)</p>
<div class="rule"></div>
<h2 class="bigsec">Slots board — what the raise needs</h2>
${slotBoard}
<div class="rule"></div>
<h2 class="bigsec">All candidates — review absolutely everything</h2>
${candidateHTML}
</body></html>`;
  fs.writeFileSync(path.join(KIT, 'canon-build.html'), html);
  console.log(`canon-build: ${filled}/${SLOTS.slots.length} slots set, ${total} candidates`);
  console.log(`  repo images ${R} · EL photos ${E} · EL portraits ${EP} · EL videos ${EV} · repo videos ${RV}`);
  console.log('-> design/brand/kit/canon-build.html');
};
main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
