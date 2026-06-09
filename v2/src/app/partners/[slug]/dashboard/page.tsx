import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPartnerDashboard } from '@/lib/data/partner-dashboards';
import { getAssetStats } from '@/lib/data/impact-fetcher';

// Always live: read the asset register fresh each request.
export const dynamic = 'force-dynamic';

const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getPartnerDashboard(slug);
  return {
    title: p ? `${p.partnerName} — Goods on Country partner dashboard` : 'Partner dashboard',
    robots: { index: false, follow: false },
  };
}

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
      <p className="font-display text-3xl sm:text-4xl leading-none mb-2" style={{ color: RUST }}>{value}</p>
      <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>{label}</p>
      {sub ? <p className="text-xs mt-1" style={{ color: `${CHARCOAL}99` }}>{sub}</p> : null}
    </div>
  );
}

export default async function PartnerDashboardPage({ params }: Props) {
  const { slug } = await params;
  const partner = getPartnerDashboard(slug);
  if (!partner) notFound();

  // Live metrics from the asset register.
  let stats: Awaited<ReturnType<typeof getAssetStats>> | null = null;
  try {
    stats = await getAssetStats();
  } catch {
    stats = null;
  }

  const beds = stats ? stats.totalBeds.toLocaleString() : '—';
  const communities = stats ? String(stats.communitiesServed) : '—';
  // Plastic = STRETCH beds only (recycled HDPE), ~20 kg each.
  const plasticT = stats ? `${((stats.stretchBedsDeployed * 20) / 1000).toFixed(2)} t` : '—';
  const washers = stats ? `${stats.washersWorking} / ${stats.washersDeployed}` : '—';
  const communityList = stats
    ? stats.communityBreakdown
        .map((c) => c.community)
        .filter((c) => c && c !== 'Unknown' && c !== 'Pending Delivery')
    : [];

  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      <section className="px-5 sm:px-8 pt-12 sm:pt-16 pb-10 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <Link href="/" className="inline-flex flex-col leading-none">
            <span className="font-display text-3xl sm:text-4xl" style={{ color: CHARCOAL }}>Goods</span>
            <span className="text-[10px] sm:text-xs uppercase mt-1" style={{ color: `${CHARCOAL}99` }}>On Country · Partner dashboard</span>
          </Link>
          <div className="rounded-lg bg-white px-4 py-3 shadow-sm" style={{ border: '1px solid #E8DED4' }}>
            <Image src="/images/partners/snow-foundation.png" alt={partner.partnerName} width={400} height={160} priority className="h-12 w-auto" />
          </div>
        </div>

        <p className="text-xs uppercase mb-4" style={{ color: RUST }}>{partner.partnerName}</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] mb-5" style={{ color: CHARCOAL }}>{partner.heroLine}</h1>
        <p className="text-base sm:text-lg leading-relaxed max-w-3xl" style={{ color: `${CHARCOAL}cc` }}>{partner.intro}</p>
      </section>

      {/* Live trajectory */}
      <section className="px-5 sm:px-8 pb-14 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: SAGE }} />
          <p className="text-xs uppercase" style={{ color: RUST }}>The trajectory, live from the field</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Stat value={beds} label="Beds in community" sub={stats ? `${stats.stretchBedsDeployed} recycled-plastic Stretch Beds` : undefined} />
          <Stat value={communities} label="Communities" />
          <Stat value={plasticT} label="Plastic diverted" sub="~20 kg per Stretch Bed" />
          <Stat value={washers} label="Washing machines" sub="live / deployed" />
          <Stat value={partner.facilities.value} label="Production facilities" sub={partner.facilities.note} />
        </div>
        {communityList.length > 0 ? (
          <p className="text-sm mt-4 leading-relaxed" style={{ color: `${CHARCOAL}b3` }}>
            <span className="font-semibold" style={{ color: CHARCOAL }}>The {communityList.length} communities: </span>
            {communityList.join('  ·  ')}
          </p>
        ) : null}
        <p className="text-xs mt-3" style={{ color: `${CHARCOAL}80` }}>
          Beds, communities, plastic (Stretch Beds only) and washing machines read live from the Goods asset register. Production facilities are a curated count.
        </p>
      </section>

      {/* Kanban: what we're working towards */}
      <section className="px-5 sm:px-8 py-14" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase mb-6" style={{ color: RUST }}>What we are working towards</p>
          <div className="grid md:grid-cols-3 gap-4">
            {partner.kanban.map((col) => (
              <div key={col.heading} className="rounded-lg p-5" style={{ backgroundColor: CREAM, border: '1px solid #E8DED4' }}>
                <p className="text-sm font-semibold uppercase mb-4" style={{ color: SAGE }}>{col.heading}</p>
                <ul className="space-y-3">
                  {col.items.map((it) => (
                    <li key={it.title}>
                      <p className="text-sm font-medium leading-snug" style={{ color: CHARCOAL }}>{it.title}</p>
                      {it.note ? <p className="text-xs mt-0.5" style={{ color: `${CHARCOAL}99` }}>{it.note}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement history */}
      <section className="px-5 sm:px-8 py-14 max-w-3xl mx-auto">
        <p className="text-xs uppercase mb-6" style={{ color: RUST }}>Where we have come from, and where we are going</p>
        <ol className="relative border-l pl-6 space-y-7" style={{ borderColor: '#E8DED4' }}>
          {partner.history.map((h) => (
            <li key={h.date + h.title} className="relative">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full" style={{ backgroundColor: RUST }} />
              <p className="text-xs uppercase mb-1" style={{ color: SAGE }}>{h.date}</p>
              <p className="text-base font-medium" style={{ color: CHARCOAL }}>{h.title}</p>
              {h.detail ? <p className="text-sm mt-1 leading-relaxed" style={{ color: `${CHARCOAL}bf` }}>{h.detail}</p> : null}
            </li>
          ))}
        </ol>
      </section>

      {/* Photo gallery */}
      {partner.gallery.length > 0 ? (
        <section className="px-5 sm:px-8 py-14" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="max-w-5xl mx-auto">
            <p className="text-xs uppercase mb-6" style={{ color: RUST }}>From the field</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {partner.gallery.map((g) => (
                <figure key={g.src} className="overflow-hidden rounded-lg bg-white" style={{ border: '1px solid #E8DED4' }}>
                  <div className="relative aspect-[4/3]">
                    <Image src={g.src} alt={g.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 320px" />
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Traffic / airport */}
      <section className="px-5 sm:px-8 py-14" style={{ backgroundColor: CREAM }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase mb-3" style={{ color: RUST }}>Out in the world</p>
          <p className="text-base leading-relaxed max-w-2xl mb-6" style={{ color: `${CHARCOAL}cc` }}>{partner.traffic.intro}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {partner.traffic.snapshots.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} sub={s.note} />
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: `${CHARCOAL}80` }}>{partner.traffic.asOf}</p>
          {partner.traffic.reactions.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {partner.traffic.reactions.map((r) => (
                <a key={r.href} href={r.href} className="text-sm underline" style={{ color: RUST }}>{r.label}</a>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Links */}
      <section className="px-5 sm:px-8 py-14 max-w-5xl mx-auto">
        <p className="text-xs uppercase mb-6" style={{ color: RUST }}>Go deeper</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {partner.links.map((l) => {
            const inner = (
              <>
                <p className="text-base font-medium" style={{ color: CHARCOAL }}>{l.label} →</p>
                {l.note ? <p className="text-sm mt-1" style={{ color: `${CHARCOAL}99` }}>{l.note}</p> : null}
              </>
            );
            const cls = 'block rounded-lg p-5 transition hover:opacity-90';
            const style = { backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' };
            return l.external ? (
              <a key={l.href} href={l.href} className={cls} style={style}>{inner}</a>
            ) : (
              <Link key={l.href} href={l.href} className={cls} style={style}>{inner}</Link>
            );
          })}
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12 text-center max-w-3xl mx-auto">
        <p className="text-sm leading-relaxed" style={{ color: `${CHARCOAL}bf` }}>
          Goods on Country acknowledges the Traditional Owners of the lands on which we work, and pays respect to
          Elders past, present and emerging. This work is done on country, with country, for country.
        </p>
      </section>
    </main>
  );
}
