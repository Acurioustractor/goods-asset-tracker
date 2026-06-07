# Grantscope — Goods Funder/Grant Matches

**Source repo:** `/Users/benknight/Code/grantscope` (Next.js)
**Mined:** 2026-05-30
**Scope:** FUNDER/GRANT prospect names + fit only. Goods asset/cost/revenue numbers from Grantscope are NOT trusted (see DRIFT FOUND).

## How the Goods matching brain works (still exists — confirmed)

The Goods matching brain is **live and database-driven**, not a static list. The named funders below are extracted from (a) the curated `funder_allowlist` seed and (b) the Goods operating-system code's named pipeline rows.

- **Runtime matcher:** `goods-signals-workbench.ts` joins community demand "signals" to two Supabase tables — `grant_opportunities` (filtered on `goods_relevance_score`, `geography`, `closes_at`, `discovery_method`) and `foundations` — via `matched_grant_ids` / `matched_foundation_ids`. Capital providers (IBA/NAIF/Many Rivers-type loans-with-grant-features) live in `grant_opportunities` as `discovery_method='indigenous-finance'`.
- **Fit gates (from `goods-signals-workbench.ts`):** `amount_max >= $10,000` AND `goods_relevance_score >= threshold` AND geography is national or state-exact to the community. `amount_max >= $100,000` earns a bonus.
- **Relevance scoring:** `add-goods-relevance-score.sql` adds `goods_relevance_score` (0–100) on `grant_opportunities`, scored on keyword/geography/amount-band/category/embedding signals. The actual keyword list is computed at scoring time (not in the migration), but the operating-system file names Goods' themes: **manufacturing, circular economy, Indigenous business, regional health, housing, dignity, climate/landfill reduction**.
- **Curated allowlist:** `scripts/expand-funder-allowlist-2026-05-15.sql` adds 20 named, themed funders (table below). These are the *trusted* funder universe that grant rows get attributed to.

**The named-funder data therefore lives in the Supabase DB + the allowlist seed — the matching logic in code is intact and operating.** I could not query the live DB (Grantscope's Supabase, not in scope here), so live `grant_opportunities` rows with deadlines/amounts are not enumerated; the curated + code-named prospects below are the extractable set.

---

## Ranked funder/grant prospects

Ranked by fit to the Goods profile (durable on-Country recycled-plastic goods for remote First Nations communities; non-equity blended capital). Tier A = active/named Goods pipeline. Tier B = curated allowlist, strong thematic + geographic fit. Tier C = curated allowlist, partial/adjacent fit.

| Funder / Grant | Type | Fit rationale | Amount / round (if stated) | Deadline (if stated) | Source file |
|---|---|---|---|---|---|
| **QBE Catalysing Impact** | Corporate impact grant | Live Goods ask; catalytic capacity + operating support; the lead funder gate | ~$210K *(Grantscope figure — verify)* | — | `goods-operating-system.ts` |
| **Snow Foundation** | Philanthropic foundation | Multi-tranche existing partner; health/dignity/community; warmest relationship | ~$200K under review *(verify)* | — | `goods-operating-system.ts` |
| **REAL Innovation Fund (DEWR)** | Government innovation fund | On-Country containerised production + governance pathway; via Oonchiumpa/PICC consortium | $1.2M / 4yrs (submitted) *(verify)* | EOI submitted | `goods-operating-system.ts`, `link-pipeline-grants.sql` |
| **Minderoo Foundation** | Philanthropic foundation (Forrest family) | Large generalist; indigenous + environment + community + health; named mid-May pitch (contact Lucy Stronach) | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql`, `goods-operating-system.ts` |
| **Centrecorp Foundation** | Corporate/regional buyer-foundation | Central Australia / Tennant Creek board pathway; pre-purchase + foundation route | ~$150K board pathway *(verify)* | — | `goods-operating-system.ts` |
| **QLD Partnering for Impact** | Government (QLD) blended | Repayment/governance/benefit model; blended (non-equity) capital fit | $640K of $3.2M (EOI pathway) *(verify)* | EOI pathway | `goods-operating-system.ts` |
| **Rio Tinto Foundation** | Corporate foundation | Pilbara + national Indigenous focus; WA/NT/QLD remote = direct geographic + theme fit | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **The Gelganyem Trust** | Philanthropic foundation | Kimberley Indigenous trust; indigenous + community + land + culture; remote WA | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **WCCT Central Sub-Regional Trust** (Western Cape Communities Trust) | Philanthropic foundation | Cape York / Western Cape Indigenous trust; indigenous + community; remote QLD | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **The Fogarty Foundation** | Philanthropic foundation | WA Indigenous education + entrepreneurship; social-enterprise angle | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **Moriarty Foundation** | Philanthropic foundation | Indigenous youth + community; NSW/NT national; remote-community delivery fit | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **IBA (Indigenous Business Australia)** | First Nations enterprise finance | Enterprise pathway / patient capital; non-equity finance for community-owned end-state | — | — | `goods-operating-system.ts` |
| **SEFA** | Impact loan / working capital | Blended non-equity working capital once unit economics + repayment logic ready | working capital / $640K+ *(verify)* | — | `goods-operating-system.ts` |
| **NAIF / Many Rivers** *(class)* | Indigenous-finance loans-with-grant-features | Named in code as the `indigenous-finance` capital class for Goods; non-equity blended | — | — | `goods-signals-workbench.ts` |
| **Fay Fuller Community Health Foundation** | Philanthropic foundation | Health + community; SA + national; health-impact (RHD/dignity) angle | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **Mater Foundation** | Philanthropic foundation | Health + community; QLD; health-outcome framing | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **RAS Foundation** | Philanthropic foundation | Rural/remote + community + education; regional reach | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **The Mercy Foundation** | Philanthropic foundation | Homelessness/housing + community + justice; dignity/sleeping-rough = bed fit | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **Australian Indigenous Education Foundation (AIEF)** | Philanthropic foundation | Indigenous focus (education/youth) — thematic-adjacent; warm-intro candidate | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **Shark Island Foundation** | Philanthropic foundation | Indigenous + storytelling/documentary; fits Empathy-Ledger story layer, not core build | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **Coles Group Foundation** | Corporate foundation | Food security + community; remote-store distribution adjacency (ALPA/Outback Stores) | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **CommBank Foundation** | Corporate foundation | Community + financial-wellbeing; broad corporate community grant | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **NSW Govt — DCCEEW (Climate/Environment/Water)** | Government agency | Environment + climate + regenerative + land; circular-economy/recycling fit | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **Community Broadcasting Foundation (CBF)** | Philanthropic foundation | Community + indigenous + media; story/awareness, not core build | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **Geelong Community Foundation** | Community foundation | Community + rural/remote; VIC-only — geographically weak for remote NT/QLD/WA | — | periodic_rounds | `expand-funder-allowlist-2026-05-15.sql` |
| **RAS / Mater / NSW-DCJ etc. (justice lane)** | Mixed | Adjacent justice/youth themes (JusticeHub, not Goods core) — low Goods fit | — | — | `expand-funder-allowlist-2026-05-15.sql` |

### Also named in code as relationship/warm (lower direct-grant fit)
- **Paul Ramsay Foundation** (contact William Frazer) — partner-tagged in GHL; kept warm for JusticeHub/civic infra, not Goods core. (`goods-operating-system.ts`, `link-pipeline-grants.sql`)
- **June Canavan Foundation** — relationship unverified, "verify fit". (`goods-operating-system.ts`)
- **Dusseldorp Forum** (Rachel Fyfe / Jessica Duffy) — active partner, youth-justice/systems-change lane. (`goods-operating-system.ts`)
- **Rotary eClub Outback Australia** — historical funder (receivable), remote-Australia aligned. (`goods-operating-system.ts`)
- **NAIDOC Grants** — linked to PICC org, not Goods directly. (`link-pipeline-grants.sql`)
- **Procurement (non-grant) buyer lane:** Supply Nation / IPP pathway, ALPA / Outback Stores, ACCHOs / hostels / SDA community housing, mining foundations (place-based pre-purchases). These are *buyer/pre-purchase* revenue, not grants.

---

## DRIFT FOUND (do NOT trust these Goods numbers from Grantscope)

Grantscope hard-codes stale/incorrect Goods asset/cost/revenue figures. All confirmed present in the repo on 2026-05-30:

- **`$600 per bed` planning cost** — `goods-cost-evidence.ts:967` and `:1035` ("use $600 per bed plus route freight"). Canonical Goods cost is far lower (v6 community direct ~$270.74). **Stale/wrong.**
- **`389 assets` / `369 beds, 20 washing machines`** — `goods-operating-system.ts:2`, `:136`, `:311`, `:394`. Canonical is **496 deployed beds (363 Basket + 133 Stretch) + 28 washers**. **Wrong (~107-bed undercount).**
- **`$445,685` philanthropic funding received** — `goods-operating-system.ts:11, 46, 54, 62, 70, 78, 148, 223, 275`. Does not match the Xero-reconciled Goods figures. **Treat as drift.**
- **`$537,595` ACT-GD revenue code** — `goods-operating-system.ts` financials block. **Unverified — do not repeat.**
- **`$400 target` delivered bed cost** — `goods-operating-system.ts` (flagged in-file as "unsafe claim"). **Do not quote.**
- **`404 / 369` asset-count reconciliation note** — `goods-operating-system.ts:311` ("reconcile 389 canonical with 404 CSV rows"). Both figures are stale vs the 496/28 canonical.
- Various **receivable/invoice amounts** (Snow INV-0321 $132K, Centrecorp INV-0314 $84,700, PICC $113,300, Rotary $82,500, Minderoo pitch $900K, etc.) are pulled from an older Xero snapshot and conflict with the current reconciliation — **treat all $ figures as indicative only; re-pull from live Xero.**

**Funder/grant NAMES and their thematic/geographic fit are reliable; every dollar figure and every Goods asset/cost number is NOT.**
