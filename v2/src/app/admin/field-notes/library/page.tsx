import Link from 'next/link';
import type { Metadata } from 'next';
import { LibraryClient } from './library-client';

export const metadata: Metadata = {
  title: 'Field-notes block library',
  robots: { index: false, follow: false },
};

/**
 * Catalog of every TripBlock kind. Each card shows:
 *  - What it does
 *  - Where the content comes from (atom vs bespoke vs structural)
 *  - A ready-to-paste TS snippet
 *
 * Authoring workflow: pick a kind, click "Copy snippet", paste into the
 * `blocks: []` array in `src/lib/data/trip-stories.ts`, edit the bespoke
 * fields. Atom blocks need almost no editing — they pull copy from
 * story-atoms.ts automatically.
 */
export default function BlockLibraryPage() {
  return (
    <div className="max-w-5xl space-y-6 pb-16">
      <header>
        <p className="text-xs">
          <Link href="/admin/field-notes" className="text-blue-700 hover:underline">← back to field notes</Link>
        </p>
        <h1 className="mt-2 text-3xl font-light" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
          Block library
        </h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Every block kind the field-notes renderer supports. Drop these into{' '}
          <code>blocks: []</code> in <code>src/lib/data/trip-stories.ts</code>.
          {' '}
          <span className="text-emerald-700">Atom</span> blocks pull universal copy from{' '}
          <code>story-atoms.ts</code>. <span className="text-blue-700">Bespoke</span> blocks
          carry one trip&apos;s specific content. <span className="text-amber-700">Structural</span>{' '}
          blocks (like portal) are self-aware about the project.
        </p>
      </header>

      <LibraryClient />
    </div>
  );
}
