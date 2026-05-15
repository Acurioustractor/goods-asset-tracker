/**
 * Pulls actual supplier spend from the Goods Xero data (mirrored into the
 * ACT infra Supabase). Used to compute *real* cost-per-bed alongside the
 * canonical $149.20 BOM in supplier-quotes.ts.
 *
 * NB: ACCPAY totals include freight, training, setup, and prototype work
 * alongside per-bed BOM. Treat the resulting $/bed as a *directional*
 * signal, not a per-unit truth. To get true per-unit COGS we'd need
 * Xero line-items tagged with a batch code (future enhancement).
 */

type XeroInvoiceRow = {
  date: string;
  contact_name: string;
  total: number;
  type: string;
};

export const BOM_SUPPLIERS = [
  'Defy',
  'Defy Design',
  'Defy Manufacturing',
  'DNA Steel Direct',
  'DNA Steel',
  'Centre Canvas',
  'Centre Canvas And Upholstery',
] as const;

export type SupplierActuals = {
  totalSpend: number;
  bySupplier: Array<{ supplier: string; total: number; invoiceCount: number }>;
  invoiceCount: number;
  earliestDate: string | null;
  latestDate: string | null;
  source: 'live' | 'unavailable';
  error?: string;
};

const EMPTY: SupplierActuals = {
  totalSpend: 0,
  bySupplier: [],
  invoiceCount: 0,
  earliestDate: null,
  latestDate: null,
  source: 'unavailable',
};

export async function getSupplierActuals(): Promise<SupplierActuals> {
  const baseUrl = process.env.ACT_INFRA_SUPABASE_URL;
  const key = process.env.ACT_INFRA_SUPABASE_KEY;
  if (!baseUrl || !key) {
    return { ...EMPTY, error: 'ACT_INFRA_SUPABASE_URL/KEY not configured' };
  }

  // PostgREST IN list: quote each value to be safe with spaces
  const supplierList = BOM_SUPPLIERS.map((s) => `"${s.replace(/"/g, '\\"')}"`).join(',');
  const url = `${baseUrl}/rest/v1/xero_invoices?type=eq.ACCPAY&contact_name=in.(${encodeURIComponent(supplierList)})&select=date,contact_name,total,type&order=date.desc`;

  try {
    const res = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      // server-side fetch; revalidate every 6 hours
      next: { revalidate: 21600 },
    });
    if (!res.ok) {
      return { ...EMPTY, error: `Xero fetch ${res.status}` };
    }
    const rows = (await res.json()) as XeroInvoiceRow[];

    const bySupplierMap = new Map<string, { total: number; invoiceCount: number }>();
    let total = 0;
    let earliest: string | null = null;
    let latest: string | null = null;

    for (const r of rows) {
      total += r.total;
      const cur = bySupplierMap.get(r.contact_name) || { total: 0, invoiceCount: 0 };
      cur.total += r.total;
      cur.invoiceCount += 1;
      bySupplierMap.set(r.contact_name, cur);
      if (!earliest || r.date < earliest) earliest = r.date;
      if (!latest || r.date > latest) latest = r.date;
    }

    return {
      totalSpend: total,
      bySupplier: [...bySupplierMap.entries()]
        .map(([supplier, { total, invoiceCount }]) => ({ supplier, total, invoiceCount }))
        .sort((a, b) => b.total - a.total),
      invoiceCount: rows.length,
      earliestDate: earliest,
      latestDate: latest,
      source: 'live',
    };
  } catch (e) {
    return { ...EMPTY, error: e instanceof Error ? e.message : 'unknown' };
  }
}
