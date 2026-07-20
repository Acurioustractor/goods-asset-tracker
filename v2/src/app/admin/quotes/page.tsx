// Quotes — content system Phase 2. Curation view of the quotes table (EL-sourced
// + curated), joined to storyteller and community. Read-only v1 (curation edit is
// a fast-follow). Consent tier is shown on every quote; this is an admin surface.

import type { Metadata } from 'next';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import QuotesClient, { type QuoteRow } from './quotes-client';

export const metadata: Metadata = {
  title: 'Quotes · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchQuotes(): Promise<{ rows: QuoteRow[]; ready: boolean }> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('quotes')
      .select(
        'id, text, context, source, consent_tier, storyteller:storytellers(display_name, slug, is_elder, portrait:content_items(url)), community:communities(name)',
      )
      .order('created_at', { ascending: true });
    if (error) return { rows: [], ready: false };
    return { rows: (data ?? []) as unknown as QuoteRow[], ready: true };
  } catch {
    return { rows: [], ready: false };
  }
}

export default async function QuotesPage() {
  const { rows, ready } = await fetchQuotes();
  const withPerson = rows.filter((r) => r.storyteller).length;
  const elders = rows.filter((r) => r.storyteller?.is_elder).length;

  return (
    <div className="space-y-6 pb-16 p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight font-display">Quotes</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-prose">
          Curated community voices, one record per quote, linked to the person who said it and their
          community. Sourced from Empathy Ledger and the curated set. The people behind them live under{' '}
          <Link href="/admin/el-storytellers" className="text-orange-700 hover:underline">Storytellers</Link>.
          Every quote shows its consent tier; treat RED and Elder voices as consent-gated externally.
        </p>
      </header>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span><span className="font-bold text-foreground">{rows.length}</span> quotes</span>
        <span><span className="font-bold text-foreground">{withPerson}</span> attributed</span>
        <span><span className="font-bold text-foreground">{elders}</span> Elder voices</span>
      </div>

      {!ready ? (
        <p className="rounded border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
          Quotes index not available. Check the quotes table / service key.
        </p>
      ) : rows.length === 0 ? (
        <p className="rounded border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
          No quotes yet.
        </p>
      ) : (
        <QuotesClient quotes={rows} />
      )}
    </div>
  );
}
