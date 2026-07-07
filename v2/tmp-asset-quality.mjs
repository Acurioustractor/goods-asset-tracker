// Data-quality snapshot of the live Goods asset register.
// READ-ONLY and PII-FREE: completeness via count-only head requests with null
// filters; no recipient names, contacts, or GPS values are ever fetched.
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) { console.error('missing env'); process.exit(1); }
const sb = createClient(url, key);
const out = {};

const countWhere = async (table, mod) => {
  let q = sb.from(table).select('*', { count: 'exact', head: true });
  if (mod) q = mod(q);
  const { count, error } = await q;
  return error ? `ERR: ${error.message}` : count;
};

// 1. Non-PII categorical breakdown
const { data: cats, error: e1 } = await sb.from('assets').select('product,status,community').limit(2000);
if (e1) { console.error('assets:', e1.message); process.exit(1); }
const by = (arr, f) => arr.reduce((m, x) => { const k = f(x) ?? 'NULL'; m[k] = (m[k] || 0) + 1; return m; }, {});
out.totalAssets = cats.length;
out.byProductStatus = by(cats, a => `${a.product}|${a.status}`);
out.deployedByCommunity = by(cats.filter(a => a.status === 'deployed'), a => a.community);

// 2. Deployed completeness: count-only, no values fetched
const dep = q => q.eq('status', 'deployed');
out.deployedCompleteness = {
  total: await countWhere('assets', dep),
  hasRecipientName: await countWhere('assets', q => dep(q).not('recipient_name', 'is', null)),
  hasRecipientConsent: await countWhere('assets', q => dep(q).not('recipient_consent_at', 'is', null)),
  hasContactHousehold: await countWhere('assets', q => dep(q).not('contact_household', 'is', null)),
  hasHouseholdSize: await countWhere('assets', q => dep(q).not('household_size', 'is', null)),
  hasGps: await countWhere('assets', q => dep(q).not('gps', 'is', null)),
  hasQr: await countWhere('assets', q => dep(q).not('qr_url', 'is', null)),
  hasSupplyDate: await countWhere('assets', q => dep(q).not('supply_date', 'is', null)),
  hasLastCheckin: await countWhere('assets', q => dep(q).not('last_checkin_date', 'is', null)),
  washersWithMachineId: await countWhere('assets', q => dep(q).ilike('product', '%wash%').not('machine_id', 'is', null)),
  washersDeployed: await countWhere('assets', q => dep(q).ilike('product', '%wash%')),
};

// 3. Engagement: counts + freshness only
out.claims_user_assets = await countWhere('user_assets');
out.checkins = await countWhere('checkins');
out.bed_scans = await countWhere('bed_scans');
const { data: lastScan } = await sb.from('bed_scans').select('scanned_at').order('scanned_at', { ascending: false }).limit(1);
out.lastScanAt = lastScan?.[0]?.scanned_at ?? null;
out.bed_signals = await countWhere('bed_signals');
out.bed_journeys = await countWhere('bed_journeys');
out.overdue_assets = await countWhere('overdue_assets');

// 4. Washer telemetry pipeline: volume, freshness, coverage
out.usage_logs = await countWhere('usage_logs');
const { data: lastLog } = await sb.from('usage_logs').select('event_type,created_at').order('created_at', { ascending: false }).limit(3);
out.lastUsageEvents = lastLog ?? null;
const { data: machineIds } = await sb.from('usage_logs').select('machine_id').limit(10000);
out.distinctMachinesPinging = new Set((machineIds || []).map(m => m.machine_id).filter(Boolean)).size;
out.webhook_receipts = await countWhere('webhook_receipts');
const { data: lastHook } = await sb.from('webhook_receipts').select('created_at').order('created_at', { ascending: false }).limit(1);
out.lastWebhookAt = lastHook?.[0]?.created_at ?? null;
const { data: lastRollup } = await sb.from('daily_machine_rollups').select('*', { head: false }).order('created_at', { ascending: false }).limit(0);
out.daily_machine_rollups = await countWhere('daily_machine_rollups');

console.log(JSON.stringify(out, null, 1));
