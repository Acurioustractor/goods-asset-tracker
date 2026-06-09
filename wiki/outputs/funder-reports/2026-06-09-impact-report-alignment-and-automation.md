# Impact report: alignment + automation design

> Date: 2026-06-09. Trigger: Snow asked for re-forwardable progress they can feed their monthly partner updates + Board. Question from Ben: make the report aligned and impactful (stories → bed + washer numbers → stage of growth → focus area → how the funder's support ignites change), automate it in Notion so we do not rebuild each time, and carve it into areas that get reviewed each quarter and sent to all supporters via a Notion page per milestone.
>
> Bottom line: the generation engine already exists and is ~80% of the way there. The real work is (1) a narrative spine that earns the word "impactful," (2) three missing content beats + washer numbers, and (3) the Notion publish + per-quarter review loop. This is a design, not a build. Nothing here is built yet.

## 1. What already exists (do not rebuild)

| Piece | Where | What it does | State |
|---|---|---|---|
| Report engine | `v2/scripts/generate-funder-report.mjs` | `node ... <funder-slug> <period-slug>` assembles the 18 section templates + per-funder config, resolves live metrics, writes `wiki/outputs/funder-reports/<slug>/<period>.md`. Quarter-aware (QUARTERS map). | Built |
| 18 section templates | `wiki/templates/funder-report/sections/*.md` | Modular markdown with `[METRIC: ...]` and `[PHOTO/QUOTE/VIDEO/MAP: ...]` placeholders. | Built |
| Per-funder config | `v2/src/lib/funders/configs/{snow,centrecorp}.ts` + registry | Picks which sections, supplies principles, risks, investment tiers, commitment, photo tags, headline achievements. | Built (snow, centrecorp) |
| Live metric resolvers | inside the engine | Beds by status/period, communities, plastic from Goods `assets`; $ raised/paid/overhead from the Xero mirror (`xero_invoices`). | Built |
| Markdown → Notion sync | `act-global-infrastructure/scripts/sync-goods-wiki-to-notion.mjs` | Mirrors any `wiki/outputs/*.md` as a Notion subpage under Goods. HQ; preserves child pages; dry-run; uses `notion-md-blocks.mjs`. | Built |
| Beds + washers per community → GHL | `v2/scripts/sync-goods-impact-rollups.mjs` + `cron-goods-impact-sync.sh` (weekly) | Live `assets` aggregated per community, Ben's curated community→record map, writes beds/washers/last-delivery onto funder + partner records. | Built + cron |
| Impact Reporting Register | Notion DB `08afd05c…` | Per-report record: status, due, period, evidence/story/claim review, GHL + URL fields. | Built |
| Web audience templates | `v2/src/lib/data/report-templates.ts` + `impact-report.tsx` + `/admin/reports/impact/[templateId]` | funder-impact / procurement-buyer / supporter-update / supply-partner web reports with live metrics + consent-filtered EL stories. | Built (separate track from the markdown engine) |

So: generate markdown → push to Notion → live beds/washers/$/communities are all solved. The chain works.

## 2. Review of the current 18 sections: aligned and impactful?

Classifying each section as AUTO (regenerates from live data, no human review) or CURATED (human-reviewed each quarter), and whether it serves the "ignite change" arc.

| Section | AUTO / CURATED | Verdict |
|---|---|---|
| 00 cover, 01 headline, 08 impact-numbers, 10 headline-achievements | AUTO | Solid. Numbers are live. BUT beds only, no washers. `$550` per-bed in 08 is hardcoded + off-canon ($534.79). |
| 02 map, 07 how-we-track | AUTO | Good proof-of-rigour. Keep. |
| 09 financials, 14 commitment-progress | AUTO (Xero) | Good, but the config feeding it is stale (snow.ts $395K/$275K/$120K; the slice is now fully paid, total ~$493K). |
| 03 hero-photo, 04 photo-grid, 05 voices | CURATED (consent) | The human heart. Keep. Consent-gated via EL. |
| 06 why-it-works | CURATED | Good "how it works", but it is product mechanics, not momentum. |
| 11 investment-priorities, 12 alignment-principles, 13 safeguarding-risks | CURATED | Compliance spine. Necessary for funders, dead weight for supporters. |
| 15 upcoming-commitments, 16 whats-next | CURATED | Closest thing to forward motion, but framed as a task list, not a growth story. |
| 17 country-acknowledgement | AUTO | Keep. |

**The alignment gap.** The report today is a strong *delivery + compliance* artifact. It proves the beds landed and the money was spent well. It does not tell the story Ben described. Three beats are missing entirely, and one number is missing:

1. **Washing machine numbers.** Absent from every section. The rollup sync already has washers per community; the report just never surfaces them.
2. **Stage of growth.** No beat says where Goods is on the journey (prototype → pilot → scaling) or what step-changed this quarter.
3. **Focus area.** No beat names the one or two things this capital is unlocking right now.
4. **The ignition / catalytic attribution.** Nothing connects *this funder's specific role* to the momentum it unlocked. For Snow this is the whole point: anchor capital → production plant → Alice Springs jobs → the next 1,000 beds. This is what makes a report "impactful" rather than "complete."

## 3. The aligned narrative spine (the 7 beats)

Re-order and extend the sections into one arc. Same data, told as a story that moves from a person to momentum.

1. **A person.** Open on one face, one voice, one place (hero-photo + a verified quote). [exists: 03, 05]
2. **What moved this period.** Beds AND washers delivered, communities, plastic. One glance. [exists: 01/08/10 + ADD washers]
3. **Where we are on the journey.** Stage of growth: the dial from first prototype to on-country production, and the specific step-change this quarter (e.g. "first paid local production roles in Alice Springs"). [NEW]
4. **What we are focused on next.** The one or two things this capital is unlocking now, and why these and not others. [reframe 15/16]
5. **How your support ignited this.** The catalytic line: connect the funder's dollars/role to the momentum. For Snow: anchor backing de-risked the plant, the plant created the jobs, the jobs make the next beds local. This is the beat that earns renewal. [NEW]
6. **Proof it is working, and well-governed.** Live impact numbers, QR tracking, safeguarding, principles alignment. The trust layer. [exists: 02/07/12/13]
7. **The invitation.** What is next together (renewal, the next tranche, the impact-investment conversation). [exists: 16, + funder-specific ask]

Supporter-tier version = beats 1, 2, 3, 5, 7 only (story-first, no financials / principles / risk register).

## 4. The three new content beats to build

All three are CURATED (config + EL), refreshed quarterly, not auto-generated, because they are judgement, not counts.

- **`stage-of-growth.md`** — a simple stage dial (prototype → pilot → scaling → on-country production) + a one-paragraph "step-change this quarter". Config supplies the current stage + the step-change sentence.
- **`focus-area.md`** — the 1-2 priorities this capital is unlocking now. Config supplies them.
- **`ignition.md`** (the catalytic attribution) — funder-specific: "your support → what it unlocked → what it is igniting next." Config supplies the chain per funder. This is the most important new section.

Plus one AUTO change: add washer resolvers (`washers-delivered-this-period`, `washers-working`, `wash-cycles-this-period`) and surface them in 01/08/10. Fleet data already exists (`impact-fetcher.ts`: 14 working, wash cycles via `get_fleet_kpis`).

## 5. The automation + per-quarter review model

The key idea that answers "do not rebuild each time": **every section is AUTO or CURATED, and the quarterly job is to review only the CURATED ones.**

```
Quarterly (or per milestone):
  1. node generate-funder-report.mjs <funder> <period>     # AUTO sections refresh from live data
  2. Review ONLY the CURATED sections (stories, stage, focus, ignition, principles, risks)
     - stories/photos: consent-gated via Empathy Ledger
     - stage/focus/ignition: edit the per-funder config
  3. node sync-goods-wiki-to-notion.mjs --file <the report>  # publish as a Notion page
  4. Update the Impact Reporting Register row: Notion URL, status, last sent, next touch
  5. Send the Notion page link via GHL (per audience segment)
```

- **AUTO sections** never need review. They are live by construction (assets, Xero, fleet, rollups).
- **CURATED sections** get a review state. Add a `Curated sections last reviewed` date to the Impact Reporting Register, plus the existing Evidence / Story / Claim review fields. That is the "specific area reviewed each quarter" Ben asked for: the CURATED set is the review surface.
- **Drift fixes that remove rebuild pain:** stop hardcoding $ in `snow.ts` (let the Xero resolver own commitment/received); fix the `$550` in section 08 to canon; this is what makes the AUTO half trustworthy.

## 6. Supporter tier + a Notion page per milestone

- Add a `supporter` funder-config-equivalent (or reuse `report-templates.ts` `supporter-update`) that selects the supporter beat set (1,2,3,5,7) and a warm tone. Output `wiki/outputs/funder-reports/supporter/<milestone>.md`.
- A **milestone** (e.g. "1,000th bed", "first Alice Springs production run", "plant commissioned") = an event-scoped run, not a quarter. The engine already takes any period; add named milestones alongside QUARTERS.
- Publish each milestone supporter page via the Notion sync. The page URL is shareable. The Impact Reporting Register row holds the URL + send status, and GHL sends the link to the supporter segment. This is the "Notion page for each milestone + supporter article" Ben described.

## 7. Build sequence (smallest first, only if Ben says go)

1. **Washer numbers** into the AUTO sections (resolvers + lines in 01/08/10). Smallest, highest "bed + washer" payoff.
2. **Fix the stale config drift** (snow.ts $ → Xero resolver; `$550` → canon). Removes rebuild pain.
3. **Three new CURATED sections** (`stage-of-growth`, `focus-area`, `ignition`) + add to snow.ts config with real content.
4. **Re-order** snow.ts sections into the 7-beat spine.
5. **Supporter tier** config + milestone runs.
6. **Notion publish + register-row update** as one wrapper command; add `Curated sections last reviewed` to the register.
7. (Optional) cron the quarterly generate + a "curated sections need review" reminder.

## Open questions for Ben

- Confirm the stage dial labels (prototype → pilot → scaling → on-country production?) and Goods' current stage.
- The Snow ignition chain in one line: is it "anchor capital → production plant → Alice Springs jobs → next 1,000 beds local"?
- Which milestones should trigger a supporter page (1,000th bed? first AS production run? plant commissioned?).
- Do supporters get the SAME Notion page or a lighter supporter-tier page (recommended: lighter).
