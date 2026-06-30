/**
 * QBE readiness / investor one-pager (/sites/qbe-readiness).
 *
 * A single, self-contained Server Component that says the simple thing first:
 * twelve readiness areas collapse into ONE goal and FIVE proofs. Order:
 * header + confidential banner -> 10-second proof (4 metric cards) -> the simple
 * frame -> the one goal -> the ask + stack -> the five proofs -> the program
 * timeline (near-term gates + three phases) -> a scannable 12-area scoreboard
 * (one line each, not essays) -> links to the live models -> provenance footer.
 *
 * "The real models" are the live, same-login gated tools, linked directly:
 * /sites/qbe (cost-model cockpit), /sites/cost-lab and /sites/cost-lab/playbook.
 * The strategic-pack .md files are repo-only and are deliberately NOT presented
 * as links here (a funder cannot open them).
 *
 * VISIBILITY: gated behind the shared INVESTORS_PASSWORD cookie in src/proxy.ts
 * (same gate as /sites/qbe, /sites/cost-lab and /investors), rendered standalone,
 * noindex. A confidential banner is carried on-page as defence in depth.
 *
 * PUBLIC-COPY DISCIPLINE: figures and dates trace to the 2026-06-13 strategic
 * pack (03-next-stage-focus.md, 00-master-alignment-map.md). Evidence tiers are
 * labelled. Nothing here is audited or final. NO em dashes (brand rule).
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CircleDollarSign,
  ExternalLink,
  Gauge,
  ListChecks,
  Lock,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'QBE Readiness One-Pager · Goods on Country',
  description:
    'The simple version: one goal, five proofs, and the program timeline for the Goods on Country QBE capital pathway.',
  robots: { index: false, follow: false },
};

// ── Evidence tiers ──────────────────────────────────────────────────────────
// One label on every number that needs it. A figure only moves toward Verified
// as the evidence catches up.
type Tier = 'Verified' | 'Workpaper' | 'Modelled' | 'Target' | 'Open';

const TIER_STYLE: Record<Tier, string> = {
  Verified: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  Workpaper: 'border-amber-300 bg-amber-50 text-amber-900',
  Modelled: 'border-sky-300 bg-sky-50 text-sky-800',
  Target: 'border-violet-300 bg-violet-50 text-violet-800',
  Open: 'border-rose-300 bg-rose-50 text-rose-800',
};

const TIER_LEGEND: Array<{ tier: Tier; meaning: string }> = [
  { tier: 'Verified', meaning: 'Checkable today' },
  { tier: 'Workpaper', meaning: 'Xero mirror, unaudited' },
  { tier: 'Modelled', meaning: 'Planning assumption' },
  { tier: 'Target', meaning: 'Sought, not signed' },
  { tier: 'Open', meaning: 'Gap to close' },
];

function Pill({ tier }: { tier: Tier }) {
  return (
    <Badge variant="outline" className={`text-[11px] font-semibold ${TIER_STYLE[tier]}`}>
      {tier}
    </Badge>
  );
}

// ── 10-second proof ────────────────────────────────────────────────────────
const METRICS: Array<{ value: string; label: string; sub: string; tier: Tier }> = [
  {
    value: '496 beds',
    label: '9 communities',
    sub: 'Every bed QR-tracked in a live register a stranger can scan.',
    tier: 'Verified',
  },
  {
    value: 'AU$713,827',
    label: 'Goods-only received',
    sub: 'Accountant-signed carve-out, within AU$741,111 all-sources received.',
    tier: 'Verified',
  },
  {
    value: 'AU$0 signed',
    label: 'of a ~AU$400K target',
    sub: 'First match-eligible capital, due signed by 31 August 2026.',
    tier: 'Open',
  },
  {
    value: 'Up to AU$400K',
    label: 'QBE match',
    sub: 'At least 1:1 against secured capital. Repayable finance preferred.',
    tier: 'Target',
  },
];

// ── The ask (the stack, junior to senior) ──────────────────────────────────
const STACK: Array<{ label: string; amount: string; detail: string; tier: Tier }> = [
  { label: 'Grants', amount: '~AU$500K', detail: 'Snow R4/R5, Centrecorp, VFFF', tier: 'Target' },
  {
    label: 'QBE match',
    amount: 'up to AU$400K',
    detail: 'at least 1:1 vs secured capital, repayable preferred',
    tier: 'Target',
  },
  { label: 'SEFA', amount: 'AU$300K', detail: 'concessional working-capital line', tier: 'Target' },
];

// ── The five proofs ─────────────────────────────────────────────────────────
type ProofStatus = 'In progress' | 'Not started';

const PROOF_STATUS_STYLE: Record<ProofStatus, string> = {
  'In progress': 'border-amber-300 bg-amber-50 text-amber-900',
  'Not started': 'border-stone-300 bg-stone-100 text-stone-600',
};

const PROOFS: Array<{
  number: number;
  title: string;
  owners: string;
  body: string;
  status: ProofStatus;
}> = [
  {
    number: 1,
    title: 'The money is real',
    owners: 'Ben, Nic, accountant',
    body: 'The accountant-signed Goods-only figure is done at AU$713,827. The live gap is one signed commitment: an LOI, offtake, term sheet, or facility that QBE accepts as match evidence.',
    status: 'In progress',
  },
  {
    number: 2,
    title: 'The legal vehicle is decided',
    owners: 'Ben, Nic, Keith Rovers',
    body: 'One approved entity-wording block. It is the keystone that gates Supply Nation 51% certification, IBA eligibility, and four of eight procurement channels.',
    status: 'In progress',
  },
  {
    number: 3,
    title: 'The cost-down is measured, not modelled',
    owners: 'Nic, accountant, SIH cost advisor',
    body: 'The 50-bed in-source run (about AU$60K to AU$80K) that turns the AU$426 in-house bed cost from modelled to measured. Today: 0 beds built in-house.',
    status: 'Not started',
  },
  {
    number: 4,
    title: 'Impact and consent hold up',
    owners: 'Ben',
    body: 'The named impact method is in place and 32 voices are cleared for external use. The live discipline is keeping every public claim labelled verified, modelled, target, or future.',
    status: 'In progress',
  },
  {
    number: 5,
    title: 'Governance and people look fundable',
    owners: 'Ben, Nic',
    body: 'The step from an advisory committee to an independent-majority board (it gates SEFA debt), and a 12-month role map naming the GM and BD hires.',
    status: 'Not started',
  },
];

// ── The program timeline ────────────────────────────────────────────────────
const MILESTONES: Array<{ when: string; what: string; tier?: Tier }> = [
  {
    when: 'Now, 26 June 2026',
    what: 'The documents are done. 496 beds proven and tracked. Accountant-signed Goods-only revenue: AU$713,827. Signed match capital today: AU$0.',
  },
  {
    when: '1 July 2026',
    what: 'Supply Nation 51% First Nations ownership threshold tightens. A legal-structure gate.',
  },
  {
    when: 'By 31 August 2026',
    what: 'Close the first ~AU$400K of signed, match-eligible capital. This is the one deadline that matters.',
    tier: 'Open',
  },
  { when: 'September 2026', what: 'QBE Stage 2 application submitted.' },
  { when: 'November 2026', what: 'QBE outcome decided. The match is paid against capital already raised.' },
];

const PHASES: Array<{ n: number; name: string; horizon: string; body: string }> = [
  {
    n: 1,
    name: 'De-risk',
    horizon: 'next ~12 months',
    body: 'Run the 50-bed proof, close the first ~AU$400K, use the accountant-signed carve-out, decide the legal entity, and put the first community operator on payroll.',
  },
  {
    n: 2,
    name: 'Prove the engine',
    horizon: 'after de-risk',
    body: 'Institutional buyers shift from grant-funded to procurement-funded. The first community-employed operator runs a repeatable build.',
  },
  {
    n: 3,
    name: 'Scale on country',
    horizon: 'the endgame',
    body: 'Distributed, community-owned production. The central organisation steps back. The job was always to become unnecessary.',
  },
];

// ── The 12-area scoreboard (one line each, not essays) ──────────────────────
type Row = {
  number: number;
  name: string;
  from?: string;
  to?: string;
  label?: string;
  priority: boolean;
  line: string;
};

const ROWS: Row[] = [
  {
    number: 1,
    name: 'Vision & Ambition',
    from: '8',
    to: '9',
    priority: false,
    line: 'Become unnecessary: communities owning the means to collect, make, repair, and sell.',
  },
  {
    number: 2,
    name: 'Social Objective & Impact',
    from: '5',
    to: '8',
    priority: true,
    line: 'Every metric labelled verified, modelled, or future. No health claims without partner evidence.',
  },
  {
    number: 3,
    name: 'Business Model Clarity',
    from: '4',
    to: '7',
    priority: true,
    line: 'About 89% grant-funded today. The path off grants: in-source plastic, shift buyers to procurement.',
  },
  {
    number: 4,
    name: 'Financial Management',
    from: '4',
    to: '7',
    priority: true,
    line: 'The Goods-only figure is now accountant-signed at AU$713,827. The gates are opening cash, capex quotes, and full workbook review.',
  },
  {
    number: 5,
    name: 'Strategic Planning & Risk',
    from: '5',
    to: '7',
    priority: true,
    line: 'Three phases with pre-agreed scenario forks, and a scored register of 14 risks with named owners.',
  },
  {
    number: 6,
    name: 'Process & Technology',
    from: '7',
    to: '8',
    priority: false,
    line: 'The operating loop is mapped end to end. The QR register of 496 beds is the strongest single proof.',
  },
  {
    number: 7,
    name: 'Governance, Data & Reporting',
    from: '5',
    to: '8',
    priority: true,
    line: 'Advisory committee and a real OCAP data practice are live. A fiduciary board is still to stand up.',
  },
  {
    number: 8,
    name: 'People & Organisation',
    from: '6',
    to: '7',
    priority: false,
    line: 'Two founders carry six domains. Phased hires triggered by signed capital, the GM first.',
  },
  {
    number: 9,
    name: 'Legal Structure',
    from: '5',
    to: '7',
    priority: false,
    line: 'The keystone. One legally-reviewed entity-wording block gates Supply Nation, IBA, and procurement.',
  },
  {
    number: 10,
    name: 'Investors & Capital Raising',
    from: '6',
    to: '8',
    priority: false,
    line: 'Demand is proven (an Elder self-funding 20 beds, 107 beds via Centrecorp). The ask is the first signed dollar.',
  },
  {
    number: 11,
    name: 'Cost Model',
    label: 'P0',
    priority: true,
    line: 'What does in-sourcing plastic do to the bed cost? Buy-kit AU$685, factory AU$426, community AU$421 (modelled).',
  },
  {
    number: 12,
    name: 'Investor Alignment',
    label: 'Populated',
    priority: false,
    line: 'Goods own filter (8 knockout, 14 fit) now scores a warmest-first shortlist: SEFA, Snow, Centrecorp, Minderoo, and VFFF lead the first ~AU$400K.',
  },
];

// ── The live models (the real, openable links) ──────────────────────────────
const MODELS: Array<{ href: string; title: string; body: string }> = [
  {
    href: '/sites/qbe',
    title: 'Live cost-model cockpit',
    body: 'The interactive engine: unit economics, the injection stack, and the 36-month forecast you can change inputs on.',
  },
  {
    href: '/sites/cost-lab',
    title: 'Cost Lab',
    body: 'The first-principles working room. Build a bed up from raw materials and watch breakeven move.',
  },
  {
    href: '/sites/cost-lab/playbook',
    title: 'Cost Lab playbook',
    body: 'The five analogies and set-plays for explaining the cost-down to any audience in plain language.',
  },
];

const serif = { fontFamily: 'Georgia, serif' } as const;

function SectionHeading({
  icon: Icon,
  children,
  color = '#A8643F',
}: {
  icon: typeof Gauge;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5" style={{ color }} />
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={serif}>
        {children}
      </h2>
    </div>
  );
}

export default function QbeReadinessPage() {
  return (
    <main className="min-h-screen bg-[#FDF8F3] text-[#2B2A26]">
      {/* Confidential banner */}
      <div className="border-b border-amber-300 bg-[#FBEFD8]">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2 text-xs font-medium text-amber-900 sm:px-6">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          Confidential investor draft, June 2026. Nothing here is audited or final. Re-pull Xero
          before any external send.
        </div>
      </div>

      {/* Header */}
      <section className="border-b border-stone-800 bg-[#24211D] text-[#FDF8F3]">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-[#BBA255]/30 bg-[#BBA255]/15 text-[#FDF8F3]">
              QBE readiness
            </Badge>
            <Badge className="border-white/15 bg-white/10 text-[#FDF8F3]">
              One goal · five proofs · the timeline
            </Badge>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#BBA255]">
            Goods on Country
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-light leading-tight sm:text-5xl" style={serif}>
            A good bed is health hardware.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#E6DFD1] sm:text-lg">
            We deliver quality, washable, repairable household goods to remote Indigenous
            communities, built for real remote conditions from recycled plastic, every unit tracked.
            This is environmental-health hardware, not charity furniture. The endgame is to become
            unnecessary: local people making, owning, and repairing the goods themselves.
          </p>
        </div>
      </section>

      {/* Evidence labels */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Evidence labels
          </span>
          {TIER_LEGEND.map(({ tier, meaning }) => (
            <span key={tier} className="flex items-center gap-2">
              <Pill tier={tier} />
              <span className="text-xs text-stone-600">{meaning}</span>
            </span>
          ))}
        </div>
      </section>

      {/* 10-second proof */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <SectionHeading icon={Gauge}>The proof, in 10 seconds</SectionHeading>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          What is deployed, what is banked, what is signed versus sought.
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div
              key={m.value}
              className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-2xl font-semibold leading-tight text-[#2B2A26]">{m.value}</p>
                <Pill tier={m.tier} />
              </div>
              <p className="mt-1 text-sm font-medium text-stone-700">{m.label}</p>
              <p className="mt-3 text-xs leading-5 text-stone-500">{m.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The simple frame */}
      <section className="border-y border-stone-200 bg-[#24211D] text-[#FDF8F3]">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#BBA255]">
            The whole thing, simply
          </p>
          <p className="mt-4 max-w-3xl text-xl leading-8 sm:text-2xl" style={serif}>
            Twelve readiness areas collapse into one goal and five proofs. The homework is finished.
            What is left is not more documents. It is real-world evidence.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#E6DFD1]">
            Close one signed dollar, use accountant-signed numbers, decide the legal entity, measure
            (not model) the bed cost, and clear consent on impact. Get those and the QBE match doubles
            the money. That is the game between now and 31 August.
          </p>
        </div>
      </section>

      {/* The one goal */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <SectionHeading icon={Target}>The one goal</SectionHeading>
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-6 sm:p-8">
          <p className="text-lg leading-8 text-[#2B2A26] sm:text-xl">
            Close the first{' '}
            <span className="font-semibold">~AU$400K of signed, match-eligible capital by 31
            August 2026.</span>{' '}
            QBE then adds up to AU$400K, but only as a match, so signed external money has to come
            first. Today that number is{' '}
            <span className="font-semibold text-rose-700">AU$0 signed</span>. The entire stage is the
            work of getting it off zero. A conversation problem, not a discovery problem.
          </p>
        </div>
      </section>

      {/* The ask */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <SectionHeading icon={CircleDollarSign}>The ask</SectionHeading>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700">
            AU$900K to AU$1M, blended and non-equity. A de-risking round, not a growth round. No
            equity, because the end-state is community-owned production, so capital that needs an exit
            would contradict the thing being built.
          </p>

          <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            The stack, junior to senior
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {STACK.map((item) => (
              <div
                key={item.label}
                className="flex flex-col rounded-xl border border-stone-200 bg-[#FDF8F3] p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-stone-700">{item.label}</span>
                  <Pill tier={item.tier} />
                </div>
                <p className="mt-2 text-xl font-semibold text-[#2B2A26]">{item.amount}</p>
                <p className="mt-1 text-xs leading-5 text-stone-500">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-stone-500">
            All sought except the QBE invitation. See the numbers move in the{' '}
            <Link href="/sites/qbe" className="font-semibold text-[#A8643F] underline">
              live cost-model cockpit
            </Link>
            .
          </p>
        </div>
      </section>

      {/* The five proofs */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <SectionHeading icon={ShieldCheck}>The five proofs</SectionHeading>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          The real to-do list. None of it is a writing task. Each proof carries an owner and a
          status.
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROOFS.map((proof) => (
            <div
              key={proof.number}
              className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2B2A26] text-sm font-bold text-[#BBA255]">
                    {proof.number}
                  </span>
                  <h3 className="text-base font-semibold leading-snug text-[#2B2A26]">
                    {proof.title}
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[11px] font-semibold ${PROOF_STATUS_STYLE[proof.status]}`}
                >
                  {proof.status}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">{proof.body}</p>
              <p className="mt-4 border-t border-stone-100 pt-3 text-xs font-medium text-stone-500">
                <span className="uppercase tracking-[0.14em] text-stone-400">Owner</span>{' '}
                {proof.owners}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The program timeline */}
      <section className="border-y border-stone-200 bg-[#F6EFE6]">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <SectionHeading icon={CalendarDays} color="#5C8A86">
            The program timeline
          </SectionHeading>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
            The near-term gates first, then the three phases of the full program.
          </p>

          {/* Near-term gates */}
          <ol className="mt-7 space-y-0 border-l-2 border-stone-300 pl-6">
            {MILESTONES.map((m) => (
              <li key={m.when} className="relative pb-6 last:pb-0">
                <span className="absolute -left-[1.92rem] top-1 h-3.5 w-3.5 rounded-full border-2 border-[#5C8A86] bg-[#FDF8F3]" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[#2B2A26]">{m.when}</span>
                  {m.tier ? <Pill tier={m.tier} /> : null}
                </div>
                <p className="mt-1 text-sm leading-6 text-stone-600">{m.what}</p>
              </li>
            ))}
          </ol>

          {/* The three phases */}
          <h3 className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            The three phases
          </h3>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {PHASES.map((p) => (
              <div
                key={p.n}
                className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5C8A86]/15 text-sm font-bold text-[#3F6E6A]">
                    {p.n}
                  </span>
                  <h4 className="text-base font-semibold text-[#2B2A26]">{p.name}</h4>
                </div>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
                  {p.horizon}
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-600">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 12-area scoreboard */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <SectionHeading icon={ListChecks}>The 12 readiness areas, at a glance</SectionHeading>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Each area shows a score, now to target. A star marks a priority for this round.
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          {ROWS.map((r, i) => (
            <div
              key={r.number}
              className={`flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5 ${
                i > 0 ? 'border-t border-stone-100' : ''
              }`}
            >
              <div className="flex items-center gap-2 sm:w-64 sm:shrink-0">
                <span className="text-sm font-semibold tabular-nums text-stone-400">{r.number}</span>
                <span className="text-sm font-semibold text-[#2B2A26]">{r.name}</span>
                {r.priority ? (
                  <span className="text-[#BBA255]" aria-label="priority area">
                    ★
                  </span>
                ) : null}
              </div>
              <div className="sm:w-24 sm:shrink-0">
                {r.from && r.to ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-stone-700">
                    {r.from}
                    <ArrowRight className="h-3 w-3 text-stone-400" />
                    {r.to}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md border border-[#BBA255]/40 bg-[#FFF9EA] px-2 py-0.5 text-xs font-semibold text-[#8A6D1F]">
                    {r.label}
                  </span>
                )}
              </div>
              <p className="text-sm leading-6 text-stone-600 sm:flex-1">{r.line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The live models */}
      <section className="border-y border-stone-200 bg-[#F6EFE6]">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <SectionHeading icon={ExternalLink} color="#5C8A86">
            Open the real models
          </SectionHeading>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
            These are live and interactive, on this same login. Click in and change the inputs.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {MODELS.map((model) => (
              <Link
                key={model.href}
                href={model.href}
                className="group flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-[#5C8A86] hover:shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold leading-snug text-[#2B2A26]">
                    {model.title}
                  </h3>
                  <ArrowRight className="h-4 w-4 shrink-0 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-[#5C8A86]" />
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-600">{model.body}</p>
                <span className="mt-3 font-mono text-xs text-stone-400">{model.href}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Provenance footer */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-stone-400" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Evidence and provenance
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-xs leading-5 text-stone-500">
            This page distils the full 12-area strategic pack held in the repo (2026-06-13), where
            every number traces. A draft for founder review. Modelled figures are planning
            assumptions (0 beds assembled in-house). Workpaper figures are unaudited Xero mirror
            data and are not yet a Goods-only carve-out. Re-pull Xero and apply the entity-wording
            and number-audit checks before any external send.
          </p>
        </div>
      </section>
    </main>
  );
}
