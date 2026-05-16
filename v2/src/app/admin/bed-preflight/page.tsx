import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Check = {
  label: string;
  ok: boolean;
  detail?: string;
  fix?: string;
};

async function pingHttp(url: string, timeoutMs = 4000): Promise<{ ok: boolean; status?: number }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timer);
    return { ok: res.status < 500, status: res.status };
  } catch {
    return { ok: false };
  }
}

export default async function BedPreflightPage() {
  const supabase = createServiceClient();

  // --- ENV checks ---
  const envChecks: Check[] = [
    {
      label: 'NEXT_PUBLIC_SUPABASE_URL',
      ok: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      detail: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 50),
      fix: 'Set in Vercel → Project Settings → Environment Variables.',
    },
    {
      label: 'SUPABASE_SERVICE_ROLE_KEY',
      ok: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      detail: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'missing',
      fix: 'Required for server-side writes (compassion_content, bed_signals).',
    },
    {
      label: 'GHL_API_KEY + GHL_LOCATION_ID',
      ok: !!process.env.GHL_API_KEY && !!process.env.GHL_LOCATION_ID,
      detail: process.env.GHL_LOCATION_ID ? `location ${process.env.GHL_LOCATION_ID.slice(0, 8)}…` : 'missing',
      fix: 'Needed for inbound SMS routing + outbound reminder cron.',
    },
    {
      label: 'NEXT_PUBLIC_GOODS_SUPPORT_PHONE',
      ok: !!process.env.NEXT_PUBLIC_GOODS_SUPPORT_PHONE,
      detail: process.env.NEXT_PUBLIC_GOODS_SUPPORT_PHONE || '(falling back to +61 468 052 660)',
      fix: 'The number WhatsApp/SMS buttons deep-link to. Should match your GHL inbound number.',
    },
    {
      label: 'GHL_PULSE_WEBHOOK_URL',
      ok: !!process.env.GHL_PULSE_WEBHOOK_URL,
      detail: process.env.GHL_PULSE_WEBHOOK_URL ? 'configured' : 'missing — pulse alerts will write to DB only',
      fix: 'In GHL: Automation → Workflows → New → trigger "Inbound Webhook" → copy URL → set as env.',
    },
    {
      label: 'EMPATHY_LEDGER_SUPABASE_URL + KEY',
      ok: !!process.env.EMPATHY_LEDGER_SUPABASE_URL && !!process.env.EMPATHY_LEDGER_SUPABASE_KEY,
      detail: process.env.EMPATHY_LEDGER_SUPABASE_URL ? 'set' : 'missing',
      fix: 'Needed for the story modal to push drafts to the Empathy Ledger.',
    },
    {
      label: 'EMPATHY_LEDGER_TENANT_ID + FALLBACK_*',
      ok: !!process.env.EMPATHY_LEDGER_TENANT_ID && !!process.env.EMPATHY_LEDGER_FALLBACK_STORYTELLER_ID,
      detail: 'attribution fallback',
      fix: 'Used to satisfy the EL stories require-attribution check constraint.',
    },
    {
      label: 'CRON_SECRET',
      ok: !!process.env.CRON_SECRET,
      detail: process.env.CRON_SECRET ? 'set' : 'missing',
      fix: 'Vercel cron sends this in the Authorization header. Without it, dispatch crons are read-only.',
    },
    {
      label: 'MINIMAX_API_KEY',
      ok: !!process.env.MINIMAX_API_KEY,
      detail: process.env.MINIMAX_API_KEY ? `set · model ${process.env.MINIMAX_MODEL || 'MiniMax-M2'}` : 'missing',
      fix: 'Powers the "Get help" chat via Minimax (api.minimax.io). Without it the chat returns a 503. Get a key at platform.minimax.io.',
    },
  ];

  // --- Schema checks ---
  const schemaChecks: Check[] = [];

  const { error: bedSignalsErr } = await supabase
    .from('bed_signals')
    .select('id', { count: 'exact', head: true });
  schemaChecks.push({
    label: 'Table: bed_signals',
    ok: !bedSignalsErr,
    detail: bedSignalsErr?.message,
    fix: 'Re-apply migration 20260515000003_bed_signals_and_display_name.sql.',
  });

  const { error: displayNameErr } = await supabase
    .from('assets')
    .select('display_name', { head: true, count: 'exact' })
    .limit(1);
  schemaChecks.push({
    label: 'Column: assets.display_name',
    ok: !displayNameErr,
    detail: displayNameErr?.message,
    fix: 'Re-apply migration 20260515000003 — adds display_name + display_name_public.',
  });

  const { error: communityDemandErr } = await supabase
    .from('community_demand')
    .select('id', { head: true, count: 'exact' })
    .limit(1);
  schemaChecks.push({
    label: 'Table: community_demand',
    ok: !communityDemandErr,
    detail: communityDemandErr?.message,
    fix: 'Should already exist from communities migration.',
  });

  // --- Live data: how many beds ready for scan ---
  const { count: readyCount } = await supabase
    .from('assets')
    .select('unique_id', { count: 'exact', head: true })
    .eq('status', 'ready');

  const { count: deployedCount } = await supabase
    .from('assets')
    .select('unique_id', { count: 'exact', head: true })
    .eq('status', 'deployed');

  const { count: signalCount } = await supabase
    .from('bed_signals')
    .select('id', { count: 'exact', head: true });

  // --- Test bed ID for the smoke test ---
  const { data: testBed } = await supabase
    .from('assets')
    .select('unique_id')
    .eq('status', 'ready')
    .order('created_time', { ascending: false })
    .limit(1)
    .maybeSingle();

  const testBedId = testBed?.unique_id || 'GB0-156-1';
  const testBedUrl = `/bed/${testBedId}`;

  // --- External pings (cron routes responding) ---
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.goodsoncountry.com';
  const [pulsePing, smsPing] = await Promise.all([
    pingHttp(`${baseUrl}/api/cron/pulse-watch`),
    pingHttp(`${baseUrl}/api/cron/sms-dispatch`),
  ]);

  const cronChecks: Check[] = [
    {
      label: '/api/cron/pulse-watch responding',
      ok: pulsePing.ok,
      detail: pulsePing.status ? `HTTP ${pulsePing.status}` : 'no response',
      fix: 'Vercel cron should be registered in vercel.json. Hit the URL in a browser to dry-run.',
    },
    {
      label: '/api/cron/sms-dispatch responding',
      ok: smsPing.ok,
      detail: smsPing.status ? `HTTP ${smsPing.status}` : 'no response',
      fix: 'Same as above. Daily 8am AEST schedule.',
    },
  ];

  const allChecks = [...envChecks, ...schemaChecks, ...cronChecks];
  const okCount = allChecks.filter((c) => c.ok).length;
  const totalCount = allChecks.length;
  const allGreen = okCount === totalCount;

  // --- Smoke test steps ---
  const smokeSteps = [
    { door: 'Hero name', desc: 'Tap "Give this bed a name". Type a name. Tick "show publicly". Save. Reload — name appears in hero.' },
    { door: 'Pulse', desc: 'Tap 👍. Confirms with thanks. Open /admin/bed-signals — pulse row appears at top.' },
    { door: 'WhatsApp', desc: 'Tap 💚 WhatsApp Goods. WhatsApp opens with pre-filled "Hi Goods, scanning {id}". Send.' },
    { door: 'SMS', desc: 'Tap 📱 Text us. Phone messages app opens with pre-filled body. Send.' },
    { door: 'Setup video', desc: 'Tap play. Video runs.' },
    { door: 'FAQ accordion', desc: 'Tap "How do I wash the canvas?" — expands inline.' },
    { door: 'Parts diagram', desc: 'Card shows 4 numbered parts (canvas / pole / leg / end cap).' },
    { door: 'Behind this bed', desc: 'Card shows materials + Alice plant team + production photos (if any shifts have photos).' },
    { door: 'Share a photo or story', desc: 'Tap. Open the modal. Upload a photo OR record voice OR type story. Submit. Reload — photo lands in BedGallery.' },
    { door: 'Reminder', desc: 'Pick 3 months. Enter phone. Save. Reload /admin/bed-signals — reminder row queued with scheduled_for.' },
    { door: 'Demand bump', desc: 'Tap "We need more here". Set 2. Notes "for the new houses". Save. Check /admin/communities/{id} — community_demand row.' },
    { door: 'Workshop interest', desc: 'Tap "I\'m keen". Enter contact. Save. /admin/bed-signals shows workshop_interest row.' },
    { door: 'Get help chat', desc: 'Tap floating 💡 Get help. Page header shows "Help with your bed" with the asset ID. Ask "How do I wash this?" — bed-aware answer.' },
    { door: 'Need help / support', desc: 'Tap 🛠️. /support form opens with asset pre-filled.' },
    { door: 'Claim bed', desc: 'Tap "Stay in touch". Phone login. After OTP, lands at /my-items with bed listed.' },
  ];

  return (
    <div className="px-4 md:px-8 py-6 space-y-6 max-w-4xl mx-auto">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-bold">Bed scan preflight</h1>
        <p className="text-sm text-muted-foreground">
          Run this before flying. Confirms env, schema, and crons. Use the smoke test list to walk through a real scan.
        </p>
      </header>

      {/* Top summary */}
      <div className={`rounded-2xl border p-5 ${allGreen ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900' : 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900'}`}>
        <p className="text-2xl font-bold">
          {allGreen ? '✅ All systems good' : `⚠️ ${totalCount - okCount} check${totalCount - okCount === 1 ? '' : 's'} failing`}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {okCount} of {totalCount} checks passing
        </p>
        <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
          <div className="rounded-lg bg-card border p-3">
            <p className="text-xs text-muted-foreground">Beds ready for delivery</p>
            <p className="text-2xl font-bold">{readyCount || 0}</p>
          </div>
          <div className="rounded-lg bg-card border p-3">
            <p className="text-xs text-muted-foreground">Beds deployed</p>
            <p className="text-2xl font-bold">{deployedCount || 0}</p>
          </div>
          <div className="rounded-lg bg-card border p-3">
            <p className="text-xs text-muted-foreground">Signals captured</p>
            <p className="text-2xl font-bold">{signalCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Test-a-real-bed CTA */}
      <div className="rounded-2xl border bg-card p-5">
        <p className="font-display text-lg font-bold mb-1">Try it now</p>
        <p className="text-sm text-muted-foreground mb-3">
          Opens the freshest unallocated bed&apos;s public page. Walk through the smoke test below as you go.
        </p>
        <Link
          href={testBedUrl}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full bg-amber-700 hover:bg-amber-800 text-white px-5 py-3 text-sm font-semibold"
        >
          Open {testBedId} →
        </Link>
      </div>

      {/* Env checks */}
      <section>
        <h2 className="font-display text-lg font-bold mb-3">Environment</h2>
        <ul className="space-y-2">
          {envChecks.map((c) => (
            <CheckRow key={c.label} check={c} />
          ))}
        </ul>
      </section>

      {/* Schema checks */}
      <section>
        <h2 className="font-display text-lg font-bold mb-3">Database schema</h2>
        <ul className="space-y-2">
          {schemaChecks.map((c) => (
            <CheckRow key={c.label} check={c} />
          ))}
        </ul>
      </section>

      {/* Cron checks */}
      <section>
        <h2 className="font-display text-lg font-bold mb-3">Cron routes</h2>
        <ul className="space-y-2">
          {cronChecks.map((c) => (
            <CheckRow key={c.label} check={c} />
          ))}
        </ul>
      </section>

      {/* Smoke test */}
      <section>
        <h2 className="font-display text-lg font-bold mb-1">Smoke test (15 steps)</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Walk through each on your phone with {testBedId}. Tick mentally as you go.
        </p>
        <ol className="space-y-2">
          {smokeSteps.map((step, idx) => (
            <li key={idx} className="rounded-lg border bg-card p-3 flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{step.door}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Useful links */}
      <section>
        <h2 className="font-display text-lg font-bold mb-3">While in the field</h2>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li>
            <Link href="/admin/install-checklist" className="block rounded-lg border bg-card p-3 hover:bg-muted">
              📝 Install checklist (printable)
            </Link>
          </li>
          <li>
            <Link href="/wiki/guides/recipient-handover" className="block rounded-lg border bg-card p-3 hover:bg-muted" target="_blank">
              🤝 Recipient handover script
            </Link>
          </li>
          <li>
            <Link href="/admin/bed-signals" className="block rounded-lg border bg-card p-3 hover:bg-muted">
              📡 Bed signals (live)
            </Link>
          </li>
          <li>
            <Link href="/admin/communities" className="block rounded-lg border bg-card p-3 hover:bg-muted">
              🌏 Communities + demand
            </Link>
          </li>
          <li>
            <Link href="/admin/assets" className="block rounded-lg border bg-card p-3 hover:bg-muted">
              📚 Asset register
            </Link>
          </li>
          <li>
            <Link href="/admin/compassion" className="block rounded-lg border bg-card p-3 hover:bg-muted">
              💛 Compassion content (photos)
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

function CheckRow({ check }: { check: Check }) {
  return (
    <li className="rounded-lg border bg-card p-3 flex items-start gap-3">
      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${check.ok ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}>
        {check.ok ? '✓' : '✗'}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{check.label}</p>
        {check.detail && (
          <p className="text-xs text-muted-foreground mt-0.5 font-mono break-all">{check.detail}</p>
        )}
        {!check.ok && check.fix && (
          <p className="text-xs text-amber-700 mt-1">→ {check.fix}</p>
        )}
      </div>
    </li>
  );
}
