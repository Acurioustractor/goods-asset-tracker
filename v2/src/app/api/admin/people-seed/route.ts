// Content system — Phase 2: seed the people + quotes layer (idempotent).
//
// Seeds `storytellers` and `quotes` from the LOCAL data modules for the CLEARED
// voices only (consent-safe by design): storytellerProfiles (portrait, role,
// community, elder) + curatedQuotes (the words), gated by isClearedForExternal.
// Links each storyteller to its portrait (content_items) and community. Re-run
// safe: storytellers upsert on slug; curated quotes are replaced per run.
//
// Design: wiki/outputs/2026-07-03-content-system-design.md §4/§6.
// Admin-gated (requireAdmin); on localhost the dev bypass lets you curl it.

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';
import { storytellerProfiles } from '@/lib/data/content';
import { curatedQuotes } from '@/lib/data/curated-quotes';
import { isClearedForExternal } from '@/lib/data/cleared-voices';

export const runtime = 'nodejs';

const norm = (n: string) =>
  (n ?? '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/&/g, 'and')
    .replace(/[.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const slugify = (n: string) => norm(n).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

interface SeedRow {
  display_name: string;
  slug: string;
  role: string | null;
  is_elder: boolean;
  community: string | null; // community slug from the profile
  photo: string | null;
  quotes: { text: string; context: string | null }[];
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  const supabase = createServiceClient();

  // 1. Build the cleared-only universe, deduped by normalised name.
  const byNorm = new Map<string, SeedRow>();
  for (const p of storytellerProfiles as Array<Record<string, unknown>>) {
    const name = String(p.name ?? '');
    if (!isClearedForExternal(name)) continue;
    byNorm.set(norm(name), {
      display_name: name,
      slug: String(p.id ?? slugify(name)),
      role: (p.role as string) ?? null,
      is_elder: !!p.isElder,
      community: (p.community as string) ?? null,
      photo: (p.photo as string) ?? null,
      quotes: [],
    });
  }
  for (const [name, qs] of Object.entries(curatedQuotes)) {
    if (!isClearedForExternal(name)) continue;
    const key = norm(name);
    let st = byNorm.get(key);
    if (!st) {
      st = { display_name: name.replace(/\s+/g, ' ').trim(), slug: slugify(name), role: null, is_elder: false, community: null, photo: null, quotes: [] };
      byNorm.set(key, st);
    }
    for (const q of qs) st.quotes.push({ text: q.text, context: q.context });
  }
  const universe = [...byNorm.values()];

  // 2. Lookups: community slug -> id, portrait url -> content_item id.
  const { data: comms } = await supabase.from('communities').select('id, name, traditional_name, name_aliases');
  const communityBySlug = new Map<string, string>();
  for (const c of comms ?? []) {
    const keys = [c.name, c.traditional_name, ...((c.name_aliases as string[]) ?? [])].filter(Boolean) as string[];
    for (const k of keys) communityBySlug.set(slugify(k), c.id as string);
  }
  const { data: portraits } = await supabase.from('content_items').select('id, url').eq('area', 'people');
  const portraitByUrl = new Map<string, string>();
  for (const r of portraits ?? []) portraitByUrl.set(r.url as string, r.id as string);

  // 3. Upsert storytellers (consent gated = all are cleared voices).
  const rows = universe.map((s) => {
    const portraitUrl = s.photo || `/images/people/${s.slug}.jpg`;
    return {
      display_name: s.display_name,
      slug: s.slug,
      role: s.role,
      is_elder: s.is_elder,
      community_id: s.community ? communityBySlug.get(slugify(s.community)) ?? null : null,
      portrait_content_id: portraitByUrl.get(portraitUrl) ?? null,
      consent_tier: 'gated' as const,
    };
  });
  const { data: upserted, error: upErr } = await supabase
    .from('storytellers')
    .upsert(rows, { onConflict: 'slug' })
    .select('id, slug, community_id');
  if (upErr) return NextResponse.json({ ok: false, step: 'storytellers', error: upErr.message }, { status: 500 });

  const idBySlug = new Map<string, { id: string; community_id: string | null }>();
  for (const r of upserted ?? []) idBySlug.set(r.slug as string, { id: r.id as string, community_id: (r.community_id as string) ?? null });

  // 4. Replace curated quotes for the seeded storytellers (idempotent).
  const ids = [...idBySlug.values()].map((v) => v.id);
  if (ids.length) {
    await supabase.from('quotes').delete().eq('source', 'curated').in('storyteller_id', ids);
  }
  const quoteRows: Record<string, unknown>[] = [];
  for (const s of universe) {
    const st = idBySlug.get(s.slug);
    if (!st) continue;
    for (const q of s.quotes) {
      quoteRows.push({
        storyteller_id: st.id,
        community_id: st.community_id,
        text: q.text,
        context: q.context,
        source: 'curated',
        consent_tier: 'gated',
      });
    }
  }
  let quotesInserted = 0;
  if (quoteRows.length) {
    const { error: qErr } = await supabase.from('quotes').insert(quoteRows);
    if (qErr) return NextResponse.json({ ok: false, step: 'quotes', error: qErr.message, storytellers: rows.length }, { status: 500 });
    quotesInserted = quoteRows.length;
  }

  const withPortrait = rows.filter((r) => r.portrait_content_id).length;
  const withCommunity = rows.filter((r) => r.community_id).length;
  return NextResponse.json({
    ok: true,
    storytellers: rows.length,
    withPortrait,
    withCommunity,
    quotes: quotesInserted,
  });
}
