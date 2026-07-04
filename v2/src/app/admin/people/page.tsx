// People — the engagement network / relationship CRM.
//
// "People we engage with": funders, capital lenders, government programs,
// community & health partners, corporate/manufacturing partners, advisors,
// the Butterfly board, and the Goods team. DISTINCT from Storytellers (EL
// community members with Goods stories, at /admin/el-storytellers).
//
// v1 aggregates the real in-repo sources via getEngagementPeople(); live GHL
// pipeline-stage overlay is a documented fast-follow. Read-only surface — stage
// moves and outreach stay human-gated in the relationship-pipeline skill.
// (Was a duplicate storyteller roster; that lives on Storytellers now. The
// storytellers/quotes tables + /api/admin/people-seed are untouched.)

import type { Metadata } from 'next';
import Link from 'next/link';
import { typeCounts } from '@/lib/people';
import { getEngagementPeopleWithGhl } from '@/lib/people-ghl';
import PeopleClient from './people-client';

export const metadata: Metadata = {
  title: 'People · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function PeoplePage() {
  const { people, ghlOk, matched } = await getEngagementPeopleWithGhl();
  const counts = typeCounts(people);
  const orgs = people.filter((p) => p.isOrg).length;

  return (
    <div className="space-y-6 pb-16 p-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">People</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-prose">
          Everyone we engage with — funders, lenders, partners, advisors, the board and the team.
          Community members who tell <span className="font-medium text-gray-700">Goods stories</span> live under{' '}
          <Link href="/admin/el-storytellers" className="text-orange-700 hover:underline">Storytellers</Link>.
          This view is read-only; pipeline stages and outreach are managed in Deals and the LOI tracker.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-500">
        <span><span className="font-bold text-gray-900">{people.length}</span> records</span>
        <span><span className="font-bold text-gray-900">{people.length - orgs}</span> people</span>
        <span><span className="font-bold text-gray-900">{orgs}</span> organisations</span>
        {ghlOk ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> live GHL · {matched} matched
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" /> GHL offline · showing static
          </span>
        )}
      </div>

      {people.length === 0 ? (
        <p className="rounded border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
          No records aggregated. Check the in-repo data sources.
        </p>
      ) : (
        <PeopleClient people={people} counts={counts} />
      )}
    </div>
  );
}
