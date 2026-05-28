// Lightweight EL photo browser. Click a folder chip, see all photos
// tagged with that combination. Click a photo to see metadata + copy
// its public URL or download it. Separate from /admin/photos (which
// is the heavier review-and-tag workflow).
//
// Admin gating happens at the layout level (see v2/src/app/admin/layout.tsx
// + middleware). On localhost everyone has admin; in prod only signed-in
// admins reach this page.

import { PhotosBrowserClient } from './photos-browser-client';

export const metadata = {
  title: 'Browse photos · Goods Admin',
};

export default function PhotosBrowserPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Browse photos</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Every photo tagged in Empathy Ledger. Click a folder to filter, click a
          photo to copy its URL or download it. Use this when you just want to
          find a shot for a deck, a social post or a funder report.
        </p>
      </header>
      <PhotosBrowserClient />
    </main>
  );
}
