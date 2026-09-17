import { communityRecord, isPublishable, type CommunityRecord, type ConsentState, type Held } from '@/lib/data/community-record';

/**
 * WHAT THE SYSTEM HOLDS ABOUT ONE COMMUNITY, and what may be said about each part.
 *
 * community-record.ts opens with "ONE RECORD PER COMMUNITY, the join across the five modules that
 * each hold a piece", and it carries every field as `Held<T>` with its own ConsentState, so
 * consent is a property of the field instead of a property of the page it lands on. It was
 * written in July, imported by two public pages, and rendered by no admin surface. Ben's admin
 * sweep on 17 September named it the last of four spines that existed and were optional.
 *
 * This is the surface for it, and the consent state is the reason to have it. Everywhere else in
 * the admin, whether a value may be published is a thing you have to know. Here it is on the row:
 *
 *   CLEARED           may appear on a page a stranger can open
 *   CONFIRM TOGETHER  true as far as we know, and the community has not seen it stated this way
 *   INTERNAL          ours, and never a statement about them
 *
 * The bed counts come from the canon that the register is guarded against, so this panel also
 * shows when the live rows and the ruling disagree. That is the Utopia 147-against-169 failure,
 * which reached an external document before anyone noticed.
 */

const TONE: Record<ConsentState, { label: string; className: string }> = {
  cleared: { label: 'CLEARED', className: 'bg-emerald-100 text-emerald-900' },
  'confirm-together': { label: 'CONFIRM TOGETHER', className: 'bg-amber-100 text-amber-900' },
  internal: { label: 'INTERNAL', className: 'bg-muted text-muted-foreground' },
};

function Field({ label, consent, source, children }: {
  label: string;
  consent: ConsentState;
  source: string;
  children: React.ReactNode;
}) {
  const tone = TONE[consent];
  return (
    <div className="border-t py-2.5 first:border-t-0">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wide ${tone.className}`}>{tone.label}</span>
        <span className="ml-auto text-[10px] text-muted-foreground">{source}</span>
      </div>
      <div className="mt-1 text-sm leading-snug">{children}</div>
    </div>
  );
}

export function CommunityCanonRecord({ communityId, liveBeds }: { communityId: string; liveBeds: number }) {
  const record: CommunityRecord | null = communityRecord(communityId, { asOf: new Date().toISOString().slice(0, 10) });
  if (!record) return null;

  const a = record.assets;
  const drift = a && liveBeds > 0 && liveBeds !== a.value.beds ? liveBeds - a.value.beds : 0;
  // isPublishable is the only filter a surface should need, so the count goes through it rather
  // than re-testing the consent state here and getting to disagree with it later.
  const fields = ([a, record.stage, record.modules, record.nextDecision, record.handover] as (Held<unknown> | null)[])
    .filter((f): f is Held<unknown> => f !== null);
  const publishable = fields.filter(isPublishable).length;
  const held = fields.length;

  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-base font-semibold">The record for {record.name}</h2>
        <p className="text-[11px] text-muted-foreground">
          {publishable} of {held} fields may be published. The rest are ours until the community has seen them.
        </p>
      </div>

      <div className="mt-2">
        {a && (
          <Field label="Assets" consent={a.consent} source={a.source}>
            <span className="font-semibold tabular-nums">{a.value.beds}</span> beds
            {a.value.basketBeds > 0 && a.value.stretchBeds > 0 && (
              <span className="text-muted-foreground"> ({a.value.basketBeds} Basket, {a.value.stretchBeds} Stretch)</span>
            )}
            {a.value.washers > 0 && <span>, <span className="font-semibold tabular-nums">{a.value.washers}</span> washing machines</span>}
            <span className="text-muted-foreground">, {a.value.plasticKg.toLocaleString('en-AU')}kg of HDPE, modelled at the per-bed rate.</span>
            {drift !== 0 && (
              <p className="mt-1 rounded bg-goods-terracotta/10 px-2 py-1 text-[11px] text-goods-terracotta">
                The live register counts {liveBeds} here, {Math.abs(drift)} {drift > 0 ? 'more' : 'fewer'} than the ruling.
                One of the two is wrong and the ruling is the one with a decision behind it.
              </p>
            )}
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{a.value.ruling}</p>
          </Field>
        )}

        {record.stage && (
          <Field label="Stage" consent={record.stage.consent} source={record.stage.source}>
            {record.stage.value.label}
          </Field>
        )}

        {record.modules && (
          <Field label="Modules asked for" consent={record.modules.consent} source={record.modules.source}>
            {record.modules.value.filter((m) => m.state !== 'not-assessed').map((m) => m.label).join(', ') || 'Nothing recorded yet.'}
          </Field>
        )}

        {record.nextDecision && (
          <Field label="What we think happens next" consent={record.nextDecision.consent} source={record.nextDecision.source}>
            {record.nextDecision.value}
          </Field>
        )}

        {record.handover && (
          <Field label="The handover test, run on ourselves" consent={record.handover.consent} source={record.handover.source}>
            {record.handover.value.state}, {record.handover.value.passed.length} of {record.handover.value.ofTotal} checkpoints.
            <span className="block text-[11px] leading-relaxed text-muted-foreground">{record.handover.value.note}</span>
          </Field>
        )}
      </div>
    </section>
  );
}
