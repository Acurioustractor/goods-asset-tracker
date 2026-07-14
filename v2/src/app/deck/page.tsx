'use client';

/**
 * Goods on Country — investor deck.
 *
 * A keyboard-navigable slide deck built to send the same day a funder call ends.
 * Structure borrows the discipline of the decks that actually worked (Airbnb's
 * one-line clarity, LinkedIn's open-with-the-thesis, Uber's why-now, Buffer's
 * traction-forward order, a grown-up risks slide): one clear claim per slide,
 * proof directly under it, canon numbers only, every claim labelled.
 *
 * Canon: numbers come from CANONICAL_ASSETS (asset-canonical.ts). The claim
 * ceiling — scabies→RHD is the *why*, never a claimed outcome; demand is
 * interest, not committed revenue; the in-source cost-down is modelled, not yet
 * measured — is baked into the copy. Do not raise a claim past its label.
 */

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CANONICAL_ASSETS as A } from '@/lib/data/asset-canonical';

const display = { fontFamily: 'var(--font-display, Georgia, serif)' } as const;

/* ---------- shared primitives ------------------------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-primary font-medium mb-5">
      {children}
    </p>
  );
}

type LabelKind = 'verified' | 'modelled' | 'interest' | 'future';
const LABEL_STYLES: Record<LabelKind, string> = {
  verified: 'bg-accent/20 text-accent-foreground border-accent/40',
  modelled: 'border-[color:var(--goods-gold)]/50 text-[color:var(--goods-gold)] bg-[color:var(--goods-gold)]/10',
  interest: 'border-[color:var(--goods-clay)]/50 text-[color:var(--goods-clay)] bg-[color:var(--goods-clay)]/10',
  future: 'border-[color:var(--goods-teal)]/50 text-[color:var(--goods-teal)] bg-[color:var(--goods-teal)]/10',
};
function Tag({ kind, children }: { kind: LabelKind; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-medium ${LABEL_STYLES[kind]}`}
    >
      {children}
    </span>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground" style={display}>
        {value}
      </div>
      <div className="mt-1 text-xs sm:text-sm text-muted-foreground leading-snug">{label}</div>
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-12">
      {children}
    </div>
  );
}

/* Canonical media-pack photography (cleared for external use). */
const PHOTO = {
  cover: '/images/media-pack/lying-on-stretch-bed.jpg',
  product: '/images/media-pack/thumbs-up-stretch-bed.jpg',
  community: '/images/media-pack/community-testing-bed-golden-hour.jpg',
  team: '/images/media-pack/nic-with-elder-on-verandah.jpg',
} as const;

/* Rounded, object-cover photo with an optional cleared-voice caption. */
function Photo({ src, alt, caption, who }: { src: string; alt: string; caption?: string; who?: string }) {
  return (
    <figure className="m-0 flex h-full flex-col gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="min-h-0 w-full flex-1 rounded-xl object-cover" />
      {caption && (
        <figcaption className="text-sm italic leading-relaxed text-muted-foreground">
          &ldquo;{caption}&rdquo;
          {who && <span className="mt-1 block text-xs not-italic text-muted-foreground/80">{who}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/* ---------- the slides -------------------------------------------------- */

const SLIDES: { id: string; render: () => React.ReactNode }[] = [
  /* 01 — Cover: remove all confusion in five seconds */
  {
    id: 'cover',
    render: () => (
      <div className="relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PHOTO.cover}
          alt="A young man lying full-length on a Stretch Bed on Country, the recycled-plastic X-trestle legs and canvas visible"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/60 to-black/25" />
        <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col justify-end px-6 pb-16 pt-20 sm:px-12 sm:pb-24">
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.25em] text-[color:var(--goods-terracotta)] sm:text-xs">
            Goods on Country · Investor brief · 2026
          </p>
          <h1 className="max-w-4xl text-4xl font-light leading-[1.05] text-white sm:text-6xl lg:text-7xl" style={display}>
            We press recycled-plastic beds{' '}
            <span className="text-[color:var(--goods-terracotta)]">On Country</span>, and build the factory so community owns it.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            A good bed is health hardware, not furniture. Goods turns local plastic waste into durable,
            washable beds — and hands the means of making them to the communities that need them.
          </p>
          <p className="mt-8 text-sm text-white/70">
            Raising <span className="font-medium text-white">AU$400,000</span> in catalytic capital
            that converts into community ownership.
          </p>
        </div>
      </div>
    ),
  },

  /* 02 — Problem: three human pains, lived not researched */
  {
    id: 'problem',
    render: () => (
      <Frame>
        <Eyebrow>The problem</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          Thousands of people in remote Australia sleep on the floor tonight.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              h: 'The freight tax',
              p: '"You can’t just go down to the store and buy beds. It’s a big muck-around. You have to bring them on the barge, pay for freight, and still, not everyone gets one."',
              who: 'Alfred Johnson, Palm Island',
            },
            {
              h: 'Beds that fail in months',
              p: 'Furniture freighted into community is built for suburbs. It breaks, it can’t be washed, and the real remote cost is buying it again and again.',
              who: 'The pattern across communities',
            },
            {
              h: 'Sleep you can’t clean',
              p: 'Off-the-ground, washable sleep supports the conditions needed to interrupt the scabies→rheumatic-heart-disease pathway. This is the why — not a claimed outcome.',
              who: 'Health rationale',
            },
          ].map((c) => (
            <div key={c.h} className="border-t border-border pt-4">
              <h3 className="text-lg font-medium text-foreground">{c.h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.p}</p>
              <p className="mt-3 text-xs italic text-muted-foreground">{c.who}</p>
            </div>
          ))}
        </div>
      </Frame>
    ),
  },

  /* 03 — Current workaround: show the ugly way it's solved today */
  {
    id: 'workaround',
    render: () => (
      <Frame>
        <Eyebrow>How it&rsquo;s solved today — badly</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          The current answer is charity drops and freighted goods that end up in the dump.
        </h2>
        <div className="mt-10 space-y-5">
          {[
            ['One Alice Springs supplier', 'sells ~AU$3M of washing machines into remote communities a year — most reach the dump within months.'],
            ['Bed drops & hardship grants', 'move product once, leave no jobs, no ownership, and no way to fix or replace it locally.'],
            ['Do nothing', 'means the floor, a couch, or a mattress on the ground — the workaround most people are living with right now.'],
          ].map(([h, p]) => (
            <div key={h} className="flex gap-4 border-l-2 border-primary/40 pl-4">
              <div className="min-w-0">
                <span className="font-medium text-foreground">{h}</span>{' '}
                <span className="text-muted-foreground">{p}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-sm text-muted-foreground">
          The demand is already proven — it&rsquo;s just being met by things that don&rsquo;t last and money that
          leaves the community.
        </p>
      </Frame>
    ),
  },

  /* 04 — Solution: the magic in three steps */
  {
    id: 'solution',
    render: () => (
      <Frame>
        <Eyebrow>The Stretch Bed</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          Collect the plastic. Press the parts. Build a bed that lasts a decade.
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            {[
              ['1 · Recycled HDPE legs', 'Two crossed-plank X-trestles pressed On Country from 20kg of diverted plastic.'],
              ['2 · Two steel poles', 'Galvanised poles thread through the leg holes and the canvas sleeves.'],
              ['3 · Structural canvas', 'Tensioning the canvas braces the frame — no tools, ~5 minutes, it won’t stand without it.'],
            ].map(([h, p]) => (
              <div key={h} className="border-l-2 border-primary/40 pl-4">
                <h3 className="text-base font-medium text-foreground">{h}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p}</p>
              </div>
            ))}
            <div className="mt-1 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span><span className="font-medium text-foreground">200kg</span> capacity</span>
              <span><span className="font-medium text-foreground">26kg</span>, flat-packable</span>
              <span><span className="font-medium text-foreground">10+ year</span> life</span>
              <span><span className="font-medium text-foreground">20kg</span> plastic / bed</span>
            </div>
          </div>
          <Photo
            src={PHOTO.product}
            alt="A young man sitting on a Stretch Bed, thumbs up, the speckled recycled-plastic X-trestle legs and canvas clearly visible"
            caption="Having a bed is something you need; you feel more safe when you sleep in a bed. It’s different than sleeping on the couch or the ground."
            who="Alfred Johnson, Palm Island"
          />
        </div>
        <p className="mt-6 max-w-2xl text-base text-foreground">
          The magic isn&rsquo;t the bed. It&rsquo;s that <span className="text-primary">the making belongs On Country</span> — the
          plant can move to community ownership.
        </p>
      </Frame>
    ),
  },

  /* 05 — Traction: strongest proof, moved up (Buffer) */
  {
    id: 'traction',
    render: () => (
      <Frame>
        <div className="flex items-center gap-3">
          <Eyebrow>Traction — in the field, today</Eyebrow>
        </div>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          Already deployed, already wanted.
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <Stat value={`${A.bedsDeployed}`} label="beds deployed" />
          <Stat value={`${A.communitiesServed}`} label="communities served" />
          <Stat value={`${A.washersInCommunity}`} label="washing machines in community" />
          <Stat value={`${A.plasticKg.toLocaleString()}kg`} label="plastic diverted" />
        </div>
        <div className="mt-4">
          <Tag kind="verified">Verified · canon, reconciled 2026-05-30</Tag>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-muted p-5">
              <p className="text-sm leading-relaxed text-foreground">
                <span className="font-medium">200–350 bed requests logged.</span> Elder Dianne Stokes asked for 20
                more and offered to self-fund. PICC offered to buy a plant outright. Centrecorp funded a 107-bed
                deployment.
              </p>
              <div className="mt-3"><Tag kind="interest">Demand is interest, not committed revenue</Tag></div>
            </div>
            <div className="rounded-lg bg-muted p-5">
              <p className="text-sm italic leading-relaxed text-foreground">
                &ldquo;It&rsquo;s more better than laying around on the floors. It was easy to make. It&rsquo;s nice.&rdquo;
              </p>
              <p className="mt-3 text-xs text-muted-foreground">Ivy, Palm Island — after receiving her bed</p>
            </div>
          </div>
          <Photo
            src={PHOTO.community}
            alt="Community members gathered at golden hour around a Stretch Bed, one person testing it, the multicoloured recycled-plastic legs in the foreground"
          />
        </div>
      </Frame>
    ),
  },

  /* 06 — Why now: three external shifts (Uber / Sequoia) */
  {
    id: 'why-now',
    render: () => (
      <Frame>
        <Eyebrow>Why now</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          Three shifts make this buildable now — and not before.
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            ['Technology', 'Shred-melt-press micro-manufacturing is now small, cheap and mobile enough to run On Country — the plant can sit where the waste and the need are.'],
            ['Policy & procurement', 'Closing the Gap and First Nations procurement targets are moving institutional buyers from grant-funded hand-outs toward buying from Indigenous enterprise.'],
            ['Economics', 'Recycled HDPE feedstock plus brutal freight costs make a bed built in community cheaper over its life than one trucked in to break.'],
          ].map(([h, p]) => (
            <div key={h}>
              <h3 className="text-lg font-medium text-primary">{h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p}</p>
            </div>
          ))}
        </div>
      </Frame>
    ),
  },

  /* 07 — Business model: one sentence + one sum (Airbnb / Mint) */
  {
    id: 'model',
    render: () => (
      <Frame>
        <Eyebrow>The model</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          Sell beds to buyers who already have a duty to house people — then bring the plastic in-house.
        </h2>
        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">The unit, today → factory → community-owned</p>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-3">
            <div>
              <span className="text-3xl font-light text-foreground" style={display}>AU$750</span>
              <span className="ml-2 text-sm text-muted-foreground">price / bed</span>
            </div>
            <span className="text-muted-foreground">−</span>
            <div>
              <span className="text-3xl font-light text-foreground" style={display}>$685 → $426 → $421</span>
              <span className="ml-2 text-sm text-muted-foreground">marginal cost</span>
            </div>
            <span className="text-muted-foreground">=</span>
            <div>
              <span className="text-3xl font-light text-primary" style={display}>~338</span>
              <span className="ml-2 text-sm text-muted-foreground">beds / yr to break even</span>
            </div>
          </div>
          <div className="mt-4"><Tag kind="modelled">Modelled — 0 beds assembled in-house yet; the 50-bed run is the test</Tag></div>
        </div>
        <p className="mt-8 max-w-2xl text-base text-muted-foreground">
          The path off grants has two levers: <span className="text-foreground">in-source the plastic</span>{' '}
          (8.6× markup verified on bought-in feedstock) and <span className="text-foreground">move institutional
          buyers from grant-funded to procurement-funded</span>.
        </p>
      </Frame>
    ),
  },

  /* 08 — GTM wedge: named channels, not "we'll market" (Airbnb) */
  {
    id: 'gtm',
    render: () => (
      <Frame>
        <Eyebrow>Go-to-market — the first three wedges</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          We already have a buyer in each channel.
        </h2>
        <div className="mt-10 space-y-6">
          {[
            ['1 · Institutional procurement', 'Health services, land councils and housing bodies with a duty to house people and procurement targets to meet.', 'Proof: Centrecorp funded a 107-bed deployment.'],
            ['2 · Community co-invest', 'Communities buying their own beds — and their own plant — on their terms.', 'Proof: Dianne Stokes offered to self-fund; PICC offered to buy a plant.'],
            ['3 · Direct + catalytic', 'Online Stretch Bed sales and match-eligible catalytic capital that de-risks the scale-up.', 'Proof: live checkout + QBE Catalysing Impact match.'],
          ].map(([h, p, proof]) => (
            <div key={h} className="grid gap-1 border-t border-border pt-4 sm:grid-cols-[1fr_1.3fr]">
              <h3 className="text-lg font-medium text-foreground">{h}</h3>
              <div>
                <p className="text-sm text-muted-foreground">{p}</p>
                <p className="mt-1 text-xs font-medium text-primary">{proof}</p>
              </div>
            </div>
          ))}
        </div>
      </Frame>
    ),
  },

  /* 09 — Competition: answer "why you win" (LinkedIn / Buffer) */
  {
    id: 'competition',
    render: () => (
      <Frame>
        <Eyebrow>The alternatives</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          We&rsquo;re not competing with a bed. We&rsquo;re competing with the way beds arrive.
        </h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Alternative</th>
                <th className="py-3 pr-4 font-medium">What people like</th>
                <th className="py-3 pr-4 font-medium">What breaks</th>
                <th className="py-3 font-medium">Why we win</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ['Freighted commercial furniture', 'Familiar, available in cities', 'Freight tax; fails in remote conditions in months', 'Built for country; washable; 10+ yr life'],
                ['Charity bed drops', 'Free, immediate', 'No jobs, no ownership, no repair path', 'Local jobs + community-owned plant'],
                ['Do nothing / the floor', 'No cost, no logistics', 'The health and dignity cost people live with', 'A bed off the ground people asked for'],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 font-medium text-foreground">{row[0]}</td>
                  <td className="py-3 pr-4">{row[1]}</td>
                  <td className="py-3 pr-4">{row[2]}</td>
                  <td className="py-3 text-foreground">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Frame>
    ),
  },

  /* 10 — Moat: why we get stronger as we grow */
  {
    id: 'moat',
    render: () => (
      <Frame>
        <Eyebrow>Why we get stronger as we grow</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          The advantage compounds where a competitor can&rsquo;t follow: in community.
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {[
            ['Ownership, by design', 'Each plant is built to move into community hands (Supply Nation 51% First Nations-ownership path). The model gets more defensible the more it gives away.'],
            ['A cost-down curve', 'Verified bill of materials + in-sourced plastic drive marginal cost from $685 toward $421 as volume and local capability grow.'],
            ['Field-proven evidence', `${A.bedsDeployed} beds across ${A.communitiesServed} communities, with consent-based stories through the Empathy Ledger — proof procurement buyers can stand on.`],
            ['Relationships, not access', 'Years of design in community, led by Elders. You can copy a bed. You can’t copy trust that was earned On Country.'],
          ].map(([h, p]) => (
            <div key={h} className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-base font-medium text-foreground">{h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p}</p>
            </div>
          ))}
        </div>
      </Frame>
    ),
  },

  /* 11 — Team & governance: honest about the gaps */
  {
    id: 'team',
    render: () => (
      <Frame>
        <Eyebrow>Team &amp; governance</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          Two founders, an eleven-member advisory circle, and a plan to make ourselves unnecessary.
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Photo
            src={PHOTO.team}
            alt="Co-founder Nic Marchesi seated on a Stretch Bed in conversation with an Elder and a community member on a shaded verandah"
            caption="Working both ways — cultural side in white society and Indigenous society."
            who="Dianne Stokes, Elder, Tennant Creek"
          />
          <div className="flex flex-col gap-5">
            {[
              ['Nicholas Marchesi', 'Co-founder & Project Lead — community-led design, on-country manufacturing.'],
              ['Benjamin Knight', 'Co-founder — story, technology, and the systems that connect product to community.'],
            ].map(([n, r]) => (
              <div key={n}>
                <h3 className="text-lg font-medium text-foreground">{n}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r}</p>
              </div>
            ))}
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">11-member monthly advisory committee</span>, moving to a
                fiduciary board (trigger-gated). Data held under OCAP® Indigenous data sovereignty.
              </p>
              <p>
                <span className="font-medium text-foreground">12-month role map:</span> GM, then Business Development —
                each hire trigger-gated to milestones, not calendar.
              </p>
              <div><Tag kind="future">Honest: 0 hires and 0 independent directors yet — this round funds the first</Tag></div>
            </div>
          </div>
        </div>
      </Frame>
    ),
  },

  /* 12 — Risks & mitigations: maturity, not spin (Hoffman / Mint) */
  {
    id: 'risks',
    render: () => (
      <Frame>
        <Eyebrow>Risks &amp; mitigations</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          We&rsquo;re a de-risking-stage enterprise. Here&rsquo;s exactly what&rsquo;s still open.
        </h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Risk</th>
                <th className="py-3 pr-4 font-medium">Why it matters</th>
                <th className="py-3 font-medium">Mitigation</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ['In-house cost-down unproven', 'The core economic claim ($421/bed) is modelled', 'A 50-bed in-source run turns it from modelled to measured'],
                ['Revenue figure pending sign-off', 'We won’t publish a number the accountant hasn’t signed', 'One consolidated Goods-only figure is being reconciled now — published when signed'],
                ['Entity & 51% structure open', 'The First Nations-ownership keystone isn’t closed', 'Sequenced after the charity lands (~end July); draft with MinterEllison'],
                ['Founder concentration', 'Two load-bearing founders, no hires yet', 'Trigger-gated GM + BD hires funded by this round'],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 font-medium text-foreground">{row[0]}</td>
                  <td className="py-3 pr-4">{row[1]}</td>
                  <td className="py-3 text-foreground">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Catalytic funders expect a de-risking enterprise, not a finished one. Flagging the gaps is more credible
          than papering over them. Every number in this deck sits in the public{' '}
          <Link href="/register" className="underline decoration-border underline-offset-4 hover:text-foreground">
            Claims Register
          </Link>{' '}
          with its evidence and flip date.
        </p>
      </Frame>
    ),
  },

  /* 13 — Ask & use of funds */
  {
    id: 'ask',
    render: () => (
      <Frame>
        <Eyebrow>The ask</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          AU$400,000 in catalytic capital that converts into community ownership.
        </h2>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground">
          A recoverable grant (≥1:1 match-eligible, repayable preferred) — capital designed to make itself
          unnecessary as the enterprise stands on procurement revenue.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            ['~AU$60–80K', 'The 50-bed in-source run — the proof gate that turns unit economics from modelled to measured.'],
            ['~AU$200K', 'GM + Business Development hires — the first team beyond the two founders.'],
            ['Balance', 'Press capex (AU$110,046 verified) plus facility and per-site build-out.'],
          ].map(([v, p]) => (
            <div key={v} className="rounded-lg border border-border bg-card p-5">
              <div className="text-2xl font-light text-primary" style={display}>{v}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Why now:</span> QBE Catalysing Impact match live · first
          signed match-eligible commitment targeted by 31 Aug · Stage 2 in September.
        </p>
      </Frame>
    ),
  },

  /* 14 — Closing thesis: what you must believe to invest (Hoffman) */
  {
    id: 'thesis',
    render: () => (
      <Frame>
        <Eyebrow>Why invest now</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
          Four things to believe.
        </h2>
        <ol className="mt-8 space-y-5">
          {[
            ['The market is turning', 'Procurement targets, Closing the Gap, recycled feedstock and freight costs all point the same way — toward buying durable goods made in community.'],
            ['There is early proof', `${A.bedsDeployed} beds, ${A.communitiesServed} communities, ${A.plasticKg.toLocaleString()}kg of plastic diverted, and buyers asking for more.`],
            ['This team can win', 'Design in community led by Elders, on-country manufacturing, and consent-based evidence a competitor can’t shortcut.'],
            ['This round gets us there', 'Measured (not modelled) unit economics, the first procurement-funded revenue, and a plant on the path to community ownership.'],
          ].map(([h, p], i) => (
            <li key={h} className="flex gap-4">
              <span className="text-2xl font-light text-primary" style={display}>{i + 1}</span>
              <div>
                <h3 className="text-lg font-medium text-foreground">{h}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p}</p>
              </div>
            </li>
          ))}
        </ol>
        <blockquote className="mt-8 border-l-2 border-primary pl-4 text-lg font-light italic text-foreground" style={display}>
          &ldquo;I want to see a better future for our kids and better housing for our people.&rdquo;
          <span className="mt-1 block font-sans text-xs not-italic text-muted-foreground">
            Norman Frank, Elder, Tennant Creek
          </span>
        </blockquote>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/register"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Audit every claim in this deck
          </Link>
          <Link
            href="/impact"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            See the impact evidence
          </Link>
          <Link
            href="/cost-story"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Read the cost story
          </Link>
        </div>
      </Frame>
    ),
  },
];

/* ---------- deck shell -------------------------------------------------- */

export default function DeckPage() {
  const [i, setI] = useState(0);
  const last = SLIDES.length - 1;

  const go = useCallback(
    (n: number) => setI(Math.max(0, Math.min(last, n))),
    [last],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        setI((c) => Math.min(last, c + 1));
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        setI((c) => Math.max(0, c - 1));
      } else if (e.key === 'Home') {
        setI(0);
      } else if (e.key === 'End') {
        setI(last);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [last]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground select-none">
      {/* progress bar */}
      <div className="h-1 w-full bg-border/60">
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${((i + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* slide */}
      <div className="relative flex-1 overflow-hidden">
        {/* click zones for prev / next */}
        <button
          aria-label="Previous slide"
          onClick={() => go(i - 1)}
          className="absolute left-0 top-0 z-10 h-full w-1/4 cursor-w-resize focus:outline-none"
        />
        <button
          aria-label="Next slide"
          onClick={() => go(i + 1)}
          className="absolute right-0 top-0 z-10 h-full w-1/4 cursor-e-resize focus:outline-none"
        />
        <div key={SLIDES[i].id} className="deck-fade h-full overflow-y-auto">
          {SLIDES[i].render()}
        </div>
      </div>

      {/* footer chrome */}
      <div className="flex items-center justify-between border-t border-border px-6 py-3 text-xs text-muted-foreground sm:px-12">
        <span className="font-medium tracking-wide text-foreground">Goods on Country</span>
        <div className="hidden items-center gap-1.5 sm:flex">
          {SLIDES.map((s, n) => (
            <button
              key={s.id}
              aria-label={`Go to slide ${n + 1}`}
              onClick={() => go(n)}
              className={`h-1.5 rounded-full transition-all ${
                n === i ? 'w-6 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
        <span className="tabular-nums">
          {String(i + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
      </div>

      <style>{`
        .deck-fade { animation: deckFade 0.35s ease-out; }
        @keyframes deckFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
