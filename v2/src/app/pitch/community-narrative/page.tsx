import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  CircleAlert,
  Factory,
  FileText,
  Image as ImageIcon,
  UsersRound,
} from 'lucide-react';
import {
  anonymousFieldEvidence,
  blockedOrHoldVoices,
  communityNarrativeUpdated,
  communityThemes,
  investmentWorth,
  leadNarrative,
  narrativePrinciples,
  nextStagePlan,
  quoteDripSequence,
  transcriptQuoteOverrides,
  transcriptSourceCoverage,
  type TranscriptQuote,
} from '@/lib/data/community-narrative';
import { getCuratedQuotes } from '@/lib/data/curated-quotes';
import { storytellerReview, type StorytellerReview } from '@/lib/data/pitch-photo-review';

export const metadata = {
  title: 'Community narrative | Goods on Country pitch',
  description:
    'A complete Goods on Country storyteller, transcript, theme, and investor narrative synthesis for pitch and deck work.',
};

function cleanContext(context: string | null | undefined) {
  if (!context) return 'Transcript quote';
  return context
    .replace(/Co[- ]?design/gi, 'Design in community')
    .replace(/co[- ]?design/gi, 'design in community');
}

function normaliseQuote(text: string) {
  return text.replace(/\s+/g, ' ').trim().replace(/[.]+$/, '');
}

function uniqueQuotes(quotes: TranscriptQuote[]) {
  const seen = new Set<string>();
  return quotes.filter((quote) => {
    const key = normaliseQuote(quote.text).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getTranscriptQuotes(person: StorytellerReview): TranscriptQuote[] {
  const curated =
    getCuratedQuotes(person.name)?.map((quote) => ({
      text: quote.text,
      context: cleanContext(quote.context),
      source: 'v2/src/lib/data/curated-quotes.ts',
      use: person.deckUse,
    })) ?? [];

  const overrides = transcriptQuoteOverrides[person.name] ?? [];
  const fallback =
    person.quote && curated.length === 0 && overrides.length === 0
      ? [
          {
            text: person.quote,
            context: 'Deck review selected quote',
            source: 'v2/src/lib/data/pitch-photo-review.ts',
            use: person.deckUse,
          },
        ]
      : [];

  return uniqueQuotes([...overrides, ...curated, ...fallback]);
}

const storytellerRows = storytellerReview.map((person) => ({
  person,
  quotes: getTranscriptQuotes(person),
}));

const allThemes = Array.from(
  new Set(storytellerReview.flatMap((person) => person.themes)),
).sort((a, b) => a.localeCompare(b));

const quoteCount = storytellerRows.reduce((sum, row) => sum + row.quotes.length, 0);
const communityVoiceCount = storytellerReview.filter(
  (person) => !['Dr Boe Remenyi', 'Chloe', 'Wayne Glenn'].includes(person.name),
).length;
const practitionerCount = storytellerReview.length - communityVoiceCount;

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a84f35]">{eyebrow}</p>
      <h2
        className="mt-3 max-w-5xl text-3xl font-light leading-tight text-[#1f2623] md:text-5xl"
        style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
      >
        {title}
      </h2>
      {body && <p className="mt-4 max-w-4xl text-base leading-relaxed text-[#4f5f59]">{body}</p>}
    </div>
  );
}

function PhotoFrame({
  src,
  alt,
  contain = false,
}: {
  src?: string;
  alt: string;
  contain?: boolean;
}) {
  if (!src) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-dashed border-[#c7d1c9] bg-[#edf2ed] text-[#718078]">
        <ImageIcon className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-[#d6ddd4] bg-[#edf2ed]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 360px"
        className={contain ? 'object-contain p-4' : 'object-cover'}
      />
    </div>
  );
}

function QuoteBlock({ quote }: { quote: TranscriptQuote }) {
  return (
    <blockquote className="rounded-md border border-[#d6ddd4] bg-[#fdfcf7] p-4">
      <p className="text-sm leading-relaxed text-[#2f3b36]">&quot;{quote.text}&quot;</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a8a83]">
        {quote.context}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[#65756f]">{quote.use}</p>
      <code className="mt-3 block break-all rounded bg-[#edf2ed] px-2 py-1 text-[10px] leading-relaxed text-[#65756f]">
        {quote.source}
      </code>
    </blockquote>
  );
}

function StorytellerCard({ row }: { row: { person: StorytellerReview; quotes: TranscriptQuote[] } }) {
  const { person, quotes } = row;
  const contain = person.photo?.includes('oonchiumpa') ?? false;

  return (
    <article className="rounded-md border border-[#d6ddd4] bg-white p-4 shadow-sm shadow-[#1f2623]/5">
      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
        <div>
          <PhotoFrame src={person.photo} alt={person.name} contain={contain} />
        </div>
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-[#1f2623]">{person.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[#65756f]">{person.role}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#7a8a83]">{person.location}</p>
            </div>
            <span className="rounded-full border border-[#b7c7bd] bg-[#ecf2ed] px-2 py-1 text-[11px] font-semibold text-[#24423f]">
              {person.clearedForExternal ? 'external cleared' : 'check before use'}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {person.themes.map((theme) => (
              <span
                key={theme}
                className="rounded-full border border-[#d6ddd4] bg-[#f5f3ea] px-2 py-1 text-[11px] font-semibold text-[#4f5f59]"
              >
                {theme}
              </span>
            ))}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[#4f5f59]">{person.deckUse}</p>
          {person.note && (
            <p className="mt-3 rounded-md border border-[#ddb5a2] bg-[#fff8ee] p-3 text-xs leading-relaxed text-[#6d452e]">
              {person.note}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {quotes.length > 0 ? (
          quotes.map((quote) => <QuoteBlock key={`${person.name}-${quote.text}`} quote={quote} />)
        ) : (
          <div className="rounded-md border border-[#d6ddd4] bg-[#fdfcf7] p-4 text-sm leading-relaxed text-[#65756f]">
            No direct transcript quote is used for this person. Keep the role, image, or story caveat visible.
          </div>
        )}
      </div>
    </article>
  );
}

export default function CommunityNarrativePage() {
  return (
    <main className="min-h-screen bg-[#f5f3ea] text-[#1f2623]">
      <section className="border-b border-[#203833] bg-[#243d3a] text-white">
        <div className="mx-auto max-w-[1560px] px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Link
              href="/pitch/investor-lab"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Investor lab
            </Link>
            <Link
              href="/pitch/workshop"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              Workshop
            </Link>
            <Link
              href="/pitch/photo-review"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              Photo review
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[#e09b6f]">
                <BookOpenText className="h-4 w-4" />
                Community narrative synthesis
              </p>
              <h1
                className="max-w-5xl text-4xl font-light leading-tight md:text-6xl"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                {leadNarrative.headline}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/72 md:text-lg">
                {leadNarrative.summary}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/58">
                {leadNarrative.proofFrame}
              </p>
            </div>

            <div className="rounded-md border border-white/15 bg-white/8 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Corpus coverage</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-white/10 bg-white/8 p-3">
                  <p className="text-2xl font-semibold">{storytellerReview.length}</p>
                  <p className="mt-1 text-xs text-white/55">cleared voices reviewed</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/8 p-3">
                  <p className="text-2xl font-semibold">{quoteCount}</p>
                  <p className="mt-1 text-xs text-white/55">transcript quote rows</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/8 p-3">
                  <p className="text-2xl font-semibold">{communityVoiceCount}</p>
                  <p className="mt-1 text-xs text-white/55">community and partner voices</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/8 p-3">
                  <p className="text-2xl font-semibold">{practitionerCount}</p>
                  <p className="mt-1 text-xs text-white/55">practitioner voices</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/45">
                Updated {communityNarrativeUpdated}. Use this as an internal deck and narrative working view.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-b border-[#d6ddd4] bg-[#fdfcf7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1560px] gap-2 overflow-x-auto px-4 py-3 md:px-6">
          {[
            ['Lead', '#lead'],
            ['Themes', '#themes'],
            ['Drip feed', '#drip-feed'],
            ['Storytellers', '#storytellers'],
            ['Next stages', '#next-stages'],
            ['Sources', '#sources'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="inline-flex flex-shrink-0 items-center rounded-md border border-[#d6ddd4] bg-white px-3 py-2 text-sm font-semibold text-[#4f5f59] transition-colors hover:border-[#24423f] hover:text-[#1f2623]"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      <section className="border-b border-[#d6ddd4] py-10" id="lead">
        <div className="mx-auto max-w-[1560px] px-4 md:px-6">
          <SectionHeader
            eyebrow="First principles"
            title="The deck should sequence belief, not information."
            body="The strongest investor version keeps community voice in front, uses one quote at each belief turn, and names the difference between what is proven now and what investment builds next."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {narrativePrinciples.map((item) => (
              <article key={item.principle} className="rounded-md border border-[#d6ddd4] bg-white p-4">
                <CheckCircle2 className="h-5 w-5 text-[#2f6f59]" />
                <h3 className="mt-3 text-base font-semibold text-[#1f2623]">{item.principle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#65756f]">{item.meaning}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {leadNarrative.sections.map((section) => (
              <article key={section.id} className="rounded-md border border-[#d6ddd4] bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a84f35]">
                  {section.label}
                </p>
                <h3
                  className="mt-3 text-2xl font-light leading-tight text-[#1f2623]"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  {section.headline}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#4f5f59]">{section.body}</p>
                <div className="mt-5">
                  <PhotoFrame src={section.photo.src} alt={section.photo.label} />
                </div>
                <p className="mt-4 rounded-md border border-[#b7c7bd] bg-[#ecf2ed] p-3 text-sm leading-relaxed text-[#24423f]">
                  Investor belief: {section.investorBelief}
                </p>
                <ul className="mt-4 space-y-2">
                  {section.proof.map((proof) => (
                    <li key={proof} className="flex gap-2 text-sm leading-relaxed text-[#4f5f59]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2f6f59]" />
                      <span>{proof}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a8a83]">
                  Voices: {section.communityVoices.join(', ')}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#d6ddd4] bg-[#edf2ed] py-10" id="themes">
        <div className="mx-auto max-w-[1560px] px-4 md:px-6">
          <SectionHeader
            eyebrow="What community is saying"
            title="Eight themes carry the whole story."
            body="These are the repeat patterns across the cleared storyteller corpus and the compiled transcript evidence. Use them as the deck's evidence map."
          />
          <div className="mb-6 flex flex-wrap gap-2">
            {allThemes.map((theme) => (
              <span key={theme} className="rounded-full border border-[#c7d1c9] bg-white px-3 py-1 text-xs font-semibold text-[#4f5f59]">
                {theme}
              </span>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {communityThemes.map((theme) => (
              <article key={theme.id} className="rounded-md border border-[#d6ddd4] bg-white p-4">
                <PhotoFrame
                  src={theme.photo.src}
                  alt={theme.photo.label}
                  contain={theme.photo.src.includes('oonchiumpa')}
                />
                <h3 className="mt-4 text-lg font-semibold text-[#1f2623]">{theme.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4f5f59]">{theme.whatWeAreHearing}</p>
                <p className="mt-3 rounded-md border border-[#b7c7bd] bg-[#ecf2ed] p-3 text-xs leading-relaxed text-[#24423f]">
                  Investor meaning: {theme.investorMeaning}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-[#65756f]">Deck use: {theme.deckUse}</p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a8a83]">
                  Strong voices: {theme.strongestVoices.join(', ')}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#d6ddd4] py-10" id="drip-feed">
        <div className="mx-auto max-w-[1560px] px-4 md:px-6">
          <SectionHeader
            eyebrow="Quote drip-feed"
            title="One voice at each turn in the pitch."
            body="This keeps the story moving. Each quote answers a specific investor question, then hands the deck to the next proof point."
          />
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {quoteDripSequence.map((item) => (
              <article key={`${item.moment}-${item.voice}`} className="rounded-md border border-[#d6ddd4] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a84f35]">{item.moment}</p>
                  <span className="rounded-full border border-[#d6ddd4] bg-[#f5f3ea] px-2 py-1 text-[11px] font-semibold text-[#4f5f59]">
                    {item.voice}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-[#1f2623]">{item.belief}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4f5f59]">{item.quoteUse}</p>
                <p className="mt-3 text-xs font-semibold text-[#7a8a83]">{item.slideUse}</p>
                <div className="mt-4">
                  <PhotoFrame
                    src={item.image.src}
                    alt={item.image.label}
                    contain={item.image.src.includes('oonchiumpa')}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#d6ddd4] bg-[#fdfcf7] py-10" id="storytellers">
        <div className="mx-auto max-w-[1560px] px-4 md:px-6">
          <SectionHeader
            eyebrow="Complete cleared corpus"
            title="All Goods storytellers and transcript quotes in one view."
            body="This section uses the 32 consent-cleared voices for external use. Practitioner voices are included but must be labelled as practitioners, not community recipients."
          />
          <div className="space-y-5">
            {storytellerRows.map((row) => (
              <StorytellerCard key={row.person.name} row={row} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#d6ddd4] bg-[#edf2ed] py-10">
        <div className="mx-auto grid max-w-[1560px] gap-8 px-4 md:px-6 xl:grid-cols-[1fr_0.8fr]">
          <div>
            <SectionHeader
              eyebrow="Anonymous field evidence"
              title="Use role-only Utopia voices as field proof, not named testimonials."
              body="These are cleared field-evidence lines from the Utopia trip. They are useful because they show immediate household demand, but they should stay role-only."
            />
            <div className="grid gap-3 md:grid-cols-2">
              {anonymousFieldEvidence.map((quote) => (
                <QuoteBlock key={`${quote.context}-${quote.text}`} quote={quote} />
              ))}
            </div>
          </div>
          <div>
            <SectionHeader
              eyebrow="Hold and blocked voices"
              title="Visible guardrails for the deck."
              body="These prevent us from accidentally using useful transcript material in the wrong context."
            />
            <div className="space-y-3">
              {blockedOrHoldVoices.map((voice) => (
                <article key={voice.name} className="rounded-md border border-[#ddb5a2] bg-white p-4">
                  <div className="flex gap-3">
                    <CircleAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#a84f35]" />
                    <div>
                      <h3 className="text-base font-semibold text-[#1f2623]">{voice.name}</h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#a84f35]">
                        {voice.status}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#4f5f59]">{voice.reason}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d6ddd4] py-10" id="next-stages">
        <div className="mx-auto max-w-[1560px] px-4 md:px-6">
          <SectionHeader
            eyebrow="Next stages"
            title="What we are doing next, and why investment is worthwhile."
            body="The investment story should show exactly how money moves the work from proof into capacity, governance, and the first place-based ownership pathway."
          />
          <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
            <div className="space-y-3">
              {nextStagePlan.map((stage) => (
                <article key={stage.stage} className="rounded-md border border-[#d6ddd4] bg-white p-4">
                  <h3 className="text-lg font-semibold text-[#1f2623]">{stage.stage}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4f5f59]">{stage.work}</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <p className="rounded-md border border-[#b7c7bd] bg-[#ecf2ed] p-3 text-xs leading-relaxed text-[#24423f]">
                      Community effect: {stage.communityEffect}
                    </p>
                    <p className="rounded-md border border-[#ddb5a2] bg-[#fff8ee] p-3 text-xs leading-relaxed text-[#6d452e]">
                      Investor value: {stage.investorValue}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="space-y-3">
              {investmentWorth.map((item) => (
                <article key={item.claim} className="rounded-md border border-[#d6ddd4] bg-white p-4">
                  <Factory className="h-5 w-5 text-[#2f6f59]" />
                  <h3 className="mt-3 text-lg font-semibold text-[#1f2623]">{item.claim}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4f5f59]">{item.evidence}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10" id="sources">
        <div className="mx-auto max-w-[1560px] px-4 md:px-6">
          <SectionHeader
            eyebrow="Source coverage"
            title="What was reviewed to build this view."
            body="This is a synthesis from local Goods source material and compiled transcript extracts. It does not replace final consent review in Empathy Ledger."
          />
          <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-md border border-[#d6ddd4] bg-white p-5">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1f2623]">
                <FileText className="h-5 w-5 text-[#a84f35]" />
                Source files
              </h3>
              <div className="mt-4 grid gap-2">
                {transcriptSourceCoverage.map((source) => (
                  <code key={source} className="block break-all rounded bg-[#edf2ed] px-3 py-2 text-xs text-[#4f5f59]">
                    {source}
                  </code>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-[#d6ddd4] bg-[#243d3a] p-5 text-white">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <UsersRound className="h-5 w-5 text-[#e09b6f]" />
                Deck rule
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/72">
                Use one storyteller voice per proof point. Keep the person, place, and consent caveat attached.
                Put final external material through Empathy Ledger or the canon board before sending.
              </p>
              <div className="mt-4 grid gap-2">
                <Link
                  href="/pitch/investor-lab"
                  className="inline-flex items-center justify-between rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Investor lab
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pitch/photo-review"
                  className="inline-flex items-center justify-between rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Photo review
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pitch/miro-board"
                  className="inline-flex items-center justify-between rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Miro board
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
