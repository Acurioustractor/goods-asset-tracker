import Link from 'next/link';
import type { Metadata } from 'next';
import { tripStories } from '@/lib/data/trip-stories';

export const metadata: Metadata = {
  title: 'Field notes (internal)',
  robots: { index: false, follow: false },
};

export default function FieldNotesIndex() {
  return (
    <div className="max-w-3xl">
      <h1
        className="text-3xl font-light text-foreground mb-2"
        style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
      >
        Field notes
      </h1>
      <p className="text-muted-foreground mb-8 max-w-prose">
        Internal scrollytelling previews of community trips. Consent pending and not for publishing until
        voices are verified in Empathy Ledger. Each story is authored as data in{' '}
        <code>src/lib/data/trip-stories.ts</code>.
      </p>

      <div className="grid gap-4">
        {tripStories.map((s) => (
          <Link
            key={s.slug}
            href={`/admin/field-notes/${s.slug}`}
            className="block rounded-xl border border-border bg-card p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-medium text-foreground">{s.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{s.dateline}</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-prose">{s.summary}</p>
              </div>
              <span
                className={`shrink-0 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${
                  s.published
                    ? 'text-green-700 border-green-300'
                    : 'text-amber-700 border-amber-300'
                }`}
              >
                {s.published ? 'published' : 'internal'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
