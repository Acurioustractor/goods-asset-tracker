import { createServiceClient } from '@/lib/supabase/server';
import {
  SYSTEM_OWNERS,
  FRESHNESS_DOMAINS,
  type SystemOwner,
  type FreshnessDomain,
} from '@/lib/data/operating-systems';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DAY_MS = 24 * 60 * 60 * 1000;

type FreshnessResult = FreshnessDomain & {
  lastUpdated: string | null;
  ageDays: number | null;
  status: 'fresh' | 'aging' | 'stale' | 'unknown';
};

/**
 * Live freshness — query the latest timestamp per domain. Each query is wrapped
 * so a single bad table/column degrades to "unknown" rather than crashing the
 * page. Columns verified against the live schema 2026-05-30.
 */
async function checkFreshness(): Promise<FreshnessResult[]> {
  const supabase = createServiceClient();
  return Promise.all(
    FRESHNESS_DOMAINS.map(async (d): Promise<FreshnessResult> => {
      try {
        const { data, error } = await supabase
          .from(d.table)
          .select(d.column)
          .order(d.column, { ascending: false })
          .limit(1);
        if (error || !data || data.length === 0) {
          return { ...d, lastUpdated: null, ageDays: null, status: 'unknown' };
        }
        const iso = (data[0] as unknown as Record<string, string>)[d.column];
        const ageDays = Math.floor((Date.now() - new Date(iso).getTime()) / DAY_MS);
        const status =
          ageDays <= d.staleAfterDays ? 'fresh' : ageDays <= d.staleAfterDays * 2 ? 'aging' : 'stale';
        return { ...d, lastUpdated: iso, ageDays, status };
      } catch {
        return { ...d, lastUpdated: null, ageDays: null, status: 'unknown' };
      }
    }),
  );
}

const STATUS_STYLE: Record<FreshnessResult['status'], { label: string; cls: string }> = {
  fresh: { label: 'Fresh', cls: 'bg-emerald-100 text-emerald-800' },
  aging: { label: 'Aging', cls: 'bg-amber-100 text-amber-800' },
  stale: { label: 'Stale', cls: 'bg-red-100 text-red-800' },
  unknown: { label: 'Unknown', cls: 'bg-gray-100 text-gray-600' },
};

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function OwnerCard({ s, accent }: { s: SystemOwner; accent: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${accent}`} />
        <p className="text-sm font-semibold text-gray-900">{s.name}</p>
      </div>
      <p className="mt-1 text-xs font-medium text-gray-500">{s.role}</p>
      <p className="mt-2 text-xs leading-relaxed text-gray-600">{s.sourceOfTruthFor}</p>
    </div>
  );
}

export default async function OperatingSystemsPage() {
  const freshness = await checkFreshness();
  const dataOwners = SYSTEM_OWNERS.filter((s) => s.tier === 'data');
  const narrative = SYSTEM_OWNERS.filter((s) => s.tier === 'narrative');
  const support = SYSTEM_OWNERS.filter((s) => s.tier === 'support');

  return (
    <div className="max-w-5xl space-y-12">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Operating Systems</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">
          How Goods&apos; systems fit together, who owns which truth, and whether the data behind our
          external claims is fresh. Data flows <strong>one way</strong> into each owner — every system
          is the source of truth for exactly one domain and reads the others; it never restates them.
        </p>
      </header>

      {/* 1 — Operating-systems map */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Operating-systems map</h2>
        <p className="mb-4 text-sm text-gray-500">
          Three data owners feed one narrative; supporting systems sit alongside.
        </p>

        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          Data owners — each the single source of truth for one domain
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {dataOwners.map((s) => (
            <OwnerCard key={s.key} s={s} accent="bg-sky-500" />
          ))}
        </div>

        <p className="my-3 text-center text-xs font-medium text-gray-400">
          ↓ feed numbers into (never the reverse) ↓
        </p>

        <div className="grid grid-cols-1 gap-3">
          {narrative.map((s) => (
            <div key={s.key} className="rounded-lg border border-violet-200 bg-violet-50 p-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                <span className="text-xs font-medium text-gray-500">— {s.role}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">{s.sourceOfTruthFor}</p>
              <p className="mt-1 text-xs font-medium text-violet-700">{s.neverSourceFor}</p>
            </div>
          ))}
        </div>

        <p className="mb-2 mt-6 text-xs font-medium uppercase tracking-wide text-gray-400">
          Supporting systems
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {support.map((s) => (
            <OwnerCard key={s.key} s={s} accent="bg-gray-400" />
          ))}
        </div>
      </section>

      {/* 2 — Source-of-truth matrix */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Source-of-truth matrix</h2>
        <p className="mb-4 text-sm text-gray-500">
          Where each fact lives. If two surfaces disagree, the owner below wins.
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">System</th>
                <th className="px-3 py-2 font-medium">Source of truth for</th>
                <th className="px-3 py-2 font-medium">Reads</th>
                <th className="px-3 py-2 font-medium">Never the source of</th>
                <th className="px-3 py-2 font-medium">Where it lives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SYSTEM_OWNERS.map((s) => (
                <tr key={s.key} className="align-top">
                  <td className="px-3 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-3 py-3 text-gray-600">{s.sourceOfTruthFor}</td>
                  <td className="px-3 py-3 text-gray-500">{s.reads}</td>
                  <td className="px-3 py-3 text-gray-600">{s.neverSourceFor}</td>
                  <td className="px-3 py-3 text-xs text-gray-400">{s.lives}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3 — Data-freshness checklist (live) */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Data-freshness checklist</h2>
        <p className="mb-4 text-sm text-gray-500">
          Run before any external demo or funder claim. Status is live from Supabase right now.
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Domain</th>
                <th className="px-3 py-2 font-medium">Last updated</th>
                <th className="px-3 py-2 font-medium">Backs the claim</th>
                <th className="px-3 py-2 font-medium">If stale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {freshness.map((f) => {
                const st = STATUS_STYLE[f.status];
                return (
                  <tr key={f.id} className="align-top">
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-medium text-gray-900">{f.label}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                      {fmtDate(f.lastUpdated)}
                      {f.ageDays !== null && (
                        <span className="ml-1 text-xs text-gray-400">({f.ageDays}d)</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-gray-600">{f.backsClaim}</td>
                    <td className="px-3 py-3 text-xs text-gray-500">{f.verify}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Thresholds are per-domain (e.g. CRM stale after 14 days, fleet after 3). &ldquo;Aging&rdquo;
          = past threshold; &ldquo;Stale&rdquo; = more than double it. &ldquo;Unknown&rdquo; = the
          query did not return a row.
        </p>
      </section>
    </div>
  );
}
