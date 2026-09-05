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

/**
 * What claim a FACT can carry. One of three claim-ish vocabularies in this
 * codebase, which look mergeable and are not. Written down because the
 * temptation to collapse them is real and would lose meaning:
 *
 *   ClaimLabel    (here)                  subject: a FACT.
 *                                         "how well evidenced is this number"
 *   ClaimStatus   (claims-ledger.ts)      subject: an external CLAIM.
 *                                         Shares most values, but adds 'locked',
 *                                         which is a claim we PUBLISH as
 *                                         deliberately withheld, with a ceiling
 *                                         and a promised flip date. That is not
 *                                         the same as 'internal-only' here,
 *                                         which means the fact is simply not
 *                                         shown.
 *   EvidenceState (community-pathways.ts) subject: HOW something was evidenced,
 *                                         not how strongly. Carries
 *                                         'community-confirmation', which is a
 *                                         distinct epistemology from a measured
 *                                         figure and is the point rather than a
 *                                         weaker version of 'verified'.
 *
 * Separately: the deck-hygiene labels in the standing rules
 * (observed/requested/agreed/delivered/measured/proposed) are NOT this axis.
 * They track a commitment through its lifecycle, which the code models as
 * DemandStatus on bed demand. Do not import them here.
 *
 * Labels mirror the QBE Diagnostic Artifact Database and the hub legend.
 */
/**
 * `workpaper` added 2026-07-25 (ruling H). It fills a real gap: a figure that is ACTUAL, not
 * modelled, but whose supporting document is not signed. The Goods-only carve-out is the case.
 * Before this, such a figure had to sit as `verified` (an overclaim: it implies checkable
 * today) or `modelled` (wrong: it is real cash). Mirrors `Solidity` in cost-story.ts, which
 * has carried a `workpaper` grade for longer.
 */
export type ClaimLabel = 'verified' | 'workpaper' | 'modelled' | 'target' | 'future' | 'internal-only';
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
    source: 'v2 Supabase `assets` (status=deployed) via asset-canonical.ts', check: 'auto', asAt: '2026-07-18', owner: 'Ben',
    // Date corrected 2026-08-04: said "Jul 2026", INV-0303 is dated 18 May 2026 (PAID).
    // Invoice-level provenance for Maningrida lives on COMMUNITY_BED_CANON.
    definition: 'Deployed bed units in the register: 363 Basket (legacy) + 177 Stretch (flagship; incl. Maningrida +40, INV-0303 18 May 2026, and Kununurra +2 / Katherine +1 / Tennant youth centre +1, Ben rulings 2026-07-19).',
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
    source: 'Ben ruling 2026-07-21, settled per community against the live register (supersedes the old curated 20). The register still shows 32 deployed washer rows because 10 are stale (Tennant Creek 7, Alice Springs 2, Darwin 1 pending restatus to retired). Purchase ledger: wiki/outputs/2026-05-14-washing-machine-final-reconciliation.md; ruling table: CONTEXT.md', check: 'manual', asAt: '2026-07-21', owner: 'Ben',
    definition: '22 Pakkimjalki Kari washing machines in community: Maningrida 8, Tennant Creek 9, Palm Island 4, Alice Springs 1, Darwin 0. Single public figure; becomes register-derivable once the 10 stale deployed rows are restatused.',
  },
  {
    id: 'communities-served', label: 'Communities served', value: CANONICAL_ASSETS.communitiesServed, unit: 'communities',
    domain: 'assets', claimLabel: 'verified', dataClass: 'green',
    source: 'v2 Supabase `assets` via asset-canonical.ts', check: 'auto', asAt: '2026-05-30', owner: 'Ben',
    definition: '11 served (incl. Kununurra + Katherine, added 2026-07-19); 12 distinct communities touched.',
  },
  {
    id: 'plastic-kg', label: 'Recycled HDPE diverted', value: CANONICAL_ASSETS.plasticKg, unit: 'kg',
    domain: 'assets', claimLabel: 'verified', dataClass: 'green',
    source: 'Derived: stretchBedsDeployed × 20kg', check: 'auto', asAt: '2026-05-30', owner: 'Ben',
    definition: 'Stretch-only (Basket beds are not a plastic product).',
  },

  // ── Money (MANUAL: never auto-written by a loop; reconciliation is a P0 human gate) ──
  {
    id: 'revenue-received', label: 'Funding received (site figure)', value: 901_311, unit: 'AUD',
    domain: 'money', claimLabel: 'verified', dataClass: 'amber',
    source: 'verifiedFinancials.revenueReceived (compendium.ts) === fundingHistory.totalReceived (grant-content.ts); 2026-06-03 live-Xero reconcile, restated 2026-09-05 (Ben) twice: first to add Homeland INV-0303 $44,000, then ALIVE INV-0342 $101,200 and Julalikari INV-0335 $15,000, all three Goods receipts paid after that baseline and re-read as PAID on Xero the same day. Oonchiumpa INV-0344 $41,250 and INV-0346 $1,000, both paid after the baseline, were ruled OUT on 2026-09-05 (Ben: the first is the Oonchiumpa program through ACT, the second a reimbursement), so nothing paid after the baseline is pending.',
    check: 'manual', asAt: '2026-09-05', owner: 'Ben/accountant',
    definition: 'Cash received since inception, Goods-scoped. Grant and philanthropic receipts $556,330 (Snow $493,130 + VFFF $50,000 + QIC $12,000 + Villiers $1,200) + commercial and buyer receipts $344,981 (Centrecorp $123,332 for 167 beds on INV-0259 and INV-0291, ruled a buyer by Ben on 2026-09-05, DECISIONS.md ruling Z, + other buyer and commercial receipts $221,649). Grant share about 62%. PICC and other Marchesi-project contacts excluded. Was $785,111: the commercial line was $105,449 until Ben ruled on 2026-09-05 that ALIVE INV-0342 $101,200 and Julalikari INV-0335 $15,000 are sales, the same as the Centrecorp sales, and both go in. Before that it was $741,111 until Homeland INV-0303 $44,000 went in the same day.',
    reconcilesWith: ['revenue-xero-paid', 'revenue-carveout'],
  },
  {
    id: 'accounts-receivable', label: 'Accounts receivable', value: 82_500, unit: 'AUD',
    domain: 'money', claimLabel: 'verified', dataClass: 'amber',
    source: 'verifiedFinancials.accountsReceivable (compendium.ts) === fundingHistory.totalReceivables (grant-content.ts)',
    check: 'manual', asAt: '2026-09-05', owner: 'Ben/accountant',
    definition: 'Rotary INV-0222 $82,500 alone, and it is BAD DEBT (Ben, 2026-09-05: "just overdue and fucked"), due 24 April 2025. COLLECTABLE RECEIVABLES ARE $0, so never present this as money we expect. Was $143,000: Homeland INV-0303 $44,000 has been paid (Ben, 2026-09-05; Xero PAID) and Regional Arts INV-0302 $16,500 is a Harvest project receivable, not Goods (Ben, 2026-09-05).',
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
    // RULING G/H 2026-07-25: cite the figure, never call it signed. No accountant document
    // exists yet; getting one is the next action. Was claimLabel 'verified', which ruling G
    // flagged as an overclaim rendering in front of funders.
    domain: 'money', claimLabel: 'workpaper', dataClass: 'amber',
    source: 'Goods carve-out workpaper, prepared with the accountant (NOT signed); pitch blueprint A3', check: 'manual', asAt: '2026-06-02', owner: 'Ben/accountant',
    definition: 'Goods-only FY26 carve-out, prepared with the accountant but NOT YET SIGNED (Ben ruling 2026-07-25, DECISIONS.md ruling G). Cite the figure; never the word signed, until a signed letter exists and is named in this source field. Obtaining one is an open action, promised in the claims ledger before mid-August 2026. No surplus is claimed for Goods. The sole trader\'s FY26 P&L closed on a net profit of about $168K before any founder wages, which are not in the books (Xero re-pull 5 Sep 2026; the earlier "net loss" was the 31 May year-to-date position and is retired). Goods\' history sits in those books and everything Goods is moving into The Butterfly Movement Ltd, Goods on Country (ruling X; Ben, 5 Sep 2026). Use alongside revenue-received ($901,311 all-sources) with the basis named.',
    reconcilesWith: ['revenue-received'],
  },

  // ── Product / cost ──
  {
    id: 'stretch-price', label: 'Stretch Bed price', value: 750, unit: 'AUD',
    domain: 'product', claimLabel: 'verified', dataClass: 'green',
    source: 'v2 Supabase `products` (stretch-bed-single, price_cents=75000). Flipped to check: auto on 2026-07-25 — check-asset-drift.mjs verifies this against the live products row. products.ts deliberately holds no prices, so the live table is the only source that can confirm it, and that job already holds the credentials.', check: 'auto', asAt: '2026-07-25', owner: 'Nic',
    definition: 'Current shop price for the only direct-sale product. Delivery is additional and quoted separately for the destination (Ben ruling 2026-08-10).',
  },
  {
    id: 'facility-public-low', label: 'Complete facility public range — low', value: 150_000, unit: 'AUD',
    domain: 'cost', claimLabel: 'target', dataClass: 'green',
    source: 'GoC Entity Financial Model v1; simplified public band ruled by Ben 2026-08-10', check: 'manual', asAt: '2026-08-10', owner: 'Ben',
    definition: 'Lower end of the public $150K–$220K complete-facility range, including equipment, workspace setup, commissioning and initial support. Location-specific exceptions are scoped separately.',
    reconcilesWith: ['facility-public-high'],
  },
  {
    id: 'facility-public-high', label: 'Complete facility public range — high', value: 220_000, unit: 'AUD',
    domain: 'cost', claimLabel: 'target', dataClass: 'green',
    source: 'GoC Entity Financial Model v1; simplified public band ruled by Ben 2026-08-10', check: 'manual', asAt: '2026-08-10', owner: 'Ben',
    definition: 'Upper end of the public $150K–$220K complete-facility range. Replaces the public $112K–$222K capital envelope; detailed model ranges remain internal evidence.',
    reconcilesWith: ['facility-public-low'],
  },
  {
    id: 'governance-scoping-base', label: 'Governance and scoping base case', value: 35_000, unit: 'AUD',
    domain: 'governance', claimLabel: 'target', dataClass: 'green',
    source: 'Planning range agreed by Ben 2026-08-10; validate against completed scopes', check: 'manual', asAt: '2026-08-10', owner: 'Ben',
    definition: 'Public starting point within an internal $25K–$50K range for listening, governance design, needs assessment, facility scope, budget and pathway brief.',
  },
  {
    id: 'working-capital-base', label: 'Working capital base case', value: 105_000, unit: 'AUD',
    domain: 'money', claimLabel: 'modelled', dataClass: 'amber',
    source: 'GoC Entity Financial Model v1; base case ruled by Ben 2026-08-10', check: 'manual', asAt: '2026-08-10', owner: 'Ben',
    definition: 'Investor-diligence planning case within an $80K–$145K range. Revolving capital for materials, production, wages and delivery before customer payment; not annual expenditure.',
  },
  {
    id: 'goods-network-basis', label: 'Goods annual network cost basis', value: 290_200, unit: 'AUD/year',
    domain: 'money', claimLabel: 'workpaper', dataClass: 'amber',
    source: 'GoC Entity Financial Model v1: salaries $151.2K + head office $53K + marketing $35K + field travel $51K', check: 'manual', asAt: '2026-08-10', owner: 'Ben/accountant',
    definition: 'Transparent basis for the approximately $300K annual public ask. The separate $50K consulting/accounting provision is excluded until overlap is reconciled.',
  },
  {
    id: 'marginal-buykit', label: 'Marginal cost / bed (Buy-Kit)', value: 685, unit: 'AUD',
    domain: 'cost', claimLabel: 'verified', dataClass: 'green',
    source: 'cost-model/engine.ts (engine-locked BOM)', check: 'auto', asAt: '2026-05-29', owner: 'Ben',
    definition: 'Marginal cost buying finished leg kits. Engine-locked.',
  },
  {
    id: 'marginal-factory', label: 'Marginal cost / bed (Factory)', value: 426, unit: 'AUD',
    domain: 'cost', claimLabel: 'modelled', dataClass: 'green',
    source: 'cost-model/engine.ts (engine-locked BOM)', check: 'auto', asAt: '2026-07-31', owner: 'Ben',
    definition: 'Marginal cost pressing our own legs. Engine-locked BOM, so the ARITHMETIC is verified; the per-bed cost at a sustained production rate has never been measured. Regraded verified -> modelled 2026-07-31: cost-story.ts, ask-surface.ts SPEND_SEPARATION, deck.ts stop-6 and the standing hard rule all said modelled while canon said verified, and deck.ts:368 already wrote down why ("a verified BOM computation, not a measured production cost"). Any surface reading claimLabel straight from canon was one import away from printing "verified" beside $426 in front of a funder. The measured 50-bed run is what changes this.',
  },
  {
    id: 'marginal-community', label: 'Marginal cost / bed (Community)', value: 421, unit: 'AUD',
    domain: 'cost', claimLabel: 'modelled', dataClass: 'green',
    source: 'cost-model/engine.ts computeModel(DEFAULTS).marginalCommunity = stateCommunity 270.74 + longHaulFreight 150 = 420.74, rounded to 421. Verified 2026-07-25 and flipped to check: auto — canon.guards.test.ts recomputes it from the engine and fails on a mismatch.', check: 'auto', asAt: '2026-07-25', owner: 'Ben',
    definition: 'MODELLED on a fair-wage band ($100-160) and $0 free feedstock. Never group under engine-locked. This is the COMMUNITY build, engine field marginalCommunity, not marginalFactory (425.74) and not marginalKit (684.79). The QBE sweep\'s ~$426/bed is the factory figure; do not reconcile the two, they are different build methods.',
  },
  {
    id: 'save-per-bed', label: 'Saving from pressing in-house', value: 194, unit: 'AUD',
    domain: 'cost', claimLabel: 'modelled', dataClass: 'green',
    source: 'cost-model/engine.ts (BOM: $344.05 finished leg vs $40.00 raw shred ex-delivery)', check: 'auto', asAt: '2026-07-31', owner: 'Ben',
    definition: '8.6x markup on the recycled-plastic leg. The whole capital case. THE RATIO DIVIDES BY $40, THE RAW SHRED EX-DELIVERY (cost-model-scenarios.json raw_hdpe_cost_per_bed_no_delivery, and idiot_index raw_low 40.00 / index_low 8.6), NOT the $55 landed figure sitting one line away from it: $344.05/$55 is 6.3 and a funder breaks it with a calculator. Regraded verified -> modelled 2026-07-31 for the same reason as marginal-factory, which it derives from.',
  },

  // ── Story / consent (RED data class — recipient/storyteller; never auto-published) ──
  // Two consent tiers (reconciled 2026-06-17). cleared-voices = the OCAP-strict EXTERNAL list
  // we make funder/QBE claims on. display-storyteller-pool = the broader website roster,
  // computed live by Loop E (check-story-coverage.mjs). Do NOT conflate them: external claims
  // use cleared-voices; the pool is a coverage queue, not a clearance list.
  {
    id: 'cleared-voices', label: 'Consent-cleared voices (external use)', value: 37, unit: 'voices',
    domain: 'story', claimLabel: 'verified', dataClass: 'red',
    source: 'Ben consent pass 2026-06-17 (wiki/outputs/2026-06-17-storyteller-quote-decision-sheet.md), which cleared 32; quotes from curated-quotes.ts + trip-stories.ts; supersedes the prior 3-voice strict list (pack 05). Moved to 34 on 2026-07-21 with Margaret Lloyd and Tanya Turner. The asAt is 2026-07-21 because that is the latest documented clearing event (Margaret Lloyd resolved and her portrait made public); if the pass that added Tanya Turner carries a different date, correct asAt to it. Reconciled 2026-07-25: cleared-voices.ts holds 34 distinct people (37 entries, 3 of them alias spellings) and storyteller-registry.ts holds 34 at tier external, matching both directions with no unresolved spellings. Flipped to check: auto on 2026-07-25 — check-storyteller-registry.mjs now fails if this value and the registry tier-external count disagree. Manual protected the decision, not the count, and the count is derivable from the tiers. Ben still owns who is cleared; the tier on a record is how that decision is expressed. Moved to 35 on 2026-08-01 with Jahvan Oui (Palm Island), cleared by Ben 2026-07-26 with quotes verbatim from the Final Video Jahvan transcript. His clearance was written on feat/six-front-doors, reached main in PR #171 and left again in the same-hour revert PR #173, so it sat stranded off main for five days while the content gate correctly blocked his 24 August post. Re-landed on its own, carrying only the allowlist entry, the registry record and the portrait: none of the six-front-doors site work came with it. Ebony Oui and the unnamed washing-machine recipients remain NOT cleared.', check: 'auto', asAt: '2026-08-01', owner: 'Ben',
    definition: 'Voices Ben cleared for EXTERNAL use (funder material, public web, QBE). From the 2026-06-17 consent pass: Ivy Johnson, Dianne Stokes, Ray Nelson, Mykel, Kristy Bloomfield, Norman Frank, Linda Turner, Alfred Johnson, Brian Russell, Karen Liddle, Katrina Bloomfield, Annie Morrison, Heather Mundo, Fred Campbell, Gloria Turner, Carmelita & Colette (joint card), Daniel Patrick Noble, Shayne Bloomfield, Jason, Gary, Dorrie Jones (consent confirmed 2026-06-17), Cliff Plummer, Mark, Melissa Jackson, Patricia Frank, Risilda Hogan, Tracy McCartney, Jimmy Frank, Xavier (consent confirmed 2026-06-17; pictured on the main Stretch Bed photo; story told in Fred Campbell\'s voice, no own EL record), + practitioner voices Dr Boe Remenyi, Chloe & Wayne Glenn (label as practitioners, NOT community recipients). Added after that pass, taking the count from 32 to 34: Margaret Lloyd (the Utopia "Margaret", resolved 2026-07-21, crm + EL linked, portrait public), Tanya Turner (Oonchiumpa manager). RED: never to external models, never auto-published. Broader website roster = display-storyteller-pool. The operative gate is cleared-voices.ts; this fact records the count, not the check. Added 2026-08-21, taking the count from 35 to 37: Eric Pascoe (On Country Learning Coordinator) and Tehmineh Mason (Principal), both Homeland School Company, Maningrida — full consent confirmed by Ben 2026-08-21 and mirrored in Empathy Ledger (profiles.consent_given=true, storytellers.content_status=active). Both speak on camera in the approved Maningrida film; quotes are from the Descript SRT of that cut.',
    reconcilesWith: ['display-storyteller-pool'],
  },
  {
    id: 'display-storyteller-pool', label: 'Website storyteller pool (display tier)', value: 34, unit: 'voices',
    domain: 'story', claimLabel: 'internal-only', dataClass: 'red',
    source: 'check-story-coverage.mjs computed pool (curated-quotes.ts ∪ trip-stories.ts cleared VoiceCards); mirror of wiki/canon/story-coverage.md. Flipped to check: auto on 2026-07-25 — that script computed this number all along and knew when the fact disagreed, but only wrote a warning into a markdown report. It now exits 1 on a mismatch and prints the correct value.', check: 'auto', asAt: '2026-06-16', owner: 'Ben',
    definition: 'Named voices live on the website via a public curated quote or a cleared trip VoiceCard (incl. partners/board). A coverage queue, NOT the external-clearance list — use cleared-voices for any external/funder claim. Mirrors the Loop E computed pool; re-confirm each run (Loop E warns if this drifts from the computed count).',
    reconcilesWith: ['cleared-voices'],
  },
  {
    id: 'el-published-stories', label: 'Empathy Ledger published stories (public)', value: 2, unit: 'stories',
    domain: 'story', claimLabel: 'verified', dataClass: 'amber',
    source: 'Empathy Ledger Supabase, Goods project 6bd47c8a-e676-456f-aa25-ddcbb5a31047. Re-derive with: GET /rest/v1/stories?project_id=eq.<goods>&status=eq.published&select=is_public,has_explicit_consent,consent_withdrawn_at,is_archived — count rows where is_public is true. Still check: manual because CI holds Goods Supabase secrets but not EL ones; flip to auto once EMPATHY_LEDGER_SUPABASE_* reach the workflow.', check: 'manual', asAt: '2026-07-25', owner: 'Ben',
    definition: 'Goods stories publicly readable from EL. Measured 2026-07-25: 10 rows carry status=published, but only 2 have is_public=true, and those 2 are exactly the ones returned by the canonical stories_for_site syndication RPC. All 10 carry explicit consent and syndication_enabled, so the gate holding the other 8 is the public flip, not consent. This fact counts the 2. The earlier value of 0 was correct on 2026-06-03 and went stale: the publish-flips the old definition was waiting on have partly landed. The site still falls back to local journeyStories for anything it cannot fetch.',
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
    // RULING K 2026-07-25. The `value` deliberately carries NO trading name: the company holds
    // no registered business names at all, so asserting one in a canon value is the exact
    // defect this ruling fixed. The trading-as-Goods. fact lives in the definition instead.
    id: 'entity-trading-goforward', label: 'Go-forward trading entity', value: 'A Curious Tractor Pty Ltd, ACN 697 347 676 / ABN 36 697 347 676',
    domain: 'governance', claimLabel: 'verified', dataClass: 'green',
    source: 'grant-content.ts orgIdentity (ABN confirmed 2026-05-29, registered 21 Apr 2026); area-09 review', check: 'manual', asAt: '2026-05-29', owner: 'Ben/Nic',
    definition: 'Confirmed go-forward trading company; all operations migrate to it in FY2026-27. It trades as Goods., the maker and seller, and holds NO registered business names (ABN Lookup, checked 2026-07-25). "Goods on Country" is a business name of The Butterfly Movement Ltd, the charity, registered 23 Jul 2026, NOT of this company (Ben ruling 2026-07-25, DECISIONS.md ruling K). The two are different things and conflating them has reached funder documents. Open and with MinterEllison: the shop\'s seller of record, since beds are sold by the company on a domain named for the charity. Do not present the migration as finished externally.',
  },
  {
    id: 'entity-dgr-home', label: 'Charity / DGR home', value: 'The Butterfly Movement Ltd, ABN 22 155 132 684',
    domain: 'governance', claimLabel: 'verified', dataClass: 'green',
    source: 'area-09 review citing ABN Lookup (extracted 2026-05-06): active company, ACNC charity, PBI, GST, DGR Item 1', check: 'manual', asAt: '2026-05-06', owner: 'Ben/Nic',
    definition: 'The ONLY DGR / public-benevolent vehicle for Goods. ABN Lookup (checked 2026-07-25) shows DGR endorsement live since 17 Jan 2012 and ACNC charity registration since 3 Dec 2012, so the entity IS DGR today; the open question is the receipting mechanics and whose name is on the receipt, not the status (confirm with the Butterfly side before printing "tax-deductible today" anywhere donor-facing). Also holds the registered business name "Goods on Country" from 23 Jul 2026. Control transferring from TABOO Foundation; AGM 14 Sep 2026. DGR is never via Goods. / A Curious Tractor / A Kind Tractor directly.',
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
    source: 'GHL "Goods Supporter Journey" pipeline, stage "Committed" (pipeline id JvBFYpVpyKsw899lkFgj). There is NO "Signed-LOI" stage; the old source named one that does not exist. Verified 2026-07-25: 0 rows at Committed.', check: 'manual', asAt: '2026-05-30', owner: 'Ben',
    definition: 'Signed match-eligible commitments across all 3 Goods pipelines. The QBE match gate is a DOLLAR test, not a count: the Stage 2 grant must be at least matched by signed external commitments (program terms, wiki/investor/04-qbe-pipeline.md). The prior ">=3 signed LOIs" assertion had no source and was struck 2026-07-25 (DECISIONS.md ruling M). Match is judged on signed, verifiable paper: amount, instrument, funder legal name, and a contact SIH can call, which is a LETTER, not a facility agreement, so a grant-led match papers faster than a loan. Target is AU$400K signed by our own internal gate of 31 Aug 2026; the program\'s own application closes late September 2026. SOURCED 2026-08-01: Jay Boolkin, Social Impact Hub, to the Stage 2 cohort 14 July 2026, "The formal application will open via an online form, closing in late September", with the final group check-in Thursday 3 September 2026 and a short pitch and interview before conditional offers. No firmer date has been circulated, so there is STILL no day to name. Do NOT write "14 Sep" as the application date: that is the Butterfly AGM, a different thing, and the source confirms it was never QBE\'s. Full requirements: wiki/investor/19-qbe-stage2-application-requirements.md. A moving number: re-confirm from GHL before citing.',
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
