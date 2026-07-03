// Admin: unified media library. Local website assets (images + video) render
// immediately; the Empathy Ledger library loads client-side after first paint
// (see curation.ts + /api/admin/el-media) so the page no longer blocks on the
// paged EL API. One grid, filterable by source, subject, community; star,
// rate, archive, tag — all curation state lives in content_items.

import { buildLocalItems } from './curation';
import { MediaLibraryClient } from './library-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MediaLibraryPage() {
  const { items, curationReady } = await buildLocalItems();

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Media library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every photo and video in the project — local website assets and the Empathy Ledger
          library — in one grid. Star keepers, archive junk, rate and search. Filter by source,
          subject, community, starred or archived.
        </p>
      </header>
      <MediaLibraryClient items={items} curationReady={curationReady} />
    </div>
  );
}
