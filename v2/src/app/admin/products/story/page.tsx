import Link from 'next/link';
import { GOODS_STORY } from '@/lib/data/product-wiki';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { ArrowLeft, Play } from 'lucide-react';

export const dynamic = 'force-static';

export default function GoodsStoryPage() {
  return (
    <div className="max-w-[900px] mx-auto pb-20">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Products &amp; Plant
      </Link>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden border mb-8" style={{ aspectRatio: '16 / 7' }}>
        <video autoPlay muted loop playsInline poster="/video/hero-poster.jpg" className="absolute inset-0 h-full w-full object-cover">
          <source src="/video/hero-desktop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,17,12,0.92) 0%, rgba(20,17,12,0.3) 50%, rgba(20,17,12,0.1) 100%)' }} />
        <div className="absolute bottom-0 left-0 p-8">
          <p className="text-[13px] font-semibold text-white/70 mb-1">The full story of Goods on Country</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>What does it take to make an essential good that lasts?</h1>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-2xl space-y-4 mb-6">
        {GOODS_STORY.intro.map((para, i) => (
          <p key={i} className={i === 0 ? 'text-xl leading-relaxed text-foreground' : 'text-[16px] leading-relaxed text-muted-foreground'}>{para}</p>
        ))}
      </div>

      {/* Canon strip */}
      <div className="flex flex-wrap gap-x-8 gap-y-2 rounded-2xl border bg-card px-6 py-4 mb-12">
        {[
          [String(CANONICAL_ASSETS.bedsDeployed), 'beds delivered'],
          [String(CANONICAL_ASSETS.stretchBedsDeployed), 'Stretch Beds'],
          [String(CANONICAL_ASSETS.washersInCommunity), 'washing machines'],
          [String(CANONICAL_ASSETS.communitiesServed), 'communities'],
          [`${CANONICAL_ASSETS.plasticKg.toLocaleString()}kg`, 'HDPE diverted'],
        ].map(([n, l]) => (
          <div key={l}>
            <div className="font-display text-2xl font-bold tabular-nums" style={{ fontFamily: 'Georgia, serif' }}>{n}</div>
            <div className="text-[11px] text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>

      {/* Sections */}
      <article className="space-y-14">
        {GOODS_STORY.sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-8">
            <h2 className="font-display text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>{s.heading}</h2>
            {(s.image || s.video) && (
              <div className="relative rounded-2xl overflow-hidden border mb-5" style={{ aspectRatio: '16 / 9' }}>
                {s.video ? (
                  <>
                    <video muted loop playsInline controls poster={s.videoPoster} className="absolute inset-0 h-full w-full object-cover">
                      <source src={s.video} type="video/mp4" />
                    </video>
                    <div className="pointer-events-none absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  </>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image} alt={s.heading} className="absolute inset-0 h-full w-full object-cover" />
                )}
              </div>
            )}
            <div className="max-w-2xl space-y-4">
              {s.body.map((para, i) => (
                <p key={i} className="text-[16px] leading-relaxed text-muted-foreground">{para}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {/* The story in one sentence */}
      <section className="mt-16 rounded-3xl bg-primary/10 p-8">
        <div className="text-[10.5px] font-bold uppercase tracking-widest text-primary mb-3">The story in one sentence</div>
        <p className="font-display text-2xl leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{GOODS_STORY.oneSentence}</p>
      </section>

      <p className="mt-8 text-xs text-muted-foreground max-w-2xl">
        Narrative drawn from the Goods project history and compendium. Every figure held to the current
        register canon, not the older numbers the source history was written against. Health language stays
        inside the evidence ceiling: Goods explains the environmental-health rationale but never claims a bed prevents disease.
      </p>
    </div>
  );
}
