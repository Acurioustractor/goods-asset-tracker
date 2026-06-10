import { ConfidenceChip } from './confidence-chip';

const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

/**
 * The washing machine's path: from the problem, through the Pakkimjalki Kari
 * prototype, to the cost-down R&D whose destination is a machine a family can
 * buy for their own home. Facts come from wiki/articles/products/washing-machine.md
 * and the May 2026 founder working conversation; unit costs are founder
 * estimates and are labelled modelled, never counted.
 */

const STEPS: { stage: string; title: string; body: string }[] = [
  {
    stage: 'The problem',
    title: 'Machines built for suburbs, dying in the desert',
    body: 'Standard machines fail fast in remote conditions. One Alice Springs provider sells about $3M a year of them into communities, and most end up in the dump within months. Families told us washing bedding is health, not convenience.',
  },
  {
    stage: 'First design',
    title: 'Pakkimjalki Kari, the V1 prototype',
    body: 'A commercial-grade Speed Queen base with the equivalent of bull bars and bash plates for remote conditions. Named in Warumungu language by Elder Dianne Stokes in Tennant Creek. It proves the durability and repairability direction.',
  },
  {
    stage: 'Happening now',
    title: 'R&D to bring the price down',
    body: 'The next-generation build is in development. V1 works, but at $4,300 a unit it is council and organisation territory. The design problem now is keeping the durability while stripping out cost.',
  },
  {
    stage: 'The destination',
    title: 'A machine a family can buy for home',
    body: 'The target is $2,000 to $2,500 depending on community needs and conversations, repairable close to community, so owning a washing machine at home becomes a normal purchase rather than a program.',
  },
];

const SOLVING: string[] = [
  'Resident price point',
  'Repair model in remote communities',
  'Home ownership vs community laundry',
  'Telemetry consent and data use',
  'Rebates and avoided-landfill levers on the real price',
];

export function WasherJourney({ washersLine }: { washersLine: string }) {
  return (
    <div>
      {/* The four-step path */}
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.stage} className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4', borderTop: `3px solid ${i === STEPS.length - 1 ? RUST : '#E8DED4'}` }}>
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: i === STEPS.length - 1 ? RUST : SAGE }}>
              {String(i + 1).padStart(2, '0')} · {s.stage}
            </p>
            <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: CHARCOAL }}>{s.title}</p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{s.body}</p>
          </li>
        ))}
      </ol>

      {/* The price path: the one number this section is really about */}
      <div className="mt-6 rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>The price has to fall by roughly half</p>
          <ConfidenceChip grade="modelled" note="Founder estimates from the May 2026 working conversation. Unit costs vary with spec and freight; the target is a design goal, not a promise." />
        </div>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="font-display text-3xl leading-none" style={{ color: CHARCOAL }}>$4,300</p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>What a V1 unit costs today. Bought by councils and organisations, out of reach for a household.</p>
          </div>
          <div>
            <p className="font-display text-3xl leading-none" style={{ color: RUST }}>$2,000 to $2,500</p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>The target depending on community needs and conversations, so families can buy one for home.</p>
          </div>
        </div>
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: '#EEE9E3' }} aria-hidden>
          <div className="h-full rounded-full" style={{ width: '50%', backgroundColor: RUST }} />
        </div>
        <p className="mt-2 text-[11px]" style={{ color: `${CHARCOAL}80` }}>{washersLine}</p>
      </div>

      {/* Still being solved: named honestly, same as everywhere else on this page */}
      <div className="mt-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>Still being solved</p>
        <div className="flex flex-wrap gap-2">
          {SOLVING.map((s) => (
            <span key={s} className="rounded-full px-4 py-2 text-sm" style={{ backgroundColor: '#FFFFFF', color: `${CHARCOAL}cc`, border: '1px solid #E8DED4' }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
