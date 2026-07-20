// Live Goods -> EL write-through. When a media item is tagged in the Media Room
// and that media lives in Empathy Ledger (an el_media id or an external EL-proxy
// URL), push the tag to EL immediately: community place + VERIFIED nation on the
// media_asset, and a media_storytellers link for a person. Batch equivalent:
// scripts/sync-goods-el.py (npm run sync:el). Philosophy: wiki/canon/el-goods-alignment.md.
//
// Best-effort and non-blocking: a failure here never fails the Goods tag; the
// route returns an `elSync` note and the nightly `sync:el` reconciles anyway.
// Never guesses a nation; never uploads a file; never guess-links a person.

import { createServiceClient } from '@/lib/supabase/server';

const EL_URL = (process.env.EMPATHY_LEDGER_SUPABASE_URL || '').replace(/["']/g, '').trim();
const EL_KEY = (process.env.EMPATHY_LEDGER_SUPABASE_KEY || '').replace(/["']/g, '').trim();
const PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';
const TENANT_ID = 'a1adca53-4c80-44b3-a859-e9e12b40e1a8';

// Goods community slug -> EL place name (place-level, safe)
const PLACE: Record<string, string> = {
  utopia: 'Utopia Homelands (Urapuntja)', 'tennant-creek': 'Tennant Creek', 'palm-island': 'Palm Island',
  kalgoorlie: 'Kalgoorlie', 'alice-springs': 'Alice Springs', katherine: 'Katherine / Nitmiluk',
  kununurra: 'Lake Argyle / Kununurra', maningrida: 'Maningrida', 'mt-isa': 'Mount Isa', darwin: 'Darwin', canberra: 'Canberra',
};
// VERIFIED nations only (EL communities.country_names). Everything else stays null.
const VERIFIED_NATION: Record<string, string[]> = {
  'palm-island': ['Bwgcolman', 'Manbarra'], 'alice-springs': ['Mparntwe', 'Arrernte Country'],
};
const NAME_ALIAS: Record<string, string> = { 'shayne bloomfield': 'shane bloomfield', 'ben knight': 'benjamin knight' };

export interface ElSyncResult { synced: boolean; detail: string }

/** Resolve the EL media_asset id a Goods media reference points at, or null. */
function elMediaId(media_source: string, media_key: string): string | null {
  if (media_source === 'el_media') return media_key;
  if (media_source === 'external') {
    const m = media_key.match(/\/media\/([0-9a-f-]{36})\//);
    return m ? m[1] : null;
  }
  return null;
}

async function elFetch(path: string, init: RequestInit = {}) {
  return fetch(`${EL_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
}

/**
 * Push one Media Room tag to EL, if the media lives in EL. Returns a note; never
 * throws. `local` media (no EL home) is a no-op here — handled by batch sync /
 * EL upload, per the no-duplication rule.
 */
export async function syncMediaLinkToEL(link: {
  media_source: string; media_key: string; target_type: string; target_key: string;
}): Promise<ElSyncResult> {
  if (!EL_URL || !EL_KEY) return { synced: false, detail: 'EL not configured' };
  const eid = elMediaId(link.media_source, link.media_key);
  if (!eid) return { synced: false, detail: 'not EL-hosted media (local) — batch sync / EL upload handles it' };

  try {
    // read the EL media (any project — Goods references some ACT-org photos too)
    const curRes = await elFetch(`media_assets?id=eq.${eid}&select=id,project_id,country_or_place,nation_or_community`);
    const cur = (await curRes.json()) as Array<{ id: string; project_id: string | null; country_or_place: string | null; nation_or_community: string[] | null }>;
    if (!cur.length) return { synced: false, detail: 'EL media not found' };
    const row = cur[0];

    if (link.target_type === 'community') {
      // place/nation edits are scoped to Goods-project media — do not rewrite another org's metadata
      if (row.project_id !== PROJECT_ID) return { synced: false, detail: 'community place left to owning org (not Goods project)' };
      const slug = link.target_key;
      const patch: Record<string, unknown> = {};
      if (!row.country_or_place && (PLACE[slug] || slug)) patch.country_or_place = PLACE[slug] || slug;
      if (!row.nation_or_community?.length && VERIFIED_NATION[slug]) patch.nation_or_community = VERIFIED_NATION[slug];
      if (!Object.keys(patch).length) return { synced: true, detail: 'EL already has place/nation' };
      const r = await elFetch(`media_assets?id=eq.${eid}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(patch) });
      return r.ok ? { synced: true, detail: `EL ${Object.keys(patch).join('+')} set` } : { synced: false, detail: `EL patch ${r.status}` };
    }

    if (link.target_type === 'person') {
      // Goods person target_key is a crm_contacts.id -> name -> EL project storyteller id
      const supabase = createServiceClient();
      const { data: contact } = await supabase.from('crm_contacts').select('name').eq('id', link.target_key).maybeSingle();
      const name = (contact?.name || '').trim().toLowerCase();
      if (!name) return { synced: false, detail: 'no crm contact name' };
      const psRes = await elFetch(`project_storytellers?project_id=eq.${PROJECT_ID}&select=storyteller:storytellers(id,display_name)`);
      const ps = (await psRes.json()) as Array<{ storyteller: { id: string; display_name: string } | null }>;
      const map = new Map<string, string>();
      for (const p of ps) if (p.storyteller?.display_name) map.set(p.storyteller.display_name.trim().toLowerCase(), p.storyteller.id);
      const sid = map.get(name) || map.get(NAME_ALIAS[name]);
      if (!sid) return { synced: false, detail: `"${contact?.name}" not an EL project storyteller — flagged, not guessed` };
      const r = await elFetch('media_storytellers', {
        method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
        body: JSON.stringify({ media_asset_id: eid, storyteller_id: sid, tenant_id: TENANT_ID, relationship: 'appears_in', consent_status: 'pending', source: 'batch' }),
      });
      if (r.ok) return { synced: true, detail: `EL storyteller link added (${contact?.name})` };
      if (r.status === 409) return { synced: true, detail: `EL already links ${contact?.name}` };
      return { synced: false, detail: `EL link ${r.status}` };
    }

    return { synced: false, detail: `${link.target_type} not synced to EL (product/story stay Goods-side)` };
  } catch (e) {
    return { synced: false, detail: `EL sync error: ${e instanceof Error ? e.message : 'unknown'}` };
  }
}
