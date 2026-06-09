import { ConfidenceChip, type ConfidenceGrade } from './confidence-chip';

const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

/**
 * The health chain: why a bed and a washing machine are health hardware, not
 * comfort. Every link is graded with the same vocabulary as the rest of the
 * dashboard, and the claims follow the verdicts in
 * wiki/outputs/2026-05-29-goods-health-evidence-appendix.md. The hard rails:
 * never claim Goods independently reduces RHD; the skin arm of the strep
 * pathway is presented as recognised-but-emerging; no $250K surgery figure.
 */

const CHAIN: { step: string; title: string; body: string }[] = [
  {
    step: '01',
    title: 'A bed off the floor, a washer that works',
    body: 'Sleeping off the ground on a washable surface, with a machine that can actually clean bedding in remote conditions.',
  },
  {
    step: '02',
    title: 'Clean bedding, fewer shared surfaces',
    body: 'Washable canvas and working laundry interrupt the cycle that keeps scabies and skin sores moving through a crowded house.',
  },
  {
    step: '03',
    title: 'Healthier skin, fewer strep infections',
    body: 'Up to a third of children in some remote communities carry scabies. Skin sores are a major entry point for Group A strep.',
  },
  {
    step: '04',
    title: 'Less rheumatic fever and heart disease',
    body: 'Recurrent strep infection drives acute rheumatic fever, which becomes rheumatic heart disease. 94 percent of new ARF cases in Australia are First Nations people.',
  },
];

const EVIDENCE: { value: string; label: string; source: string; grade: ConfidenceGrade; note?: string }[] = [
  {
    value: '40%',
    label: 'fewer infectious-disease hospital separations where housing health hardware was fixed',
    source: 'Housing for Health, 71 communities, NSW Health',
    grade: 'counted',
    note: 'Published program evaluation across 2,230 houses. Not a Goods result; the evidence base we build on.',
  },
  {
    value: '69-71%',
    label: 'modelled reduction in ARF and RHD cases from the full prevention bundle',
    source: 'END RHD Endgame Strategy, Telethon Kids Institute',
    grade: 'modelled',
    note: 'Modelled, not observed. The bundle: less crowding, better hygiene infrastructure, stronger primary care, reliable prophylaxis.',
  },
  {
    value: 'Up to ⅓',
    label: 'of children in some remote communities carry scabies at any one time (the top of a 16 to 35 percent range)',
    source: 'Davidson et al. 2020, MJA; Gramp & Gramp 2021, PLOS NTDs',
    grade: 'counted',
    note: 'A published prevalence range, not an average. We quote the range honestly.',
  },
];

export function HealthPathway({ strategyLine }: { strategyLine?: string }) {
  return (
    <div>
      {/* The chain */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CHAIN.map((c) => (
          <div key={c.step} className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4', borderTop: `3px solid ${SAGE}` }}>
            <p className="text-[11px] font-semibold tracking-wide" style={{ color: `${CHARCOAL}66` }}>{c.step}</p>
            <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: CHARCOAL }}>{c.title}</p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{c.body}</p>
          </div>
        ))}
      </div>

      {/* The evidence base, graded */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {EVIDENCE.map((e) => (
          <div key={e.value} className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-2xl leading-none" style={{ color: RUST }}>{e.value}</p>
              <ConfidenceChip grade={e.grade} note={e.note} />
            </div>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}b3` }}>{e.label}</p>
            <p className="mt-2 text-[11px] leading-snug" style={{ color: `${CHARCOAL}80` }}>{e.source}</p>
          </div>
        ))}
      </div>

      {/* The honest frame: contribution to a documented bundle, never the cure */}
      <p className="mt-6 max-w-2xl text-sm leading-relaxed" style={{ color: `${CHARCOAL}99` }}>
        We hold this claim carefully. Goods has not run a clinical trial, and we never present a bed as a cure.
        What we claim is a contribution: beds and working washers are the hygiene-infrastructure link in a
        prevention bundle the research community has already modelled and named.
      </p>

      {strategyLine ? (
        <p className="mt-4 max-w-2xl border-l-2 pl-4 text-sm leading-relaxed" style={{ borderColor: RUST, color: `${CHARCOAL}cc` }}>
          {strategyLine}
        </p>
      ) : null}

      {/* The clearest health-partner voice we hold */}
      <figure className="mt-6 max-w-2xl rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
        <blockquote className="font-display text-lg leading-snug" style={{ color: CHARCOAL }}>
          &ldquo;There is also a lot of scabies and this often leads to Rheumatic Heart Disease, so washing
          machines are essential to be able to clean infected clothing, bedding and towels.&rdquo;
        </blockquote>
        <figcaption className="mt-3 text-xs uppercase tracking-wide" style={{ color: SAGE }}>
          Jessica Allardyce · Miwatj Health, East Arnhem Land
        </figcaption>
      </figure>
    </div>
  );
}
