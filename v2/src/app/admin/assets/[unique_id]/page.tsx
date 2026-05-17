import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Phone, Mail, MessageCircle } from 'lucide-react';
import { AssetEditForm } from './asset-edit-form';
import {
  resolveBedOwners,
  BED_OWNER_SOURCE_LABEL,
  type BedOwnerGroup,
} from '@/lib/data/bed-owners';
import { ghl, type GHLConversationSummary } from '@/lib/ghl';

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

  // Resolve the "who is connected to this bed?" view across orders / claims / tickets / stories / GHL
  const owners = await resolveBedOwners(supabase, asset.unique_id);

  // For owners that have a known GHL contact id, pull their recent message previews
  // in parallel so the OwnersBlock can render inline thread teasers without re-fetching.
  const contactIdsForConvos = owners
    .map((g) => g.ghlContactId)
    .filter((id): id is string => Boolean(id));
  const recentConvosByContactId = new Map<string, GHLConversationSummary[]>();
  if (contactIdsForConvos.length > 0) {
    const results = await Promise.all(
      contactIdsForConvos.map(async (id) => [id, await ghl.getRecentConversations(id, 3)] as const),
    );
    for (const [id, convos] of results) recentConvosByContactId.set(id, convos);
  }

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

      {/* Owners & contacts (derived from orders + claims + tickets + stories + GHL) */}
      <OwnersBlock owners={owners} recentConvos={recentConvosByContactId} />

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

const SUPPORT_PHONE = (process.env.NEXT_PUBLIC_GOODS_SUPPORT_PHONE || '+61468052660').replace(/\s+/g, '');
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';

function whatsappHref(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/^\+/, '').replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

function ghlContactHref(contactId: string): string | null {
  if (!GHL_LOCATION_ID) return null;
  return `https://app.gohighlevel.com/v2/location/${GHL_LOCATION_ID}/contacts/detail/${contactId}`;
}

function ConvoPreview({ convos }: { convos: GHLConversationSummary[] }) {
  if (convos.length === 0) return null;
  const labelFor = (type: string | null): string => {
    if (!type) return 'Message';
    if (type.includes('SMS')) return 'SMS';
    if (type.includes('WHATSAPP') || type.includes('Whatsapp')) return 'WhatsApp';
    if (type.includes('EMAIL')) return 'Email';
    if (type.includes('LIVE_CHAT')) return 'Live chat';
    if (type.includes('CALL')) return 'Call';
    return type.replace(/^TYPE_/, '').toLowerCase();
  };
  return (
    <div className="mt-3 space-y-1.5 rounded-md border border-indigo-100 bg-indigo-50/60 px-3 py-2">
      <div className="text-[11px] font-medium uppercase tracking-wide text-indigo-700">Recent messages</div>
      {convos.map((c) => (
        <div key={c.id} className="text-xs">
          <div className="flex flex-wrap items-baseline gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${
                c.lastMessageDirection === 'inbound'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              {c.lastMessageDirection === 'inbound' ? '← in' : 'out →'}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-indigo-700">
              {labelFor(c.lastMessageType)}
            </span>
            {c.lastMessageDate && (
              <span className="text-[10px] text-gray-500">
                {new Date(c.lastMessageDate).toLocaleString('en-AU', {
                  day: 'numeric',
                  month: 'short',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            )}
            {c.unreadCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">
                {c.unreadCount} unread
              </span>
            )}
          </div>
          <p className="mt-0.5 line-clamp-2 text-gray-700">{c.lastMessageBody || <em className="text-gray-400">(no preview)</em>}</p>
        </div>
      ))}
    </div>
  );
}

function OwnersBlock({
  owners,
  recentConvos,
}: {
  owners: BedOwnerGroup[];
  recentConvos: Map<string, GHLConversationSummary[]>;
}) {
  if (owners.length === 0) {
    return (
      <Card>
        <CardContent>
          <h2 className="mb-1 text-base font-semibold">Owners &amp; contacts</h2>
          <p className="text-sm text-gray-500">
            Nobody is connected to this bed yet. Connections appear here when someone buys it,
            claims it via QR scan, opens a support ticket, shares a story, or messages the
            support number tagged with this bed.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            GHL inbox: <a href="https://app.gohighlevel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">app.gohighlevel.com</a>
            {' · '}Support line: <a href={`tel:${SUPPORT_PHONE}`} className="text-blue-600 hover:underline">{SUPPORT_PHONE}</a>
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold">Owners &amp; contacts</h2>
          <span className="text-xs text-gray-500">{owners.length} {owners.length === 1 ? 'person' : 'people'}</span>
        </div>
        <ul className="space-y-4">
          {owners.map((group) => (
            <li key={group.identityKey} className="rounded-lg border border-gray-200 bg-white p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {group.primaryName || group.primaryPhone || group.primaryEmail || 'Unknown contact'}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    {group.primaryPhone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {group.primaryPhone}
                      </span>
                    )}
                    {group.primaryEmail && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {group.primaryEmail}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-emerald-700">
                    {BED_OWNER_SOURCE_LABEL[group.primarySource]}
                  </span>
                  {group.ghlContactId && ghlContactHref(group.ghlContactId) && (
                    <a
                      href={ghlContactHref(group.ghlContactId)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100"
                    >
                      <ExternalLink className="h-3 w-3" /> GHL
                    </a>
                  )}
                </div>
              </div>

              {/* Quick contact actions */}
              {(group.primaryPhone || group.primaryEmail) && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {group.primaryPhone && (
                    <a
                      href={whatsappHref(group.primaryPhone, `Hi from Goods — checking in about your bed.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700 hover:bg-emerald-100"
                    >
                      <MessageCircle className="h-3 w-3" /> WhatsApp
                    </a>
                  )}
                  {group.primaryPhone && (
                    <a
                      href={`sms:${group.primaryPhone}`}
                      className="inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-amber-700 hover:bg-amber-100"
                    >
                      <MessageCircle className="h-3 w-3" /> SMS
                    </a>
                  )}
                  {group.primaryPhone && (
                    <a
                      href={`tel:${group.primaryPhone}`}
                      className="inline-flex items-center gap-1 rounded border border-stone-200 bg-stone-50 px-2 py-1 text-stone-700 hover:bg-stone-100"
                    >
                      <Phone className="h-3 w-3" /> Call
                    </a>
                  )}
                  {group.primaryEmail && (
                    <a
                      href={`mailto:${group.primaryEmail}`}
                      className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-1 text-blue-700 hover:bg-blue-100"
                    >
                      <Mail className="h-3 w-3" /> Email
                    </a>
                  )}
                </div>
              )}

              {/* Recent GHL conversation previews (SMS / WhatsApp / Email) — when a contact id is known */}
              {group.ghlContactId && (
                <ConvoPreview convos={recentConvos.get(group.ghlContactId) || []} />
              )}

              {/* Source links — every touch we know about for this person */}
              <div className="mt-3 space-y-1 border-t border-gray-100 pt-2 text-xs text-gray-600">
                {group.links.map((link, idx) => (
                  <div key={`${link.source}-${idx}`} className="flex flex-wrap items-baseline gap-2">
                    <span className="inline-block w-20 font-medium uppercase tracking-wide text-gray-500">
                      {link.source}
                    </span>
                    <span className="text-gray-700">{link.detail || '—'}</span>
                    {link.linkedAt && (
                      <span className="text-gray-400">
                        {new Date(link.linkedAt).toLocaleDateString('en-AU')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
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
