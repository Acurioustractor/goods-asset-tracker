import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  MODULES,
  MODULE_RULE,
  PUBLIC_STAGES,
  STAGE_RULE,
} from '@/lib/data/pathway-stages';

/**
 * THE DELIVERY-PARTNER FRONT DOOR.
 *
 * Until 2026-08-02 there was not one. Five audiences had a URL and delivery partners had none:
 * `/pathways` belongs to community and is noindexed because it renders per-community items marked
 * "Confirm together"; `/partner` (singular) turned out to be a FUNDER page, "Back the Work", for
 * philanthropists and patient capital; `/partners/[slug]/dashboard` is password-gated and serves
 * partners we already have, not one deciding whether to work with us. That gap may be part of why
 * partner conversations have been hard: there was no surface for them. Wayfinder map #177, #187.
 *
 * WHAT IT LEADS WITH, and why that is not a style choice. `audience.ts` says this reader must lead
 * with "which of the nine modules is theirs, and which is ours", and must never see "a scope that
 * leaves Transfer undefined" or "a number that assumes a whole site when they are taking one
 * module". So the modules come first, Transfer is named as a stage with an owner, and there is not
 * a single figure on this page.
 *
 * WHY IT CAN BE PUBLIC when `/pathways` cannot: everything here is imported from
 * `pathway-stages.ts`, the locked definition of the six stages and nine modules. There is no
 * per-community state, nothing marked "Confirm together", no community named without their say.
 * That is the whole reason this is a new page rather than an unlock of the old one.
 *
 * NOTHING HERE IS AUTHORED. Every line of substance is imported, so a change to the stages or the
 * modules moves this page and cannot leave it behind. Do not restate a module or a stage locally.
 */

export const metadata = {
  title: 'Partner with Goods on Country',
  description:
    'The nine modules a community chooses from, which parts are ours, which are yours, and what happens at Transfer.',
  alternates: { canonical: 'https://www.goodsoncountry.com/partners' },
};

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-goods-cream">
      <section className="border-b border-goods-grid bg-[radial-gradient(circle_at_top_left,_#efe2cf_0,_#fbf8f1_46%,_#f4eee4_100%)]">
        <div className="container mx-auto max-w-6xl px-5 py-16 md:py-24">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#a64f35]">
            For delivery partners
          </p>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.06] text-goods-ink md:text-6xl">
            Nine modules. You take the ones that are yours.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#665f53]">
            {MODULE_RULE}
          </p>
        </div>
      </section>

      {/* The modules first. This is the lead, not a section. */}
      <section className="container mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-2xl text-goods-ink md:text-3xl">
          What a community can choose
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <li
              key={m.id}
              className="rounded-lg border border-goods-grid bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
            >
              <p className="text-sm font-semibold text-goods-ink">{m.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#665f53]">{m.what}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-[#665f53]">
          A partner might hold one of these, or several. Which ones are yours and which stay ours is
          a conversation, and it is the first one worth having. We will not quote you for a whole
          site when you are taking a single module.
        </p>
      </section>

      {/* Transfer must never be left undefined for this reader. */}
      <section className="border-y border-goods-grid bg-[#f4eee4]">
        <div className="container mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-2xl text-goods-ink md:text-3xl">
            How the work moves, and who holds what
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#665f53]">{STAGE_RULE}</p>
          <ol className="mt-8 space-y-3">
            {PUBLIC_STAGES.map((s, i) => (
              <li
                key={s.id}
                className="flex flex-col gap-2 rounded-lg border border-goods-grid bg-white p-5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="flex-shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-[#a64f35]">
                  {i + 1}. {s.label}
                </span>
                <span className="flex-1 text-sm leading-relaxed text-goods-ink">{s.line}</span>
                <span className="flex-shrink-0 text-xs text-[#665f53]">
                  Community holds: <span className="font-semibold text-goods-ink">{s.holds}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-2xl text-goods-ink md:text-3xl">
          Agree the scope in writing
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#665f53]">
          The next step is naming which modules are yours, which are ours, and who holds the
          enterprise at Transfer. That is a conversation and a written scope, not a proposal we
          arrive with.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-goods-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#433f38]"
        >
          Start that conversation <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
