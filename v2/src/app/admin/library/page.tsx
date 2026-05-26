import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { stretchBedBOM, stretchBedCOGS, supplierSummary, supplierQuotes } from '@/lib/data/supplier-quotes';
import { FUNDER_PAGES } from '@/lib/data/funder-pages';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const WIKI_ARTICLES = [
  // Operations + manufacturing
  { href: '/wiki/manufacturing/facility-manual', title: 'Facility manual', cat: 'Manufacturing' },
  { href: '/wiki/manufacturing/machine-specs', title: 'Machine specs', cat: 'Manufacturing' },
  { href: '/wiki/manufacturing/plastic-processing', title: 'Plastic processing', cat: 'Manufacturing' },
  { href: '/wiki/manufacturing/throughput', title: 'Throughput planning', cat: 'Manufacturing' },
  { href: '/wiki/manufacturing/safety-briefing', title: 'Plant safety briefing', cat: 'Manufacturing' },
  { href: '/wiki/products', title: 'Products overview', cat: 'Products' },
  { href: '/wiki/products/stretch-bed', title: 'Stretch Bed', cat: 'Products' },
  { href: '/wiki/products/washing-machine', title: 'Washing Machine', cat: 'Products' },
  { href: '/wiki/community/partner-guide', title: 'Community partner guide', cat: 'Community' },
  { href: '/wiki/community/tracking-model', title: 'Tracking model', cat: 'Community' },
  { href: '/wiki/guides/operations', title: 'Operations playbook', cat: 'Guides' },
  { href: '/wiki/guides/recipient-handover', title: 'Recipient handover script', cat: 'Guides' },
  { href: '/wiki/guides/story-templates', title: 'Story templates', cat: 'Templates' },
  { href: '/wiki/support/faq', title: 'Support FAQ', cat: 'Support' },
];

const TEMPLATES = [
  { title: 'Install checklist (printable)', href: '/admin/install-checklist', detail: 'Per-bed field checklist. ⌘P from the page to print or save as PDF. Filterable by community + batch.' },
  { title: 'Recipient handover script', href: '/wiki/guides/recipient-handover', detail: 'What Goods staff say + do at install. Cultural protocol, scan flow, photo consent.' },
  { title: 'Plant safety briefing', href: '/wiki/manufacturing/safety-briefing', detail: 'PPE, machine hazards, emergency contacts. Read before any new operator\'s first shift.' },
  { title: 'Brand voice + lint rules', href: '/admin/brand', detail: 'Voice violations checker, signature generator.' },
  { title: 'Story templates (wiki)', href: '/wiki/guides/story-templates', detail: 'Patterns for community + funder stories.' },
  { title: 'Funder URL map', code: 'v2/src/lib/data/funder-url-map.ts', detail: 'Per-funder shareable links + reference docs.' },
  { title: 'Funder shared content', code: 'v2/src/lib/data/funder-shared-content.ts', detail: 'TRACTION_STATS, PRODUCT_CARDS, BUYER_PIPELINE.' },
  { title: 'Outreach targets', code: 'v2/src/lib/data/outreach-targets.ts', detail: 'Named contact list with status.' },
  { title: 'Grant content', code: 'v2/src/lib/data/grant-content.ts', detail: 'Boilerplate for grant applications.' },
  { title: 'Press kit', href: '/api/press-kit', detail: 'JSON endpoint of brand assets + stats.', isApi: true },
];

const VIDEOS = [
  { slug: 'hero', name: 'Hero', path: '/video/hero-mobile.mp4', purpose: 'Site-wide background. General mood.' },
  { slug: 'stretch-bed', name: 'Stretch Bed', path: '/video/stretch-bed-mobile.mp4', purpose: 'Used as the temporary setup video on /bed/{id}.' },
  { slug: 'community', name: 'Community', path: '/video/community-mobile.mp4', purpose: 'Community-flavoured background.' },
  { slug: 'building-together', name: 'Building Together', path: '/video/building-together-mobile.mp4', purpose: 'Production team at work.' },
  { slug: 'recycling-plant', name: 'Recycling Plant', path: '/video/recycling-plant-mobile.mp4', purpose: 'Plastic recycling process.' },
  { slug: 'jaquilane-testimony', name: 'Jaquilane Testimony', path: '/video/jaquilane-testimony.mp4', purpose: 'Featured storyteller voice.' },
];

const MISSING_CONTENT = [
  { kind: '🎥 Video', what: '60-second Stretch Bed setup walkthrough', why: 'Currently /bed/{id} falls back to the generic stretch-bed clip. Recipients need a real "here\'s how it goes together" video. Drop file at /public/video/setup-bed-mobile.mp4 + .desktop + poster.', priority: 'high' as const },
  { kind: '🎥 Video', what: 'Canvas wash how-to', why: 'Most common care question. 30s screen-recordable on a real bed. Drop at /public/video/wash-canvas-mobile.mp4.', priority: 'high' as const },
  { kind: '📸 Photo', what: 'Annotated parts photo (replace SVG)', why: 'Built a CSS/SVG-based diagram as a stand-in (works today). Real photo with overlay labels is better — drop at /public/images/parts/stretch-bed-annotated.jpg and import in stretch-bed-svg.tsx.', priority: 'medium' as const },
  { kind: '🎥 Video', what: 'Alice plant tour', why: 'For funders + cooperative-interest leads. 3-5 minute walkthrough.', priority: 'medium' as const },
  { kind: '🎥 Video', what: 'Manufacturing process — plastic shred → press → CNC → assembly', why: 'For wiki/manufacturing/plastic-processing and the funder pages.', priority: 'medium' as const },
  { kind: '🎥 Video', what: 'Damage repair guide', why: 'Pole bend, canvas tear. Cuts support load. 1 min each.', priority: 'medium' as const },
  { kind: '📸 Photo', what: 'Plant floor photos with captions', why: 'Goods staff log shifts but production_shifts.photo_urls is sparse. Surfaces in /bed/{id} Behind-this-bed.', priority: 'medium' as const },
  { kind: '🎥 Video', what: 'Workshop intro: "How to start making beds in your community"', why: 'Co-operative invite tile on /bed/{id} needs a destination.', priority: 'low' as const },
  { kind: '📸 Photo', what: 'Each operator\'s portrait (with opt-in consent)', why: 'For "Meet who made this" when we build the proper attribution flow post-trip.', priority: 'low' as const },
];

export default async function LibraryPage() {
  const supabase = createServiceClient();

  // Live entity counts
  const [
    assetsRes,
    communitiesRes,
    dealsRes,
    productionRes,
    compassionRes,
    bedSignalsRes,
    deployedRes,
    bedAssetsRes,
    machineAssetsRes,
  ] = await Promise.all([
    supabase.from('assets').select('unique_id', { count: 'exact', head: true }),
    supabase.from('communities').select('id', { count: 'exact', head: true }),
    supabase.from('crm_deals').select('id', { count: 'exact', head: true }),
    supabase.from('production_shifts').select('id', { count: 'exact', head: true }),
    supabase.from('compassion_content').select('id', { count: 'exact', head: true }),
    supabase.from('bed_signals').select('id', { count: 'exact', head: true }),
    supabase.from('assets').select('unique_id', { count: 'exact', head: true }).eq('status', 'deployed'),
    supabase.from('assets').select('unique_id', { count: 'exact', head: true }).ilike('product', '%bed%'),
    supabase.from('assets').select('unique_id', { count: 'exact', head: true }).ilike('product', '%machine%'),
  ]);

  // Group communities for quick links
  const { data: communities } = await supabase
    .from('communities')
    .select('id, name, state, status')
    .order('status', { ascending: true })
    .order('name', { ascending: true })
    .limit(50);

  // Recent batches for the asset section
  const { data: batches } = await supabase
    .from('assets')
    .select('notes')
    .ilike('notes', '%Batch %')
    .limit(200);
  const batchSet = new Set<string>();
  for (const a of batches || []) {
    const match = (a.notes as string)?.match(/Batch (\d+)/);
    if (match) batchSet.add(match[1]);
  }
  const recentBatches = Array.from(batchSet).sort((a, b) => Number(b) - Number(a)).slice(0, 6);

  const wikiByCategory: Record<string, typeof WIKI_ARTICLES> = {};
  for (const a of WIKI_ARTICLES) {
    if (!wikiByCategory[a.cat]) wikiByCategory[a.cat] = [];
    wikiByCategory[a.cat].push(a);
  }

  return (
    <div className="px-4 md:px-8 py-6 space-y-8 max-w-6xl mx-auto">
      <header>
        <h1 className="font-display text-2xl font-bold">Library</h1>
        <p className="text-sm text-muted-foreground mt-1">
          One discovery surface for everything we have — entities, templates, guides, pricing, manufacturing, videos.
          And a clear list of what still needs to be made.
        </p>
      </header>

      {/* Counts strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <CountCard label="Communities" count={communitiesRes.count} href="/admin/communities" />
        <CountCard label="Assets" count={assetsRes.count} href="/admin/assets" />
        <CountCard label="Beds" count={bedAssetsRes.count} href="/admin/assets?product=bed" />
        <CountCard label="Machines" count={machineAssetsRes.count} href="/admin/fleet" />
        <CountCard label="Deployed" count={deployedRes.count} href="/admin/assets?status=deployed" />
        <CountCard label="Deals" count={dealsRes.count} href="/admin/deals" />
        <CountCard label="Production shifts" count={productionRes.count} href="/admin/production" />
        <CountCard label="Compassion items" count={compassionRes.count} href="/admin/compassion" />
        <CountCard label="Bed signals" count={bedSignalsRes.count} href="/admin/bed-signals" />
        <CountCard label="Funder pages" count={FUNDER_PAGES.length} href={`/funders/${FUNDER_PAGES[0]?.slug || ''}`} />
        <CountCard label="Wiki articles" count={WIKI_ARTICLES.length} href="/wiki" />
        <CountCard label="Videos" count={VIDEOS.length} href="#videos" />
      </section>

      {/* Permalink patterns */}
      <Section title="Permalinks — how to link to anything" anchor="permalinks">
        <p className="text-sm text-muted-foreground mb-3">
          Every entity has a canonical URL. Copy + paste any of these patterns.
        </p>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <PermalinkRow label="A bed (admin)" pattern="/admin/assets/GB0-156-1" example={`/admin/assets/GB0-156-1`} />
          <PermalinkRow label="A bed (public scan page)" pattern="/bed/GB0-156-1" example={`/bed/GB0-156-1`} />
          <PermalinkRow label="A batch (manifest + print sheet)" pattern="/api/admin/assets/batch/156/manifest" example={`/admin/assets/batch/156`} />
          <PermalinkRow label="A washing machine" pattern="/admin/fleet/{machine_id}" example="/admin/fleet" />
          <PermalinkRow label="A community" pattern="/admin/communities/{id}" example={`/admin/communities/${communities?.[0]?.id || ''}`} />
          <PermalinkRow label="A funder page (public)" pattern="/funders/{slug}" example={`/funders/${FUNDER_PAGES[0]?.slug || ''}`} />
          <PermalinkRow label="A bed's claim page" pattern="/claim/GB0-156-1" example="/claim/GB0-156-1" />
          <PermalinkRow label="Support ticket for a bed" pattern="/support?asset_id=GB0-156-1" example="/support?asset_id=GB0-156-1" />
          <PermalinkRow label="Help chat for a bed" pattern="/portal/ask-goods?asset_id=GB0-156-1" example="/portal/ask-goods?asset_id=GB0-156-1" />
        </div>
      </Section>

      {/* Communities */}
      <Section title={`Communities (${communitiesRes.count || 0})`} anchor="communities">
        <p className="text-sm text-muted-foreground mb-3">
          Every community we know about. Click to drill into demand, deployed beds, stories.
        </p>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {(communities || []).map((c) => (
            <li key={c.id}>
              <Link
                href={`/admin/communities/${c.id}`}
                className="block rounded-lg border bg-card hover:bg-muted/40 px-3 py-2 transition-colors"
              >
                <p className="font-medium truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.state || '—'} · {c.status || '—'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Asset batches */}
      <Section title="Asset batches" anchor="assets">
        <p className="text-sm text-muted-foreground mb-3">
          Each batch has a manifest, QR PNGs, and a printable sticker sheet.
        </p>
        {recentBatches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No batches found.</p>
        ) : (
          <ul className="grid sm:grid-cols-3 gap-2 text-sm">
            {recentBatches.map((batch) => (
              <li key={batch}>
                <Link
                  href={`/admin/assets/batch/${batch}`}
                  className="block rounded-lg border bg-card hover:bg-muted/40 px-3 py-2 transition-colors"
                >
                  <p className="font-mono font-semibold">GB0-{batch}</p>
                  <p className="text-xs text-muted-foreground">
                    manifest · print sheet · QR pack
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 text-xs text-muted-foreground">
          To mint a new batch: copy <code className="bg-muted px-1 rounded">scripts/generate_batch_156.py</code>,
          change <code className="bg-muted px-1 rounded">BATCH</code> + <code className="bg-muted px-1 rounded">COUNT</code>, run.
        </div>
      </Section>

      {/* Funders */}
      <Section title={`Funder pages (${FUNDER_PAGES.length})`} anchor="funders">
        <p className="text-sm text-muted-foreground mb-3">
          Per-funder branded landing pages. Share with their team.
        </p>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {FUNDER_PAGES.map((f) => (
            <li key={f.slug}>
              <Link
                href={`/funders/${f.slug}`}
                target="_blank"
                className="block rounded-lg border bg-card hover:bg-muted/40 px-3 py-2 transition-colors"
              >
                <p className="font-medium truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground truncate">/funders/{f.slug}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Templates */}
      <Section title="Templates" anchor="templates">
        <p className="text-sm text-muted-foreground mb-3">
          Reusable patterns — voice, signature, story shapes, funder URLs.
        </p>
        <ul className="space-y-2 text-sm">
          {TEMPLATES.map((t) => (
            <li key={t.title} className="rounded-lg border bg-card p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.detail}</p>
                  {t.code && <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{t.code}</p>}
                </div>
                {t.href && (
                  <Link
                    href={t.href}
                    target={t.isApi ? '_blank' : undefined}
                    className="text-xs underline hover:text-foreground whitespace-nowrap"
                  >
                    Open
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* How-to guides — wiki */}
      <Section title={`How-to guides — wiki (${WIKI_ARTICLES.length})`} anchor="guides">
        <p className="text-sm text-muted-foreground mb-3">
          Public wiki at <Link href="/wiki" className="underline">/wiki</Link>. Search + browse there. Direct links below.
        </p>
        {Object.entries(wikiByCategory).map(([cat, items]) => (
          <div key={cat} className="mb-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              {cat}
            </p>
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {items.map((a) => (
                <li key={a.href}>
                  <Link
                    href={a.href}
                    target="_blank"
                    className="block rounded-lg border bg-card hover:bg-muted/40 px-3 py-2 transition-colors"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      {/* Pricing / BOM */}
      <Section title="Pricing + Bill of Materials" anchor="pricing">
        <p className="text-sm text-muted-foreground mb-3">
          Canonical Stretch Bed costs + margins. Source:{' '}
          <code className="bg-muted px-1 rounded">v2/src/lib/data/supplier-quotes.ts</code>.
        </p>
        <div className="rounded-2xl border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Component</th>
                <th className="text-left px-4 py-2 font-medium">Qty</th>
                <th className="text-left px-4 py-2 font-medium">Unit cost</th>
                <th className="text-left px-4 py-2 font-medium">Supplier</th>
                <th className="text-right px-4 py-2 font-medium">Line</th>
              </tr>
            </thead>
            <tbody>
              {stretchBedBOM.map((item) => (
                <tr key={item.component} className="border-t">
                  <td className="px-4 py-2 font-medium">{item.component}</td>
                  <td className="px-4 py-2">{item.qty}</td>
                  <td className="px-4 py-2">${item.unitCost.toFixed(2)}</td>
                  <td className="px-4 py-2 text-muted-foreground">{item.supplier}</td>
                  <td className="px-4 py-2 text-right font-mono">${(item.qty * item.unitCost).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="border-t bg-muted/30 font-semibold">
                <td className="px-4 py-2" colSpan={4}>COGS per bed</td>
                <td className="px-4 py-2 text-right font-mono">${stretchBedCOGS.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <PriceCard label="Website price" value="$750" sub={`${supplierSummary.marginPct}% margin · $${supplierSummary.marginAtInstitutional}`} />
          <PriceCard label="Margin / bed" value={`$${supplierSummary.marginAtInstitutional}`} sub={`COGS $${supplierSummary.cogsPerBed}`} />
          <PriceCard label="PICC channel" value="$750" sub="confirm GST" />
          <PriceCard label="Workshop (full kit)" value="$6,000" sub="per workshop" />
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Active supplier quotes: {supplierQuotes.filter((q) => q.status === 'active').length} ·{' '}
          {supplierSummary.localSuppliers} of {supplierSummary.totalSuppliers} suppliers are Alice-Springs-local.
        </p>
      </Section>

      {/* Manufacturing */}
      <Section title="Manufacturing" anchor="manufacturing">
        <p className="text-sm text-muted-foreground mb-3">
          The plant, the process, the shifts. Photos and how-to videos go here.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-2xl border bg-card p-4">
            <p className="font-semibold text-sm">Process documents</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>→ <Link href="/wiki/manufacturing/plastic-processing" className="underline" target="_blank">Plastic processing</Link></li>
              <li>→ <Link href="/wiki/manufacturing/throughput" className="underline" target="_blank">Throughput planning</Link></li>
              <li>→ <Link href="/wiki/manufacturing/facility-manual" className="underline" target="_blank">Facility manual</Link></li>
              <li>→ <Link href="/wiki/manufacturing/machine-specs" className="underline" target="_blank">Machine specs</Link></li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <p className="font-semibold text-sm">Live operations</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>→ <Link href="/admin/production" className="underline">Production journal</Link> ({productionRes.count} shifts)</li>
              <li>→ <Link href="/admin/fleet" className="underline">Fleet diagnostics</Link></li>
              <li>→ <Link href="/admin/compassion" className="underline">Compassion / photo uploads</Link></li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Videos */}
      <Section title={`Videos in /public/video (${VIDEOS.length})`} anchor="videos">
        <p className="text-sm text-muted-foreground mb-3">
          Each video has desktop + mobile + poster variants. Drop in via <code className="bg-muted px-1 rounded">{`<video src="/video/<slug>-mobile.mp4" />`}</code>.
        </p>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {VIDEOS.map((v) => (
            <li key={v.slug} className="rounded-lg border bg-card p-3">
              <p className="font-semibold">{v.name}</p>
              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{v.slug}</p>
              <p className="text-xs text-muted-foreground mt-1">{v.purpose}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Missing content roadmap */}
      <Section title="Missing content — what to film, photograph, or write next" anchor="todo">
        <p className="text-sm text-muted-foreground mb-3">
          Where we still have placeholder text or generic stand-ins. Ordered by priority.
        </p>
        <ul className="space-y-2">
          {MISSING_CONTENT.sort((a, b) => {
            const order = { high: 0, medium: 1, low: 2 } as const;
            return order[a.priority] - order[b.priority];
          }).map((m, idx) => (
            <li
              key={idx}
              className={`rounded-lg border p-3 ${
                m.priority === 'high'
                  ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900'
                  : 'bg-card'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{m.kind.split(' ')[0]}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {m.what}
                    <span
                      className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        m.priority === 'high'
                          ? 'bg-red-100 text-red-900'
                          : m.priority === 'medium'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-900'
                      }`}
                    >
                      {m.priority}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{m.why}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-3">
          When something is shot or written, drop the file in <code className="bg-muted px-1 rounded">v2/public/video/</code>{' '}
          or <code className="bg-muted px-1 rounded">wiki/articles/</code> and wire it into the relevant component.
        </p>
      </Section>
    </div>
  );
}

function CountCard({ label, count, href }: { label: string; count: number | null; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border bg-card hover:bg-muted/40 transition-colors p-4 block"
    >
      <p className="text-2xl font-bold tabular-nums">{count ?? 0}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </Link>
  );
}

function PriceCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function PermalinkRow({ label, pattern, example }: { label: string; pattern: string; example: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xs font-mono mt-1">{pattern}</p>
      <Link href={example} className="text-xs underline hover:text-foreground mt-1 inline-block" target="_blank">
        Try: {example}
      </Link>
    </div>
  );
}

function Section({
  title,
  anchor,
  children,
}: {
  title: string;
  anchor: string;
  children: React.ReactNode;
}) {
  return (
    <section id={anchor} className="scroll-mt-4">
      <h2 className="font-display text-xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}
