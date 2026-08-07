/**
 * THE CLAIMS LEDGER — the default-deny registry of every claim Goods makes on
 * EXTERNAL surfaces (/register, /deck, funder material).
 *
 * Modelled on cleared-voices.ts: canon.ts is the source of truth for values;
 * THIS file is the gate that decides which facts may be *stated externally*,
 * how they are worded, what each claim does NOT say (the ceiling), and when a
 * claim is promised to flip. A number renders externally only if its claim is
 * in this ledger — same posture as voices: DEFAULT-DENY.
 *
 * Hard rules (enforced by assertLedgerSafe() at module load):
 *   1. A claim may carry a figure ONLY if it is backed by a canon fact with
 *      dataClass 'green' (public-safe). Amber/red facts cannot ship a figure
 *      to the open web, full stop.
 *   2. LOCKED claims carry no figure, no canon dereference into copy, and a
 *      digit-free statement/ceiling — so the withheld consolidated revenue
 *      figure can never leak into client JS again (it did, once: /deck
 *      shipped it in a risk row until 2026-07-11).
 *   3. Values are read via canon helpers, never re-typed here, so drift is
 *      impossible by construction.
 */

import { canonFact } from './canon';

export type ClaimStatus = 'verified' | 'modelled' | 'interest' | 'future' | 'locked';

export interface ClaimEvidence {
  label: string;
  /** Internal route or external URL. Omit for offline evidence (invoices, decision sheets). */
  href?: string;
}

export interface Claim {
  /** Stable slug — cited by ClaimChips, changelog entries and diffs. */
  id: string;
  /** Short row label. */
  headline: string;
  /** The full external sentence. For LOCKED claims: must contain no digits. */
  statement: string;
  /** Display figure. ONLY allowed when factId points at a green canon fact. */
  figure?: string;
  /** Canon fact backing the figure and asOf date. */
  factId?: string;
  status: ClaimStatus;
  /** The claim ceiling — what this claim does NOT say. Rendered with the claim. */
  ceiling?: string;
  evidence: ClaimEvidence[];
  /** ISO date the claim was last reconciled/confirmed (defaults from canon fact). */
  asOf: string;
  /** The promised flip: when this claim's status is due to change, and how. */
  flip?: { when: string; how: string };
}

/** Format a green canon fact's numeric value for display. Throws on non-green. */
function greenFigure(factId: string, format?: (n: number) => string): string {
  const f = canonFact(factId);
  if (f.dataClass !== 'green') {
    throw new Error(`Claims ledger: fact '${factId}' is dataClass '${f.dataClass}', not green — it may not render a figure externally.`);
  }
  if (typeof f.value !== 'number') return String(f.value);
  return format ? format(f.value) : f.value.toLocaleString('en-AU');
}

const aud = (n: number) => `AU$${n.toLocaleString('en-AU')}`;

/* ────────────────────────────────────────────────────────────────────────────
 * The register. Order = display order on /register.
 * ──────────────────────────────────────────────────────────────────────────── */

export const EXTERNAL_CLAIMS: Claim[] = [
  // ── Verified — measured, reconciled, source named ──
  {
    id: 'beds-deployed',
    headline: 'Beds deployed',
    statement: 'Beds deployed across remote Australia, per the live asset register: 363 Basket (legacy) + 177 Stretch (flagship).',
    figure: greenFigure('beds-deployed'),
    factId: 'beds-deployed',
    status: 'verified',
    evidence: [
      { label: 'Impact evidence', href: '/impact' },
      { label: 'Asset register', href: '/impact#register' },
    ],
    asOf: canonFact('beds-deployed').asAt,
  },
  {
    id: 'communities-served',
    headline: 'Communities served',
    statement: 'Communities served through deployed assets; twelve distinct communities touched.',
    figure: greenFigure('communities-served'),
    factId: 'communities-served',
    status: 'verified',
    evidence: [{ label: 'Communities', href: '/communities' }],
    asOf: canonFact('communities-served').asAt,
  },
  {
    id: 'washers-in-community',
    headline: 'Washing machines in community',
    statement: 'Pakkimjalki Kari washing machines in community. This count has been checked by the Goods team.',
    figure: greenFigure('washers-in-community'),
    factId: 'washers-in-community',
    status: 'verified',
    ceiling: 'Prototype stage: register interest only, not for direct sale.',
    evidence: [{ label: 'Washing machines', href: '/wiki/products' }],
    asOf: canonFact('washers-in-community').asAt,
  },
  {
    id: 'plastic-diverted',
    headline: 'Recycled HDPE diverted',
    statement: 'Kilograms of recycled HDPE used in Stretch Bed legs. Each Stretch Bed uses 20kg. Basket Beds are not included.',
    figure: `${greenFigure('plastic-kg')}kg`,
    factId: 'plastic-kg',
    status: 'verified',
    evidence: [{ label: 'The work', href: '/the-work' }],
    asOf: canonFact('plastic-kg').asAt,
  },
  {
    id: 'stretch-price',
    headline: 'Stretch Bed price',
    statement: 'Current shop price for the Stretch Bed, the only product for direct sale.',
    figure: greenFigure('stretch-price', aud),
    factId: 'stretch-price',
    status: 'verified',
    evidence: [{ label: 'Shop', href: '/shop/stretch-bed-single' }],
    asOf: canonFact('stretch-price').asAt,
  },
  {
    id: 'marginal-cost-today',
    headline: 'Cost to make the next bed today',
    statement: 'The current cost to make one more bed when we buy finished leg kits.',
    figure: greenFigure('marginal-buykit', aud),
    factId: 'marginal-buykit',
    status: 'verified',
    evidence: [{ label: 'The cost story', href: '/cost-story' }],
    asOf: canonFact('marginal-buykit').asAt,
  },
  {
    id: 'saving-per-bed',
    headline: 'Saving from pressing in-house',
    statement: 'The saving on each bed when we press our own legs instead of buying finished kits. Finished legs cost 8.6 times the raw plastic.',
    figure: greenFigure('save-per-bed', aud),
    factId: 'save-per-bed',
    status: 'verified',
    evidence: [{ label: 'The cost story', href: '/cost-story' }],
    asOf: canonFact('save-per-bed').asAt,
  },
  {
    id: 'centrecorp-107',
    headline: 'Centrecorp-funded deployment',
    statement: 'Centrecorp paid for 107 beds to be delivered to communities. This was a purchase, not a grant.',
    figure: '107 beds',
    factId: 'beds-deployed', // counted within the deployed total; green
    status: 'verified',
    evidence: [{ label: 'Centrecorp partnership', href: '/partners/centrecorp' }],
    asOf: '2026-05-30',
  },

  // ── Modelled — honest about what is not yet measured ──
  {
    id: 'marginal-cost-community',
    headline: 'Estimated cost per bed in community',
    statement: 'The estimated cost to make one more bed in community, using paid local labour and free waste plastic. This has not yet been measured in sustained production.',
    figure: greenFigure('marginal-community', aud),
    factId: 'marginal-community',
    status: 'modelled',
    ceiling: 'This is an estimate, not a measured production cost.',
    evidence: [{ label: 'The cost story', href: '/cost-story' }],
    asOf: canonFact('marginal-community').asAt,
    flip: { when: 'after a sustained production run', how: 'We will replace the estimate with the measured cost.' },
  },
  {
    id: 'breakeven-rate',
    headline: 'Break-even rate',
    statement: 'Roughly 338 beds per year to cover current operating costs, based on the estimated cost per bed above.',
    figure: '~338 beds/yr',
    factId: 'marginal-community', // derived from the modelled cost; inherits its label
    status: 'modelled',
    ceiling: 'This uses the estimated cost above, so it is also an estimate.',
    evidence: [{ label: 'The cost story', href: '/cost-story' }],
    asOf: canonFact('marginal-community').asAt,
    flip: { when: 'after a sustained production run', how: 'We will recalculate it using the measured cost per bed.' },
  },

  // ── Interest — demand signals, never revenue ──
  {
    id: 'bed-requests',
    headline: 'Bed requests logged',
    statement: '200–350 bed requests logged across communities and partners.',
    figure: '200–350',
    status: 'interest',
    ceiling: 'Interest, not committed revenue. No request is counted as a sale.',
    evidence: [{ label: 'Impact evidence', href: '/impact' }],
    asOf: '2026-07-10',
  },
  {
    id: 'buyer-offers',
    headline: 'Unprompted buyer offers',
    statement: 'Elder Dianne Stokes asked for twenty more beds and offered to fund them.',
    status: 'interest',
    ceiling: 'Offers on the record, not contracts.',
    evidence: [{ label: 'Community stories', href: '/stories' }],
    asOf: '2026-07-10',
  },

  // ── Future — what we are promising, with dates ──
  {
    id: 'signed-lois',
    headline: 'Signed match-eligible commitments',
    statement: 'No external commitments are signed today. QBE requires signed commitments before we submit the application. Earlier commitments make the application stronger.',
    status: 'future',
    evidence: [{ label: 'Investor deck', href: '/deck' }],
    asOf: canonFact('signed-lois').asAt,
    flip: { when: 'when the first commitment is signed', how: 'We will record it here.' },
  },
  {
    id: 'community-ownership',
    headline: 'Community ownership of the plant',
    statement: 'Each plant is built to move into community hands, on the Supply Nation 51% First Nations-ownership path.',
    status: 'future',
    ceiling: 'Community ownership is the goal. It has not happened yet.',
    evidence: [{ label: 'The work', href: '/the-work' }],
    asOf: '2026-07-10',
  },
  {
    id: 'first-hires',
    headline: 'First hires beyond the founders',
    statement: 'There are no employees or independent directors today. New roles will only be added when funding allows.',
    status: 'future',
    evidence: [{ label: 'Investor deck', href: '/deck' }],
    asOf: '2026-07-10',
  },

  // ── Locked — held until a human signs. No figure. Ever. ──
  {
    id: 'consolidated-revenue',
    headline: 'A signed revenue figure',
    // Rewritten 2026-07-25 (DECISIONS.md ruling H). The old wording said the figure was held
    // from publication until signed. It was not held: it shipped on funder surfaces from June.
    // A gate that describes a discipline nobody follows is worse than no gate, because it reads
    // as assurance. What IS held is the word "signed". Statement stays digit-free so
    // assertLedgerSafe keeps protecting the locked class.
    statement: 'There is no accountant-signed revenue figure for Goods alone yet. Any prepared figure is clearly labelled as unsigned and explains what records it uses.',
    status: 'locked',
    ceiling: 'No revenue figure is described as signed or certified until the accountant signs one. No surplus figure, ever.',
    evidence: [{ label: 'Reconciliation basis (internal, on request)' }],
    asOf: '2026-07-25',
    flip: { when: 'when the accountant signs it', how: 'We will publish the signed figure and explain its basis.' },
  },
];

/* ── Anti-claims: the cold open. What Goods does NOT claim. ──────────────── */

export const ANTI_CLAIMS: { statement: string; why: string }[] = [
  {
    statement: 'We do not claim health outcomes.',
    why: 'Off-the-ground, washable sleep supports the conditions needed to interrupt the pathway from scabies to rheumatic heart disease. We do not claim our beds have produced a measured health outcome.',
  },
  {
    statement: 'We do not count demand as revenue.',
    why: '200–350 logged bed requests are interest. Revenue is a signed purchase, and only signed purchases are reported as revenue.',
  },
  {
    // RULING G/H 2026-07-25: this anti-claim was FALSE as written ("We do not publish an
    // unsigned revenue figure") while the figure rendered on eight surfaces. An integrity
    // commitment contradicted by practice is worse than no commitment.
    statement: 'We do not call a revenue figure signed until it is.',
    why: 'The Goods-only figure has been prepared with our accountant but is not signed. We label it as unsigned and explain which records it uses.',
  },
  {
    statement: 'We do not claim community ownership has happened.',
    why: 'Community ownership is the goal. Until ownership is transferred, we describe the work as moving toward that goal.',
  },
  {
    statement: 'We do not use an uncleared voice or photo.',
    // Reads from canon rather than a hardcoded count, which had gone stale at "32" and was also
    // the WRONG TIER: 32 is the display-storyteller pool, a coverage queue, not a clearance list.
    why: `Only the ${canonFact('cleared-voices').value} people cleared for public use appear in public stories. If a person has not been cleared, their words and photo are not published.`,
  },
];

/* ── Changelog: dated, diffable. "Come back 30 September and diff this." ── */

export const CLAIMS_CHANGELOG: { date: string; note: string }[] = [
  { date: '2026-07-11', note: 'Claims Register published. Consolidated-revenue row LOCKED; the unsigned figure removed from /deck client JS (it had shipped in a risk row).' },
  { date: '2026-07-18', note: 'Maningrida delivery registered (+40 Stretch, +2 washers per INV-0303, Homeland School Company, farm-made; an interim +60 entry was corrected same day): 536 beds, 173 Stretch, 18 washers, 3,460kg HDPE (Stretch only, 173 x 20kg).' },
  { date: '2026-07-10', note: 'The investor deck began showing whether each claim was confirmed, estimated, an expression of interest or future work.' },
  { date: '2026-06-17', note: 'Thirty-two voices were cleared for public use.' },
  { date: '2026-06-11', note: 'Washing-machine count curated to 16 in-community (founder-confirmed), superseding the raw register row count.' },
  { date: '2026-06-03', note: 'Financial figures were checked against Xero. The combined revenue figure remains unpublished until the accountant signs it.' },
  { date: '2026-05-30', note: 'Asset figures were checked against the register: 496 beds, 9 communities and 2,660kg of HDPE.' },
];

/** The standing appointment: the date we have asked funders to come back and diff the register. */
export const DIFF_APPOINTMENT = '2026-09-30';

/* ── Guards ──────────────────────────────────────────────────────────────── */

/**
 * Fails loudly (at module load, so at build/dev time) if the ledger violates
 * its own rules. This is the regression test for the 2026-07-11 leak class.
 */
/**
 * Exported so the leak-prevention can actually be tested. It runs at module load
 * below, which means a regression only surfaces as an import-time crash
 * somewhere downstream, and only if a bad claim happens to exist. The tests in
 * claims-ledger.guards.test.ts exercise it directly against crafted claims.
 */
export function assertLedgerSafe(claims: Claim[]): void {
  for (const c of claims) {
    if (c.status === 'locked') {
      if (c.figure !== undefined) {
        throw new Error(`Claims ledger: locked claim '${c.id}' must not carry a figure.`);
      }
      if (/\d/.test(c.statement)) {
        throw new Error(`Claims ledger: locked claim '${c.id}' has digits in its statement — locked statements must be figure-free.`);
      }
    }
    if (c.figure !== undefined && c.factId) {
      const f = canonFact(c.factId); // throws on unknown id
      if (f.dataClass !== 'green') {
        throw new Error(`Claims ledger: claim '${c.id}' renders a figure from non-green fact '${c.factId}'.`);
      }
    }
  }
}

assertLedgerSafe(EXTERNAL_CLAIMS);

export function claimById(id: string): Claim {
  const c = EXTERNAL_CLAIMS.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown claim id: ${id}`);
  return c;
}
