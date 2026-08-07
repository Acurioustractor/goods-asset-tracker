import Link from 'next/link';
import type { Metadata } from 'next';
import {
  EXTERNAL_CLAIMS,
  ANTI_CLAIMS,
  CLAIMS_CHANGELOG,
  type Claim,
  type ClaimStatus,
} from '@/lib/data/claims-ledger';

/**
 * THE CLAIMS REGISTER — the public page where Goods audits its own numbers.
 *
 * Every headline number used on an external surface appears here as a claim
 * row: what we say, what it's based on, what it does NOT say, and when it is
 * promised to change. Renders ONLY from claims-ledger.ts (default-deny).
 * The substrate of the "deck that audits itself" concept (2026-07-10).
 */

export const metadata: Metadata = {
  title: 'The Claims Register: Goods on Country',
  description:
    'Every number Goods on Country uses in public, what it is based on, what it means and what it does not mean.',
  alternates: { canonical: 'https://www.goodsoncountry.com/register' },
};

const display = { fontFamily: 'var(--font-display, Georgia, serif)' } as const;

const STATUS_META: Record<
  ClaimStatus,
  { label: string; chip: string; blurb: string }
> = {
  verified: {
    label: 'Confirmed',
    chip: 'bg-accent/20 text-accent-foreground border-accent/40',
    blurb: 'Counted or measured from a named record.',
  },
  modelled: {
    label: 'Estimate',
    chip: 'border-[color:var(--goods-gold)]/50 text-[color:var(--goods-gold)] bg-[color:var(--goods-gold)]/10',
    blurb: 'Calculated from stated assumptions and not yet measured.',
  },
  interest: {
    label: 'Interest',
    chip: 'border-[color:var(--goods-clay)]/50 text-[color:var(--goods-clay)] bg-[color:var(--goods-clay)]/10',
    blurb: 'Requests or offers, not confirmed sales.',
  },
  future: {
    label: 'Working towards',
    chip: 'border-[color:var(--goods-teal)]/50 text-[color:var(--goods-teal)] bg-[color:var(--goods-teal)]/10',
    blurb: 'Work that has started but is not complete.',
  },
  locked: {
    label: 'Waiting',
    chip: 'border-foreground/30 text-foreground bg-foreground/5',
    blurb: 'Waiting for written confirmation before a number is published.',
  },
};

const SECTION_ORDER: ClaimStatus[] = ['verified', 'modelled', 'interest', 'future', 'locked'];

function StatusChip({ status }: { status: ClaimStatus }) {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-medium ${m.chip}`}
    >
      {m.label}
    </span>
  );
}

function ClaimRow({ claim }: { claim: Claim }) {
  return (
    <article id={claim.id} className="scroll-mt-24 border-t border-border py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-medium text-foreground">{claim.headline}</h3>
          <StatusChip status={claim.status} />
        </div>
        {claim.figure ? (
          <div className="text-2xl font-light text-foreground sm:text-3xl" style={display}>
            {claim.figure}
          </div>
        ) : claim.status === 'locked' ? (
          <div className="text-2xl font-light tracking-widest text-muted-foreground" style={display} aria-label="Figure waiting for written confirmation">
            ·····
          </div>
        ) : null}
      </div>

      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{claim.statement}</p>

      {claim.ceiling && (
        <p className="mt-2 max-w-3xl text-sm italic leading-relaxed text-foreground/80">
          <span className="not-italic text-[10px] font-medium uppercase tracking-wider text-muted-foreground">This does not mean: </span>
          {claim.ceiling}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
        <span className="tabular-nums">As at {claim.asOf}</span>
        {claim.evidence.map((e) =>
          e.href ? (
            <Link key={e.label} href={e.href} className="underline decoration-border underline-offset-4 transition hover:text-foreground">
              {e.label}
            </Link>
          ) : (
            <span key={e.label}>{e.label}</span>
          ),
        )}
        {claim.flip && (
          <span className="text-foreground/80">
            <span className="font-medium">Next update, {claim.flip.when}:</span> {claim.flip.how}
          </span>
        )}
      </div>
    </article>
  );
}

export default function RegisterPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-24">
      {/* ── Header ── */}
      <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.25em] text-primary sm:text-xs">
        The Register
      </p>
      <h1 className="max-w-3xl text-3xl font-light leading-tight text-foreground sm:text-5xl" style={display}>
        Every public number, with a clear source.
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
        This page shows the numbers Goods on Country uses in public, where each number came from,
        whether it was counted or estimated, and what it does not mean. If we cannot show the
        basis for a number, we do not publish it.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
        <Link
          href="/pitch/road"
          className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90"
        >
          Read the Road to Ownership
        </Link>
      </div>

      {/* ── Anti-claims ── */}
      <section className="mt-16">
        <h2 className="text-2xl font-light text-foreground sm:text-3xl" style={display}>
          First: what we don&rsquo;t claim.
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {ANTI_CLAIMS.map((a) => (
            <div key={a.statement} className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-medium text-foreground">{a.statement}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.why}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The register ── */}
      <section className="mt-16">
        <h2 className="text-2xl font-light text-foreground sm:text-3xl" style={display}>
          The register.
        </h2>
        {SECTION_ORDER.map((status) => {
          const rows = EXTERNAL_CLAIMS.filter((c) => c.status === status);
          if (rows.length === 0) return null;
          const m = STATUS_META[status];
          return (
            <div key={status} className="mt-10">
              <div className="flex items-baseline gap-3">
                <StatusChip status={status} />
                <p className="text-sm text-muted-foreground">{m.blurb}</p>
              </div>
              <div className="mt-4">
                {rows.map((c) => (
                  <ClaimRow key={c.id} claim={c} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Changelog ── */}
      <section className="mt-16">
        <h2 className="text-2xl font-light text-foreground sm:text-3xl" style={display}>
          Updates.
        </h2>
        <ol className="mt-6 space-y-4">
          {CLAIMS_CHANGELOG.map((e) => (
            <li key={`${e.date}-${e.note.slice(0, 24)}`} className="flex gap-4 border-t border-border pt-4 text-sm">
              <span className="shrink-0 tabular-nums font-medium text-foreground">{e.date}</span>
              <span className="text-muted-foreground">{e.note}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Method ── */}
      <section className="mt-16 border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">How this register works.</span> Every number
          comes from a named record. We show whether it was counted, estimated, expressed as
          interest, planned for the future or is still waiting for confirmation. Voices and photos
          only appear after they are cleared for public use. When a source changes, this page is
          updated too.
        </p>
      </section>
    </main>
  );
}
