/**
 * QBE readiness / investor one-pager (/sites/qbe-readiness).
 *
 * A single, self-contained Server Component mirroring the Notion "Capital Command
 * Center" hierarchy, in order: header + confidential banner → the 10-second view
 * (4 headline metric cards) → the ask (one paragraph + the funding stack + first
 * use of funds) → are we ready? the five proofs (owner · why it matters · status)
 * → the 12 diagnostic areas as cards (number · name · score · ★ priority · key
 * points · artifact) → an evidence/provenance footer. It complements the
 * interactive cost-model cockpit at /sites/qbe — that one is the live engine; this
 * one is the at-a-glance readiness map.
 *
 * VISIBILITY: gated behind the shared INVESTORS_PASSWORD cookie in src/proxy.ts
 * (the same gate as /sites/qbe, /sites/cost-lab and /investors), and rendered
 * standalone (the /sites prefix hides the public marketing nav/footer via
 * conditional-chrome). Not indexed, not in any nav. A confidential banner is
 * carried on-page as defence in depth.
 *
 * PUBLIC-COPY DISCIPLINE: all numbers trace to
 * wiki/outputs/2026-06-13-goods-strategic-pack/_hub-content.md. Evidence tiers
 * are labelled visibly. Nothing here is audited or final. The investor shortlist
 * / pipeline is deliberately NOT on this page — that is internal-only.
 */
import type { Metadata } from 'next';
import {
  BadgeCheck,
  Banknote,
  Building2,
  CircleDollarSign,
  ClipboardCheck,
  Cpu,
  Factory,
  Gauge,
  HandCoins,
  Leaf,
  Lock,
  type LucideIcon,
  Scale,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'QBE Readiness One-Pager · Goods on Country',
  description:
    'Investor-facing readiness map: the 12 diagnostic areas, the catalytic ask, and the five proofs to close — for the Goods on Country QBE capital pathway.',
  robots: { index: false, follow: false },
};

// ── Evidence tiers ──────────────────────────────────────────────────────────
// Labelled visibly on every number that needs it. The discipline IS the method:
// a metric only moves left (toward Verified) as evidence catches up.
type Tier = 'Verified' | 'Workpaper' | 'Modelled' | 'Guardrail' | 'Target' | 'Open';

const TIER_STYLE: Record<Tier, string> = {
  Verified: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  Workpaper: 'border-amber-300 bg-amber-50 text-amber-900',
  Modelled: 'border-sky-300 bg-sky-50 text-sky-800',
  Guardrail: 'border-stone-300 bg-stone-100 text-stone-700',
  Target: 'border-violet-300 bg-violet-50 text-violet-800',
  Open: 'border-rose-300 bg-rose-50 text-rose-800',
};

const TIER_LEGEND: Array<{ tier: Tier; meaning: string }> = [
  { tier: 'Verified', meaning: 'Independently checkable today' },
  { tier: 'Workpaper', meaning: 'Xero mirror, unaudited' },
  { tier: 'Modelled', meaning: 'Planning assumption — 0 beds assembled in-house' },
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

// ── The 10-second view ────────────────────────────────────────────────────────
// The prominent metric row that mirrors the Notion command center's top strip:
// what's deployed, what's banked, what's signed vs sought, and the match ceiling.
const TEN_SECOND_METRICS: Array<{
  value: string;
  label: string;
  sub: string;
  tier: Tier;
}> = [
  {
    value: '496 beds',
    label: '9 communities',
    sub: 'Every bed QR-tracked in a live register a stranger can scan.',
    tier: 'Verified',
  },
  {
    value: 'AU$649,710.79',
    label: 'received to date',
    sub: 'Xero workpaper, unaudited. Not yet a Goods-only carve-out.',
    tier: 'Workpaper',
  },
  {
    value: 'AU$0 signed',
    label: '~AU$400K target',
    sub: 'First match-eligible capital sought before Sept 2026 Stage 2.',
    tier: 'Open',
  },
  {
    value: 'Up to AU$400K',
    label: 'QBE match',
    sub: 'At least 1:1 vs secured capital. Repayable finance preferred.',
    tier: 'Guardrail',
  },
];

// ── The ask ──────────────────────────────────────────────────────────────────
// The stack (junior → senior). All sought except the QBE invitation.
const ASK_STACK: Array<{ label: string; amount: string; detail: string; tier: Tier }> = [
  {
    label: 'Grants',
    amount: '~AU$500K',
    detail: 'Snow R4/R5, Centrecorp, VFFF',
    tier: 'Target',
  },
  {
    label: 'QBE match',
    amount: 'up to AU$400K',
    detail: 'at least 1:1 vs secured capital, repayable preferred',
    tier: 'Guardrail',
  },
  {
    label: 'SEFA',
    amount: 'AU$300K',
    detail: 'concessional working-capital line',
    tier: 'Target',
  },
];

// ── The 12 areas ─────────────────────────────────────────────────────────────
type Area = {
  number: number;
  name: string;
  score: string;
  priority: boolean;
  icon: LucideIcon;
  points: string[];
  artifact: string;
};

const AREAS: Area[] = [
  {
    number: 1,
    name: 'Vision & Ambition',
    score: '8 → 9',
    priority: false,
    icon: Target,
    points: [
      'North star stated first, not buried: the job is to become unnecessary — communities owning the means to collect, make, repair, and sell, so the central organisation steps back.',
      'Three shifts held together or not at all: material (durable, washable, repairable goods replace failing ones), economic (more value stays local), story (communities control how their experience is recorded).',
      'Structure mapped honestly as hub-and-spoke: A Curious Tractor (parent) → Goods on Country (the venture, mid-migration) → future community-controlled production entities (spokes, not yet established).',
      'Ambition in three horizons: short — prove the economics via the 50-bed run and put the first community operator on payroll; medium — scope the first Aboriginal-controlled operating entity; long — distributed, community-owned production on country.',
    ],
    artifact: '13-vision-and-ambition.md',
  },
  {
    number: 2,
    name: 'Social Objective & Impact',
    score: '5 → 8',
    priority: true,
    icon: Leaf,
    points: [
      'The honesty is the method: every metric sits in one of three columns — Verified (checkable today), Modelled (computed from assumptions), Future (not yet collected). A metric only moves left as evidence catches up.',
      'Verified today: 496 beds tracked, 9 communities served, 20 kg HDPE diverted per bed, 3 consent-cleared voices. The 2,660 kg plastic figure is honestly Modelled, retiring the old 9,225 / 9,920 kg overclaim (~3.7×).',
      'The claim ceiling, stated plainly: washable beds and reliable washing machines support the environmental-health conditions that interrupt known infection pathways. No claimed reduction in rheumatic heart disease without partner clinical evidence.',
      'Consent is method, not compliance (OCAP). Only Ivy Johnson, Dianne Stokes, and Ray Nelson are cleared for external use; the short list is itself a named gap to close.',
    ],
    artifact: '05-impact-measurement-method.md',
  },
  {
    number: 3,
    name: 'Business Model Clarity',
    score: '4 → 7',
    priority: true,
    icon: Building2,
    points: [
      'Four customer segments, in true revenue order: (1) institutional / community-controlled buyers and councils — essentially all current income; (2) businesses buying for staff housing; (3) procurement / housing programs — future, gated on 51% First Nations ownership; (4) direct retail + NDIS — AU$90 to date.',
      'Honest read: ~89% grant-funded by design. The AU$90 of shop revenue proves the pipe works (a stranger can buy a bed online and it ships), not the market.',
      'Two payment innovations break affordability without cutting price: lease-to-own washing machines, and council waste-offsets paying community operators to collect the plastic. Both are intentions with clear mechanisms, not booked income.',
      'The path off grants has two compounding moves: in-source the plastic to drop unit cost (8.6× markup verified on bought-in legs), and move institutional buyers from grant-funded to procurement-funded (needs the 51% structure + first signed offtake).',
    ],
    artifact: '14-business-model.md',
  },
  {
    number: 4,
    name: 'Financial Management',
    score: '4 → 7',
    priority: true,
    icon: Banknote,
    points: [
      'Money in: AU$649,710.79 received / AU$732,210.79 billed / 88.8% collection (all Xero workpaper, mirror 29 May, unaudited). Commercial revenue AU$90 (3 orders).',
      'The single most important caveat: there is not yet one accountant-endorsed, Goods-only revenue figure. The trading org also holds non-Goods income, so the Xero total is not a Goods carve-out. Producing one is now a hard QBE Stage-2 gate.',
      'Unit economics today: sells AU$750 (verified), marginal cost AU$684.79 (workpaper), ~AU$65 contribution, fixed block ~AU$109,500/yr → breakeven ~1,679 beds/yr (modelled). The cost-down is the lever (factory AU$425.74 / community AU$270.74, modelled, 0 beds in-house) — breakeven drops to 333–338 beds/yr.',
      '36-month forecast (all modelled): without injection −AU$487,722 at month 36; with the injection stack +AU$212,278, through an intra-period trough of −AU$177,292. Founder time is costed in. Opening cash is a flagged AU$50K placeholder — the highest-leverage input to lock.',
    ],
    artifact: '15-financial-summary.md',
  },
  {
    number: 5,
    name: 'Strategic Planning & Risk',
    score: '5 → 7',
    priority: true,
    icon: Scale,
    points: [
      'Three earned phases: De-risk (12 months — run the 50-bed proof, close the first ~AU$400K, get the accountant carve-out, decide the legal entity); Prove the repeatable engine (institutional buyers shift grant → procurement; first community-employed operator); Scale toward community-owned production.',
      'Scenario forks are pre-agreed so decisions aren’t made under pressure: 50-bed run PASS → scale the raise; MISS → re-base at AU$684.79; capital slow → defer the next plant build, avoid bridging debt; cash tight → compress geographic scope to the deepest relationships.',
      'Scored risk register: 14 risks, likelihood × consequence, named owners. Two Critical (20): founder bottleneck (already happening) and story/data consent. Eleven of 14 score High or Critical — itself the message that this is a de-risking round.',
      'Governing test: "do no harm" — including "do not centralise value in ACT while talking about community ownership." 7 of 14 risks are internal-only and must never be presented externally as settled.',
    ],
    artifact: '16-strategic-plan.md + 06-risk-register.md',
  },
  {
    number: 6,
    name: 'Process & Technology',
    score: '7 → 8',
    priority: false,
    icon: Cpu,
    points: [
      'A strength: strong technical capability for a small team. The operating loop — demand/order → on-country manufacture → QR-tag & register → delivery → feedback/telemetry — is mapped so a third person can see it without a founder narrating.',
      'Live and systematised: the Stretch Bed Stripe path, the Supabase truth layer, and the QR asset register (496 beds tracked — the single most credible piece of operating evidence). Still founder-dependent: manufacture itself (0 beds in-house), institutional orders, delivery, repair follow-up.',
      'One source of truth per thing: six systems, each authoritative for one domain with one named owner — drift between systems is what produces a contradicted number in front of a funder.',
      'The human-in-loop rule, held as policy: AI is a repository and drafting aid, never the author of record. The production SOP — the transferable shred/press/cut/assemble parameters — is the key document still to write.',
    ],
    artifact: '17-operating-model.md',
  },
  {
    number: 7,
    name: 'Governance, Data & Reporting',
    score: '5 → 8',
    priority: true,
    icon: ClipboardCheck,
    points: [
      'Two parts work now (an 11-member Goods-specific advisory committee meeting monthly; a real OCAP data-sovereignty practice — share-back, retraction, consent-travels-with-the-data). Two parts are not yet built (a fiduciary board; a consolidated annual reporting cycle). Marked which is which.',
      'The committee is advisory — named members, real expertise, used for challenge — and is not a fiduciary board (no legal duty, no power to stop a decision, no independent finance oversight). Calling it a board would be exactly the overclaim the public-copy rule forbids.',
      'The move is a plan with a trigger: recruit 1–2 independent directors and stand up a minimum-viable independent-majority board. The trigger is the capital, not the calendar — SEFA’s AU$300K is gated on it. Today: 0 independent directors recruited.',
      'Reporting shifts from per-grant to one consolidated annual cycle against one reconciled set of evidence-labelled numbers, community-first. Gated on the accountant-reviewed Goods-only figure, which doesn’t exist yet.',
    ],
    artifact: '18-governance-framework.md',
  },
  {
    number: 8,
    name: 'People & Organisation',
    score: '6 → 7',
    priority: false,
    icon: Users,
    points: [
      'Load-bearing capacity is two FTE founders: Ben Knight (relationships, story/consent, governance, product-feedback) and Nicholas Marchesi (builder/operator — remote delivery, prototype-to-product, unit economics). ACT shared services and the advisory group are real support but not owned, taskable headcount.',
      'The founder bottleneck is the #1 risk, "already happening" — six domains run through two people. It is the ceiling on how much capital and demand Goods can absorb.',
      'Phased hires, each triggered by a real event (signed capital, order volume) not a calendar: General Manager first (unwinds the most concentration), then Business Development / sales lead (owns the pipeline, attacks the $0-signed-LOI gate). Then ops, production trainer, fractional finance/CFO, on-country coordinators.',
      'Founder labour is currently subsidised, not properly costed — costing it at fair-market rate is a parallel P0. Interim cover (QBE skilled volunteering, PIN mentoring) tapers ~August, the same window the first tranche targets.',
    ],
    artifact: '07-role-map.md',
  },
  {
    number: 9,
    name: 'Legal Structure',
    score: '5 → 7',
    priority: false,
    icon: ShieldCheck,
    points: [
      'The keystone gap (0 artifacts at diagnosis). One reusable, legally-reviewed wording block (plus tailored variants for web / investor / grant / contract) so the same accurate words are reused everywhere instead of drifting.',
      'Three distinct roles, never blurred: trades today = sole trader; go-forward trading company = A Curious Tractor Pty Ltd t/a Goods on Country, migrating this FY; DGR/charity home = The Butterfly Movement Ltd, operational FY2026-27, not live today (donors cannot tax-receipt yet).',
      'Six open questions for legal: the go-forward entity form, the community-production entity’s legal form, contracting party during migration, the Supply Nation 51% precondition (IPP threshold tightens 1 July 2026), the mission lock (none exists today), and DGR timing/related-party boundary.',
      'Do-not-say discipline: never claim Goods is a charity/DGR; never describe community-ownership transfer as complete; never publish an ABN/ACN until legal confirms.',
    ],
    artifact: '04-entity-wording-block.md',
  },
  {
    number: 10,
    name: 'Investors & Capital Raising',
    score: '6 → 8',
    priority: false,
    icon: HandCoins,
    points: [
      'The catalytic case opens with a link, not a logo wall: the proof is independently checkable (scan the register).',
      'Demand follows use, not the reverse — the strongest validation: an Elder offered to self-fund 20 beds after co-designing; 107 beds approved and paid via Centrecorp; 65 beds requested for children in Maningrida; exploratory interest at Groote (a market signal, not revenue).',
      'The honest commercial reality is the pitch, not a thing to hide: a catalytic investor is precisely the partner who funds the gap between proven delivery and a proven commercial engine. One catalytic dollar is structured to unlock several behind it.',
      'Why now: a ~12-week window where four clocks align — the QBE match gate (Stage 2 closes Sept 2026), freshest proof (May Utopia op), free program support ending August, and warm funders waiting for the first to move. The ask: be the first signed commitment.',
    ],
    artifact: '01-strategy-memo.md · 02-one-pager.md',
  },
  {
    number: 11,
    name: 'Cost Model',
    score: 'Priority (P0)',
    priority: true,
    icon: Factory,
    points: [
      'The heart of the catalytic case, one question: what does in-sourcing the plastic do to unit cost and therefore breakeven? Three build methods — Buy-Kit (today) AU$684.79 (workpaper); Factory in-source AU$425.74 (modelled); Community in-source AU$270.74 (modelled).',
      'The one piece of hard evidence underneath the whole model: an 8.6× markup ("idiot index") on the HDPE legs bought from Defy (verified). Everything else in the cost-down is modelled.',
      'Honest status: a credible hypothesis, not a result — 0 beds assembled in-house, against a stale inventory snapshot (2026-03-27). The 50-bed run (~AU$60–80K) is the experiment that converts it.',
      'Capex carries two coexisting figures to reconcile: a confirmed press-capex line of AU$110,046, and a wider gross-capex range of AU$112–222K (midpoint ~AU$167K, firm quote pending). Accountant to confirm which is canonical.',
    ],
    artifact: 'Goods Playable Model (live) + 15-financial-summary.md',
  },
  {
    number: 12,
    name: 'Investor Alignment',
    score: 'Working area',
    priority: false,
    icon: BadgeCheck,
    points: [
      'The CASE Smart Impact Capital tool, populated from the real pipeline: Goods’ own filter (6 knockout criteria + 10 weighted fit criteria), then every funder scored against it. Output: a defensible shortlist for the first ~AU$400K.',
      'The discipline: "a quick ‘no’ is much more helpful than a long drawn-out process." Every rating traces to a wiki investor profile; where a profile is silent, the cell reads "Don’t Know" — an honest gap, never an invented position.',
      'Knockouts: non-equity, concessional/social-first, remote-Australia geography, early-commercial de-risking stage.',
      'The ranking weights proximity to a signed commitment before the September 2026 Stage 2 application, because the match is an output of money raised first — warm relationships that convert fast rank above colder perfect-fits.',
    ],
    artifact: '12-investor-alignment.md',
  },
];

// ── The five proofs ──────────────────────────────────────────────────────────
// Each proof carries an owner, why it matters, and a status. Status is the work
// state (distinct from the evidence tiers above, which grade numbers).
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
    title: 'Money is real',
    owners: 'Ben / Nic / accountant',
    body: 'One signed commitment (LOI or offtake) unlocks the QBE match and fixes the weak commercial-paperwork gap, plus one accountant-reviewed Goods-only revenue figure.',
    status: 'In progress',
  },
  {
    number: 2,
    title: 'The legal vehicle is decided',
    owners: 'Ben / Nic / Keith Rovers',
    body: 'One approved entity-wording block — the keystone that gates Supply Nation 51% certification, IBA eligibility, and four of eight procurement channels.',
    status: 'In progress',
  },
  {
    number: 3,
    title: 'The cost-down is measured, not modelled',
    owners: 'Nic / accountant / SIH cost advisor',
    body: 'The 50-bed in-source run (~AU$60–80K) that turns the AU$425.74 in-house cost from modelled to measured (today: 0 beds in-house).',
    status: 'Not started',
  },
  {
    number: 4,
    title: 'Impact and consent hold up',
    owners: 'Ben',
    body: 'A measurement-method one-pager separating verified from modelled from future, and a consent-cleared story list (today only Ivy Johnson, Dianne Stokes, Ray Nelson).',
    status: 'In progress',
  },
  {
    number: 5,
    title: 'Governance and people look fundable',
    owners: 'Ben / Nic',
    body: 'The step from advisory to an independent-majority board (gates SEFA’s debt line) and a 12-month role map naming the GM and BD roles before the team slide ships.',
    status: 'Not started',
  },
];

const serif = { fontFamily: 'Georgia, serif' } as const;

export default function QbeReadinessPage() {
  return (
    <main className="min-h-screen bg-[#FDF8F3] text-[#2B2A26]">
      {/* Confidential banner — defence in depth alongside the password gate */}
      <div className="border-b border-amber-300 bg-[#FBEFD8]">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs font-medium text-amber-900 sm:px-6">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          Confidential — investor draft, 13 June 2026. Nothing here is audited or final. Re-pull
          Xero before any external send.
        </div>
      </div>

      {/* Header */}
      <section className="border-b border-stone-800 bg-[#24211D] text-[#FDF8F3]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-[#BBA255]/30 bg-[#BBA255]/15 text-[#FDF8F3]">
              QBE readiness one-pager
            </Badge>
            <Badge className="border-white/15 bg-white/10 text-[#FDF8F3]">
              12 areas · the ask · five proofs
            </Badge>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#BBA255]">
            Goods on Country
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-light leading-tight sm:text-5xl" style={serif}>
            A good bed can prevent heart disease.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#E6DFD1] sm:text-lg">
            A social enterprise delivering quality, washable, repairable household goods to remote
            Indigenous communities — built for actual remote conditions from recycled plastic, every
            unit tracked, production moving toward community ownership. We make environmental-health
            hardware, not charity furniture, and our endgame is to become unnecessary: local people
            making, owning, and repairing the goods themselves.
          </p>
        </div>
      </section>

      {/* Evidence legend */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
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

      {/* The 10-second view */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-[#A8643F]" />
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={serif}>
            The 10-second view
          </h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          What is deployed, what is banked, what is signed versus sought, and the match ceiling.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEN_SECOND_METRICS.map((m) => (
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

      {/* The ask */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-[#A8643F]" />
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={serif}>
              The ask
            </h2>
          </div>

          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700">
            AU$900K–$1M, blended and{' '}
            <span className="font-semibold text-[#2B2A26]">non-equity</span> — a de-risking round
            (~89% grant-funded by design), not a growth round. No equity: the end-state is
            community-owned production, so capital that needs an exit would contradict the thing
            being built. The unlock is the first ~AU$400K of signed, match-eligible capital before
            the September 2026 Stage 2 application — signatures locked through August (signed today: 0).
            A conversation problem, not a discovery problem. The match is an output of money raised
            first, not an input.
          </p>

          {/* The stack */}
          <h3 className="mt-9 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            The stack (junior → senior)
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {ASK_STACK.map((item) => (
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
            All sought except the QBE invitation.
          </p>

          {/* First use of funds */}
          <div className="mt-8 rounded-xl border border-sky-200 bg-sky-50/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-snug text-[#2B2A26]">
                First use of funds: the 50-bed in-source production run, ~AU$60–80K
              </h3>
              <Pill tier="Modelled" />
            </div>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              The single experiment the catalytic ask is built around — it turns the central cost
              claim from modelled to measured. Pass confirms AU$425.74 and the raise scales; miss
              re-bases the raise honestly at AU$684.79.
            </p>
          </div>
        </div>
      </section>

      {/* The five proofs — are we ready? */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#A8643F]" />
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={serif}>
            Are we ready? The five proofs
          </h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          The human work left — none of it is a writing task; the documentation is done. Each proof
          carries an owner and a current status.
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

      {/* The 12 areas */}
      <section className="border-y border-stone-200 bg-[#F6EFE6]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-[#5C8A86]" />
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={serif}>
              The 12 diagnostic areas
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-700">
            Each area carries a score (now → target) and the substance a reader needs to act. A
            star marks a priority area for the round.
          </p>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {AREAS.map((area) => {
              const Icon = area.icon;
              return (
                <article
                  key={area.number}
                  className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <header className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F2E9DF] text-[#A8643F]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold leading-snug text-[#2B2A26]">
                          <span className="text-stone-400">{area.number}.</span> {area.name}
                          {area.priority ? (
                            <span className="ml-1.5 text-[#BBA255]" aria-label="priority area">
                              ★
                            </span>
                          ) : null}
                        </h3>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-stone-300 bg-stone-50 text-[11px] font-semibold text-stone-700"
                        >
                          <TrendingUp className="h-3 w-3" />
                          {area.score}
                        </Badge>
                        {area.priority ? (
                          <Badge
                            variant="outline"
                            className="border-[#BBA255]/50 bg-[#FFF9EA] text-[11px] font-semibold text-[#8A6D1F]"
                          >
                            Priority
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </header>

                  <ul className="mt-4 space-y-2.5">
                    {area.points.map((p, i) => (
                      <li key={i} className="flex gap-2.5 text-sm leading-6 text-stone-600">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5C8A86]" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 border-t border-stone-100 pt-3 text-xs text-stone-500">
                    <span className="font-semibold uppercase tracking-[0.14em] text-stone-400">
                      Artifact
                    </span>{' '}
                    <span className="font-mono">{area.artifact}</span>
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Evidence / footer */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-stone-400" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Evidence &amp; provenance
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-xs leading-5 text-stone-500">
            This page distils the full 12-area strategic pack held in the repo. Source of truth:
            00-master-alignment-map.md (2026-06-13), where every number traces. DRAFT for founder
            review — nothing here is audited or final. Modelled figures are planning assumptions (0
            beds assembled in-house); workpaper figures are unaudited Xero mirror data. Re-pull Xero
            before any external send and apply the entity-wording and number-audit checks before
            publishing.
          </p>
        </div>
      </section>
    </main>
  );
}
