// EL photo↔people ALIGNMENT (server-only). Reads the FULL Goods photo library
// (galleries + project media, direct EL Supabase — the content-hub API is capped
// and never sees the galleries) and writes people attributions into EL's
// `media_storytellers` junction, the source of truth. A junction row links an
// EXISTING photo to a person, so this is NOT the storage-backed media_assets
// insert the 2026-06-17 plan refused. Consent stays `pending` until a human
// clears it in EL, so nothing this writes can auto-publish.

import 'server-only';

const URL_ = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const PID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';
// The May-2026 trip dump was bucketed under this placeholder storyteller, not the
// real individuals — exclude it from the pickable people.
const PLACEHOLDER = 'ac700001-0000-0000-0000-000000000002';
const H: Record<string, string> = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function elGet<T>(table: string, qs: string): Promise<T[]> {
  if (!URL_ || !KEY) return [];
  // Retry on 5xx / 429 / network blips so a flaky EL call never silently drops
  // whole sources (that produced the "68 photos" fallback).
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const r = await fetch(`${URL_}/rest/v1/${table}?${qs}`, { headers: H, cache: 'no-store' });
      if (r.ok) return (await r.json()) as T[];
      if (r.status < 500 && r.status !== 429) return []; // a real 4xx (bad query) — don't retry
    } catch {
      // network error — fall through to retry
    }
    await new Promise((res) => setTimeout(res, 200 * (attempt + 1)));
  }
  return [];
}
function chunk<T>(a: T[], n: number): T[][] { const o: T[][] = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; }

interface MediaRow { id: string; cdn_url: string | null; thumbnail_url: string | null; title: string | null; media_type: string | null; file_type: string | null; is_sacred_no_publish: boolean | null; removed_by_storyteller_at: string | null; tenant_id: string | null; source_url: string | null; }
interface PersonRow { id: string; display_name: string | null; public_avatar_url: string | null; is_elder: boolean | null; is_active: boolean | null; }
interface JunctionRow { media_asset_id: string; storyteller_id: string; }

export interface AlignPhoto { id: string; url: string; thumb: string; title: string; gallery: string; people: { id: string; name: string }[]; }
export interface AlignPerson { id: string; name: string; portrait: string | null; isElder: boolean; }

export async function getAlignData(): Promise<{ photos: AlignPhoto[]; persons: AlignPerson[] }> {
  // galleries → their media (galleries hold ~136 photos NOT tagged with project_id)
  const pg = await elGet<{ gallery_id: string }>('project_galleries', `project_id=eq.${PID}&select=gallery_id`);
  const gids = pg.map((g) => g.gallery_id);
  const gals = gids.length ? await elGet<{ id: string; title: string }>('galleries', `id=in.(${gids.join(',')})&select=id,title`) : [];
  const galTitle = new Map(gals.map((g) => [g.id, g.title]));
  const assoc = gids.length ? await elGet<{ gallery_id: string; media_asset_id: string }>('gallery_media_associations', `gallery_id=in.(${gids.join(',')})&select=gallery_id,media_asset_id`) : [];
  const galleryOf = new Map<string, string>(); assoc.forEach((a) => galleryOf.set(a.media_asset_id, galTitle.get(a.gallery_id) || ''));

  const SEL = 'id,cdn_url,thumbnail_url,title,media_type,file_type,is_sacred_no_publish,removed_by_storyteller_at,tenant_id,source_url';
  // EL tags Goods media THREE inconsistent ways: project_id (96), project_code='goods'
  // (195), and gallery-only. Union all three (dedupe by id) so "all photos" is truly all.
  const [byId, byCode] = await Promise.all([
    elGet<MediaRow>('media_assets', `project_id=eq.${PID}&select=${SEL}&limit=1000`),
    elGet<MediaRow>('media_assets', `project_code=eq.goods&select=${SEL}&limit=1000`),
  ]);
  const rowById = new Map<string, MediaRow>();
  for (const m of [...byId, ...byCode]) rowById.set(m.id, m);
  const missing = [...new Set(assoc.map((a) => a.media_asset_id))].filter((id) => !rowById.has(id));
  for (const c of chunk(missing, 100)) {
    for (const m of await elGet<MediaRow>('media_assets', `id=in.(${c.join(',')})&select=${SEL}`)) rowById.set(m.id, m);
  }
  // EL-verified corpus: only rows typed media_type='image' (240). The 136 untyped
  // rows (media_type + mime both null) may be docs/graphics — held back until reviewed.
  const media = [...rowById.values()].filter((m) => m.media_type === 'image' && !m.is_sacred_no_publish && !m.removed_by_storyteller_at);

  // existing junction alignment
  const mids = media.map((m) => m.id);
  const junction: JunctionRow[] = [];
  for (const c of chunk(mids, 100)) junction.push(...(await elGet<JunctionRow>('media_storytellers', `media_asset_id=in.(${c.join(',')})&select=media_asset_id,storyteller_id`)));

  // pickable Goods storytellers = the full project_storytellers junction (30), minus
  // placeholder + deactivated (is_active filter below). Someone can APPEAR in a photo
  // without authoring a story, so this fuller roster fits photo tagging better than the
  // 24 story-authors. (Ben's choice, 2026-07-07.)
  const ps = await elGet<{ storyteller_id: string | null }>('project_storytellers', `project_id=eq.${PID}&select=storyteller_id`);
  const stIds = [...new Set(ps.map((s) => s.storyteller_id).filter((x): x is string => !!x))].filter((id) => id !== PLACEHOLDER);
  // Exclude deactivated storytellers (is_active=false) — never offer them as a tag.
  const persons0 = (stIds.length ? await elGet<PersonRow>('storytellers', `id=in.(${stIds.join(',')})&select=id,display_name,public_avatar_url,is_elder,is_active&order=display_name`) : [])
    .filter((p) => p.is_active !== false);
  const nameById = new Map(persons0.map((p) => [p.id, p.display_name || '']));

  const byMedia = new Map<string, { id: string; name: string }[]>();
  for (const j of junction) {
    if (!nameById.has(j.storyteller_id)) continue;
    const arr = byMedia.get(j.media_asset_id) || [];
    arr.push({ id: j.storyteller_id, name: nameById.get(j.storyteller_id) || '' });
    byMedia.set(j.media_asset_id, arr);
  }

  // Private-bucket migrations (52 person/community photos) have no cdn_url or
  // thumbnail_url by design — their bytes live at source_url ("story-media/<path>")
  // in a gated bucket, fetchable ONLY server-side with the EL service key. Build the
  // authed object URL so the admin-only el-image proxy (which holds that key) can
  // render them for alignment, WITHOUT any public exposure. Public consumers still
  // get nothing (visibility stays private); this is an admin display path only.
  const storageBase = URL_.replace(/\/$/, '');
  const authedUrl = (m: MediaRow) => (m.source_url ? `${storageBase}/storage/v1/object/${m.source_url}` : '');
  const photos: AlignPhoto[] = media.map((m) => {
    const authed = authedUrl(m);
    return {
      id: m.id,
      url: m.cdn_url || m.thumbnail_url || authed || '',
      thumb: m.thumbnail_url || m.cdn_url || authed || '',
      title: m.title || '',
      gallery: galleryOf.get(m.id) || '(ungalleried)',
      people: byMedia.get(m.id) || [],
    };
  });
  const persons: AlignPerson[] = persons0.map((p) => ({ id: p.id, name: p.display_name || '', portrait: p.public_avatar_url, isElder: p.is_elder === true }));
  return { photos, persons };
}

// EL-verified write shape (2026-07-07, checked against the EL codebase):
//  - relationship + source are CHECK-constrained enums; the old 'depicted' /
//    'goods-align-2026-07' values were REJECTED on every insert.
//  - tenant_id is auto-filled by trigger trg_fill_tenant_id from the storyteller —
//    do NOT pass it (a passed value is overwritten anyway).
//  - added_by is a nullable auth.users FK; a service write has no auth user, so omit.
//  - idempotency key is the (media_asset_id, storyteller_id, relationship) triple.
//  - consent_status 'pending' keeps the name↔photo LINK out of person-aware feeds,
//    but the photo itself is already visibility='public' — tagging changes neither.
export async function alignAdd(mediaAssetId: string, storytellerId: string): Promise<{ ok: boolean; error?: string }> {
  const payload = {
    media_asset_id: mediaAssetId,
    storyteller_id: storytellerId,
    relationship: 'appears_in', // CHECK: appears_in|photographer|subject|owner|tagged_by_face|mentioned
    consent_status: 'pending', // CHECK: pending|granted|denied|revoked|not_required
    source: 'batch', // CHECK: manual|face_detection|batch|self_tagged
  };
  try {
    const r = await fetch(`${URL_}/rest/v1/media_storytellers?on_conflict=media_asset_id,storyteller_id,relationship`, {
      method: 'POST',
      headers: { ...H, 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) return { ok: false, error: `EL ${r.status}: ${(await r.text()).slice(0, 160)}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'write failed' };
  }
}

export async function alignRemove(mediaAssetId: string, storytellerId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    // Only our own 'appears_in' tag — never touch other relationship rows.
    const r = await fetch(`${URL_}/rest/v1/media_storytellers?media_asset_id=eq.${mediaAssetId}&storyteller_id=eq.${storytellerId}&relationship=eq.appears_in`, { method: 'DELETE', headers: H });
    if (!r.ok) return { ok: false, error: `EL ${r.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'delete failed' };
  }
}
