import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { AssetEditForm } from './asset-edit-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const KNOWN_COMMUNITIES = [
  'Tennant Creek',
  'Palm Island',
  'Maningrida',
  'Alice Springs',
  'Utopia Homelands',
  'Kalgoorlie',
  'Mount Isa',
  'Darwin',
  'Canberra',
  'Pending Delivery',
];

const STATUSES = ['requested', 'allocated', 'ready', 'demo', 'deployed', 'under_investigation', 'retired'];

export default async function AssetEditPage({
  params,
}: {
  params: Promise<{ unique_id: string }>;
}) {
  const { unique_id } = await params;
  const supabase = createServiceClient();

  const [{ data: asset, error }, telemetryRes] = await Promise.all([
    supabase
      .from('assets')
      .select(
        'unique_id, name, product, community, place, status, supply_date, qr_url, notes, partner_name, gps, quantity, photo, created_time'
      )
      .eq('unique_id', unique_id)
      .single(),
    supabase
      .from('usage_logs')
      .select('machine_id, event_type, created_at, site_name, signal_rssi, online')
      .order('created_at', { ascending: false })
      .limit(2000),
  ]);

  if (error || !asset) notFound();

  // Telemetry filter for this asset — match by mapping table OR by name/site exact
  const mapped = TELEMETRY_TO_ASSET[asset.unique_id] ?? [];
  const events = (telemetryRes.data || []).filter((e) => mapped.includes(e.machine_id || ''));
  const lastEvent = events[0];
  const daysSilent = lastEvent ? Math.floor((Date.now() - new Date(lastEvent.created_at).getTime()) / 86400000) : null;

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/assets" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back to Asset Register
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <Link
            href={`/bed/${asset.unique_id}`}
            target="_blank"
            className="inline-flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink className="h-3 w-3" /> Public page
          </Link>
          {asset.qr_url && (
            <a
              href={asset.qr_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-gray-200 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50"
            >
              QR url
            </a>
          )}
        </div>
      </div>

      <header>
        <div className="font-mono text-xs uppercase tracking-wide text-gray-500">{asset.product}</div>
        <h1 className="font-mono text-2xl font-bold tracking-tight">{asset.unique_id}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {asset.name || <em className="text-gray-400">unnamed</em>}
          {asset.community && <> · {asset.community}</>}
          {asset.place && <> · {asset.place}</>}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Edit form */}
        <Card className="lg:col-span-2">
          <CardContent className="space-y-1">
            <AssetEditForm
              asset={{
                unique_id: asset.unique_id,
                name: asset.name,
                community: asset.community,
                place: asset.place,
                status: asset.status,
                notes: asset.notes,
                partner_name: asset.partner_name,
                gps: asset.gps,
              }}
              communityOptions={KNOWN_COMMUNITIES}
              statusOptions={STATUSES}
            />
          </CardContent>
        </Card>

        {/* Telemetry summary */}
        <Card>
          <CardContent className="space-y-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Telemetry</div>
              {lastEvent ? (
                <div className="mt-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {daysSilent === 0 ? 'Today' : `${daysSilent}d ago`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(lastEvent.created_at).toLocaleString('en-AU')}
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <div className="text-2xl font-bold text-gray-400">Never reported</div>
                  <div className="text-xs text-gray-500">
                    {mapped.length === 0
                      ? 'No coreid mapped'
                      : `Mapped to ${mapped.join(', ')} — no events found`}
                  </div>
                </div>
              )}
            </div>

            {mapped.length > 0 && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Maps to</div>
                <div className="font-mono text-xs text-gray-700 break-all">{mapped.join('\n')}</div>
              </div>
            )}

            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Events seen</div>
              <div className="text-sm text-gray-900">{events.length.toLocaleString()}</div>
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Supplied</div>
              <div className="text-sm text-gray-900">
                {asset.supply_date ? new Date(asset.supply_date).toLocaleDateString('en-AU') : '--'}
              </div>
            </div>

            {asset.gps && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">GPS</div>
                <div className="font-mono text-xs text-gray-700">{asset.gps}</div>
              </div>
            )}

            {asset.qr_url && (
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">QR landing</div>
                <a
                  href={asset.qr_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-xs text-blue-600 hover:underline"
                >
                  {asset.qr_url}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent telemetry events */}
      {events.length > 0 && (
        <Card>
          <CardContent>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-base font-semibold">Recent telemetry events</h2>
              <span className="text-xs text-gray-500">showing latest {Math.min(events.length, 25)} of {events.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-2 text-left">When</th>
                    <th className="px-3 py-2 text-left">Event</th>
                    <th className="px-3 py-2 text-left">Site</th>
                    <th className="px-3 py-2 text-left">Online</th>
                    <th className="px-3 py-2 text-left">RSSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.slice(0, 25).map((e, i) => (
                    <tr key={`${e.machine_id}-${e.created_at}-${i}`}>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {new Date(e.created_at).toLocaleString('en-AU')}
                      </td>
                      <td className="px-3 py-2">{e.event_type || '--'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700">{e.site_name || '--'}</td>
                      <td className="px-3 py-2 text-xs">{e.online === false ? 'offline' : e.online === true ? 'online' : '--'}</td>
                      <td className="px-3 py-2 text-xs">{e.signal_rssi ?? '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Same canonical mapping as /admin/assets/page.tsx — single asset can map to
 * multiple machine_ids (e.g. the same physical machine reported under a coreid
 * AND a friendly site name).
 */
const TELEMETRY_TO_ASSET: Record<string, string[]> = {
  // Merged coreid + named-pipeline events 2026-05-14
  'GB0-113':   ['Norms House', 'e00fce684086eb2aba8d4f25'],     // + F25 coreid
  'GB0-154-2': ['Nicoles House', 'e00fce687ae01d08f95694e5'],   // + 4E5 coreid
  'GB0-125':   ['Barkley Arts', 'e00fce68c2ba447b66bcd507'],    // + 507 coreid
  'GB0-132':   ['e00fce682db6d32e15e86098'],                  // 098 = Jimmy Frank
  'GB0-133':   ['8D1'],                                       // speculative: 8D1 = Norman's 2nd missing
  'GB0-WM-ORPHAN-c4b9': ['e00fce68c4b97878b9a2b323'],
  'GB0-WM-ORPHAN-fe6c': ['e00fce68fe6c048ccec66ab1'],
  'GB0-WM-ORPHAN-689f': ['e00fce689f1dd0daf5987cf2'],
  'GB0-WM-RD': ['Red Dust'],
  'GB0-WM-DSS': ['Dian Stokes Sons House'],
};
