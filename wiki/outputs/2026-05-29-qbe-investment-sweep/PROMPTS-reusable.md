# Goods on Country — Reusable Prompts (2026-05-29)

Portable prompts for the QBE investor-readiness work, to run in different tools.
**How to use:** paste the **Context Block** first, then the prompt you want. Each prompt notes where it runs best.

---

## 0. CONTEXT BLOCK (paste this first, every time)

```
You are helping Goods on Country, a First Nations social enterprise making the Stretch Bed (recycled-HDPE legs + 2 galvanised steel poles + canvas; 26kg, 200kg capacity, 20kg HDPE diverted, ~5-min toolless assembly; price AUD 750) for remote Indigenous communities. Use ONLY these canonical facts; tag every figure verified / modelled / target; never overclaim.

ENTITY (confirmed 2026-05-29): Trading co = A Curious Tractor Pty Ltd, ABN 36 697 347 676 / ACN 697 347 676, t/a Goods on Country (migrating to it this FY). Currently operating via Nic Marchesi sole trader, ABN 21 591 780 066. Charity/DGR home = The Butterfly Movement Ltd (ACNC, Item 1 DGR), operational from FY2026-27 — DGR is ONLY ever via Butterfly. A Kind Tractor Ltd (ABN 73 669 029 341) is dormant, not used.

DEPLOYMENT (verified register): 496 deployed bed units across 10 communities.

VERIFIED FINANCIALS (live Xero cross-check 2026-05-29, not audited): revenue billed AUD 732,210.79 / received 649,710.79; AR 82,500 (Rotary, genuinely owed); AP ≈ 0 (a Xero payment-MATCHING gap — bills paid from ACT business accounts but never matched; NOT debt, NO director loan); expenses single cash basis 323,106 (~309K Goods); capex invested 110,046; ~89% grant-funded. Operating surplus before founder time ~340,585 (founder time sits on top as a sensitivity, ~84K/yr or 21-84K at 25-100% FTE; there is no clean single after-founder number, so lead with before-founder).

FOUNDER TIME (locked): 560/day, 150 days/yr (30 production / 50 fundraising / 25 commercialisation / 45 governance) = 84K/yr; only the 16.8K production share is unit cost — fundraising/commercialisation are cost-of-capital + customer-acquisition, not unit cost.

COST MODEL (4 build paths, direct cost/bed): Buy-Kit 534.79 / Buy-Panels 584.07 / Factory in-house 275.74 / Community 140.74. IDIOT INDEX (paid ÷ raw floor): HDPE legs 8.6x (raw ~40-55 vs paid 344 → ~289/bed Defy margin = the capital case), steel 2.1x, canvas 2.4x, hardware ~1x. Marginal cost/bed ~685 (Buy-Kit) → ~426 (Factory). Annual fixed block ~110-123K. Breakeven ~378 beds/yr (Factory) vs ~1,882 (Buy-Kit). Capex to in-source ~90-200K.

GUARDRAILS: The "1,912/bed" naive number is marginal + a year of fixed costs absorbed over tiny volume — a re-partition, NOT a cost cut. Don't present pipeline (3.42M CRM) as committed capital. Net-vs-gross capital ask is unresolved. Style: no em dashes; hyphenate "On-Country"; never "co-design".
```

---

## 1. Master investor-readiness sweep — *best in: a fresh Claude Code session in the repo*

```
[+ Context Block] Act as an impact-investment + first-principles strategy expert. Run a comprehensive QBE/SIH investor-readiness sweep for Goods: (1) review each of the 10 diagnostic areas and produce a Notion-ready record per area (status, priority P0-P2, gap, 3-5 sentence human summary, where-we-are, 2-4 priorities, proof links, public-copy risk); (2) reconfigure the bed cost model (idiot index + marginal-vs-fixed + founder-time reframe); (3) populate the CASE Investor Alignment Tool; (4) reconcile every dollar/quantity against a canonical numbers sheet and flag drift; (5) list every unsafe public/funder claim. Produce local drafts only — do NOT write to Notion or push code without approval. Then adversarially verify the numbers (a second pass that tries to refute each figure). The real gap is evidence control, not more analysis.
```

## 2. Bed unit-cost model + idiot index — *best in: Claude Code, or any LLM for the analysis*

```
[+ Context Block] Build/refine the Stretch Bed unit-cost model, first-principles (Musk idiot-index lens: paid ÷ raw-material cost; the biggest ratio is the biggest cost-down lever). Produce: (a) an idiot-index table per component; (b) the 4 build paths with direct cost/bed + margin at 750; (c) the marginal-vs-fixed reframe — separate marginal cost/bed from an annual fixed block from a breakeven volume, and show why a naive "fully-loaded $/bed" at low volume is fixed-cost absorption, not the cost of the next bed; (d) a cost-down trajectory tied to volume + in-sourcing milestones; (e) a simple live spreadsheet where changing inputs (HDPE $/kg, method, volume, founder rate) moves the cost + breakeven. Never imply the reframe makes the bed cheaper — it re-partitions the same total. Containerisation is the key lever: ~90-200K capex captures the ~289/bed Defy margin; show the payback by volume.
```

## 3. Goods-only 3-statement financial model (dial-driven) — *best in: Claude Code → xlsx, or describe to Google Sheets*

```
[+ Context Block] Build a goods-only 3-statement financial model as a control-panel-driven workbook with Google-Sheets-compatible formulas only. Tabs: Control Panel (yellow dials: volume, manufacturing method 1-4, # containerised factories, founder day-rate + FTE days, opening cash, price, freight → headline outputs); Unit Cost (4 methods + idiot index + containerisation capex/payback); Wages & People (founder 560×150d locked + FTE sensitivity at 25/50/75/100% of a 140K basis + toggleable future hires: GM/Head of Manufacturing, 3x sales); Revenue (verified actuals base + projection by segment); P&L (before & after founder time); Balance Sheet / working capital (AR 82,500, AP≈0, capex); Cashflow 36-month (cumulative recomputes off the opening-cash dial; capital injection toggles); Scenarios (Base/Upside/Downside + investment scenarios); Use of Funds; Assumptions & Provenance. Changing any dial must flow through to all three statements. Anchor to the verified actuals; honest (89% grant-funded, founder time included, not audited).
```

## 4. Investor Alignment Tool (CASE / Smart Impact) — *best in: a fresh chat, or to fill the .xlsx*

```
[+ Context Block] Populate the CASE / Smart Impact Capital "Investor Alignment Tool" for Goods. Tab 1 (Our Needs): set our priority (High/Med/Low/N-A) for the 8 knockout + 14 fit criteria, each with a one-line "our need" grounded in: hybrid Pty Ltd + Butterfly DGR; blended/concessional capital + grants (equity is low-fit for 2026); AU remote-Indigenous impact; QBE match-contingent; patient, mission-protective, low control-dilution. Tab 2 (Investor Tracking): the real pipeline — QBE/SEFA, Snow, Centrecorp, VFFF, Minderoo, Oonchiumpa/REAL (DEWR), QIC, PFI, IBA, PRF, Butterfly (DGR), R&D Tax Incentive, Rotary — with type, engagement stage, likelihood, est amount, owner, blockers, value-adds, red flags, priority. Tab 3 (Alignment): knockout X/8, fit X/14, verdict (pursue/park/decline). KEY: the QBE match is an OUTPUT of the stack (raise + evidence ~400K eligible non-QBE capital first — realistically Snow + Centrecorp + SEFA), not an input. Verified-paid only; no committed 2026 capital claimed.
```

## 5. QBE diagnostic area review → Notion-ready record — *reusable per area; Claude Code or fresh chat*

```
[+ Context Block] Review QBE/SIH diagnostic Area [N — NAME] for Goods and produce ONE Notion-ready record: diagnostic status (Strength / Partial / Gap / Priority gap), priority (P0/P1/P2), build status, claim labels, primary gap, a 3-5 sentence human summary a founder can say aloud (honest, no overclaim), where-we-are (progress since the V4 diagnostic), 2-4 concrete next priorities, evidence + decision artifacts, proof links, named public-copy risk, owner, timing. Across all areas the real gap is evidence control — founder-signed, consent-cleared, accountant/lawyer-endorsed collateral + cleaned public copy — NOT more narrative.
```

## 6. Clean stale public / funder copy — *best in: Claude Code on the repo*

```
[+ Context Block] Audit and clean stale/overclaimed public + funder copy across the codebase, landing as a standalone PR (do not deploy without sign-off). Fix: stale bed counts (369+/389/412/520+/600+ → 496 deployed across 10 communities); grant-funding overclaims (778,162 / 445K → ~576K verified + ~202K reconciling, not audited); "DGR1 status" or charity claims as Goods' own → DGR pathway via The Butterfly Movement Ltd ONLY; "committed buyer pipeline" / "fully unlocks the QBE match" / "de-risks SEFA" → contingent / in-conversation; ownership-transfer-as-done ("we don't license, we transfer") and present-tense On-Country manufacturing → pathway language; the dormant "A Kind Tractor Ltd" as the entity → A Curious Tractor Pty Ltd (ABN 36 697 347 676), DGR via Butterfly. Preserve the warm brand voice; no em dashes; "On-Country" hyphenated; never "co-design". Flag (don't guess) anything genuinely uncertain for legal/founder review.
```

## 7. Build a Notion page: tables + flow diagrams — *best in: Notion AI, or Claude with the Notion MCP*

```
[+ Context Block] Craft Notion-page content for [PAGE]. Use Notion-flavored markdown: tables as <table header-row="true"><tr><td>cell</td></tr></table> (NOT pipe tables; cells hold rich text only, use **bold** not HTML); callouts as <callout icon="💡" color="blue_bg">text</callout>; flow diagrams as ```mermaid code blocks (use <br> for line breaks, double-quote any node label with parentheses/special chars). Add these tables: [e.g. idiot index; the 4 build paths; verified financials; the investment-story scenarios]. Add these flows: [e.g. money flow — Funders → Butterfly DGR → trading co → community; cost-down — Buy-Kit → in-source → Factory → Community; financial-model structure — dials → unit cost → P&L → cashflow]. Keep it visual and simple; tag figures verified/modelled; no em dashes.
```

## 8. Draw a model / flow diagram — *best in: any LLM (mermaid); or an image/diagram tool for a polished render*

```
[+ Context Block] Draw a [operating model / cost-down flow / money flow / financial-model structure] for Goods as a mermaid flowchart (and a clean SVG if you can render one). Nodes + flows I want: [describe]. Reference — OPERATING MODEL: Funders/philanthropy → The Butterfly Movement Ltd (DGR) → funds plant + training + the fixed block → A Curious Tractor Pty Ltd (trading, t/a Goods on Country); institutional buyers → trading co (AUD 750/bed); trading co → community-led production (jobs + ownership On-Country) → finished beds back to the trading co. Short labels; no em dashes; hyphenate On-Country; double-quote any label with special characters.
```

## 9. Advisor document bundle — *best in: Claude Code on the repo, or a fresh session*

```
[+ Context Block] Assemble a costing + financials document bundle for a financial advisor doing the unit-costing handoff. Files: (1) README provenance index — every file with what it is, source, as-of date, confidence, up-to-date notes + a 1-paragraph orientation (the product, the 4 manufacturing methods, the containerisation question, the unit-cost levers: production location / method / shipping / labour); (2) bill of materials (component, qty/bed, unit cost, supplier, source); (3) supplier quotes (supplier, contact, price, MOQ, lead-time, valid-until, invoice ref); (4) cost model + 4 build paths + idiot index + factory economics + capex + containerisation payback; (5) verified financials (revenue / AR / AP≈0 matching-gap / single-basis expenses / capex / founder time) + the open accountant items. Tag every figure verified/modelled/target; do not fabricate — trace each number to a source; honest + conservative.
```

---

*Tip: chain them. In Claude Code, run #1 (sweep) → #2 (cost model) → #3 (3-statement) → #6 (copy cleanup) → #9 (bundle). In Notion AI, run #7 per page. In any chat (ChatGPT/Claude/Gemini), #2/#4/#5/#8 work standalone with the Context Block.*
