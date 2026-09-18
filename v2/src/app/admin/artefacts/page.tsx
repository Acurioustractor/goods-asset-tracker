import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ARTEFACTS,
  ARTEFACT_REGISTER_NOTION_ID,
  ARTEFACT_REGISTER_READ_AT,
  FUNDERS,
  KIND_LABEL,
  STATE_LABEL,
  artefactsFor,
  countByState,
  notionUrl,
  type ArtefactState,
  type FunderId,
} from '@/lib/data/artefact-register';

/**
 * THE ARTEFACT REGISTER, on one screen, with the file one click away.
 *
 * Ben, 18 September 2026: the Notion register was "super hard to see and get the actual
 * artefact". Same rows as Notion, read from lib/data/artefact-register.ts, filtered by funder.
 * Every file opens on its Notion row, where the uploaded copy sits. Nothing is served from
 * public/: the repo and the site are public, and some rows are private finance records.
 */

export const metadata: Metadata = {
  title: 'Artefacts | Goods admin',
  robots: { index: false, follow: false },
};

const STATE_TONE: Record<ArtefactState, string> = {
  held: 'bg-emerald-100 text-emerald-900',
  partial: 'bg-amber-100 text-amber-900',
  missing: 'bg-rose-100 text-rose-900',
  draft: 'bg-slate-200 text-slate-800',
  'rebuild-pending': 'bg-amber-100 text-amber-900',
};

const FUNDER_ORDER: FunderId[] = ['qbe', 'sefa', 'tfff', 'bmd', 'snow', 'dusseldorp', 'mazda'];

export default async function ArtefactsPage({ searchParams }: { searchParams: Promise<{ funder?: string }> }) {
  const { funder } = await searchParams;
  const active = FUNDER_ORDER.includes(funder as FunderId) ? (funder as FunderId) : null;
  const rows = active ? artefactsFor(active) : ARTEFACTS;
  const counts = countByState(rows);

  return (
    <div className="mx-auto max-w-7xl pb-16">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-primary">Funding · read from the register {ARTEFACT_REGISTER_READ_AT}</p>
        <h1 className="mt-3 font-display text-4xl">Every artefact, once</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
          One row per document a funder has asked for, who owes it, and the file. Every file opens on its Notion row.{' '}
          <a className="font-semibold text-primary underline" href={notionUrl(ARTEFACT_REGISTER_NOTION_ID)}>The Notion register</a>
        </p>
      </header>

      <nav aria-label="Funder" className="mb-6 flex flex-wrap gap-2">
        <Link href="/admin/artefacts" aria-current={active ? undefined : 'page'} className={`rounded-full border px-4 py-1.5 text-sm ${active ? 'bg-card' : 'bg-foreground text-background'}`}>
          All {ARTEFACTS.length}
        </Link>
        {FUNDER_ORDER.map((id) => (
          <Link key={id} href={`/admin/artefacts?funder=${id}`} aria-current={active === id ? 'page' : undefined} className={`rounded-full border px-4 py-1.5 text-sm ${active === id ? 'bg-foreground text-background' : 'bg-card'}`}>
            {FUNDERS[id].name} {artefactsFor(id).length}
          </Link>
        ))}
      </nav>

      <p className="mb-6 text-sm text-muted-foreground">
        {(Object.keys(counts) as ArtefactState[]).filter((s) => counts[s] > 0).map((s) => `${counts[s]} ${STATE_LABEL[s].toLowerCase()}`).join(' · ')}
        {active && (
          <>
            {' · '}
            <a className="font-semibold text-primary underline" href={notionUrl(FUNDERS[active].notionId)}>the {FUNDERS[active].name} row</a>
          </>
        )}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              <th className="p-3">Artefact</th>
              <th className="p-3">State</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Asked for by</th>
              <th className="p-3">Open</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-b align-top">
                <td className="p-3">
                  <p className="font-semibold">{/^\d/.test(a.id) ? `${a.id} · ` : ''}{a.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{KIND_LABEL[a.kind]} · {a.funders.map((f) => FUNDERS[f].name.split(' ')[0]).join(', ')}</p>
                  {a.finishes && <p className="mt-2 text-xs leading-5">{a.finishes}</p>}
                  {a.where && <p className="mt-2 text-xs leading-5 text-muted-foreground">{a.where}</p>}
                </td>
                <td className="p-3"><span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATE_TONE[a.state]}`}>{STATE_LABEL[a.state]}</span></td>
                <td className="p-3">{a.owner}</td>
                <td className="p-3 text-xs leading-5">{a.askedFor}</td>
                <td className="w-44 p-3">
                  <a className="block font-semibold text-primary underline" href={notionUrl(a.notionId)}>Open on Notion</a>
                  {a.files?.map((f) => (
                    <span key={f} className="block text-xs text-muted-foreground">{f}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
