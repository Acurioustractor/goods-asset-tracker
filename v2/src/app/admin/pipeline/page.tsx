import { getPipelineData } from './actions';
import PipelineBoard from './pipeline-board';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getGrantscopeBuyers,
  getGrantscopeCapital,
  type GrantscopeBuyerTarget,
  type GrantscopeCapitalTarget,
} from '@/lib/grantscope/client';

export const dynamic = 'force-dynamic';

export default async function PipelinePage() {
  const [assets, buyers, capital] = await Promise.all([
    getPipelineData(),
    getGrantscopeBuyers().catch(() => [] as GrantscopeBuyerTarget[]),
    getGrantscopeCapital().catch(() => [] as GrantscopeCapitalTarget[]),
  ]);

  return (
    <div className="space-y-10">
      <PipelineBoard assets={assets} />

      {/* Grantscope Intelligence */}
      {(buyers.length > 0 || capital.length > 0) && (
        <div className="space-y-8">
          <div className="border-t pt-8">
            <h2 className="text-xl font-bold">Grantscope Intelligence</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Buyer targets and capital pipeline from CivicGraph workspace
            </p>
          </div>

          {/* Buyer Targets */}
          {buyers.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold">Buyer Targets</h3>
                <Badge variant="secondary">{buyers.length}</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 font-medium">Organisation</th>
                      <th className="pb-2 font-medium">State</th>
                      <th className="pb-2 font-medium">Role</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium text-right">Score</th>
                      <th className="pb-2 font-medium">Product Fit</th>
                      <th className="pb-2 font-medium">Next Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyers.map((b) => (
                      <tr key={b.id} className="border-b last:border-0">
                        <td className="py-2 font-medium">
                          {b.website ? (
                            <a
                              href={b.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 hover:underline"
                            >
                              {b.name}
                            </a>
                          ) : (
                            b.name
                          )}
                        </td>
                        <td className="py-2">
                          {b.state && (
                            <Badge variant="outline" className="text-xs">
                              {b.state}
                            </Badge>
                          )}
                        </td>
                        <td className="py-2 text-gray-600 text-xs">{b.role}</td>
                        <td className="py-2">
                          <RelationshipBadge status={b.relationshipStatus} />
                        </td>
                        <td className="py-2 text-right font-mono">
                          {b.buyerPlausibilityScore}/100
                        </td>
                        <td className="py-2 text-gray-600 text-xs max-w-[200px] truncate">
                          {b.productFit}
                        </td>
                        <td className="py-2 text-gray-500 text-xs max-w-[200px] truncate">
                          {b.nextAction}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Capital Pipeline */}
          {capital.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold">Capital Pipeline</h3>
                <Badge variant="secondary">{capital.length}</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 font-medium">Source</th>
                      <th className="pb-2 font-medium">Kind</th>
                      <th className="pb-2 font-medium">Instrument</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium text-right">Score</th>
                      <th className="pb-2 font-medium">Amount Signal</th>
                      <th className="pb-2 font-medium">Deadline</th>
                      <th className="pb-2 font-medium">Next Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {capital.map((c) => (
                      <tr key={c.id} className="border-b last:border-0">
                        <td className="py-2 font-medium">
                          {c.url ? (
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 hover:underline"
                            >
                              {c.name}
                            </a>
                          ) : (
                            c.name
                          )}
                        </td>
                        <td className="py-2">
                          <Badge
                            variant="outline"
                            className={
                              c.sourceKind === 'grant'
                                ? 'text-xs bg-emerald-50 text-emerald-700'
                                : 'text-xs bg-violet-50 text-violet-700'
                            }
                          >
                            {c.sourceKind}
                          </Badge>
                        </td>
                        <td className="py-2 text-gray-600 text-xs">{c.instrumentType}</td>
                        <td className="py-2">
                          <RelationshipBadge status={c.relationshipStatus} />
                        </td>
                        <td className="py-2 text-right font-mono">
                          {c.capitalFitScore}/100
                        </td>
                        <td className="py-2 text-gray-600 text-xs">{c.amountSignal}</td>
                        <td className="py-2 text-gray-500 text-xs">
                          {c.deadline || '—'}
                        </td>
                        <td className="py-2 text-gray-500 text-xs max-w-[200px] truncate">
                          {c.nextAction}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function RelationshipBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    warm: 'bg-orange-100 text-orange-800',
    prospect: 'bg-blue-100 text-blue-800',
  };
  return (
    <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
      {status}
    </Badge>
  );
}
