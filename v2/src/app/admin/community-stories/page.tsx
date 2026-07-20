// Community stories — content system Phase 2. A content/coverage view of the
// communities: storytellers, quotes and media per place. Complements the ops
// rollup at /admin/communities (beds/demand/revenue). Doubles as a story-
// coverage map: communities with no tagged content surface as gaps.
//
// Consent: RED media is never rendered here. Elder/gated voices show with care
// on this admin-only surface.

import type { Metadata } from 'next';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';
import { empathyLedger } from '@/lib/empathy-ledger/client';
import { getAlignData } from '@/lib/empathy-ledger/align';
import { makeCommunityMatcher } from '@/lib/data/community-match';
import CommunityStoriesClient, { type CommunityBundle } from './community-stories-client';

// Empathy Ledger is the real source of storyteller/media location, but stores it
// as free text (location strings) + media titles — cache the two heavy EL reads
// for 5 min so repeated coverage-page loads during a review session stay quick.
const cachedElProfiles = unstable_cache(
  () => empathyLedger.getGoodsStorytellerProfiles(),
  ['community-coverage-el-profiles'],
  { revalidate: 300 },
);
const cachedElAlign = unstable_cache(
  () => getAlignData(),
  ['community-coverage-el-align'],
  { revalidate: 300 },
);

export const metadata: Metadata = {
  title: 'Community stories · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface StorytellerRow { id: string; community_id: string | null; display_name: string; is_elder: boolean; portrait: { url: string } | null }
interface QuoteRow { id: string; community_id: string | null; text: string; context: string | null; storyteller: { display_name: string } | null }
interface MediaRow { id: string; community_id: string | null; url: string | null; poster_url: string | null; media_type: string; consent_tier: string | null }
interface CommRow { id: string; name: string; traditional_name: string | null; state: string | null; status: string | null; region: string | null; partner: string | null }

async function load(): Promise<{ bundles: CommunityBundle[]; ready: boolean; elLit: number }> {
  try {
    const supabase = createServiceClient();
    const [communities, storytellers, quotes, media] = await Promise.all([
      supabase.from('communities').select('id, name, traditional_name, state, status, region, partner').order('name'),
      supabase.from('storytellers').select('id, community_id, display_name, is_elder, portrait:content_items(url)'),
      supabase.from('quotes').select('id, community_id, text, context, storyteller:storytellers(display_name)'),
      supabase.from('content_items').select('id, community_id, url, poster_url, media_type, consent_tier').not('community_id', 'is', null),
    ]);
    if (communities.error) return { bundles: [], ready: false, elLit: 0 };

    const comms = (communities.data ?? []) as unknown as CommRow[];
    const st = (storytellers.data ?? []) as unknown as StorytellerRow[];
    const qu = (quotes.data ?? []) as unknown as QuoteRow[];
    const md = ((media.data ?? []) as unknown as MediaRow[]).filter((m) => m.consent_tier !== 'red' && m.url);

    // Build a bundle per community, indexed by id, then fill from the local
    // community_id links (the only signal this page used before).
    const byId = new Map<string, CommunityBundle>();
    for (const c of comms) {
      byId.set(c.id, {
        id: c.id, name: c.name, traditional_name: c.traditional_name, state: c.state,
        status: c.status, region: c.region, partner: c.partner, storytellers: [], quotes: [], media: [],
      });
    }
    for (const s of st) {
      const b = s.community_id ? byId.get(s.community_id) : undefined;
      if (b) b.storytellers.push({ display_name: s.display_name, is_elder: s.is_elder, portrait_url: s.portrait?.url ?? null, source: 'local' });
    }
    for (const x of qu) {
      const b = x.community_id ? byId.get(x.community_id) : undefined;
      if (b) b.quotes.push({ id: x.id, text: x.text, context: x.context, storyteller: x.storyteller?.display_name ?? null });
    }
    for (const m of md) {
      const b = m.community_id ? byId.get(m.community_id) : undefined;
      if (b) b.media.push({ id: m.id, url: m.url as string, poster_url: m.poster_url, media_type: m.media_type, source: 'local' });
    }

    // --- Empathy Ledger realignment: attribute EL storytellers (by location) and
    // EL media (by title/gallery place) to communities, since the local FKs above
    // are near-empty. Best-effort: if EL is unreachable, local coverage still shows.
    const litFromEl = new Set<string>();
    try {
      const matcher = makeCommunityMatcher(comms);
      const [profiles, align] = await Promise.all([cachedElProfiles(), cachedElAlign()]);

      for (const p of profiles) {
        // Storyteller home location first; fall back to any story's own location.
        const cid = matcher.matchLocation(p.location)
          ?? p.stories.map((s) => matcher.matchLocation(s.location)).find((x): x is string => !!x)
          ?? null;
        const b = cid ? byId.get(cid) : undefined;
        if (!b) continue;
        if (b.storytellers.some((s) => s.display_name.toLowerCase() === p.name.toLowerCase())) continue;
        b.storytellers.push({ display_name: p.name, is_elder: p.isElder, portrait_url: p.portraitUrl, source: 'el' });
        litFromEl.add(cid!);
      }

      const EL_MEDIA_CAP = 24; // don't flood one community's thumb strip
      for (const ph of align.photos) {
        const url = ph.thumb || ph.url;
        if (!url) continue; // migrated-but-URL-less rows (private bucket) — skip
        const cid = matcher.matchText(ph.title) ?? matcher.matchText(ph.gallery);
        const b = cid ? byId.get(cid) : undefined;
        if (!b) continue;
        if (b.media.filter((m) => m.source === 'el').length >= EL_MEDIA_CAP) continue;
        if (b.media.some((m) => m.id === ph.id)) continue;
        b.media.push({ id: ph.id, url, poster_url: null, media_type: 'image', source: 'el' });
        litFromEl.add(cid!);
      }
    } catch {
      // EL down — keep local-only coverage.
    }

    const bundles = [...byId.values()];
    // Content-rich first, then alphabetical.
    bundles.sort((a, b) => {
      const ca = a.storytellers.length + a.quotes.length + a.media.length;
      const cb = b.storytellers.length + b.quotes.length + b.media.length;
      return cb - ca || a.name.localeCompare(b.name);
    });
    return { bundles, ready: true, elLit: litFromEl.size };
  } catch {
    return { bundles: [], ready: false, elLit: 0 };
  }
}

export default async function CommunityStoriesPage() {
  const { bundles, ready, elLit } = await load();
  const withContent = bundles.filter((c) => c.storytellers.length + c.quotes.length + c.media.length > 0).length;

  return (
    <div className="space-y-6 pb-16 p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight font-display">Community stories</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-prose">
          Every place we work, with the storytellers, quotes and media tagged to it. Communities with
          nothing tagged are coverage gaps. For beds, demand and revenue per community, see the ops view at{' '}
          <Link href="/admin/communities" className="text-orange-700 hover:underline">Communities</Link>.
        </p>
      </header>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span><span className="font-bold text-foreground">{bundles.length}</span> communities</span>
        <span><span className="font-bold text-foreground">{withContent}</span> with content</span>
        <span><span className="font-bold text-foreground">{bundles.length - withContent}</span> coverage gaps</span>
        {elLit > 0 && (
          <span><span className="font-bold text-foreground">{elLit}</span> matched from Empathy Ledger locations</span>
        )}
      </div>

      {!ready ? (
        <p className="rounded border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
          Communities index not available. Check the tables / service key.
        </p>
      ) : (
        <CommunityStoriesClient communities={bundles} />
      )}
    </div>
  );
}
