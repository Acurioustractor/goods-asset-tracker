import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink, Copy } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Pre-launch gate for flipping Stripe to live mode + opening the shop to real
 * customers. Each row reports a green/red/amber status the admin can act on.
 *
 * Anything tested here is automated; anything that requires opening the Stripe
 * or Vercel dashboard is presented as a manual step with copy-pasteable commands.
 */

interface CheckRow {
  id: string;
  title: string;
  status: 'pass' | 'fail' | 'warn' | 'manual';
  detail: string;
  action?: { label: string; href?: string; command?: string };
}

async function runChecks(): Promise<CheckRow[]> {
  const checks: CheckRow[] = [];

  // 1. Stripe key mode
  const stripeKey = process.env.STRIPE_SECRET_KEY || '';
  const isLive = stripeKey.startsWith('sk_live_');
  const isTest = stripeKey.startsWith('sk_test_');
  checks.push({
    id: 'stripe-key-mode',
    title: 'Stripe secret key mode',
    status: isLive ? 'pass' : isTest ? 'fail' : 'fail',
    detail: isLive
      ? 'Live key — real cards will be charged.'
      : isTest
        ? 'TEST key in use. Real customers cannot pay until this is swapped to a live key.'
        : 'STRIPE_SECRET_KEY missing or invalid.',
    action: !isLive
      ? {
          label: 'Swap on Vercel',
          command: `vercel env rm STRIPE_SECRET_KEY production && vercel env add STRIPE_SECRET_KEY production`,
        }
      : undefined,
  });

  // 2. Publishable key mode
  const pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  const pubIsLive = pubKey.startsWith('pk_live_');
  const pubIsTest = pubKey.startsWith('pk_test_');
  checks.push({
    id: 'stripe-pub-mode',
    title: 'Stripe publishable key mode',
    status: pubIsLive ? 'pass' : pubIsTest ? 'fail' : 'fail',
    detail: pubIsLive
      ? 'Live publishable key.'
      : pubIsTest
        ? 'TEST publishable key. Must match the secret-key mode.'
        : 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY missing or invalid.',
    action: !pubIsLive
      ? {
          label: 'Swap on Vercel',
          command: `vercel env rm NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production && vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production`,
        }
      : undefined,
  });

  // 3. Webhook signing secret present
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  checks.push({
    id: 'stripe-webhook-secret',
    title: 'Stripe webhook signing secret',
    status: webhookSecret ? 'pass' : 'fail',
    detail: webhookSecret
      ? 'Set. Make sure this matches the secret on the live webhook endpoint in the Stripe dashboard.'
      : 'STRIPE_WEBHOOK_SECRET missing — webhook handler will reject every event.',
  });

  // 4. Live webhook endpoint registered in Stripe (manual — can't introspect without Stripe API call)
  checks.push({
    id: 'stripe-webhook-endpoint',
    title: 'Stripe live webhook endpoint',
    status: 'manual',
    detail: 'Confirm the Stripe dashboard has a webhook at https://www.goodsoncountry.com/api/webhooks/stripe listening for checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed, and charge.refunded — then copy the signing secret into STRIPE_WEBHOOK_SECRET.',
    action: { label: 'Open Stripe webhooks', href: 'https://dashboard.stripe.com/webhooks' },
  });

  // 5. Active products are intentional
  const supabase = createServiceClient();
  const { data: activeProducts } = await supabase
    .from('products')
    .select('slug, name, product_type, is_active')
    .eq('is_active', true);
  const activeList = activeProducts || [];
  const hasDeprecatedSlug = activeList.some((p) => p.slug.startsWith('weave-bed') || p.slug.startsWith('basket-bed'));
  const hasWasherForSale = activeList.some((p) => p.slug === 'washing-machine-standard');
  const onlyStretchBed = activeList.length > 0 && activeList.every((p) => p.slug.startsWith('stretch-bed'));
  checks.push({
    id: 'active-products',
    title: `Active products (${activeList.length})`,
    status: onlyStretchBed ? 'pass' : hasDeprecatedSlug || hasWasherForSale ? 'fail' : 'warn',
    detail: activeList.length === 0
      ? 'No active products — the shop will be empty.'
      : activeList.map((p) => `${p.slug} (${p.product_type})`).join(', '),
    action: !onlyStretchBed
      ? { label: 'Open /admin/products', href: '/admin/products' }
      : undefined,
  });

  // 6. Stretch Bed row has the canonical product_type
  const { data: stretchRow } = await supabase
    .from('products')
    .select('slug, product_type, description, short_description')
    .eq('slug', 'stretch-bed-single')
    .single();
  const stretchType = stretchRow?.product_type as string | undefined;
  const stretchDescBad = /tension-weave|woven cord|hardwood frame/i.test(stretchRow?.description || '');
  checks.push({
    id: 'stretch-bed-canonical',
    title: 'Stretch Bed row canonical',
    status: stretchType === 'stretch_bed' && !stretchDescBad ? 'pass' : 'fail',
    detail:
      stretchType !== 'stretch_bed'
        ? `product_type is "${stretchType}", should be "stretch_bed". Apply migration 20260517000001 first, then re-run the product rewrite.`
        : stretchDescBad
          ? 'Description still contains "tension-weave / woven cord / hardwood frame" — those are wrong. Materials are HDPE plastic + galvanised steel + canvas.'
          : 'Type and description look correct.',
  });

  // 7. Most recent paid order — confirm webhook is actually firing
  const { data: lastOrder } = await supabase
    .from('orders')
    .select('order_number, customer_email, total_cents, payment_status, paid_at')
    .eq('payment_status', 'paid')
    .order('paid_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  checks.push({
    id: 'recent-paid-order',
    title: 'Most recent paid order',
    status: lastOrder ? 'warn' : 'manual',
    detail: lastOrder
      ? `${lastOrder.order_number} — ${lastOrder.customer_email} — AU$${((lastOrder.total_cents || 0) / 100).toFixed(2)} at ${new Date(lastOrder.paid_at as string).toLocaleString('en-AU')}. Confirm this was an intentional smoke test, not a real customer charged on test mode.`
      : 'No paid orders yet. Once you flip to live, do one $1 smoke test to prove the webhook fires.',
  });

  // 8. GHL enabled (the order webhook hands off here)
  const ghlEnabled = process.env.GHL_ENABLED === 'true' && !!process.env.GHL_API_KEY && !!process.env.GHL_LOCATION_ID;
  checks.push({
    id: 'ghl-enabled',
    title: 'GHL integration enabled',
    status: ghlEnabled ? 'pass' : 'warn',
    detail: ghlEnabled
      ? 'Enabled — buyers will be upserted into GHL automatically.'
      : 'Disabled or missing API key/location id. Orders will still process, but buyers won\'t land in GHL.',
  });

  return checks;
}

function StatusBadge({ status }: { status: CheckRow['status'] }) {
  if (status === 'pass') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        <CheckCircle2 className="h-3 w-3" /> Pass
      </span>
    );
  }
  if (status === 'fail') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
        <XCircle className="h-3 w-3" /> Fix
      </span>
    );
  }
  if (status === 'warn') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
        <AlertCircle className="h-3 w-3" /> Review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
      <AlertCircle className="h-3 w-3" /> Manual
    </span>
  );
}

export default async function LaunchChecklistPage() {
  const checks = await runChecks();
  const passCount = checks.filter((c) => c.status === 'pass').length;
  const failCount = checks.filter((c) => c.status === 'fail').length;
  const totalCount = checks.length;
  const allGreen = failCount === 0 && checks.every((c) => c.status !== 'fail');

  return (
    <div className="space-y-6 pb-16">
      <header>
        <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to Orders
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Stripe launch checklist</h1>
        <p className="mt-1 text-sm text-gray-600">
          Run through this before flipping the shop to live cards. Each fail is a hard blocker on real revenue.
        </p>
      </header>

      <Card>
        <CardContent className="flex flex-wrap items-baseline gap-6">
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {passCount}<span className="text-base text-gray-400">/{totalCount}</span>
            </div>
            <div className="text-xs uppercase tracking-wide text-gray-500">Passing</div>
          </div>
          {failCount > 0 && (
            <div>
              <div className="text-3xl font-bold text-red-600">{failCount}</div>
              <div className="text-xs uppercase tracking-wide text-gray-500">Fixes required</div>
            </div>
          )}
          <div className="ml-auto">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                allGreen ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {allGreen ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {allGreen ? 'Ready to go live' : 'Not ready'}
            </div>
          </div>
        </CardContent>
      </Card>

      <ul className="space-y-3">
        {checks.map((c) => (
          <li key={c.id}>
            <Card>
              <CardContent>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{c.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{c.detail}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                {c.action && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    {c.action.href && (
                      <a
                        href={c.action.href}
                        target={c.action.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                      >
                        {c.action.label} <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {c.action.command && (
                      <pre className="mt-1 overflow-x-auto rounded bg-gray-50 px-3 py-2 text-xs text-gray-800">
                        {c.action.command}
                      </pre>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {/* Manual sequence summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent>
          <h2 className="text-sm font-semibold text-blue-900">Recommended order of operations</h2>
          <ol className="mt-2 ml-5 list-decimal space-y-1 text-sm text-blue-900">
            <li>Get every automated check above to pass.</li>
            <li>
              In <a href="https://dashboard.stripe.com/" target="_blank" rel="noopener noreferrer" className="underline">Stripe</a>:
              toggle off &quot;View test data&quot;, then API keys → reveal live secret + publishable.
            </li>
            <li>
              Add a webhook endpoint pointing at <code className="rounded bg-blue-100 px-1">https://www.goodsoncountry.com/api/webhooks/stripe</code>{' '}
              and copy its signing secret.
            </li>
            <li>
              Run the three <code>vercel env</code> swap commands above (secret, publishable, webhook).
            </li>
            <li>
              <code className="rounded bg-blue-100 px-1">vercel --prod</code> to redeploy with the new envs.
            </li>
            <li>
              Buy a $1 hidden SKU with a real card → confirm it shows in <Link href="/admin/orders" className="underline">orders</Link>{' '}
              + the buyer gets the right GHL tags.
            </li>
            <li>Refund the $1 from the Stripe dashboard to clean up.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
