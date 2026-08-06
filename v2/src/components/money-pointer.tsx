import Link from 'next/link';

/**
 * The ONLY way a general public surface talks about investor money.
 *
 * The rule (Ben, 2026-08-06): money is spoken in full in exactly one place — the money
 * half of /pitch/road — and everywhere else in this one sentence. Every time the cost
 * model, the raise or unit economics were re-told in prose on another page, the copies
 * drifted and a funder eventually read two different numbers. scripts/check-money-prose.mjs
 * fails the build if a dollar figure appears in prose outside the allowed money surfaces.
 *
 * Deliberately not configurable beyond the lead-in: a configurable sentence is prose again.
 */
export function MoneyPointer({ lead }: { lead?: string }) {
  return (
    <p className="text-sm leading-6 text-stone-500">
      {lead ?? 'Production is meant to pay for itself.'}{' '}
      The numbers — what a bed costs, what stays, what we are raising —{' '}
      live in one place:{' '}
      <Link href="/pitch/road#model" className="underline decoration-amber-600 underline-offset-2 hover:text-stone-700">
        the road to ownership
      </Link>
      .
    </p>
  );
}
