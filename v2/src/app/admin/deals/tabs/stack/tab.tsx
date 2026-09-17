import {
  PROGRAM, THE_BLOCK, STACK, EXTERNAL_LINES, SIGNED_TOTAL_AUD, UNVERIFIED_LINE_IDS,
  POOL_LINES, POOL_BEDS_IF_ALL_LAND, BED_PRICE_AUD, bedsFunded,
  type StackLine, type CommitmentStatus,
} from '@/lib/data/raise-stack';

/**
 * THE RAISE STACK, ON A SCREEN.
 *
 * raise-stack.ts is 423 lines with 19 guards, written 2 September 2026 to be the one home for
 * the September raise after the stack lived by hand in Notion and the deck carried $750,000
 * twice, once as the cost of the beds and once as maximum gross sales. On 17 September the
 * dead-code sweep found that no surface imported it. The raise was modelled, guarded, and
 * invisible, with QBE nine days out.
 *
 * It renders here, on the raise hub, next to the board it describes.
 *
 * The three rules the module enforces are the three things this screen must not soften:
 *   $0 signed is derived from the line statuses, never typed, so it moves when a letter exists
 *   and not before.
 *   QBE is discretionary and sits ON TOP of signed external paper. It never doubles, triggers or
 *   guarantees anything (ruling V).
 *   The program figure is a COST: the price times the beds. It is never a sales figure and never
 *   community income.
 */

const money = (n: number) => `$${n.toLocaleString('en-AU')}`;

const STATUS_TONE: Record<CommitmentStatus, string> = {
  signed: 'bg-emerald-100 text-emerald-900',
  paid: 'bg-emerald-100 text-emerald-900',
  'ask-made': 'bg-amber-100 text-amber-900',
  invited: 'bg-primary/10 text-primary',
  target: 'bg-muted text-muted-foreground',
  excluded: 'bg-muted text-muted-foreground line-through',
};

function Line({ line }: { line: StackLine }) {
  const unverified = UNVERIFIED_LINE_IDS.includes(line.id);
  const beds = bedsFunded(line);
  return (
    <tr className="border-b align-top">
      <td className="py-2.5 pr-3">
        <span className="font-medium">{line.funder}</span>
        {unverified && (
          <span className="ml-2 rounded bg-goods-terracotta/10 px-1.5 py-0.5 text-[9px] font-semibold text-goods-terracotta">
            ONE SOURCE, NEVER SUMMED
          </span>
        )}
        <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{line.note}</span>
      </td>
      <td className="whitespace-nowrap py-2.5 pr-3 text-right tabular-nums">
        {line.amountAud === null ? 'no amount yet' : money(line.amountAud)}
        {line.split && (
          <span className="block text-[10px] text-muted-foreground">
            {money(line.split.poolAud)} pool · {money(line.split.proofsAud)} proofs
          </span>
        )}
      </td>
      <td className="whitespace-nowrap py-2.5 pr-3 text-right tabular-nums text-muted-foreground">
        {beds > 0 ? `${beds} beds` : 'none'}
      </td>
      <td className="whitespace-nowrap py-2.5 pr-3">
        <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${STATUS_TONE[line.status]}`}>
          {line.status}
        </span>
      </td>
      <td className="py-2.5 text-[10px] leading-snug text-muted-foreground">
        {line.instrument} · {line.legalHome}
        <span className="block">read {line.asAt}</span>
      </td>
    </tr>
  );
}

export function StackTab() {
  const askedTotal = EXTERNAL_LINES.reduce((n, l) => n + (l.amountAud ?? 0), 0);
  const shortfall = PROGRAM.beds - POOL_BEDS_IF_ALL_LAND;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-card p-4">
        <p className="font-display text-lg leading-snug">{PROGRAM.sentence}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{PROGRAM.honesty}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{PROGRAM.twoPots}</p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Labelled {PROGRAM.label}. {PROGRAM.source}. Read {PROGRAM.asAt}.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { k: 'Signed', v: money(SIGNED_TOTAL_AUD), s: 'derived from the line statuses, never typed' },
          { k: 'Asked, external', v: money(askedTotal), s: `${EXTERNAL_LINES.length} lines that can count once signed` },
          { k: 'Beds if all land', v: String(POOL_BEDS_IF_ALL_LAND), s: `${shortfall} short of ${PROGRAM.beds}` },
          { k: 'Programme cost', v: money(PROGRAM.costAud), s: `${PROGRAM.beds} beds at ${money(BED_PRICE_AUD)}. What the beds cost to make.` },
        ].map((m) => (
          <div key={m.k} className="rounded-xl border bg-card p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{m.k}</p>
            <p className="mt-1 font-display text-2xl leading-none">{m.v}</p>
            <p className="mt-1.5 text-[10px] leading-snug text-muted-foreground">{m.s}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-semibold">The block this raise does not fund</p>
        <p className="mt-1 text-sm leading-relaxed">{THE_BLOCK.line}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          Labelled {THE_BLOCK.label}. {THE_BLOCK.why}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr className="text-left text-[10px] uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2 font-semibold">Line</th>
              <th className="px-4 py-2 text-right font-semibold">Amount</th>
              <th className="px-4 py-2 text-right font-semibold">Beds</th>
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold">Instrument and home</th>
            </tr>
          </thead>
          <tbody className="[&_td:first-child]:pl-4 [&_td:last-child]:pr-4">
            {STACK.map((l) => <Line key={l.id} line={l} />)}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {POOL_LINES.length} pool lines count toward the beds. A line reads signed only with an
        evidence field naming the letter, its date and a person the Social Impact Hub can call, so
        the signed figure above moves when paper exists and not before. QBE is discretionary and
        sits on top of signed external commitments; it doubles nothing.
      </p>
    </div>
  );
}
