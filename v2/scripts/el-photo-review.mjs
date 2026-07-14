#!/usr/bin/env node
/**
 * EL PHOTO REVIEW — pull the real Empathy Ledger images for the Goods project
 * into one scrollable contact sheet you eyeball, so Ben picks the right shots and
 * we promote them into the image canon + swap them into the deck/artifacts.
 *
 * Sources (EL legacy Supabase keys were disabled 2026-06-17, so we use the API):
 *   - content-hub /media        (project photos; file URLs 302 to public EL storage,
 *                                so they render in a browser with no key)
 *   - syndication /storytellers (portrait avatarUrl + name + location + Elder + quote)
 *
 * The media records are a raw upload dump: no titles/tags/flags, but the filename
 * carries a shoot date (YYYYMMDD), so we cluster by shoot day instead of one flat wall.
 * Every tile gets a short pick id (P1.. portraits, M1.. media) so review is
 * "give me M12 for the cover" not a UUID copy-paste.
 *
 * READ-ONLY against EL. Writes only a local review sheet + JSON index. Ben is the
 * consent gate: EL flags are a guide, not a substitute for his sign-off.
 *
 * Usage:  cd v2 && node scripts/el-photo-review.mjs
 * Out:    design/brand/kit/el-photo-review.html  (+ el-photo-index.json keyed by pick id)
 */
import fs from 'node:fs';
import path from 'node:path';

const ENV = path.join(process.cwd(), '.env.local');
if (fs.existsSync(ENV)) for (const line of fs.readFileSync(ENV, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const U = process.env.EMPATHY_LEDGER_API_URL || 'https://empathy-ledger-v2.vercel.app';
const K = process.env.EMPATHY_LEDGER_API_KEY || '';
const PID = process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';
const SLUG = process.env.EMPATHY_LEDGER_SITE_SLUG || 'goods-asset-register';
const PCODE = process.env.EMPATHY_LEDGER_PROJECT_CODE || 'goods-on-country';
if (!K) { console.error('Missing EMPATHY_LEDGER_API_KEY in v2/.env.local'); process.exit(1); }

const getJSON = async (url, headers) => {
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`${r.status} ${url.slice(0, 80)}`);
  return r.json();
};
const yes = (v) => v === true || v === 'true';
const fmtDate = (ymd) => ymd ? `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}` : null;

// EL's media endpoint throttles bursts, so the browser drops most live <img> loads.
// Download each thumbnail ONCE to a local cache and reference that, so the sheet
// always shows. Idempotent (skips files already cached), small concurrency + retry.
const CACHE_REL = '.el-cache';
const downloadAll = async (items, cacheDir) => {
  fs.mkdirSync(cacheDir, { recursive: true });
  const local = {};
  let done = 0, failed = 0;
  const fetchOne = async (it) => {
    const file = `${it.key}.jpg`;
    const abs = path.join(cacheDir, file);
    if (fs.existsSync(abs) && fs.statSync(abs).size > 1024) { local[it.key] = `${CACHE_REL}/${file}`; done++; return; }
    for (let a = 0; a < 3; a++) {
      try {
        const r = await fetch(it.url, { redirect: 'follow', headers: { 'X-API-Key': K } });
        if (!r.ok) throw new Error(String(r.status));
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length < 1024) throw new Error('tiny');
        fs.writeFileSync(abs, buf); local[it.key] = `${CACHE_REL}/${file}`; done++; return;
      } catch { await new Promise((res) => setTimeout(res, 400 * (a + 1))); }
    }
    failed++; local[it.key] = it.url; // fall back to remote so it at least tries
  };
  const POOL = 6;
  for (let i = 0; i < items.length; i += POOL) await Promise.all(items.slice(i, i + POOL).map(fetchOne));
  console.log(`cached ${done}/${items.length} thumbnails${failed ? `, ${failed} fell back to remote` : ''}`);
  return local;
};

const main = async () => {
  const mediaResp = await getJSON(`${U}/api/v1/content-hub/media?project_code=${PCODE}&type=image&limit=300`, { 'X-API-Key': K });
  const media = mediaResp.media || [];
  let tellers = [];
  try {
    const t = await getJSON(`${U}/api/v1/sites/${SLUG}/projects/${PID}/storytellers?limit=100`, { Authorization: `Bearer ${K}` });
    tellers = (t.storytellers || []).filter((s) => s.avatarUrl);
  } catch (e) { console.warn('storytellers fetch skipped:', e.message); }

  // index keyed by pick id, so a promotion step can resolve M12 -> {id,url}
  const index = {};
  let pn = 0, mn = 0;

  const dl = []; // {key,url} pairs to cache locally

  const portraitGroup = {
    title: 'Storyteller portraits', kind: 'portrait', tone: 'red',
    desc: 'EL storyteller faces. RED / consent-gated. Only consent-cleared voices go external (cross-check the cleared-voices list).',
    photos: tellers.map((s) => {
      const pick = `P${++pn}`;
      index[pick] = { id: s.id, url: s.avatarUrl, kind: 'portrait', name: s.name };
      const quote = (s.quotes && s.quotes[0]) ? (typeof s.quotes[0] === 'string' ? s.quotes[0] : s.quotes[0].text) : null;
      const key = `portrait-${s.id}`; dl.push({ key, url: s.avatarUrl });
      return { pick, id: s.id, key, name: s.name,
        meta: [s.location, s.isElder ? 'Elder' : null].filter(Boolean).join(' · '),
        caption: quote || (s.bio ? s.bio.slice(0, 130) : ''), badges: s.isElder ? ['elder'] : [] };
    }),
  };

  // project photos: cluster by shoot date pulled from the filename, newest first
  const shoot = (m) => (m.altText || '').match(/(\d{8})/)?.[1] || (m.createdAt || '').slice(0, 10).replace(/-/g, '');
  const byDate = {};
  for (const m of media) (byDate[shoot(m) || 'undated'] ||= []).push(m);
  const dateGroups = Object.keys(byDate).sort().reverse().map((ymd) => ({
    title: `Shoot ${fmtDate(ymd) || ymd}`, kind: 'media', tone: 'warn',
    desc: `${byDate[ymd].length} photos. No EL consent/elder flag set — confirm before any external use.`,
    photos: byDate[ymd].sort((a, b) => (a.altText || '').localeCompare(b.altText || '')).map((m) => {
      const pick = `M${++mn}`;
      index[pick] = { id: m.id, url: m.url, kind: 'media' };
      const key = `media-${m.id}`; dl.push({ key, url: m.thumbnailUrl || m.url });
      return { pick, id: m.id, key, name: (m.altText || 'untitled').replace(/^Image:\s*/, ''),
        meta: [m.consentObtained && 'consent', m.elderApproved && 'elder', m.isHero && 'hero'].filter(Boolean).join(' · ') || 'no flags',
        caption: '', badges: [yes(m.isHero) && 'hero', yes(m.elderApproved) && 'elder', yes(m.consentObtained) && 'consent'].filter(Boolean) };
    }),
  }));

  const groups = [portraitGroup, ...dateGroups];
  const out0 = path.resolve(process.cwd(), '..', 'design/brand/kit');
  const local = await downloadAll(dl, path.join(out0, CACHE_REL));
  for (const g of groups) for (const p of g.photos) p.thumb = local[p.key] || '';
  const out = out0;
  fs.writeFileSync(path.join(out, 'el-photo-index.json'),
    JSON.stringify({ projectId: PID, asOf: new Date().toISOString().slice(0, 10), counts: { portraits: pn, media: mn }, picks: index }, null, 2));

  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const badge = (b) => `<span class="b b-${b}">${b}</span>`;
  const tile = (p, big) => `<div class="tile${big ? ' big' : ''}">
    <div class="thumb" style="background-image:url('${esc(p.thumb)}')"><span class="pick">${esc(p.pick)}</span><div class="badges">${(p.badges || []).map(badge).join('')}</div></div>
    <div class="cap"><div class="subj">${esc(p.name)}</div>
    ${p.meta ? `<div class="meta">${esc(p.meta)}</div>` : ''}
    ${p.caption ? `<div class="capt">${esc(p.caption)}</div>` : ''}</div></div>`;
  const secs = groups.map((g) => `<h2 class="sec ${g.tone}">${esc(g.title)} <span>(${g.photos.length})</span></h2>
    <p class="note">${esc(g.desc)}</p><div class="grid ${g.kind}">${g.photos.map((p) => tile(p, g.kind === 'portrait')).join('')}</div>`).join('');
  const total = pn + mn;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Goods — Empathy Ledger photo review</title>
<link rel="stylesheet" href="https://use.typekit.net/bys2ofg.css">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#FBF8F1;color:#2B2A26;font-family:"sinter",system-ui,sans-serif;padding:56px 64px 120px;max-width:1760px;margin:0 auto}
h1{font-family:"georgia",Georgia,serif;font-weight:400;font-size:54px;letter-spacing:-.01em}
.lead{color:#7A7363;font-size:20px;margin:14px 0 6px;max-width:1180px;line-height:1.55}
.lead b{color:#2B2A26}
.sec{font-family:"georgia",Georgia,serif;font-weight:400;font-size:30px;margin:54px 0 4px;border-bottom:1px solid #E6DFD1;padding-bottom:12px;color:#C45C3E}
.sec.warn{color:#A8643F}.sec.red{color:#C45C3E}.sec span{color:#7A7363;font-size:20px}
.note{color:#7A7363;font-size:16px;margin:6px 0 20px}
.grid{display:grid;gap:20px}
.grid.portrait{grid-template-columns:repeat(4,1fr)}
.grid.media{grid-template-columns:repeat(6,1fr);gap:14px}
.tile{background:#fff;border:1px solid #E6DFD1;border-radius:14px;overflow:hidden}
.thumb{position:relative;height:150px;background-size:cover;background-position:center;background-color:#F1ECE4}
.tile.big .thumb{height:240px}
.pick{position:absolute;top:8px;right:8px;background:#2B2A26;color:#fff;font-weight:700;font-size:13px;padding:3px 9px;border-radius:8px;letter-spacing:.04em}
.badges{position:absolute;bottom:8px;left:8px;display:flex;gap:6px;flex-wrap:wrap}
.b{font-size:10px;font-weight:700;padding:3px 7px;border-radius:999px;letter-spacing:.03em;color:#fff}
.b-hero{background:#C45C3E}.b-elder{background:#8B5E34}.b-consent{background:#5E7A4C}
.cap{padding:11px 13px}
.subj{font-weight:700;font-size:13px;line-height:1.25;word-break:break-word}
.tile.big .subj{font-size:16px}
.meta{font-size:12px;color:#7A7363;margin:5px 0}
.capt{font-size:13px;color:#2B2A26;margin:6px 0 0;line-height:1.35;font-style:italic}
@page{size:18in 26in;margin:.4in}
</style></head><body>
<h1>Empathy Ledger — Goods photo review</h1>
<p class="lead">Every Goods image in Empathy Ledger, by shoot date. To use one, tell me its <b>pick id</b> (the dark chip, e.g. <b>M12</b>) and where it goes (cover / a storyteller slide / the plant). I promote it into <b>image-canon.json</b> and swap it into the deck. Badges: <b style="color:#5E7A4C">consent</b> / <b style="color:#8B5E34">elder</b> / <b style="color:#C45C3E">hero</b> come from EL (most project photos carry none yet). <b>You are the consent gate.</b></p>
<p class="lead">${total} images · ${pn} portraits · ${mn} project photos · EL project ${PID}</p>
${secs}
</body></html>`;
  fs.writeFileSync(path.join(out, 'el-photo-review.html'), html);
  console.log(`EL photo review: ${total} images (${pn} portraits, ${mn} project photos), ${groups.length} groups`);
  for (const g of groups) console.log(`  ${g.photos.length.toString().padStart(3)}  ${g.title}`);
  console.log('-> design/brand/kit/el-photo-review.html');
};
main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
