import Link from 'next/link';
import type { Metadata } from 'next';
import { getGoodsStorytellers, slugify } from '@/lib/storytellers';
import { StorytellerAvatar } from '@/components/storyteller-avatar';

export const metadata: Metadata = {
  title: 'Storytellers — Goods on Country',
  description: 'Voices from the Goods on Country project. Each storyteller has shaped this work.',
};

export const revalidate = 300; // 5 min — matches EL cache TTL

export default async function StorytellersIndex() {
  const storytellers = await getGoodsStorytellers();

  // Elders first (their voices anchor the project), then alphabetical
  const sorted = [...storytellers].sort((a, b) => {
    if (a.elderStatus !== b.elderStatus) return a.elderStatus ? -1 : 1;
    return a.displayName.localeCompare(b.displayName);
  });

  const elderCount = sorted.filter((s) => s.elderStatus).length;
  const total = sorted.length;

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-amber-700">Voices that shaped the work</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Storytellers</h1>
        <p className="mt-4 max-w-prose text-base text-stone-700">
          Every storyteller whose voice shapes Goods on Country. Each profile holds
          their words, their stories, and where they appear across the project.
        </p>
        {total > 0 && (
          <p className="mt-3 text-sm text-stone-500">
            <strong className="text-amber-700">{total}</strong> storyteller{total === 1 ? '' : 's'}
            {elderCount > 0 && (
              <>
                {' · '}
                <strong className="text-amber-700">{elderCount}</strong> Elder{elderCount === 1 ? '' : 's'}
              </>
            )}
          </p>
        )}
      </header>

      {sorted.length === 0 ? (
        <section className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-600">
          <p>
            Storyteller library is loading. If this persists, the Empathy Ledger API may be unavailable. Try again shortly.
          </p>
        </section>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((s) => {
            const slug = slugify(s.displayName);
            return (
              <li key={s.id}>
                <Link
                  href={`/storytellers/${slug}`}
                  className="group block h-full overflow-hidden rounded-xl border border-stone-200 bg-white transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                >
                  <div className="flex gap-3 p-4">
                    <StorytellerAvatar
                      name={s.displayName}
                      src={s.avatarUrl}
                      size={56}
                      className="shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h2 className="truncate font-display text-base font-medium text-stone-900 group-hover:text-amber-700">
                          {s.displayName}
                        </h2>
                        {s.elderStatus && (
                          <span className="inline-block shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                            Elder
                          </span>
                        )}
                      </div>
                      {s.community && (
                        <p className="mt-0.5 truncate text-xs text-stone-500">{s.community}</p>
                      )}
                      {s.bio && (
                        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-stone-600">{s.bio}</p>
                      )}
                      {s.storyCount > 0 && (
                        <p className="mt-2 text-[11px] text-amber-700">
                          {s.storyCount} stor{s.storyCount === 1 ? 'y' : 'ies'} →
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* Related */}
      <footer className="mt-16 border-t pt-6 text-sm">
        <div className="flex flex-wrap gap-4">
          <Link href="/communities" className="text-amber-700 hover:underline">
            → Browse communities
          </Link>
          <Link href="/field-notes" className="text-amber-700 hover:underline">
            → Field notes
          </Link>
          <Link href="/stories" className="text-amber-700 hover:underline">
            → All stories
          </Link>
        </div>
      </footer>
    </article>
  );
}
