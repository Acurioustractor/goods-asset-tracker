import type { Metadata } from 'next';
import Link from 'next/link';
import { empathyLedger } from '@/lib/empathy-ledger';
import StorytellersClient from './storytellers-client';

export const metadata: Metadata = {
  title: 'Storytellers (EL) · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

// EL is one Next app serving both /api and /admin, so the API base is also the
// app base. Deep-link straight to the EL storyteller edit screen.
// Human-facing EL platform URL for "Edit in EL" links (storyteller edit pages
// live at /admin/storytellers/{id}/edit). Canonical apex is empathyledger.com;
// the old empathy-ledger.vercel.app (v1) is DEAD.
const EL_APP_URL = process.env.EMPATHY_LEDGER_APP_URL || 'https://empathyledger.com';

export default async function ElStorytellersIndex() {
  // Storytellers = EL people with at least one Goods-project story (not the whole
  // EL directory). See empathyLedger.getGoodsStorytellerProfiles.
  const profiles = await empathyLedger.getGoodsStorytellerProfiles();
  const withPortrait = profiles.filter((p) => p.portraitUrl).length;
  const elders = profiles.filter((p) => p.isElder).length;
  const published = profiles.filter((p) => p.publishedCount > 0).length;

  return (
    <div className="space-y-6 pb-16">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">Storytellers</h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-prose">
            EL people with at least one <span className="font-medium text-foreground">Goods</span> story
            (project-scoped, not the whole EL directory). EL is the source of truth — review here, then
            Edit in EL to change. People we engage with (partners, funders, board) live under{' '}
            <Link href="/admin/people" className="text-orange-700 hover:underline">People</Link>.
          </p>
        </div>
        <Link
          href="/admin/el-storytellers/new"
          className="shrink-0 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
        >
          + New storyteller
        </Link>
      </header>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span><span className="font-bold text-foreground">{profiles.length}</span> storytellers</span>
        <span><span className="font-bold text-foreground">{published}</span> with published public stories</span>
        <span><span className="font-bold text-foreground">{elders}</span> Elders</span>
        <span><span className="font-bold text-foreground">{withPortrait}</span> with portrait</span>
      </div>

      {profiles.length === 0 ? (
        <p className="rounded border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
          No Goods storytellers loaded (EL may be unreachable, or no project stories carry a storyteller). Refresh in a moment.
        </p>
      ) : (
        <StorytellersClient profiles={profiles} elAppBase={EL_APP_URL} />
      )}
    </div>
  );
}
