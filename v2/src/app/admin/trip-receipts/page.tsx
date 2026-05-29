import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ACT_URL = process.env.ACT_INFRA_SUPABASE_URL || '';
const ACT_KEY = process.env.ACT_INFRA_SUPABASE_KEY || '';

type XeroInv = {
  date: string;
  contact_name: string | null;
  total: number;
  line_items: Array<{ description?: string }> | null;
};

async function fetchTripXeroSpend(start: string, end: string): Promise<XeroInv[]> {
  if (!ACT_URL || !ACT_KEY) return [];
  const url = `${ACT_URL}/rest/v1/xero_invoices` +
    `?select=date,contact_name,total,line_items` +
    `&type=eq.ACCPAY&project_code=eq.ACT-GD` +
    `&date=gte.${start}&date=lte.${end}&order=date`;
  const res = await fetch(url, {
    headers: { apikey: ACT_KEY, Authorization: `Bearer ${ACT_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

/**
 * Trips are inferred from the asset register: any community with
 * ≥3 beds deployed on the same supply_date is treated as a trip.
 * For each trip we show: bed count, Xero ACCPAY in the trip window,
 * and a checklist of typical trip-overhead categories.
 */
export default async function TripReceiptsPage() {
  const supabase = createServiceClient();

  // Pull recent deployed beds, group by (community, supply_date).
  const { data } = await supabase
    .from('assets')
    .select('unique_id, community, place, supply_date, status')
    .gte('supply_date', '2026-01-01')
    .in('status', ['deployed', 'allocated'])
    .order('supply_date', { ascending: false })
    .limit(500);

  type TripKey = string;
  const trips = new Map<TripKey, { community: string; date: string; bedCount: number; bedIds: string[] }>();
  for (const r of data || []) {
    if (!r.community || !r.supply_date) continue;
    const date = (r.supply_date as string).slice(0, 10);
    const key = `${r.community}::${date}`;
    const ex = trips.get(key);
    if (ex) {
      ex.bedCount += 1;
      if (ex.bedIds.length < 12) ex.bedIds.push(r.unique_id);
    } else {
      trips.set(key, { community: r.community as string, date, bedCount: 1, bedIds: [r.unique_id] });
    }
  }
  const tripList = [...trips.values()]
    .filter((t) => t.bedCount >= 3)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  // Spend window: 3 days before -> 14 days after each trip
  function shift(d: string, days: number) {
    const dt = new Date(d); dt.setDate(dt.getDate() + days);
    return dt.toISOString().slice(0, 10);
  }
  const spendByTrip = new Map<TripKey, XeroInv[]>();
  await Promise.all(tripList.map(async (t) => {
    const inv = await fetchTripXeroSpend(shift(t.date, -3), shift(t.date, 14));
    spendByTrip.set(`${t.community}::${t.date}`, inv);
  }));

  return (
    <div className="space-y-6 pb-16">
      <header>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Trip receipts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Each trip (≥3 beds delivered to one community on one date) cross-referenced
              with Xero ACCPAY in a ±3-day to +14-day window. Missing receipts mean
              trip overhead isn&apos;t matched to ACCPAY bills yet — a Xero payment-matching
              gap (not debt), to be reconciled.
            </p>
          </div>
          <Link href="/admin/scans" className="text-xs text-blue-700 hover:underline">/admin/scans →</Link>
        </div>
      </header>

      {tripList.length === 0 && (
        <Card><CardContent className="p-6 text-sm text-gray-500">No recent trips (≥3 beds same day) found.</CardContent></Card>
      )}

      <div className="space-y-4">
        {tripList.map((t) => {
          const key = `${t.community}::${t.date}`;
          const spend = spendByTrip.get(key) || [];
          const total = spend.reduce((s, i) => s + (i.total || 0), 0);
          const hasReceipts = spend.length > 0;
          return (
            <Card key={key} className={hasReceipts ? '' : 'border-red-200 bg-red-50/40'}>
              <CardContent className="space-y-3 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold">
                      {t.community}
                      <span className="ml-3 text-sm font-normal text-gray-500">{t.date}</span>
                    </h2>
                    <p className="text-xs text-gray-500">
                      <span className="font-bold text-amber-700">{t.bedCount}</span> beds:{' '}
                      <code className="text-[11px]">{t.bedIds.slice(0, 6).join(', ')}{t.bedIds.length > 6 && '…'}</code>
                    </p>
                  </div>
                  <div className="text-right">
                    {hasReceipts ? (
                      <>
                        <p className="text-xs text-gray-500">Xero ACCPAY in window</p>
                        <p className="text-lg font-bold text-emerald-700">${total.toLocaleString('en-AU', { maximumFractionDigits: 0 })}</p>
                        <p className="text-xs text-gray-500">{spend.length} invoices</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-red-700">⚠ No Xero receipts</p>
                        <p className="text-xs text-red-600">trip overhead not yet logged</p>
                      </>
                    )}
                  </div>
                </div>

                {hasReceipts && (
                  <div className="overflow-hidden rounded border bg-white">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-50 text-[10px] uppercase tracking-wide text-gray-500">
                        <tr>
                          <th className="px-2 py-1 text-left">Date</th>
                          <th className="px-2 py-1 text-left">Vendor</th>
                          <th className="px-2 py-1 text-left">Description</th>
                          <th className="px-2 py-1 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {spend.slice(0, 10).map((inv, i) => {
                          const desc = (inv.line_items || []).map((it) => it.description || '').filter(Boolean).join('; ').slice(0, 60);
                          return (
                            <tr key={i}>
                              <td className="px-2 py-1 text-gray-500">{inv.date}</td>
                              <td className="px-2 py-1">{inv.contact_name}</td>
                              <td className="px-2 py-1 text-gray-600">{desc}</td>
                              <td className="px-2 py-1 text-right font-mono">${(inv.total || 0).toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <details className="text-xs">
                  <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                    Expected expense categories (checklist)
                  </summary>
                  <ul className="mt-2 grid grid-cols-2 gap-1 text-gray-600">
                    <li>☐ Fuel / petrol</li>
                    <li>☐ Vehicle hire / 4WD</li>
                    <li>☐ Accommodation (hotel / Airbnb)</li>
                    <li>☐ Meals / per-diem</li>
                    <li>☐ Freight / pallet transport</li>
                    <li>☐ Tolls / parking</li>
                    <li>☐ Cash purchases (reconciled)</li>
                    <li>☐ Staff time (FTE allocation)</li>
                  </ul>
                  <p className="mt-2 text-gray-500">
                    Some Goods bank-spend has historically not been matched to ACCPAY bills
                    in Xero — a payment-matching gap, not debt (the 2026-05-29 cross-check
                    found $0 paid from personal accounts and no director loan).
                    To close the gap on this trip, enter receipts in Xero
                    against <code>project_code = ACT-GD</code>.
                  </p>
                </details>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
