import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { listFunders } from '@/lib/funders/registry';
import { outputPath } from '@/lib/funders/generate';
import { GenerateButtons } from './generate-buttons';
import { QUARTERS } from './quarters';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function reportStatus(slug: string, period: string): { exists: boolean; mtime?: string; bytes?: number } {
  const path = outputPath(slug, period);
  if (!existsSync(path)) return { exists: false };
  const s = statSync(path);
  return { exists: true, mtime: s.mtime.toISOString(), bytes: s.size };
}

export default async function ReportsPage() {
  const funders = await listFunders();
  const periods = Object.keys(QUARTERS).sort();

  return (
    <div className="space-y-6 pb-16">
      <header>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Funder reports</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate per-funder reports from live data. Each generate reads the
              funder config, concatenates section templates, resolves <code>[METRIC: ...]</code>{' '}
              placeholders against Goods Supabase / ACT infra Xero / Empathy Ledger,
              and writes <code>wiki/outputs/funder-reports/&lt;slug&gt;/&lt;period&gt;.md</code>.
              Re-runnable; overwrites the file.
            </p>
          </div>
          <Link href="/admin/deck" className="text-xs text-primary hover:underline">/admin/deck preview →</Link>
        </div>
      </header>

      <div className="space-y-4">
        {funders.map((f) => (
          <Card key={f.slug}>
            <CardContent className="space-y-3 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-bold">{f.displayName}</h2>
                  <p className="text-xs text-muted-foreground">
                    <code>{f.slug}</code> · ${f.commitment.totalAud.toLocaleString('en-AU')} commitment
                    {f.commitment.totalUnits ? ` · ${f.commitment.totalUnits} ${f.commitment.unitLabel || 'units'}` : ''}
                    {' · '}
                    <span className="text-amber-700">{f.sections.length} sections</span>
                    {' · tone: '}<span className="text-emerald-700">{f.tone}</span>
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {f.funderContact?.name && <p>Contact: <strong>{f.funderContact.name}</strong></p>}
                  {f.commitment.grantReference && <p>Grant: <code>{f.commitment.grantReference}</code></p>}
                </div>
              </div>

              <GenerateButtons funderSlug={f.slug} periods={periods} />

              <details className="text-xs">
                <summary className="cursor-pointer font-medium text-foreground hover:text-foreground">
                  Existing reports for this funder
                </summary>
                <table className="mt-2 min-w-full text-xs">
                  <thead className="text-[10px] uppercase text-muted-foreground">
                    <tr>
                      <th className="px-2 py-1 text-left">Period</th>
                      <th className="px-2 py-1 text-left">Status</th>
                      <th className="px-2 py-1 text-left">Size</th>
                      <th className="px-2 py-1 text-left">Last gen</th>
                      <th className="px-2 py-1 text-left">Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((p) => {
                      const s = reportStatus(f.slug, p);
                      return (
                        <tr key={p} className="border-t border-border">
                          <td className="px-2 py-1 font-mono">{p}</td>
                          <td className="px-2 py-1">
                            {s.exists ? <span className="text-emerald-700">✓ generated</span> : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="px-2 py-1 text-muted-foreground">
                            {s.bytes ? `${(s.bytes / 1024).toFixed(1)} KB` : '—'}
                          </td>
                          <td className="px-2 py-1 text-muted-foreground">
                            {s.mtime ? new Date(s.mtime).toLocaleString('en-AU') : '—'}
                          </td>
                          <td className="px-2 py-1">
                            {s.exists && (
                              <Link
                                href={`/admin/deck?funder=${f.slug}&period=${p}`}
                                className="text-primary hover:underline"
                              >
                                open →
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
