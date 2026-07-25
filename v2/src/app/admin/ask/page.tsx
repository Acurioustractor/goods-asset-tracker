/**
 * THE ONE ASK SURFACE — /admin/ask
 *
 * The single canonical money surface. Six bands: the one ratio, the ask as a
 * sum, the stack ladder, the entity three-doors, the spend separation, the
 * growth line. Decks, one-pagers and the Notion mirror read FROM here.
 * Data: `@/lib/data/ask-surface` — this page renders the story; it holds no
 * numbers itself.
 */
import { SOLIDITY_LABEL, type Solidity } from '@/lib/data/cost-story';
import {
  ASK_RATIO,
  ASK_HEADLINE,
  ASK_BLOCKS,
  ASK_MATCH_VEHICLE,
  STACK_LAYERS,
  STACK_TOTAL,
  STACK_EXCLUDED,
  STACK_MIRROR_NOTE,
  ENTITY_DOORS,
  ENTITY_NOTES,
  SPEND_SEPARATION,
  GROWTH_STAGES,
  ASK_DOORS,
  ASK_FRAME,
} from '@/lib/data/ask-surface';
import Link from 'next/link';

export const metadata = {
  title: 'The Ask — Goods on Country',
  description:
    'What we are asking for, why it adds up, where each dollar legally sits, what we spend on product versus people, and how the model grows.',
};

const TAG_STYLE: Record<string, string> = {
  verified: 'bg-accent/15 text-accent-foreground border-accent/40',
  workpaper: 'bg-muted text-muted-foreground border-border',
  modelled: 'bg-primary/10 text-primary border-primary/30',
  target: 'bg-amber-50 text-amber-800 border-amber-200',
};

function Tag({ s }: { s: Solidity }) {
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${TAG_STYLE[s] ?? TAG_STYLE.workpaper}`}
    >
      {SOLIDITY_LABEL[s] ?? s}
    </span>
  );
}

export default function AskSurfacePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-14 pb-16">
      {/* Frame */}
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          The one money surface · updated {ASK_FRAME.updated}
        </p>
        <h1 className="font-serif text-4xl">{ASK_FRAME.title}</h1>
        <p className="text-muted-foreground">{ASK_FRAME.register}</p>
      </header>

      {/* Band 1 — the one ratio */}
      <section className="rounded-2xl border bg-card p-8 space-y-3">
        <p className="font-serif text-3xl leading-snug">{ASK_RATIO.headline}</p>
        <p className="text-xl text-muted-foreground">{ASK_RATIO.subline}</p>
        <p className="text-lg">{ASK_RATIO.second}</p>
        <p className="text-sm text-muted-foreground">
          <Tag s={ASK_RATIO.verificationLabel} /> {ASK_RATIO.verification}
        </p>
      </section>

      {/* Band 2 — the ask as a sum */}
      <section className="space-y-4">
        <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 space-y-2">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">The raise, in one sentence</p>
          <p className="font-serif text-2xl leading-snug">{ASK_HEADLINE.line}</p>
          <p className="text-sm text-muted-foreground">If more: {ASK_HEADLINE.ifMore}</p>
          <p className="text-sm text-muted-foreground">If short: {ASK_HEADLINE.ifShort}</p>
        </div>
        <h2 className="font-serif text-2xl">Where it goes — a sum, not a slogan</h2>
        <div className="space-y-3">
          {ASK_BLOCKS.map((b) => (
            <div key={b.name} className="rounded-xl border bg-card p-4 flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium">{b.name}</span>
                <span className="font-serif text-lg whitespace-nowrap">{b.amount}</span>
              </div>
              <p className="text-sm text-muted-foreground">{b.fundsWhat}</p>
              <div className="flex items-center gap-2">
                <Tag s={b.label} />
                {b.open ? (
                  <span className="text-xs text-amber-800">{b.open}</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-1">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-medium">{ASK_MATCH_VEHICLE.name}</span>
            <span className="font-serif text-lg">{ASK_MATCH_VEHICLE.amount}</span>
          </div>
          <p className="text-sm text-muted-foreground">{ASK_MATCH_VEHICLE.rule}</p>
          <p className="text-sm">{ASK_MATCH_VEHICLE.note}</p>
        </div>
      </section>

      {/* Band 3 — the stack */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl">The stack — who concedes what, and what it unlocks</h2>
        <p className="text-sm text-muted-foreground">{STACK_TOTAL}</p>
        <div className="space-y-3">
          {STACK_LAYERS.map((l) => (
            <div key={l.funder} className="rounded-xl border bg-card p-4 space-y-1">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium">{l.funder}</span>
                <span className="font-serif text-lg">{l.amount}</span>
              </div>
              <p className="text-sm">{l.instrument}</p>
              <p className="text-sm text-muted-foreground">{l.concession}</p>
              <p className="text-sm">
                <span className="text-muted-foreground">Status:</span> {l.status}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Signed paper looks like:</span>{' '}
                {l.signedPaper}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{STACK_EXCLUDED}</p>
        <p className="text-sm italic">{STACK_MIRROR_NOTE}</p>
      </section>

      {/* Band 4 — entity doors */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Where your money legally sits</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {ENTITY_DOORS.map((d) => (
            <div key={d.verb} className="rounded-xl border bg-card p-4 space-y-1">
              <p className="font-serif text-xl">{d.verb}</p>
              <p className="text-sm font-medium">{d.entity}</p>
              <p className="text-sm text-muted-foreground">{d.what}</p>
            </div>
          ))}
        </div>
        <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
          {ENTITY_NOTES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>

      {/* Band 5 — spend separation */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl">What we spend it on</h2>
        <p className="text-lg">{SPEND_SEPARATION.sentence}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[SPEND_SEPARATION.bed, SPEND_SEPARATION.block].map((col) => (
            <div key={col.title} className="rounded-xl border bg-card p-4 space-y-2">
              <p className="font-medium">{col.title}</p>
              {col.lines.map((ln) => (
                <div key={ln.label} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{ln.label}</span>
                  <span className="whitespace-nowrap font-medium">
                    {ln.value} <Tag s={ln.tag} />
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Band 6 — growth */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl">How it grows</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {GROWTH_STAGES.map((g) => (
            <div key={g.stage} className="rounded-xl border bg-card p-4 space-y-1">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">{g.stage}</p>
              <p className="font-serif text-xl">{g.beds}</p>
              <p className="text-sm">{g.means}</p>
              <p className="text-sm text-muted-foreground">{g.fundedBy}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          {ASK_DOORS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="rounded-full border px-4 py-1.5 text-sm hover:bg-muted"
            >
              {d.label} →
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
