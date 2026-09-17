import {
  BED_UNIT, SCALE_ROWS, RATIO_NOTE, UNLOCK, RATIO_GUARDRAIL, POOL_BEDS,
} from '@/lib/data/bed-ratio';
import {
  POOL, FACILITY_BAND, SITE_FLOOR, LOOP_STEPS, LOOP_RETURN, LOOP_GATES,
  STAYS_KIT_AUD, STAYS_PRESSED_AUD,
} from '@/lib/data/community-loop';
import type { Solidity } from '@/lib/data/cost-story';

/**
 * THE UNIT AND THE LOOP: two rulings from 2 September 2026 that nothing rendered.
 *
 * bed-ratio.ts is Ben's, that evening: "the ask does not have to be $750,000. Make the unit one
 * bed, show what one bed does, and let any grant scale in a straight line." community-loop.ts is
 * Nic's, from the Dusseldorp call the same day: a community receives 200 beds, sells what it
 * chooses at $750, keeps the money, and puts it toward making the next bed locally.
 *
 * Both were written, guarded and imported by nothing. Found by the dead-code sweep on
 * 17 September, which is how a funder-facing argument can be fully worked out and invisible.
 *
 * EVERY FIGURE CARRIES ITS LABEL, and the labels are the point. Verified is an invoice or a live
 * register. Workpaper is our arithmetic, checkable. Modelled is built from verified inputs.
 * Target is a future state nobody has agreed to yet. The straight line in the scale table is the
 * funder's way in; real sites do not scale in a straight line and the guardrail says so.
 *
 * Nothing here is community income. Sales money is gross sales on beds a community chooses to
 * sell, and none of it is income until the rules are agreed with that community.
 */

const money = (n: number) => `$${Math.round(n).toLocaleString('en-AU')}`;

const LABEL_TONE: Record<Solidity, string> = {
  verified: 'bg-emerald-100 text-emerald-900',
  workpaper: 'bg-sky-100 text-sky-900',
  modelled: 'bg-amber-100 text-amber-900',
  target: 'bg-muted text-muted-foreground',
  // Neither appears on these two modules today, and a label with no tone would render bare.
  conflict: 'bg-goods-terracotta/15 text-goods-terracotta',
  retired: 'bg-muted text-muted-foreground line-through',
};

function Label({ label }: { label: Solidity }) {
  return <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${LABEL_TONE[label] ?? ''}`}>{label}</span>;
}

export function UnitTab() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-semibold">What one bed does</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BED_UNIT.map((u) => (
            <div key={u.title} className="rounded-lg bg-muted/50 p-3">
              <p className="flex items-start justify-between gap-2 text-sm font-semibold leading-snug">
                {u.title} <Label label={u.label} />
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{u.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{RATIO_NOTE}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b px-4 py-3">
          <p className="text-xs font-semibold">Any amount, the same ratio</p>
          <p className="text-[10px] text-muted-foreground">The ask sits at $250,000. $400,000 is the ceiling.</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-right text-[10px] uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2 text-left font-semibold">Amount</th>
              <th className="px-4 py-2 font-semibold">Beds</th>
              <th className="px-4 py-2 font-semibold">Pools</th>
              <th className="px-4 py-2 font-semibold">HDPE</th>
              <th className="px-4 py-2 font-semibold">Local hours</th>
              <th className="px-4 py-2 font-semibold">Fair-wage labour</th>
              <th className="px-4 py-2 font-semibold">Stays local if all sold</th>
            </tr>
          </thead>
          <tbody>
            {SCALE_ROWS.map((r) => (
              <tr key={r.amountAud} className="border-b text-right tabular-nums">
                <td className="px-4 py-2.5 text-left font-semibold">{money(r.amountAud)}</td>
                <td className="px-4 py-2.5">{r.beds}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{r.pools.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{r.hdpeTonnes.toFixed(1)}t</td>
                <td className="px-4 py-2.5 text-muted-foreground">{Math.round(r.localHours).toLocaleString('en-AU')}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{money(r.fairWageAud)}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{money(r.staysLocalIfAllSoldAud)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">{RATIO_GUARDRAIL}</p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-sm font-semibold">{UNLOCK.title}</p>
        <p className="mt-1.5 text-sm leading-relaxed">{UNLOCK.body}</p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-semibold">One community loop</p>
          <p className="text-[10px] text-muted-foreground">
            {POOL.beds} beds, {money(POOL.costAud)} to make. A facility is {money(FACILITY_BAND.lowAud)} to {money(FACILITY_BAND.highAud)}.
          </p>
        </div>
        <ol className="mt-3 space-y-2.5">
          {LOOP_STEPS.map((s) => (
            <li key={s.n} className="flex gap-3">
              <span className="font-display text-xl leading-none text-muted-foreground">{s.n}</span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-semibold">{s.title} <Label label={s.label} /></span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">{s.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 border-t pt-3 text-sm">
          <span className="font-semibold">{LOOP_RETURN.title}. </span>
          <span className="text-muted-foreground">{LOOP_RETURN.body}</span>
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          About {money(STAYS_PRESSED_AUD)} stays on a bed pressed locally against about {money(STAYS_KIT_AUD)} on a kit.
          The site floor is {SITE_FLOOR.sentence}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-semibold">Nothing in the loop is real until these four are true at a named site</p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {LOOP_GATES.map((g) => (
            <div key={g.title} className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm font-semibold">{g.title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{g.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">One pool is {POOL_BEDS} beds.</p>
      </div>
    </div>
  );
}
