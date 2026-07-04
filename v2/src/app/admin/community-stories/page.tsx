// Community stories — content system Phase 2. A content/coverage view of the
// communities: storytellers, quotes and media per place. Complements the ops
// rollup at /admin/communities (beds/demand/revenue). Doubles as a story-
// coverage map: communities with no tagged content surface as gaps.
//
// Consent: RED media is never rendered here. Elder/gated voices show with care
// on this admin-only surface.

import type { Metadata } from 'next';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import CommunityStoriesClient, { type CommunityBundle } from './community-stories-client';

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

async function load(): Promise<{ bundles: CommunityBundle[]; ready: boolean }> {
  try {
    const supabase = createServiceClient();
    const [communities, storytellers, quotes, media] = await Promise.all([
      supabase.from('communities').select('id, name, traditional_name, state, status, region, partner').order('name'),
      supabase.from('storytellers').select('id, community_id, display_name, is_elder, portrait:content_items(url)'),
      supabase.from('quotes').select('id, community_id, text, context, storyteller:storytellers(display_name)'),
      supabase.from('content_items').select('id, community_id, url, poster_url, media_type, consent_tier').not('community_id', 'is', null),
    ]);
    if (communities.error) return { bundles: [], ready: false };

    const st = (storytellers.data ?? []) as unknown as StorytellerRow[];
    const qu = (quotes.data ?? []) as unknown as QuoteRow[];
    const md = ((media.data ?? []) as unknown as MediaRow[]).filter((m) => m.consent_tier !== 'red' && m.url);

    const bundles: CommunityBundle[] = ((communities.data ?? []) as unknown as CommRow[]).map((c) => ({
      id: c.id,
      name: c.name,
      traditional_name: c.traditional_name,
      state: c.state,
      status: c.status,
      region: c.region,
      partner: c.partner,
      storytellers: st
        .filter((s) => s.community_id === c.id)
        .map((s) => ({ display_name: s.display_name, is_elder: s.is_elder, portrait_url: s.portrait?.url ?? null })),
      quotes: qu
        .filter((x) => x.community_id === c.id)
        .map((x) => ({ id: x.id, text: x.text, context: x.context, storyteller: x.storyteller?.display_name ?? null })),
      media: md
        .filter((m) => m.community_id === c.id)
        .map((m) => ({ id: m.id, url: m.url as string, poster_url: m.poster_url, media_type: m.media_type })),
    }));

    // Content-rich first, then alphabetical.
    bundles.sort((a, b) => {
      const ca = a.storytellers.length + a.quotes.length + a.media.length;
      const cb = b.storytellers.length + b.quotes.length + b.media.length;
      return cb - ca || a.name.localeCompare(b.name);
    });
    return { bundles, ready: true };
  } catch {
    return { bundles: [], ready: false };
  }
}

export default async function CommunityStoriesPage() {
  const { bundles, ready } = await load();
  const withContent = bundles.filter((c) => c.storytellers.length + c.quotes.length + c.media.length > 0).length;

  return (
    <div className="space-y-6 pb-16 p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Community stories</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-prose">
          Every place we work, with the storytellers, quotes and media tagged to it. Communities with
          nothing tagged are coverage gaps. For beds, demand and revenue per community, see the ops view at{' '}
          <Link href="/admin/communities" className="text-orange-700 hover:underline">Communities</Link>.
        </p>
      </header>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
        <span><span className="font-bold text-gray-900">{bundles.length}</span> communities</span>
        <span><span className="font-bold text-gray-900">{withContent}</span> with content</span>
        <span><span className="font-bold text-gray-900">{bundles.length - withContent}</span> coverage gaps</span>
      </div>

      {!ready ? (
        <p className="rounded border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
          Communities index not available. Check the tables / service key.
        </p>
      ) : (
        <CommunityStoriesClient communities={bundles} />
      )}
    </div>
  );
}
