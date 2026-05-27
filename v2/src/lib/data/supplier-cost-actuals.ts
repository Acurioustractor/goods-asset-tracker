/**
 * Pulls actual supplier spend from the Goods Xero data (mirrored into the
 * ACT infra Supabase). Used to compute *real* cost-per-bed alongside the
 * canonical $149.20 BOM in supplier-quotes.ts.
 *
 * NB: Goods supplier invoices are coded as lump-sum account lines
 * ("Defy Manufacturing — Materials & Supplies — ACT-GD"), NOT itemised per
 * component — so a true per-unit BOM is NOT recoverable from Xero. The
 * canonical $149.20 BOM in supplier-quotes.ts stays the per-unit anchor.
 * These ACCPAY totals also fold in freight, training, prototype iterations and
 * setup, and the cost-per-batch denominator counts Basket beds too, so treat
 * the resulting $/bed as a *directional* signal only.
 *
 * Reconciled against the ACT-infra Xero mirror 2026-05-28:
 * see wiki/outputs/2026-05-28-bed-cogs-xero-reconciliation.md.
 */

type XeroInvoiceRow = {
  date: string;
  contact_name: string;
  total: number;
  type: string;
};

// Bed-component suppliers as they appear in Goods (ACT-GD) Xero — i.e. only the
// portion of the supply chain that is actually capturable from this mirror.
// Verified against the ACT-infra mirror + Notion BOM 2026-05-28:
//   Defy / Defy Manufacturing            → HDPE legs + facility production (lump-sum coded)
//   Brisbane Steel Supplies / Steelmart  → steel (Goods-tagged)
// NOT capturable here (real, but off this mirror — confirmed by Ben 2026-05-28):
//   DNA Steel Direct (Alice Springs, $27/bed) — invoices live in Notion, not the Xero mirror.
//   Centre Canvas (Alice Springs, $93.50/bed) — its one genuine "Canvas stretcher covers"
//     invoice is mis-tagged ACT-IN (so excluded by the project filter below), and the same
//     Xero contact is polluted with Canva software-subscription lines (name collision).
// Net effect: this figure is Defy + Goods-tagged steel only — a LOWER BOUND on real
// supplier spend. The Alice Springs canvas/steel chain is in Notion.
// See wiki/outputs/2026-05-28-bed-cogs-xero-reconciliation.md.
export const BOM_SUPPLIERS = [
  'Defy',
  'Defy Design',
  'Defy Manufacturing',
  'Brisbane Steel Supplies',
  'Steelmart',
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
  // Restrict to Goods-tagged spend (project_code=ACT-GD). Without this, ACT-IN
  // invoices mis-filed against a bed-supplier contact leak in (e.g. a Canva
  // subscription booked under "Centre Canvas And Upholstery" inflated the figure
  // by ~$25k before this filter).
  const url = `${baseUrl}/rest/v1/xero_invoices?type=eq.ACCPAY&project_code=eq.ACT-GD&contact_name=in.(${encodeURIComponent(supplierList)})&select=date,contact_name,total,type&order=date.desc`;

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
