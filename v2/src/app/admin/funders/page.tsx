import Link from 'next/link';
import { listFunders } from '@/lib/funders/registry';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FundersPage() {
  const funders = await listFunders();

  return (
    <div className="space-y-6 pb-16">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Funders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add a new supporter / organisation and they appear in <code>/admin/reports</code> with a
            full report template wired to live data. JSON-backed funders live at{' '}
            <code>wiki/config/funders.json</code> — built-ins (Centrecorp / Snow) stay in code.
          </p>
        </div>
        <Link
          href="/admin/funders/new"
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
        >
          + Add funder
        </Link>
      </header>

      <div className="space-y-3">
        {funders.map((f) => (
          <Card key={f.slug}>
            <CardContent className="space-y-2 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold">{f.displayName}</h2>
                  <p className="text-xs text-gray-500">
                    <code>{f.slug}</code> ·{' '}
                    ${f.commitment.totalAud.toLocaleString('en-AU')} commitment
                    {f.commitment.totalUnits ? ` · ${f.commitment.totalUnits} ${f.commitment.unitLabel || 'units'}` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">{f.tone}</Badge>
                  <Badge variant="outline" className="text-[10px]">{f.sections.length} sections</Badge>
                  {f.community && (
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-[10px] text-blue-800">
                      scope: {f.community}
                    </Badge>
                  )}
                  {f.principles && f.principles.length > 0 && (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-800">
                      {f.principles.length} principles
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Photo tags: {f.photoTags.map((t) => <code key={t} className="mr-1 rounded bg-gray-100 px-1.5 py-0.5">{t}</code>)}
              </p>

              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <Link
                  href={`/admin/reports`}
                  className="rounded border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50"
                >
                  → Generate report
                </Link>
                {f.funderContact?.name && (
                  <span className="rounded border border-gray-100 bg-gray-50 px-2 py-1 text-gray-600">
                    Contact: {f.funderContact.name}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
