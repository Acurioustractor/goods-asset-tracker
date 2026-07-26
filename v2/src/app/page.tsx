import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  HOME_HERO,
  HOME_PROVENANCE,
  HOME_STORY_COMPACT,
  HOME_BED_SECTION,
  HOME_FACILITY_SECTION,
  HOME_VOICES,
  HOME_ROAD,
  HOME_DOORS,
  homeVoiceQuote,
} from '@/lib/data/home';

// Homepage A — "The Bed on Country" (Ben's picked mock, 2026-07-26).
// Every word renders from lib/data/home.ts, which home.guards.test.ts holds
// against canon, consent and the road spine. Nothing narrative is authored here.

const DISPLAY_FONT = { fontFamily: 'var(--font-display, Georgia, serif)' } as const;

const DOOR_TONES = {
  terracotta: '#C45C3E',
  sage: '#6F7F5C',
  teal: '#3E6363',
} as const;

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative isolate flex min-h-[76vh] items-end overflow-hidden bg-foreground">
        <Image
          src={HOME_HERO.image}
          alt={HOME_HERO.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/70" />
        <div className="relative container mx-auto px-4 pb-14 md:pb-20">
          <h1
            className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl"
            style={DISPLAY_FONT}
          >
            {HOME_HERO.headline}
          </h1>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" className="text-white hover:opacity-90" style={{ backgroundColor: DOOR_TONES.terracotta }} asChild>
              <Link href={HOME_HERO.primaryCta.href}>{HOME_HERO.primaryCta.label}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href={HOME_HERO.secondaryCta.href}>{HOME_HERO.secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Provenance strip */}
      <section className="bg-foreground py-4">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-2 px-4">
          {HOME_PROVENANCE.map((item) => (
            <span
              key={item}
              className="font-mono text-xs uppercase tracking-widest text-background/60"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* 3. Compact story */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-accent">
              {HOME_STORY_COMPACT.eyebrow}
            </p>
            <p
              className="text-2xl font-semibold leading-snug text-foreground md:text-3xl"
              style={DISPLAY_FONT}
            >
              {HOME_STORY_COMPACT.line}
            </p>
            <Link
              href={HOME_STORY_COMPACT.link.href}
              className="mt-6 inline-block text-base font-semibold"
              style={{ color: DOOR_TONES.terracotta }}
            >
              {HOME_STORY_COMPACT.link.label} →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. The Stretch Bed, with buy */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
              <Image
                src={HOME_BED_SECTION.image}
                alt={HOME_BED_SECTION.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="mb-4 text-sm uppercase tracking-widest" style={{ color: DOOR_TONES.terracotta }}>
                {HOME_BED_SECTION.eyebrow}
              </p>
              <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl" style={DISPLAY_FONT}>
                {HOME_BED_SECTION.title}
              </h2>
              <p className="mb-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {HOME_BED_SECTION.body}
              </p>
              <div className="flex flex-wrap items-center gap-5">
                <Button size="lg" className="text-white hover:opacity-90" style={{ backgroundColor: DOOR_TONES.terracotta }} asChild>
                  <Link href={HOME_BED_SECTION.buyCta.href}>{HOME_BED_SECTION.buyCta.label}</Link>
                </Button>
                <Link
                  href={HOME_BED_SECTION.moreLink.href}
                  className="text-base font-semibold"
                  style={{ color: DOOR_TONES.terracotta }}
                >
                  {HOME_BED_SECTION.moreLink.label} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The production facility, six stages */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm uppercase tracking-widest" style={{ color: DOOR_TONES.sage }}>
                {HOME_FACILITY_SECTION.eyebrow}
              </p>
              <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl" style={DISPLAY_FONT}>
                {HOME_FACILITY_SECTION.title}
              </h2>
              <p className="mb-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {HOME_FACILITY_SECTION.body}
              </p>
              <div className="mb-7 flex flex-wrap gap-2.5">
                {HOME_FACILITY_SECTION.stages.map((stage) => (
                  <span
                    key={stage.id}
                    title={stage.line}
                    className="rounded-full border px-3.5 py-1.5 text-sm font-medium"
                    style={{ borderColor: DOOR_TONES.sage, color: DOOR_TONES.sage }}
                  >
                    {stage.label}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-6">
                {HOME_FACILITY_SECTION.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base font-semibold"
                    style={{ color: DOOR_TONES.sage }}
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
              <Image
                src={HOME_FACILITY_SECTION.image}
                alt={HOME_FACILITY_SECTION.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Voices */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <p className="mb-4 text-sm uppercase tracking-widest" style={{ color: DOOR_TONES.terracotta }}>
            {HOME_VOICES.eyebrow}
          </p>
          <h2 className="mb-10 max-w-3xl text-3xl font-semibold text-foreground md:text-4xl" style={DISPLAY_FONT}>
            {HOME_VOICES.title}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {HOME_VOICES.cards.map((card) => (
              <figure key={card.name} className="overflow-hidden rounded-2xl border border-border bg-background">
                <div className="relative aspect-[4/3] w-full bg-muted">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <blockquote className="text-base leading-relaxed text-foreground/90" style={DISPLAY_FONT}>
                    &ldquo;{homeVoiceQuote(card)}&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{card.name}</span> · {card.place}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
          <Link
            href={HOME_VOICES.link.href}
            className="mt-8 inline-block text-base font-semibold"
            style={{ color: DOOR_TONES.terracotta }}
          >
            {HOME_VOICES.link.label} →
          </Link>
        </div>
      </section>

      {/* 7. The road, as lessons */}
      <section className="bg-foreground py-16 md:py-24 text-background">
        <div className="container mx-auto px-4">
          <p className="mb-4 text-sm uppercase tracking-widest" style={{ color: '#C9A227' }}>
            {HOME_ROAD.eyebrow}
          </p>
          <h2 className="mb-12 max-w-3xl text-3xl font-semibold leading-snug md:text-4xl" style={DISPLAY_FONT}>
            {HOME_ROAD.title}
          </h2>
          <ol className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
            {HOME_ROAD.stops.map((stop, i) => (
              <li key={stop.id} className="flex flex-col items-center gap-2.5 text-center">
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: i === HOME_ROAD.stops.length - 1 ? DOOR_TONES.terracotta : 'rgba(255,255,255,0.35)' }}
                />
                <span className="text-sm text-background/70" title={stop.what}>
                  {stop.taught}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-12 max-w-2xl text-lg text-background/60" style={DISPLAY_FONT}>
            {HOME_ROAD.gapLine}
          </p>
          <Button
            size="lg"
            variant="outline"
            className="mt-8 border-[#C9A227] bg-transparent text-[#C9A227] hover:bg-[#C9A227]/10"
            asChild
          >
            <Link href={HOME_ROAD.cta.href}>{HOME_ROAD.cta.label}</Link>
          </Button>
        </div>
      </section>

      {/* 8. Three doors */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {HOME_DOORS.map((door) => (
              <div key={door.title} className="flex flex-col rounded-2xl border border-border bg-muted/20 p-8">
                <h3 className="mb-2 text-2xl font-semibold text-foreground" style={DISPLAY_FONT}>
                  {door.title}
                </h3>
                <p className="mb-6 flex-1 text-base leading-relaxed text-muted-foreground">{door.body}</p>
                <Button className="self-start text-white hover:opacity-90" style={{ backgroundColor: DOOR_TONES[door.tone] }} asChild>
                  <Link href={door.cta.href}>{door.cta.label}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
