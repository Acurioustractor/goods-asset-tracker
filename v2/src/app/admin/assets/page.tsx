import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AssetTable, type AssetRow } from './asset-table';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STATUS_ORDER = ['requested', 'allocated', 'ready', 'demo', 'deployed', 'under_investigation', 'retired'];

function statusLabel(s: string | null | undefined) {
  return (s || 'deployed').replace(/_/g, ' ');
}

export default async function AssetRegisterPage() {
  const supabase = createServiceClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [assetsRes, telemetryRes, scansAllRes, scans7dRes] = await Promise.all([
    supabase
      .from('assets')
      .select(
        'unique_id, name, product, community, place, status, supply_date, qr_url, photo, partner_name, notes, quantity'
      )
      .order('supply_date', { ascending: false, nullsFirst: false })
      .limit(1000),
    supabase
      .from('usage_logs')
      .select('machine_id, created_at')
      .not('machine_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5000),
    // Real-human scan totals per bed (excludes bots + admin views). If the
    // bed_scans table isn't deployed yet, .error will be set and we fall back
    // to zero counts — the column still renders, just empty.
    supabase
      .from('bed_scans')
      .select('unique_id')
      .eq('is_bot', false)
      .eq('is_admin', false)
      .limit(100000),
    supabase
      .from('bed_scans')
      .select('unique_id')
      .eq('is_bot', false)
      .eq('is_admin', false)
      .gte('scanned_at', sevenDaysAgo)
      .limit(100000),
  ]);

  if (assetsRes.error) {
    return (
      <div className="p-6">
        <h1 className="font-display text-xl font-bold">Asset Register</h1>
        <p className="mt-3 text-sm text-red-600">Failed to load: {assetsRes.error.message}</p>
      </div>
    );
  }

  const data = assetsRes.data || [];
  const lastSeenByAsset = buildLastSeenMap(data, telemetryRes.data || []);

  // Roll up scan counts. Errors (e.g. table doesn't exist yet) → empty maps,
  // and the column shows "--" for every row.
  const scansTotalByAsset = new Map<string, number>();
  for (const row of scansAllRes.data || []) {
    scansTotalByAsset.set(row.unique_id, (scansTotalByAsset.get(row.unique_id) || 0) + 1);
  }
  const scans7dByAsset = new Map<string, number>();
  for (const row of scans7dRes.data || []) {
    scans7dByAsset.set(row.unique_id, (scans7dByAsset.get(row.unique_id) || 0) + 1);
  }

  const rows: AssetRow[] = data.map((r) => ({
    unique_id: r.unique_id,
    name: r.name,
    product: r.product,
    community: r.community,
    place: r.place,
    status: r.status,
    supply_date: r.supply_date,
    qr_url: r.qr_url,
    partner_name: r.partner_name,
    notes: r.notes,
    quantity: r.quantity ?? 1,
    photo_count: Array.isArray(r.photo) ? r.photo.length : r.photo ? 1 : 0,
    batch: extractBatch(r.unique_id),
    last_telemetry: lastSeenByAsset.get(r.unique_id) ?? null,
    scans_total: scansTotalByAsset.get(r.unique_id) ?? 0,
    scans_7d: scans7dByAsset.get(r.unique_id) ?? 0,
  }));

  const total = rows.length;
  const retiredCount = rows.filter((r) => r.status === 'retired').length;
  const activeCount = total - retiredCount;
  const byStatus = countBy(rows, (r) => r.status || 'deployed');
  const byProduct = countBy(rows, (r) => r.product || 'Unknown');

  const readyForTrip = rows.filter((r) => r.status === 'ready' && r.product === 'Stretch Bed').length;
  const bedsDeployed = rows.filter((r) => r.status === 'deployed' && /bed/i.test(r.product || '')).length;
  const machinesDeployed = rows.filter((r) => r.status === 'deployed' && /machine/i.test(r.product || '')).length;
  const missingQr = rows.filter((r) => !r.qr_url && r.status !== 'retired').length;

  return (
    <div className="space-y-8 pb-16">
      <header>
        <h1 className="font-display text-2xl font-bold tracking-tight">Asset Register</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every bed and machine Goods has touched. {activeCount.toLocaleString()} active records
          {retiredCount > 0 && <> + {retiredCount} retired</>}
          {' '}across {byProduct.size} product types.
        </p>
      </header>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Active Assets"
          value={activeCount.toLocaleString()}
          sub={retiredCount > 0 ? `${retiredCount} retired excluded` : `${byStatus.size} statuses`}
        />
        <Kpi label="Beds Deployed" value={bedsDeployed.toLocaleString()} sub="in community" />
        <Kpi label="Ready for Next Trip" value={readyForTrip.toLocaleString()} sub="Stretch Beds awaiting allocation" highlight />
        <Kpi label="Washing Machines Deployed" value={machinesDeployed.toLocaleString()} sub="across NT + QLD" />
      </section>

      {/* Pipeline summary */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-base font-semibold">Pipeline by status</h2>
          <span className="text-xs text-muted-foreground">{missingQr} rows still missing a QR url</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_ORDER.filter((s) => byStatus.has(s)).map((s) => (
            <Badge key={s} variant="secondary" className="capitalize">
              {statusLabel(s)}: <span className="ml-1 font-bold">{byStatus.get(s)}</span>
            </Badge>
          ))}
          {[...byStatus.keys()]
            .filter((s) => !STATUS_ORDER.includes(s))
            .map((s) => (
              <Badge key={s} variant="outline" className="capitalize">
                {statusLabel(s)}: <span className="ml-1 font-bold">{byStatus.get(s)}</span>
              </Badge>
            ))}
        </div>
      </section>

      {/* Batch 156 banner */}
      <section>
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-amber-700">Next Trip Batch</div>
              <div className="text-lg font-bold text-amber-900">GB0-156 — 107 Stretch Beds</div>
              <div className="text-sm text-amber-800/80">
                Status <code className="rounded bg-card px-1.5 py-0.5">ready</code> — community
                {' '}<code className="rounded bg-card px-1.5 py-0.5">Pending Delivery</code>. Update each row in-field as it&apos;s placed.
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link className="rounded-md border border-amber-400 bg-amber-600 px-3 py-1.5 font-semibold text-white hover:bg-amber-700"
                href="/admin/assets/batch/156">
                Allocate batch →
              </Link>
              <a className="rounded-md border border-amber-300 bg-card px-3 py-1.5 font-medium text-amber-900 hover:bg-amber-100"
                href="/api/admin/assets/batch/156/manifest">
                Download manifest CSV
              </a>
              <a className="rounded-md border border-amber-300 bg-card px-3 py-1.5 font-medium text-amber-900 hover:bg-amber-100"
                href="/api/admin/assets/batch/156/print">
                Print QR sheet (PDF, 18pp)
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Filterable table */}
      <section>
        <AssetTable rows={rows} />
      </section>
    </div>
  );
}

function Kpi({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <Card className={highlight ? 'border-amber-300 bg-amber-50/50' : undefined}>
      <CardContent>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className={`mt-1 text-3xl font-bold ${highlight ? 'text-amber-900' : 'text-foreground'}`}>{value}</div>
        {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function countBy<T>(arr: T[], key: (x: T) => string): Map<string, number> {
  const m = new Map<string, number>();
  for (const x of arr) {
    const k = key(x);
    m.set(k, (m.get(k) || 0) + 1);
  }
  return m;
}

function extractBatch(uid: string | null | undefined): string | null {
  if (!uid) return null;
  const m = uid.match(/^GB0-([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}

type TelemetryRow = { machine_id: string | null; created_at: string | null };
type AssetLite = { unique_id: string; name: string | null };

/**
 * Canonical telemetry machine_id -> asset unique_id mapping.
 * Source: wiki/outputs/2026-05-14-washing-machine-reconciliation.md.
 * Update this map when new devices come online or when an orphan is physically reconciled.
 */
const TELEMETRY_TO_ASSET: Record<string, string> = {
  // Particle coreids — merged to the canonical household row 2026-05-14
  'e00fce684086eb2aba8d4f25': 'GB0-113',     // F25 = Norman Frank
  'e00fce687ae01d08f95694e5': 'GB0-154-2',   // 4E5 = Nicole Frank
  'e00fce68c2ba447b66bcd507': 'GB0-125',     // 507 = Barkley Arts
  'e00fce682db6d32e15e86098': 'GB0-132',     // 098 = Jimmy Frank (merged 2026-05-14)
  'e00fce68c4b97878b9a2b323': 'GB0-WM-ORPHAN-c4b9',
  'e00fce68fe6c048ccec66ab1': 'GB0-WM-ORPHAN-fe6c',
  'e00fce689f1dd0daf5987cf2': 'GB0-WM-ORPHAN-689f',
  // Named devices (from the legacy Openfields pipeline, all went silent on 2026-03-09)
  'Norms House': 'GB0-113',
  'Nicoles House': 'GB0-154-2',
  'Barkley Arts': 'GB0-125',
  'Red Dust': 'GB0-WM-RD',
  'Dian Stokes Sons House': 'GB0-WM-DSS',
  '8D1': 'GB0-133',                        // 8D1 = Norman Frank's 2nd missing machine (speculative, merged 2026-05-14)
};

function buildLastSeenMap(_assets: AssetLite[], telemetry: TelemetryRow[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const t of telemetry) {
    if (!t.machine_id || !t.created_at) continue;
    if (t.machine_id === 'test123') continue;
    const uid = TELEMETRY_TO_ASSET[t.machine_id];
    if (!uid) continue;
    const prev = out.get(uid);
    if (!prev || t.created_at > prev) out.set(uid, t.created_at);
  }
  return out;
}
