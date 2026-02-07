'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Image from 'next/image';
import { story, communityPartnerships, investmentCase } from '@/lib/data/content';
import { media } from '@/lib/data/media';

export default function PitchDocumentPage() {
  // Hide site chrome (header, footer, impact banner, cart) on this page
  useEffect(() => {
    document.body.classList.add('pitch-document-mode');
    return () => document.body.classList.remove('pitch-document-mode');
  }, []);

  return (
    <>
      {/* Styles to hide site chrome and format for print */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .pitch-document-mode header,
            .pitch-document-mode footer,
            .pitch-document-mode [data-impact-banner],
            .pitch-document-mode .flex.min-h-screen.flex-col > div:first-child,
            .pitch-document-mode .flex.min-h-screen.flex-col > :not(main) {
              display: none !important;
            }
            .pitch-document-mode main {
              flex: unset !important;
            }
            .pitch-document-mode .flex.min-h-screen.flex-col {
              min-height: unset !important;
              display: block !important;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print { display: none !important; }
              .page-break { page-break-before: always; }
              .avoid-break { page-break-inside: avoid; }
              @page { margin: 1.5cm 2cm; size: A4; }
            }
          `,
        }}
      />

      {/* Print / download bar — hidden in print */}
      <div className="no-print sticky top-0 z-50 bg-neutral-900 text-white">
        <div className="max-w-[210mm] mx-auto px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/pitch" className="text-sm text-white/60 hover:text-white transition-colors">
              &larr; Back to pitch
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-sm text-white/40">Shareable document &middot; Save as PDF via print</span>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Save as PDF
          </button>
        </div>
      </div>

      {/* Document body — A4 proportions */}
      <article className="max-w-[210mm] mx-auto bg-white text-black" style={{ fontFamily: 'var(--font-inter, system-ui, sans-serif)' }}>

        {/* ================================================================
            COVER PAGE
            ================================================================ */}
        <section className="px-12 pt-20 pb-16 min-h-[90vh] flex flex-col justify-between print:min-h-[270mm]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-2">
              A Curious Tractor
            </p>
            <p className="text-xs text-neutral-400 mb-16">
              Investment Proposal &middot; Q1 2026
            </p>

            <h1
              className="text-4xl md:text-5xl font-light leading-tight text-black mb-8 max-w-lg"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              {investmentCase.headline}
            </h1>

            <p className="text-lg text-neutral-600 max-w-lg leading-relaxed mb-12">
              Beds, washing machines, and essential goods designed with communities,
              manufactured on country, and eventually owned by them.
            </p>

            <div className="inline-block border-l-4 border-black pl-4">
              <p className="text-sm font-medium text-black">Total investment sought</p>
              <p className="text-3xl font-bold text-black">{investmentCase.totalAsk}</p>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6 mt-auto">
            <div className="grid grid-cols-2 gap-8 text-xs text-neutral-500">
              <div>
                <p className="font-medium text-black mb-1">A Curious Tractor</p>
                <p>Nicholas Marchesi, Founder</p>
                <p>hi@act.place</p>
              </div>
              <div>
                <p className="font-medium text-black mb-1">Partners</p>
                <p>Snow Foundation &middot; The Funding Network</p>
                <p>Centre Corp Foundation</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            PAGE 2: THE PROBLEM
            ================================================================ */}
        <section className="page-break px-12 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-6">
            01 &mdash; The Problem
          </p>
          <h2
            className="text-3xl font-light text-black mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            A failure of infrastructure, not culture
          </h2>
          <p className="text-base text-neutral-600 mb-10 max-w-2xl leading-relaxed">
            {story.problem.description}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-12">
            {story.problem.stats.map((stat) => (
              <div key={stat.label} className="avoid-break border-l-2 border-neutral-200 pl-4 py-2">
                <p className="text-2xl font-bold text-black">{stat.value}</p>
                <p className="text-sm text-neutral-600">{stat.label}</p>
                {stat.source && <p className="text-xs text-neutral-400 mt-0.5">{stat.source}</p>}
              </div>
            ))}
          </div>

          <div className="avoid-break bg-neutral-50 rounded-lg p-6 border border-neutral-100">
            <p className="text-2xl font-bold text-black mb-2">$3M / year</p>
            <p className="text-sm text-neutral-600">
              One Alice Springs provider sells $3 million of washing machines annually into communities &mdash; most
              ending up in dumps. Our solution: a &ldquo;virus&rdquo; of better products people choose first.
            </p>
          </div>
        </section>

        {/* ================================================================
            PAGE 3: DEMAND EVIDENCE
            ================================================================ */}
        <section className="page-break px-12 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-6">
            02 &mdash; Evidence of Demand
          </p>
          <h2
            className="text-3xl font-light text-black mb-2"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            200&ndash;350 beds requested
          </h2>
          <p className="text-base text-neutral-500 mb-10">
            Organic demand from communities and health organisations &mdash; not manufactured need.
          </p>

          <div className="space-y-6">
            {investmentCase.demand.map((item, i) => (
              <div key={i} className="avoid-break flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm text-black leading-relaxed">{item.text}</p>
                  <p className="text-xs text-neutral-400 mt-1">{item.person}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            PAGE 4: THE PRODUCT
            ================================================================ */}
        <section className="page-break px-12 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-6">
            03 &mdash; The Product
          </p>
          <h2
            className="text-3xl font-light text-black mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            The Stretch Bed
          </h2>
          <p className="text-base text-neutral-600 mb-8 max-w-2xl leading-relaxed">
            Recycled HDPE plastic legs, galvanised steel poles, heavy-duty Australian canvas. At just 20kg, carried by one person,
            supports 200kg, and lasts 5+ years in remote conditions. Works inside and outside.
          </p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-10">
            {[
              '20kg — carried by one person',
              '200kg load capacity',
              '5-minute assembly, no tools',
              '14kg plastic diverted per bed',
              'Cleanable, movable, works outside',
              'Colours matched to community choice',
            ].map((feature) => (
              <div key={feature} className="avoid-break flex items-start gap-2 text-sm text-black">
                <span className="text-neutral-400 mt-0.5">&#10003;</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="border border-neutral-200 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-black">$600</p>
              <p className="text-xs text-neutral-500">Production cost</p>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-black">$850</p>
              <p className="text-xs text-neutral-500">Sponsored</p>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-black">$1,200</p>
              <p className="text-xs text-neutral-500">Retail</p>
            </div>
          </div>

          {/* Product photo — /public/images/product/stretch-bed-hero.jpg */}
          {media.product.stretchBedHero ? (
            <div className="aspect-video rounded-lg overflow-hidden relative">
              <Image src={media.product.stretchBedHero} alt="The Stretch Bed" fill className="object-cover" sizes="600px" />
            </div>
          ) : (
            <div className="aspect-video bg-neutral-100 rounded-lg flex items-center justify-center border border-neutral-200">
              <p className="text-xs text-neutral-400">[ Product photo ]</p>
            </div>
          )}
        </section>

        {/* ================================================================
            PAGE 5: THE MODEL + PRODUCTION
            ================================================================ */}
        <section className="page-break px-12 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-6">
            04 &mdash; The Model
          </p>
          <h2
            className="text-3xl font-light text-black mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Commerce, not charity
          </h2>
          <p className="text-base text-neutral-600 mb-10 max-w-2xl leading-relaxed">
            Products can be Aboriginal owned and controlled while sold commercially.
            No need for a separate &ldquo;Goods charity&rdquo; &mdash; leverage existing
            strong community organisations.
          </p>

          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="avoid-break text-center border border-neutral-200 rounded-lg p-6">
              <p className="text-4xl font-bold text-black mb-1">100%</p>
              <p className="text-sm text-neutral-600">community ownership is the goal</p>
            </div>
            <div className="avoid-break text-center border border-neutral-200 rounded-lg p-6">
              <p className="text-4xl font-bold text-black mb-1">$0</p>
              <p className="text-sm text-neutral-600">licensing fees &mdash; communities keep everything</p>
            </div>
          </div>

          <blockquote className="border-l-4 border-black pl-4 mb-12">
            <p
              className="text-lg italic text-neutral-600"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              &ldquo;Our job is to become unnecessary.&rdquo;
            </p>
          </blockquote>

          {/* Production plant */}
          <h3 className="text-lg font-semibold text-black mb-4">
            Containerised Production Plant
          </h3>
          <p className="text-sm text-neutral-600 mb-6 max-w-xl">
            Not a sunk cost &mdash; it&rsquo;s an impact asset. The facility is portable,
            community-deployable, and generates revenue.
          </p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6">
            {investmentCase.productionPlant.capabilities.map((cap) => (
              <div key={cap} className="avoid-break flex items-start gap-2 text-sm text-black">
                <span className="text-neutral-400 mt-0.5">&#10003;</span>
                <span>{cap}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-neutral-50 rounded-lg p-3 text-center border border-neutral-100">
              <p className="font-bold text-black">~30 beds/week</p>
              <p className="text-xs text-neutral-500">Capacity</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3 text-center border border-neutral-100">
              <p className="font-bold text-black">14kg plastic</p>
              <p className="text-xs text-neutral-500">Diverted per bed</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3 text-center border border-neutral-100">
              <p className="font-bold text-black">~$100K invested</p>
              <p className="text-xs text-neutral-500">TFN + ACT</p>
            </div>
          </div>
        </section>

        {/* ================================================================
            PAGE 6: PARTNERSHIPS
            ================================================================ */}
        <section className="page-break px-12 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-6">
            05 &mdash; Co-Design Partnerships
          </p>
          <h2
            className="text-3xl font-light text-black mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Built with communities, not for them
          </h2>
          <p className="text-base text-neutral-600 mb-10 max-w-2xl leading-relaxed">
            Community members are co-designers, not recipients. Partnerships are resourced,
            reciprocal, and on community terms.
          </p>

          <div className="space-y-5 mb-12">
            {communityPartnerships.map((p) => (
              <div key={p.id} className="avoid-break border border-neutral-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-semibold text-black">{p.name}</h3>
                    <p className="text-xs text-neutral-400">{p.region}</p>
                  </div>
                  {p.bedsDelivered > 0 && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-black">{p.bedsDelivered}</p>
                      <p className="text-xs text-neutral-400">beds</p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-neutral-600 mb-2">{p.headline}</p>
                <div className="flex flex-wrap gap-1">
                  {p.keyPeople.map((person) => (
                    <span key={person} className="inline-block text-xs bg-neutral-100 text-neutral-600 rounded px-2 py-0.5">
                      {person}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-base font-semibold text-black mb-4">Partners Under Development</h3>
          <div className="grid grid-cols-2 gap-4">
            {investmentCase.partnerships.map((p) => (
              <div key={p.name} className="avoid-break border border-neutral-100 rounded-lg p-4">
                <p className="text-sm font-medium text-black">{p.name}</p>
                <p className="text-xs text-neutral-400 mb-1">{p.role}</p>
                <p className="text-xs text-neutral-600">{p.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            PAGE 7: RISKS & MITIGATIONS
            ================================================================ */}
        <section className="page-break px-12 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-6">
            06 &mdash; Risks &amp; Mitigations
          </p>
          <h2
            className="text-3xl font-light text-black mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Eyes wide open
          </h2>
          <p className="text-base text-neutral-600 mb-10 max-w-2xl">
            We take a measured approach to scale. These are the risks we&rsquo;re actively managing.
          </p>

          <div className="space-y-5">
            {investmentCase.risks.map((r, i) => (
              <div key={i} className="avoid-break border border-neutral-200 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-black mb-1">{r.risk}</h3>
                <p className="text-xs text-neutral-500 mb-3">{r.detail}</p>
                <div className="bg-neutral-50 rounded p-3 border border-neutral-100">
                  <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1">Mitigation</p>
                  <p className="text-xs text-neutral-700 leading-relaxed">{r.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            PAGE 8: TIMELINE + THE ASK
            ================================================================ */}
        <section className="page-break px-12 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-6">
            07 &mdash; Timeline
          </p>
          <h2
            className="text-3xl font-light text-black mb-10"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            From 15 beds to 1,000
          </h2>

          <div className="space-y-8 mb-16">
            {investmentCase.timeline.map((phase, i) => (
              <div key={i} className="avoid-break flex gap-4">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-black mb-2">{phase.period}</h3>
                  <ul className="space-y-1">
                    {phase.items.map((item, j) => (
                      <li key={j} className="text-sm text-neutral-600 flex items-start gap-2">
                        <span className="text-neutral-400 mt-0.5">&#10003;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* THE ASK */}
          <div className="border-t-2 border-black pt-10">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-6">
              08 &mdash; The Investment
            </p>
            <h2
              className="text-3xl font-light text-black mb-8"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              {investmentCase.totalAsk}
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-10">
              {investmentCase.fundingLines.map((line) => (
                <div key={line.id} className="avoid-break border border-neutral-200 rounded-lg p-5">
                  <p className="text-2xl font-bold text-black mb-1">{line.amount}</p>
                  <h3 className="text-sm font-semibold text-black mb-2">{line.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{line.description}</p>
                </div>
              ))}
            </div>

            {/* Funders */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">Current Supporters</h3>
                <div className="space-y-2">
                  {investmentCase.funders.map((f) => (
                    <div key={f.name} className="text-sm">
                      <span className="font-medium text-black">{f.name}</span>
                      <span className="text-neutral-400"> &middot; {f.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">Exploring</h3>
                <div className="space-y-2">
                  {investmentCase.potentialFunders.map((f) => (
                    <div key={f.name} className="text-sm">
                      <span className="font-medium text-black">{f.name}</span>
                      <span className="text-neutral-400"> &mdash; {f.focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Closing */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 text-center">
              <p
                className="text-xl font-light text-black mb-3"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                We&rsquo;re not just building beds.
              </p>
              <p className="text-sm text-neutral-600 max-w-lg mx-auto mb-4 leading-relaxed">
                We&rsquo;re building a model where First Nations communities have the tools
                to manufacture durable, desirable products from their own waste streams &mdash;
                creating jobs and pride while displacing the disposable furniture cycle
                that fills community dumps.
              </p>
              <p className="text-sm font-medium text-black">hi@act.place</p>
            </div>
          </div>
        </section>

      </article>
    </>
  );
}
