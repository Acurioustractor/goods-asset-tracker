// Content system — Phase 2: the People tab.
// Read-only roster of storytellers (the reconciliation entity) with portrait,
// community, consent and their quotes, from the storytellers + quotes tables.
// Consent-safe: everyone here is a cleared voice (gated); the seed only writes
// cleared names. Portraits are proxied? No — local /images/people/* render direct.

import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface QuoteRow {
  text: string;
  context: string | null;
}
interface StorytellerRow {
  id: string;
  display_name: string;
  role: string | null;
  is_elder: boolean;
  consent_tier: string;
  community: { name: string } | null;
  portrait: { url: string } | null;
  quotes: QuoteRow[];
}

async function fetchStorytellers(): Promise<{ rows: StorytellerRow[]; ready: boolean }> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('storytellers')
      .select(
        'id, display_name, role, is_elder, consent_tier, community:communities(name), portrait:content_items(url), quotes(text, context)',
      )
      .order('is_elder', { ascending: false })
      .order('display_name', { ascending: true });
    if (error) return { rows: [], ready: false };
    return { rows: (data ?? []) as unknown as StorytellerRow[], ready: true };
  } catch {
    return { rows: [], ready: false };
  }
}

function consentBadge(tier: string): { text: string; cls: string } {
  switch (tier) {
    case 'public':
      return { text: 'public', cls: 'bg-green-100 text-green-700' };
    case 'gated':
      return { text: 'cleared · gated', cls: 'bg-amber-100 text-amber-700' };
    default:
      return { text: 'RED · not cleared', cls: 'bg-red-100 text-red-700' };
  }
}

export default async function PeoplePage() {
  const { rows, ready } = await fetchStorytellers();
  const totalQuotes = rows.reduce((n, r) => n + (r.quotes?.length ?? 0), 0);

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">People</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cleared storytellers with their portrait, community and quotes. One record per person,
          linking a portrait (media library) to a community and their words. {rows.length} people ·{' '}
          {totalQuotes} quotes.
        </p>
        {!ready && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            People index not built yet. Apply the storytellers/quotes migration, then run the seed:{' '}
            <code>curl -X POST http://localhost:3000/api/admin/people-seed</code>.
          </p>
        )}
      </header>

      {rows.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No storytellers yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rows.map((s) => {
            const badge = consentBadge(s.consent_tier);
            return (
              <div key={s.id} className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
                <div className="flex items-start gap-3 p-4">
                  <div className="h-16 w-16 shrink-0 rounded-full overflow-hidden bg-muted border border-border">
                    {s.portrait?.url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={s.portrait.url} alt={s.display_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg text-muted-foreground">
                        {s.display_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold leading-snug break-words">{s.display_name}</h2>
                    {s.role && <p className="text-xs text-muted-foreground mt-0.5">{s.role}</p>}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {s.is_elder && (
                        <span className="rounded-full bg-purple-100 text-purple-700 px-2 py-0.5 text-[10px] font-semibold">Elder</span>
                      )}
                      {s.community?.name && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">{s.community.name}</span>
                      )}
                      <span className={'rounded-full px-2 py-0.5 text-[10px] font-semibold ' + badge.cls}>{badge.text}</span>
                    </div>
                  </div>
                </div>

                {s.quotes && s.quotes.length > 0 && (
                  <div className="border-t border-border px-4 py-3 space-y-3 flex-1">
                    {s.quotes.map((q, i) => (
                      <blockquote key={i} className="text-sm">
                        <p className="italic leading-snug">&ldquo;{q.text}&rdquo;</p>
                        {q.context && <cite className="mt-1 block text-[11px] not-italic text-muted-foreground">{q.context}</cite>}
                      </blockquote>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
