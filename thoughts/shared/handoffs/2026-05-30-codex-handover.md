# Handover → Codex — Goods on Country (2026-05-30)

**You are picking up a Next.js/TypeScript codebase mid-stream.** This doc is self-contained — read it top to bottom before touching anything. It assumes you do **not** have the GHL / Gmail / Notion / Xero MCP integrations the prior agent had, so MCP-dependent work is flagged as out-of-scope for you.

> First action: also read `CLAUDE.md` at the repo root (full project rules — it is NOT auto-loaded for you). This handover summarizes the load-bearing parts, but CLAUDE.md is authoritative.

---

## 1. Current state (verified)

- **Branch:** `main`, tip `070ee35`. Working tree is clean except one pre-existing modified file (`thoughts/shared/handoffs/network-consolidation/current.md` — not yours, leave it) and untracked docs under `wiki/outputs/`.
- **What just landed (this session):** the 6-PR QBE stack + a follow-up sweep, all squash-merged to main:
  | SHA | PR | What |
  |---|---|---|
  | `19d69cc` | #47 | `/investors` shared-password cockpit |
  | `df147ca` | #49 | `/admin/operating-systems` source-of-truth matrix |
  | `a44778f` | #50 | `/admin/loi-tracker` (reads GHL **live**) |
  | `3c7fc86` | #53 | audience comms segments + impact-report templates (was #51) |
  | `0510931` | #48 | `/impact` public-copy quarantine + provenance badges |
  | `2ee088b` | #52 | canonical asset counts + Stretch-only plastic + `/api/impact-summary` |
  | `070ee35` | #54 | standardize community count to 9 |
- **#38 closed** (superseded). **Open PRs remaining:** #25 (Vercel-analytics draft), #22 (old wiki docs) — both unrelated; ignore unless asked.
- **Type-check passes** (`cd v2 && npx tsc --noEmit` = 0 errors). **NOTE:** a full `npm run build` fails **only** on the pre-existing `/admin/production` prerender (local Supabase latency) — it builds fine on Vercel. Don't chase that failure; treat `tsc --noEmit` clean as the green gate.

---

## 2. How to work in this repo (critical rules)

- **`v2/` is the ONLY active codebase** (Next.js 16, React 19, App Router, Tailwind 4, TypeScript). `deploy/` is a legacy static site — **never edit it**.
- **Commands:** `cd v2 && npm run dev` · `npm run build` · `npm run lint`. Always end work with **`npx tsc --noEmit` = 0 errors**.
- **Git:** branch-first off `main` (branch protection blocks direct pushes). Conventional-commit messages, **no AI attribution** in commit text. Open a PR; squash-merge.
- **Supabase — READ THIS:** there are two projects. The **Supabase MCP is connected to the WRONG one** (`bhwyqqbovcjoefezgfnq`). The v2 app uses **`cwsyhpiuepvdjtxaozwf`**. For any v2 DB work use `curl` with the service-role key in `v2/.env.local`, or `psql` — **never** the Supabase MCP. Check `information_schema` / `v2/src/lib/types/database.ts` before writing queries; do not assume column names.
- **Don't over-plan.** This team wants implementation, not multi-phase plan docs. State a 2-3 bullet approach for non-trivial work, then build.

---

## 3. Canonical invariants — DO NOT DRIFT

These numbers were just hard-won (a multi-PR canonicalization). Re-introducing a wrong one is the highest-impact mistake you can make. **Always import from the source file; never hardcode.**

- **Asset counts** — source of truth: `v2/src/lib/data/asset-canonical.ts` (`CANONICAL_ASSETS`), live variant `getCanonicalAssetRollup()` in `impact-fetcher.ts`, drift guard `v2/scripts/check-asset-drift.mjs`:
  - `bedsDeployed: 496` (= `basketBedsDeployed: 363` + `stretchBedsDeployed: 133`)
  - `washersDeployed: 28` (`washersWorking: 14`)
  - **`communitiesServed: 9`** (deployed/active) vs **`distinctCommunities: 10`** (incl. allocated/placeholder). **Public + funder copy uses 9** ("served") — this was just swept site-wide in #54. Do not write "10 communities" in any public/funder string.
  - **`plasticKg: 2660`** = **133 Stretch beds × 20kg, Stretch-only.** Basket Beds are NOT a plastic product. The old "9,920kg"/"10,400kg" figure was a ~3.7× overclaim — never reintroduce it.
- **Product specs** — source of truth: `v2/src/lib/data/products.ts`. Stretch Bed = recycled HDPE legs + galvanised steel poles (26.9mm OD × 2.6mm) + heavy-duty canvas; 26kg, 200kg capacity, 188×92×25cm, 20kg HDPE diverted/bed, 5-yr warranty, 10+ yr life. **Never** describe it as "woven cord" or "hardwood frame".
- **Weave Bed is discontinued** — canonical slug is `stretch-bed` (NOT `weave-bed`); product type `stretch_bed`. Remove `weave_bed`/`weave-bed-*` if found.
- **Only the Stretch Bed is for sale.** Washing machines = register-interest; Basket Bed = open-source download. Don't mark the latter two "for sale".
- **GHL-live rule (team decision):** funding/LOI tooling reads **GHL live**, not `crm_deals`/static. GHL is the pipeline source of truth, but **GHL dollar figures are unreliable — Xero is the $ source of truth.**

---

## 4. Codeable next work (what YOU can pick up now)

Scoped to repo/code tasks. Confirm with the user which to start.

1. **Add a community-count drift guard** *(unblocked, recommended).* Mirror `v2/scripts/check-asset-drift.mjs`: a small script/test that greps `v2/src` for `"10 communities"` / `"10 remote communit"` in public copy and fails, so the 9-vs-10 regression can't return. Storyteller-reach strings ("N storytellers across 6/8 communities") are a different metric — exclude them.
2. **Scaffold the On-Country Production pipeline data layer** *(partially blocked — see §5).* Spec: `wiki/outputs/2026-05-30-buildslice/04-oncountry-production-pipeline-design.md`. You can scaffold now: stage-name constants + a `community-makers` audience segment in `v2/src/lib/ghl/smart-lists.ts`, and a typed pipeline entry alongside the existing ones in `v2/src/lib/data/loi-pipeline.ts` — **leave GHL stage UUIDs as `TODO` placeholders** until the human builds the GHL shell. Do NOT attempt live GHL calls.
3. **Verify the production build path** *(unblocked).* Run `cd v2 && npm run build`; confirm the ONLY failure is the `/admin/production` prerender; if anything else breaks from the recent merges, fix it. Document findings.
4. **(Optional) Commit the build-slice docs.** `wiki/outputs/2026-05-30-buildslice/` (5 markdown files) is untracked. Confirm with the user whether `wiki/outputs/` is meant to be committed before adding them.

**Always:** branch → implement → `npx tsc --noEmit` clean → PR. Import canonical numbers from §3 sources; never hardcode.

---

## 5. OUT OF SCOPE for a code agent (human / MCP-gated — do NOT attempt)

These need integrations you don't have, or human decisions. Surface them to the user; don't try to execute.

- **The 4 open decisions** (founder/board): QBE match cap $200K vs $400K · entity / Indigenous-ownership structure · reconcile the $201,900 phantom (TFN/FRRR/AMP, not in Xero) · PICC $436,700 Goods-vs-ACT attribution.
- **Jay (SIH/QBE) email** — drafted in Gmail; a human deletes the dupe and sends it. (No Gmail access for you.)
- **GHL writes** — building the new pipeline shell, moving misfiled suppliers, stage/value hygiene. GHL has no create-pipeline API tool; a human builds the shell in the UI first, then provides stage UUIDs for task §4.2.
- **`INVESTORS_PASSWORD` Vercel env var** — a human sets it before the `/investors` URL is shared.
- **Two hard 2026-07-01 deadlines:** NEMA Disaster Ready Fund R4 + Supply Nation 51% certification (gated on the entity decision).

---

## 6. Key files & pointers

- **Master context for the just-finished work:** `wiki/outputs/2026-05-30-buildslice/00-MASTER-handoff-and-checklist.md` (+ `01`–`04` siblings: GHL audit, PR merge-readiness, Stage-2 pack/decisions, production-pipeline design).
- **Canonical data:** `v2/src/lib/data/asset-canonical.ts`, `products.ts`, `content.ts`, `grant-content.ts`, `funder-shared-content.ts`, `funder-pages.ts`, `operating-systems.ts`, `impact-model.ts`.
- **GHL/LOI layer:** `v2/src/lib/ghl/` (`index.ts`, `smart-lists.ts`), `v2/src/lib/data/loi-pipeline.ts`.
- **Project rules:** `CLAUDE.md` (root). Drift guard: `v2/scripts/check-asset-drift.mjs`.
- **One GHL audit correction to know:** the legacy GHL "Grants" pipeline (435 opps) is a Grantscope **prospect dump, NOT Goods grants** and is NOT a migration target — real Goods grants live in the "Supporter Journey" pipeline.

---

### Suggested first prompt to give Codex
> Read `thoughts/shared/handoffs/2026-05-30-codex-handover.md` and then `CLAUDE.md`. Confirm the canonical invariants in §3, then start task §4.1 (community-count drift guard) on a new branch. Keep `npx tsc --noEmit` clean and open a PR.
