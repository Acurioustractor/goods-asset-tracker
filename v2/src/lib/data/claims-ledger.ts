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
      { label: 'Asset register (Supabase, drift-checked)', href: '/impact#register' },
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
    statement: 'Pakkimjalki Kari washing machines in community — a curated, founder-confirmed count, not an auto-derived register number.',
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
    statement: 'Kilograms of recycled HDPE diverted into Stretch Bed legs (20kg per bed; Stretch Beds only — Basket Beds are not a plastic product).',
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
    headline: 'Marginal cost per bed — today',
    statement: 'Marginal cost per bed buying finished leg kits (engine-locked bill of materials).',
    figure: greenFigure('marginal-buykit', aud),
    factId: 'marginal-buykit',
    status: 'verified',
    evidence: [{ label: 'The cost story', href: '/cost-story' }],
    asOf: canonFact('marginal-buykit').asAt,
  },
  {
    id: 'saving-per-bed',
    headline: 'Saving from pressing in-house',
    statement: 'Saving per bed from pressing our own legs instead of buying finished kits — an 8.6× markup on the recycled-plastic leg. This is the capital case.',
    figure: greenFigure('save-per-bed', aud),
    factId: 'save-per-bed',
    status: 'verified',
    evidence: [{ label: 'The cost story', href: '/cost-story' }],
    asOf: canonFact('save-per-bed').asAt,
  },
  {
    id: 'centrecorp-107',
    headline: 'Centrecorp-funded deployment',
    statement: 'Centrecorp funded a 107-bed deployment — institutional procurement proof, not a grant hand-out.',
    figure: '107 beds',
    factId: 'beds-deployed', // counted within the deployed total; green
    status: 'verified',
    evidence: [{ label: 'Centrecorp partnership', href: '/partners/centrecorp' }],
    asOf: '2026-05-30',
  },

  // ── Modelled — honest about what is not yet measured ──
  {
    id: 'marginal-cost-community',
    headline: 'Marginal cost per bed — community scale',
    statement: 'Modelled marginal cost per bed pressed in community, on a fair-wage band and free feedstock. Nobody has measured it yet — that is the point of the 50-bed run.',
    figure: greenFigure('marginal-community', aud),
    factId: 'marginal-community',
    status: 'modelled',
    ceiling: 'MODELLED, not measured. Never grouped with the engine-locked figures.',
    evidence: [{ label: 'The cost story', href: '/cost-story' }],
    asOf: canonFact('marginal-community').asAt,
    flip: { when: '2026-09-30', how: 'The 50-bed in-source run measures it; we publish the measured figure either way.' },
  },
  {
    id: 'breakeven-rate',
    headline: 'Break-even rate',
    statement: 'Roughly 338 beds per year to break even, derived from the modelled unit economics above.',
    figure: '~338 beds/yr',
    factId: 'marginal-community', // derived from the modelled cost; inherits its label
    status: 'modelled',
    ceiling: 'Inherits the modelled label of its inputs.',
    evidence: [{ label: 'The cost story', href: '/cost-story' }],
    asOf: canonFact('marginal-community').asAt,
    flip: { when: '2026-09-30', how: 'Recomputed from measured unit economics after the 50-bed run.' },
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
    statement: 'Elder Dianne Stokes asked for twenty more beds and offered to self-fund; PICC offered to buy a plant outright.',
    status: 'interest',
    ceiling: 'Offers on the record, not contracts.',
    evidence: [{ label: 'Community stories', href: '/stories' }],
    asOf: '2026-07-10',
  },

  // ── Future — what we are promising, with dates ──
  {
    id: 'signed-lois',
    headline: 'Signed match-eligible commitments',
    statement: 'Zero signed match-eligible commitments today. The QBE grant must be at least matched by signed external commitments, a dollar test with no LOI count attached; the target is AU$400,000 signed by our own internal gate of 31 August 2026, ahead of the application, which closes late September 2026. Match is judged on signed, verifiable paper (amount, instrument, funder legal name, a contact SIH can call). The first signed commitment is the deck’s own claim flipping from future to verified.',
    status: 'future',
    evidence: [{ label: 'Investor deck', href: '/deck' }],
    asOf: canonFact('signed-lois').asAt,
    flip: { when: '2026-08-31', how: 'First signed match-eligible commitment lands and is recorded here.' },
  },
  {
    id: 'community-ownership',
    headline: 'Community ownership of the plant',
    statement: 'Each plant is built to move into community hands, on the Supply Nation 51% First Nations-ownership path.',
    status: 'future',
    ceiling: 'A pathway moving closer to community ownership — never claimed as complete. No Goods entity meets an Indigenous-ownership tier today.',
    evidence: [{ label: 'The work', href: '/the-work' }],
    asOf: '2026-07-10',
  },
  {
    id: 'first-hires',
    headline: 'First hires beyond the founders',
    statement: 'Zero hires and zero independent directors today. This round funds a trigger-gated GM and Business Development hire.',
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
    statement: 'A signed, accountant-certified Goods-only revenue figure does not exist yet. The prepared carve-out is shown on funder-facing surfaces with a workpaper label and its basis named. It is never presented as signed, and no surplus figure is published or implied anywhere.',
    status: 'locked',
    ceiling: 'No revenue figure is described as signed or certified until the accountant signs one. No surplus figure, ever.',
    evidence: [{ label: 'Reconciliation basis (internal, on request)' }],
    asOf: '2026-07-25',
    flip: { when: 'on accountant sign-off (outstanding as at 2026-07-25; the ledger previously targeted mid-August 2026)', how: 'The signed figure and its basis are named here and the workpaper label comes off every surface.' },
  },
];

/* ── Anti-claims: the cold open. What Goods does NOT claim. ──────────────── */

export const ANTI_CLAIMS: { statement: string; why: string }[] = [
  {
    statement: 'We do not claim health outcomes.',
    why: 'Off-the-ground, washable sleep supports the conditions needed to interrupt the scabies→rheumatic-heart-disease pathway. That is the why we exist — it is never claimed as a measured outcome of our beds.',
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
    why: 'The Goods-only carve-out is prepared with our accountant and not yet signed. It is shown with a workpaper label and its basis named, never as a certified number. See the locked row below.',
  },
  {
    statement: 'We do not claim community ownership has happened.',
    why: 'The plant is built to transfer. Until it does, we describe a pathway — moving closer to community ownership — not a completed handover.',
  },
  {
    statement: 'We do not use an uncleared voice or photo.',
    // Reads from canon rather than a hardcoded count, which had gone stale at "32" and was also
    // the WRONG TIER: 32 is the display-storyteller pool, a coverage queue, not a clearance list.
    why: `Only the ${canonFact('cleared-voices').value} consent-cleared voices (the 2026-06-17 pass, plus Margaret Lloyd and Tanya Turner; default-deny, OCAP®-aligned) appear on external surfaces. If a name is not on the list, it does not render. Not to be confused with the broader website display-storyteller pool.`,
  },
];

/* ── Changelog: dated, diffable. "Come back 30 September and diff this." ── */

export const CLAIMS_CHANGELOG: { date: string; note: string }[] = [
  { date: '2026-07-11', note: 'Claims Register published. Consolidated-revenue row LOCKED; the unsigned figure removed from /deck client JS (it had shipped in a risk row).' },
  { date: '2026-07-18', note: 'Maningrida delivery registered (+40 Stretch, +2 washers per INV-0303, Homeland School Company, farm-made; an interim +60 entry was corrected same day): 536 beds, 173 Stretch, 18 washers, 3,460kg HDPE (Stretch only, 173 x 20kg).' },
  { date: '2026-07-10', note: 'Investor deck v1 shipped with label pills (verified / modelled / interest / future) on every claim.' },
  { date: '2026-06-17', note: 'Consent pass: 32 voices cleared for external use; default-deny gate live in cleared-voices.ts.' },
  { date: '2026-06-11', note: 'Washing-machine count curated to 16 in-community (founder-confirmed), superseding the raw register row count.' },
  { date: '2026-06-03', note: 'Money facts restated after live-Xero reconcile. Consolidated figure held pending accountant sign-off.' },
  { date: '2026-05-30', note: 'Asset facts reconciled against the live register: 496 beds, 9 communities, 2,660kg HDPE.' },
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
