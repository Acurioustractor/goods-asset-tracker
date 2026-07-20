// Admin: unified media library. Local website assets (images + video) render
// immediately; the Empathy Ledger library loads client-side after first paint
// (see curation.ts + /api/admin/el-media) so the page no longer blocks on the
// paged EL API. One grid, filterable by source, subject, community; star,
// rate, archive, tag — all curation state lives in content_items.

import { buildLocalItems } from './curation';
import { MediaLibraryClient } from './library-client';
import { AddMediaDialog, type AssetOption, type RecentBedContent } from './add-media-dialog';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchCommunities(): Promise<{ id: string; name: string }[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase.from('communities').select('id, name').order('name');
    return (data ?? []) as { id: string; name: string }[];
  } catch {
    return [];
  }
}

/** Assets (beds etc.) for the Add-media dialog's bed picker. */
async function fetchAssets(): Promise<AssetOption[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from('assets')
      .select('unique_id, product, community')
      .order('unique_id');
    return (data ?? []) as AssetOption[];
  } catch {
    return [];
  }
}

/** The recent bed (compassion) content, absorbed from the retired /admin/compassion page. */
async function fetchRecentBedContent(): Promise<RecentBedContent[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from('compassion_content')
      .select('id, asset_id, content_type, media_url, caption, created_at, sent_at, viewed_at, is_public')
      .order('created_at', { ascending: false })
      .limit(24);
    return (data ?? []) as RecentBedContent[];
  } catch {
    return [];
  }
}

export default async function MediaLibraryPage() {
  const [{ items, curationReady }, communities, assets, recentBedContent] = await Promise.all([
    buildLocalItems(),
    fetchCommunities(),
    fetchAssets(),
    fetchRecentBedContent(),
  ]);

  return (
    <div className="p-6">
      <header className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Media Room</h1>
          <AddMediaDialog assets={assets} recent={recentBedContent} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          One place to curate every photo and video in the project. Star the keepers, archive the
          junk, rate them, and tag who is in each shot, which community it belongs to, and which
          product or story it shows.
        </p>
        <p className="mt-2 max-w-3xl text-xs text-muted-foreground">
          It pulls from two sources.{' '}
          <span className="font-medium text-foreground">Website</span> — the image and video files
          the goodsoncountry.com site is built from (yours to use freely).{' '}
          <span className="font-medium text-foreground">Empathy Ledger</span> — community photos and
          videos held in the Empathy Ledger platform, which governs consent and links each photo to
          the people and communities in it. Tagging people / community applies to those.
        </p>
      </header>
      <MediaLibraryClient items={items} curationReady={curationReady} communities={communities} />
    </div>
  );
}
