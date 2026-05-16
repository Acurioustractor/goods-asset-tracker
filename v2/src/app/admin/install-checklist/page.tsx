import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CHECKLIST_BEFORE = [
  'Beds counted off the truck. Quantity matches the manifest.',
  'No transit damage visible (canvas, poles, legs, end caps).',
  'Each bed has its QR sticker on a leg (not under it).',
  'Tools you brought: nothing required — beds need no tools to assemble.',
  'Phone has Goods admin login (email in ADMIN_EMAILS) and can scan QR codes.',
];

const CHECKLIST_DURING_INSTALL = [
  'Find a clean, flat spot. Knock the canvas out from any packing creases.',
  'Slide the two steel poles through the canvas sleeves. Direction matters: ribbed pole-end faces the leg socket.',
  'Click each plastic leg onto a pole end. Push from the end, not the side. You\'ll hear it seat.',
  'Test by sitting on the centre — canvas takes the load, frame goes rigid.',
  'Place where it lives: floor, room corner, sleepout, outstation.',
];

const CHECKLIST_AFTER_INSTALL = [
  'Scan the QR sticker. Phone opens /bed/{ID}.',
  'On the admin install logger: pick community, type the place (house, outstation, family name).',
  'Tap "📍 Use my GPS" to pin the location. Wait for accuracy ≤30m before saving.',
  'Set status to "deployed".',
  'Hit Save. Confirmation reads "Saved. The asset register is updated."',
  'Take a photo of the bed in place. Upload via /admin/compassion with asset ID. Tick "Show on public bed page" only if appropriate.',
];

const CHECKLIST_RECIPIENT_HANDOVER = [
  'Sit with the person who got the bed. No clipboard energy.',
  'Show them the QR. "Scan this any time. You can name your bed, ask us questions, share a photo."',
  'Walk through one tile together — usually Pulse check 👍, fastest way to show it works.',
  'If they want messages + requests: phone-number login + tap "Stay in touch". 30 seconds.',
  'Leave them with the support number: +61 468 052 660 (WhatsApp or SMS).',
  'Tell them: "Reply STOP any time and we stop texting."',
];

const CHECKLIST_BEFORE_LEAVING = [
  'Every bed in this community has been scanned + GPS-logged.',
  'Photos uploaded for any beds you want to share publicly.',
  'Notes captured for anything unusual (damage, wrong size, wrong house, recipient feedback).',
  'Demand bumps: if community asked for more, log via /admin/communities/{id} or the demand button on /bed/{id}.',
];

export default async function InstallChecklistPage({
  searchParams,
}: {
  searchParams: Promise<{ community?: string; batch?: string }>;
}) {
  const params = await searchParams;
  const communityFilter = params.community || null;
  const batchFilter = params.batch || null;
  const supabase = createServiceClient();

  // Pull communities for filter list (only those with beds)
  const { data: communities } = await supabase
    .from('communities')
    .select('id, name, state')
    .order('name', { ascending: true })
    .limit(50);

  // Pull beds matching filter
  let query = supabase
    .from('assets')
    .select('unique_id, community, status, notes, place')
    .in('status', ['ready', 'allocated', 'deployed'])
    .ilike('product', '%bed%')
    .order('unique_id', { ascending: true });

  if (communityFilter) query = query.eq('community', communityFilter);
  if (batchFilter) query = query.ilike('notes', `%Batch ${batchFilter}%`);

  const { data: beds } = await query;
  const bedList = beds || [];

  return (
    <>
      <style
        // Print-friendly: hide sidebar/admin chrome, white background, no shadows
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              aside, header.admin-header, .no-print { display: none !important; }
              main, .admin-main { padding: 0 !important; }
              body { background: white !important; }
              .page-break { page-break-before: always; }
              .checklist-section { break-inside: avoid; }
            }
            @page { margin: 16mm; }
          `,
        }}
      />

      <div className="px-4 md:px-8 py-6 space-y-8 max-w-3xl mx-auto print:max-w-full">
        {/* No-print controls */}
        <div className="no-print rounded-2xl border bg-card p-4 flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold mr-auto">Install checklist</p>
          <form className="flex items-center gap-2 text-xs">
            <label className="text-muted-foreground">Community:</label>
            <select
              name="community"
              defaultValue={communityFilter || ''}
              className="rounded border px-2 py-1 text-xs"
            >
              <option value="">All</option>
              {(communities || []).map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.state || '—'})
                </option>
              ))}
            </select>
            <label className="text-muted-foreground ml-2">Batch:</label>
            <input
              name="batch"
              defaultValue={batchFilter || ''}
              placeholder="e.g. 156"
              className="rounded border px-2 py-1 text-xs w-20"
            />
            <button
              type="submit"
              className="rounded bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 text-xs font-semibold"
            >
              Filter
            </button>
          </form>
          <button
            type="button"
            onClick={() => undefined /* server-rendered */ }
            className="rounded border px-3 py-1 text-xs font-semibold"
            // Print is handled by browser shortcut + the @media print rules
            // Most field teams will just hit Cmd/Ctrl + P
          >
            ⌘P / Ctrl-P to print
          </button>
        </div>

        {/* Header */}
        <header>
          <h1 className="font-display text-2xl font-bold">Bed install checklist</h1>
          <p className="text-sm text-muted-foreground">
            Print this. Take it with you. Tick boxes by hand or scan on phone after.
            {communityFilter && <> Filtered to <strong>{communityFilter}</strong>.</>}
            {batchFilter && <> Batch <strong>GB0-{batchFilter}</strong>.</>}
          </p>
        </header>

        <ChecklistSection title="Before unloading" items={CHECKLIST_BEFORE} />
        <ChecklistSection title="Installing each bed" items={CHECKLIST_DURING_INSTALL} />
        <ChecklistSection title="After install — log it" items={CHECKLIST_AFTER_INSTALL} />
        <ChecklistSection title="Recipient handover" items={CHECKLIST_RECIPIENT_HANDOVER} />
        <ChecklistSection title="Before you leave the community" items={CHECKLIST_BEFORE_LEAVING} />

        {/* Per-bed table */}
        {bedList.length > 0 && (
          <section className="checklist-section page-break">
            <h2 className="font-display text-lg font-bold mb-3">
              {bedList.length} bed{bedList.length === 1 ? '' : 's'} to install
              {communityFilter ? ` · ${communityFilter}` : ''}
              {batchFilter ? ` · Batch GB0-${batchFilter}` : ''}
            </h2>
            <table className="w-full text-sm border">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-3 py-2 font-medium w-8">✓</th>
                  <th className="text-left px-3 py-2 font-medium">Asset ID</th>
                  <th className="text-left px-3 py-2 font-medium">Status</th>
                  <th className="text-left px-3 py-2 font-medium">Community</th>
                  <th className="text-left px-3 py-2 font-medium">Place</th>
                  <th className="text-left px-3 py-2 font-medium w-32">GPS</th>
                  <th className="text-left px-3 py-2 font-medium w-32">Notes</th>
                </tr>
              </thead>
              <tbody>
                {bedList.map((b) => (
                  <tr key={b.unique_id} className="border-t">
                    <td className="px-3 py-2 text-center">
                      <span className="inline-block w-4 h-4 border-2 border-stone-400 rounded-sm" />
                    </td>
                    <td className="px-3 py-2 font-mono">{b.unique_id}</td>
                    <td className="px-3 py-2 text-xs">{b.status}</td>
                    <td className="px-3 py-2 text-xs">{b.community || '—'}</td>
                    <td className="px-3 py-2 text-xs">{b.place || '________________'}</td>
                    <td className="px-3 py-2 text-xs">________________</td>
                    <td className="px-3 py-2 text-xs">________________</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">
              Either tick by hand on the printed sheet, OR scan each bed&apos;s QR on your phone and use the install logger.
              Both paths update the same record.
            </p>
          </section>
        )}

        {/* Footer reference */}
        <footer className="checklist-section text-xs text-muted-foreground border-t pt-4">
          <p className="font-semibold">Quick reference</p>
          <ul className="grid grid-cols-2 gap-y-1 mt-2">
            <li>Support: +61 468 052 660 (WhatsApp/SMS)</li>
            <li>Admin: goodsoncountry.com/admin</li>
            <li>Live signals: /admin/bed-signals</li>
            <li>This bed: /bed/&lt;ID&gt;</li>
            <li>Communities: /admin/communities</li>
            <li>Preflight: /admin/bed-preflight</li>
          </ul>
        </footer>
      </div>
    </>
  );
}

function ChecklistSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="checklist-section">
      <h2 className="font-display text-lg font-bold mb-2">{title}</h2>
      <ul className="space-y-1.5">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="inline-block w-4 h-4 border-2 border-stone-400 rounded-sm mt-0.5 flex-shrink-0" />
            <span className="text-sm leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
