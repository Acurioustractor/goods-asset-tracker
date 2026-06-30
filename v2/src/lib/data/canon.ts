/**
 * THE CANON REGISTRY — the apex source of truth for every Goods number.
 *
 * This is Layer 1 of the Goods Alignment Engine. Every public surface, every
 * artifact, and every loop reads its facts from here. The rule (also printed on
 * the Notion Artifact Hub): if a number changes, change it HERE first, then let
 * the drift loop reconcile the rest.
 *
 * Each fact carries provenance: where the truth lives (`source`), how a loop
 * re-derives it (`check`), when it was last confirmed (`asAt`), who owns it,
 * and what claim it can carry (`claimLabel`). Money facts are `check: 'manual'`
 * and are NEVER auto-written by a loop — they go to the human sign-off queue.
 *
 * Lockstep (enforced by scripts/check-canon-drift.mjs + check-asset-drift.mjs):
 *   - asset facts  ↔ CANONICAL_ASSETS (asset-canonical.ts) ↔ live register
 *   - money facts  ↔ verifiedFinancials (compendium.ts) ↔ fundingHistory (grant-content.ts)
 *
 * Claim labels mirror the QBE Diagnostic Artifact Database and the hub legend.
 */
import { CANONICAL_ASSETS } from './asset-canonical';

export type ClaimLabel = 'verified' | 'modelled' | 'target' | 'future' | 'internal-only';
export type CanonDomain = 'assets' | 'money' | 'story' | 'product' | 'cost' | 'pipeline' | 'governance';
/** GREEN = public-safe. AMBER = internal/management. RED = recipient/storyteller data, never to external models, never auto-published. */
export type DataClass = 'green' | 'amber' | 'red';
/** 'auto' = a drift script can re-derive from a live source. 'manual' = a human must re-pull and reconcile (all money). */
export type CheckMode = 'auto' | 'manual';

export interface CanonFact {
  /** Stable slug. Artifacts cite these ids to make drift computable. */
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  domain: CanonDomain;
  claimLabel: ClaimLabel;
  dataClass: DataClass;
  /** Where the truth actually lives (table, file, or system). */
  source: string;
  check: CheckMode;
  /** ISO date this value was last confirmed against its source. Loops re-stamp on confirm. */
  asAt: string;
  owner: string;
  definition: string;
  /** Sibling fact ids this should reconcile against (different cuts of the same thing). */
  reconcilesWith?: string[];
}

export const CANON: CanonFact[] = [
  // ── Assets (auto-checked against the live register by check-asset-drift.mjs) ──
  {
    id: 'beds-deployed', label: 'Beds deployed', value: CANONICAL_ASSETS.bedsDeployed, unit: 'units',
    domain: 'assets', claimLabel: 'verified', dataClass: 'green',
    source: 'v2 Supabase `assets` (status=deployed) via asset-canonical.ts', check: 'auto', asAt: '2026-05-30', owner: 'Ben',
    definition: 'Deployed bed units in the register: 363 Basket (legacy) + 133 Stretch (flagship).',
  },
  {
    id: 'stretch-beds-deployed', label: 'Stretch Beds deployed', value: CANONICAL_ASSETS.stretchBedsDeployed, unit: 'units',
    domain: 'assets', claimLabel: 'verified', dataClass: 'green',
    source: 'v2 Supabase `assets` via asset-canonical.ts', check: 'auto', asAt: '2026-05-30', owner: 'Ben',
    definition: 'Current flagship beds deployed. Drives plastic-kg.',
  },
  {
    id: 'washers-in-community', label: 'Washing machines in community', value: CANONICAL_ASSETS.washersInCommunity, unit: 'units',
    domain: 'assets', claimLabel: 'verified', dataClass: 'green',
    source: 'Curated in-community count (Ben-confirmed 2026-06-11); supersedes the register deployed-row count pending a status cleanup', check: 'manual', asAt: '2026-06-11', owner: 'Ben',
    definition: '16 Pakkimjalki Kari washing machines in community. Single public figure; not auto-derived from the register.',
  },
  {
    id: 'communities-served', label: 'Communities served', value: CANONICAL_ASSETS.communitiesServed, unit: 'communities',
    domain: 'assets', claimLabel: 'verified', dataClass: 'green',
    source: 'v2 Supabase `assets` via asset-canonical.ts', check: 'auto', asAt: '2026-05-30', owner: 'Ben',
    definition: '9 served; 10 distinct communities touched.',
  },
  {
    id: 'plastic-kg', label: 'Recycled HDPE diverted', value: CANONICAL_ASSETS.plasticKg, unit: 'kg',
    domain: 'assets', claimLabel: 'verified', dataClass: 'green',
    source: 'Derived: stretchBedsDeployed × 20kg', check: 'auto', asAt: '2026-05-30', owner: 'Ben',
    definition: 'Stretch-only (Basket beds are not a plastic product).',
  },

  // ── Money (MANUAL: never auto-written by a loop; reconciliation is a P0 human gate) ──
  {
    id: 'revenue-received', label: 'Funding received (site figure)', value: 741_111, unit: 'AUD',
    domain: 'money', claimLabel: 'verified', dataClass: 'amber',
    source: 'verifiedFinancials.revenueReceived (compendium.ts) === fundingHistory.totalReceived (grant-content.ts); restated 2026-06-03 live-Xero reconcile',
    check: 'manual', asAt: '2026-06-03', owner: 'Ben/accountant',
    definition: 'Cash received since inception, Goods-scoped. Snow $493,130 + Centrecorp $123,332 + VFFF $50,000 + QIC $12,000 + Villiers $1,200 + commercial $61,449. PICC and other Marchesi-project contacts excluded.',
    reconcilesWith: ['revenue-xero-paid', 'revenue-carveout'],
  },
  {
    id: 'accounts-receivable', label: 'Accounts receivable', value: 143_000, unit: 'AUD',
    domain: 'money', claimLabel: 'verified', dataClass: 'amber',
    source: 'verifiedFinancials.accountsReceivable (compendium.ts) === fundingHistory.totalReceivables (grant-content.ts)',
    check: 'manual', asAt: '2026-06-03', owner: 'Ben/accountant',
    definition: 'Rotary INV-0222 $82,500 + Homeland INV-0303 $44,000 + Regional Arts INV-0302 $16,500 (all live authorised in Xero).',
  },
  {
    id: 'revenue-xero-paid', label: 'ACT-GD receivables paid (Xero cut)', value: 650_910.79, unit: 'AUD',
    domain: 'money', claimLabel: 'verified', dataClass: 'amber',
    source: 'Live Xero ACT-GD scoped receivables', check: 'manual', asAt: '2026-06-01', owner: 'Ben/accountant',
    definition: 'ACT-GD scoped paid receivables. Raised $733,410.79, $82,500 due. Includes PICC $436,700. A narrower/different cut to revenue-received.',
    reconcilesWith: ['revenue-received'],
  },
  {
    id: 'revenue-carveout', label: 'Goods revenue carve-out', value: 713_827, unit: 'AUD',
    domain: 'money', claimLabel: 'verified', dataClass: 'amber',
    source: 'Goods carve-out, pitch blueprint A3', check: 'manual', asAt: '2026-06-02', owner: 'Ben/accountant',
    definition: 'Citable accountant-signed Goods-only carve-out. No surplus claimed: connected entity runs an FY26 net loss. Use alongside revenue-received ($741,111 all-sources) with the basis named.',
    reconcilesWith: ['revenue-received'],
  },

  // ── Product / cost ──
  {
    id: 'stretch-price', label: 'Stretch Bed price', value: 750, unit: 'AUD',
    domain: 'product', claimLabel: 'verified', dataClass: 'green',
    source: 'v2 Supabase `products` (stretch-bed-single, price_cents=75000)', check: 'manual', asAt: '2026-05-29', owner: 'Nic',
    definition: 'Current shop price for the only direct-sale product.',
  },
  {
    id: 'marginal-buykit', label: 'Marginal cost / bed (Buy-Kit)', value: 685, unit: 'AUD',
    domain: 'cost', claimLabel: 'verified', dataClass: 'green',
    source: 'cost-model/engine.ts (engine-locked BOM)', check: 'auto', asAt: '2026-05-29', owner: 'Ben',
    definition: 'Marginal cost buying finished leg kits. Engine-locked.',
  },
  {
    id: 'marginal-factory', label: 'Marginal cost / bed (Factory)', value: 426, unit: 'AUD',
    domain: 'cost', claimLabel: 'verified', dataClass: 'green',
    source: 'cost-model/engine.ts (engine-locked BOM)', check: 'auto', asAt: '2026-05-29', owner: 'Ben',
    definition: 'Marginal cost pressing our own legs. Engine-locked.',
  },
  {
    id: 'marginal-community', label: 'Marginal cost / bed (Community)', value: 421, unit: 'AUD',
    domain: 'cost', claimLabel: 'modelled', dataClass: 'green',
    source: 'cost-model/engine.ts (free-feedstock + fair-wage assumption)', check: 'manual', asAt: '2026-05-29', owner: 'Ben',
    definition: 'MODELLED on a fair-wage band ($100-160) and $0 free feedstock. Never group under engine-locked.',
  },
  {
    id: 'save-per-bed', label: 'Saving from pressing in-house', value: 194, unit: 'AUD',
    domain: 'cost', claimLabel: 'verified', dataClass: 'green',
    source: 'cost-model/engine.ts (BOM: $344 finished leg vs ~$40 raw plastic)', check: 'auto', asAt: '2026-05-29', owner: 'Ben',
    definition: '8.6x markup on the recycled-plastic leg. The whole capital case.',
  },

  // ── Story / consent (RED data class — recipient/storyteller; never auto-published) ──
  // Two consent tiers (reconciled 2026-06-17). cleared-voices = the OCAP-strict EXTERNAL list
  // we make funder/QBE claims on. display-storyteller-pool = the broader website roster,
  // computed live by Loop E (check-story-coverage.mjs). Do NOT conflate them: external claims
  // use cleared-voices; the pool is a coverage queue, not a clearance list.
  {
    id: 'cleared-voices', label: 'Consent-cleared voices (external use)', value: 32, unit: 'voices',
    domain: 'story', claimLabel: 'verified', dataClass: 'red',
    source: 'Ben consent pass 2026-06-17 (wiki/outputs/2026-06-17-storyteller-quote-decision-sheet.md); quotes from curated-quotes.ts + trip-stories.ts; supersedes the prior 3-voice strict list (pack 05)', check: 'manual', asAt: '2026-06-17', owner: 'Ben',
    definition: 'Voices Ben cleared for EXTERNAL use (funder material, public web, QBE) in the 2026-06-17 consent pass: Ivy Johnson, Dianne Stokes, Ray Nelson, Mykel, Kristy Bloomfield, Norman Frank, Linda Turner, Alfred Johnson, Brian Russell, Karen Liddle, Katrina Bloomfield, Annie Morrison, Heather Mundo, Fred Campbell, Gloria Turner, Carmelita & Colette (joint card), Daniel Patrick Noble, Shayne Bloomfield, Jason, Gary, Dorrie Jones (consent confirmed 2026-06-17), Cliff Plummer, Mark, Melissa Jackson, Patricia Frank, Risilda Hogan, Tracy McCartney, Jimmy Frank, Xavier (consent confirmed 2026-06-17; pictured on the main Stretch Bed photo; story told in Fred Campbell\'s voice, no own EL record), + practitioner voices Dr Boe Remenyi, Chloe & Wayne Glenn (label as practitioners, NOT community recipients). RED: never to external models, never auto-published. Broader website roster = display-storyteller-pool.',
    reconcilesWith: ['display-storyteller-pool'],
  },
  {
    id: 'display-storyteller-pool', label: 'Website storyteller pool (display tier)', value: 32, unit: 'voices',
    domain: 'story', claimLabel: 'internal-only', dataClass: 'red',
    source: 'check-story-coverage.mjs computed pool (curated-quotes.ts ∪ trip-stories.ts cleared VoiceCards); mirror of wiki/canon/story-coverage.md', check: 'manual', asAt: '2026-06-16', owner: 'Ben',
    definition: 'Named voices live on the website via a public curated quote or a cleared trip VoiceCard (incl. partners/board). A coverage queue, NOT the external-clearance list — use cleared-voices for any external/funder claim. Mirrors the Loop E computed pool; re-confirm each run (Loop E warns if this drifts from the computed count).',
    reconcilesWith: ['cleared-voices'],
  },
  {
    id: 'el-published-stories', label: 'Empathy Ledger published stories', value: 0, unit: 'stories',
    domain: 'story', claimLabel: 'verified', dataClass: 'amber',
    source: 'Empathy Ledger API (goods-on-country project)', check: 'manual', asAt: '2026-06-03', owner: 'Ben',
    definition: '240 storytellers, 0 published. Site falls back to local journeyStories until EL publish-flips land.',
  },

  // ── Governance / legal (entity structure — QBE Area 09 keystone. ABNs are public ABR records.) ──
  // Added 2026-06-08 by Loop C; each fact hand-verified against the area-09 legal review + grant-content.ts orgIdentity.
  {
    id: 'entity-operating-now', label: 'Current operating entity', value: 'Nicholas Marchesi (sole trader), ABN 21 591 780 066',
    domain: 'governance', claimLabel: 'verified', dataClass: 'green',
    source: 'wiki/outputs/2026-05-29-qbe-area-09-legal-structure-full-review.md + grant-content.ts orgIdentity', check: 'manual', asAt: '2026-05-29', owner: 'Ben/Nic',
    definition: 'Goods trades, invoices and contracts through this sole trader today, during migration to the company. The migration starting point, not the destination.',
    reconcilesWith: ['entity-trading-goforward'],
  },
  {
    id: 'entity-trading-goforward', label: 'Go-forward trading entity', value: 'A Curious Tractor Pty Ltd, ACN 697 347 676 / ABN 36 697 347 676, t/a Goods on Country',
    domain: 'governance', claimLabel: 'verified', dataClass: 'green',
    source: 'grant-content.ts orgIdentity (ABN confirmed 2026-05-29, registered 21 Apr 2026); area-09 review', check: 'manual', asAt: '2026-05-29', owner: 'Ben/Nic',
    definition: 'Confirmed go-forward trading company; all operations migrate to it in FY2026-27. Goods on Country is its trading name, not a separate company. Do not present the migration as finished externally.',
  },
  {
    id: 'entity-dgr-home', label: 'Charity / DGR home', value: 'The Butterfly Movement Ltd, ABN 22 155 132 684',
    domain: 'governance', claimLabel: 'verified', dataClass: 'green',
    source: 'area-09 review citing ABN Lookup (extracted 2026-05-06): active company, ACNC charity, PBI, GST, DGR Item 1', check: 'manual', asAt: '2026-05-06', owner: 'Ben/Nic',
    definition: 'The ONLY DGR / public-benevolent vehicle for Goods, operational from FY2026-27 (~1 July 2026), gifted from TABOO Foundation. DGR is never via Goods / A Curious Tractor / A Kind Tractor directly, and not before the FY2026-27 handover.',
  },
  {
    id: 'entity-dormant', label: 'Dormant entity (do not cite)', value: 'A Kind Tractor Ltd, ABN 73 669 029 341',
    domain: 'governance', claimLabel: 'verified', dataClass: 'green',
    source: 'area-09 review citing ABN Lookup (extracted 2026-05-18): active company / ACNC charity but NOT DGR-entitled', check: 'manual', asAt: '2026-05-18', owner: 'Ben/Nic',
    definition: 'DORMANT and NOT used — not the trading entity, not the charity, not DGR. Do not use it as the Goods vehicle or claim DGR for it. (grant-content.ts previously mis-listed it with ABN 50 001 350 152 + DGR true; corrected 2026-05-29.)',
  },

  // ── Pipeline / capital (match-gate tracking — AMBER, manual; the headline conversion metric) ──
  {
    id: 'signed-lois', label: 'Signed LOIs', value: 0, unit: 'LOIs',
    domain: 'pipeline', claimLabel: 'verified', dataClass: 'amber',
    source: 'GHL Supporter-Journey pipeline (Committed / Signed-LOI stage)', check: 'manual', asAt: '2026-05-30', owner: 'Ben',
    definition: 'Signed letters of intent across all 3 Goods pipelines. The QBE match gate needs >=3 signed LOIs by 31 Aug 2026; this is the headline conversion metric. A moving number — re-confirm from GHL before citing.',
  },
];

const BY_ID = new Map(CANON.map((f) => [f.id, f]));

/** Look up a canon fact by id. Throws if missing, so a typo fails loudly. */
export function canonFact(id: string): CanonFact {
  const f = BY_ID.get(id);
  if (!f) throw new Error(`Unknown canon fact id: ${id}`);
  return f;
}

/** The value of a canon fact by id. */
export function canonValue(id: string): number | string {
  return canonFact(id).value;
}

/** All facts in a domain. */
export function canonByDomain(domain: CanonDomain): CanonFact[] {
  return CANON.filter((f) => f.domain === domain);
}
