import Link from 'next/link';
import type { Metadata } from 'next';
import { tripStories } from '@/lib/data/trip-stories';

export const metadata: Metadata = {
  title: 'Field notes',
  description: 'Stories from Goods on Country community trips.',
};

export default function FieldNotesIndex() {
  const published = tripStories.filter((s) => s.published);

  return (
    <main className="container mx-auto px-4 py-20 md:py-28">
      <h1
        className="text-4xl md:text-5xl font-light text-foreground mb-4"
        style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
      >
        Field notes
      </h1>
      <p className="text-muted-foreground max-w-prose mb-12">
        Stories from the road, with the communities we work alongside.
      </p>

      {published.length === 0 ? (
        <p className="text-muted-foreground">More stories are on the way.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {published.map((s) => (
            <Link
              key={s.slug}
              href={`/field-notes/${s.slug}`}
              className="block rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <h2 className="text-2xl font-medium text-foreground">{s.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">{s.dateline}</p>
              <p className="text-muted-foreground mt-3">{s.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
