---
date: 2026-07-14T18:40:00+10:00
session_name: pitch-room
branch: docs/snow-onepager-assets (not mine; work lives in artifacts + this folder; no commits made)
status: active
from: Goods Asset Register Claude session, 2026-07-14 (picked up from empathy-ledger-v2 handoff)
---

# Goods pitch room + deck builder handoff

**Goal:** Ben assembles the QBE Stage 2 deck (and its 8 sibling artifacts) from a verified, consent-clean content base. The two artifact pages are the working surfaces; this repo is the production home.

## The two live artifacts (Ben's, private)

| Artifact | URL | What it is |
|---|---|---|
| Alignment room | https://claude.ai/code/artifact/38e008ae-6ba0-473b-b643-632dd17eb1ec | Read-only situation map: QBE alignment matrix, narrative spine, people (consent tiers), timeline, gaps |
| Deck builder | https://claude.ai/code/artifact/41debd41-50de-47b8-8a9b-a272d3b61bef | Interactive: 14 slides with selectable headline/evidence/voice options (localStorage), "Copy deck brief" exports markdown, content bank, 9 output variants, gallery: 543 images + 24 playable videos |

**To update either artifact from THIS instance:** edit the matching HTML file in this folder, then call the Artifact tool with `url: <the URL above>` and the edited file path. Without `url` you mint a new link and Ben loses his bookmark. The HTML is self-contained (all media base64-embedded); the `/* injected */` data blocks are `const CANON/ELIMG/AV/VIDS/WEB` near the top of the script.

## State of the raise (all verified 2026-07-14, sources in the artifacts)

- Live campaign: AU$400K signed match-eligible capital by **31 Aug 2026** (SEFA $300K + Snow $100K + Centrecorp $75K paper stack, **$0 signed, no LOI tracker exists**; "3+ LOIs" is our own internal target, not an SIH requirement). Stage 2 application late Sept (form + pitch + interview), outcome Nov.
- April's "QBE pre-committed $400K" is wrong: competitive pool, band $150K-$400K, 2025 actuals $50K-$350K. Plan $150K-$250K central. State external leverage as 2.7x (3.7x is stack-over-grants).
- **Match rule, confirmed 14 Jul from primary sources (was UNCONFIRMED before this session) — two different bars, don't conflate them:** the SIH "letter to funders" says EOI/LOI/Term Sheet/Funding Agreement all count as evidence toward the competitive *selection* score, no fixed ratio. The signed Enterprise Agreement cl 6.9(a) is the real gate: matched funding must be SECURED and documented before QBE actually disburses. Soft engagement helps you look competitive; only secured funds get you paid.
- **Entity mismatch, confirmed 14 Jul:** the signed Enterprise Agreement (executed 17 Mar 2026) lists counterparty "A Curious Tractor" with its "ACN" field holding Nic's sole-trader ABN (21591780066), not the Pty Ltd ACN (697347676). Signed pre-incorporation, field mislabelled. **Needs a fix with SIH (Jay Boolkin) before Stage 2 governance docs go in (late Sept)** — nobody has raised it with SIH yet, this session only confirmed and documented it.
- Minderoo PAUSED by Lucy Stronach 14 May. Do not contact; do not count toward 31 Aug.
- Owed to SIH since 13 Jul: hackathon challenge confirmation ("How might we get Stretch Beds to as many people as possible?"), 15-30s promo video, Matt Allen's model answers (promised 7 Jul). Nic is confirmed lead; Ben on road to ~7 Aug; hackathon 11 Aug; Stage 1 deliverables 15 Aug.
- Blocked evidence: last-50-beds delivered-cost extract (~$155K Xero mis-tags, unmoved since 10 Jun). Revenue figure LOCKED (four cuts, accountant must sign one; the claims ledger in this repo enforces it).
- Name traps: Ampilatwatja Elders conflict (Frankie Holmes OAM + Donald Thompson OAM vs "Frank and Casey Holmes"); Linda Turner must be disambiguated from the excluded fabricated "Linda Turner Maningrida" story; Walter (Kalgoorlie) NOT cleared. Dianne Stokes is the strongest E-tier thread.

### Now
Both artifacts were republished 2026-07-14 (same URLs, localStorage-safe — no `id`s changed) with the match-rule and entity-mismatch corrections baked in, including the deck builder's "Standing rules" block that gets copied into every exported brief. Ben works the deck builder (slide 6 voice call, slide 2 ask sizing), then exports the brief ("Copy deck brief") and hands it to a Claude instance to draft actual slides into the .pen deck.

### Next
1. **Raise the entity mismatch with Jay Boolkin/SIH** — nobody has done this yet; it's a five-minute fix now vs a scramble at governance-doc submission in Sept.
2. Build the deck from Ben's exported brief: this repo's `design/goods-theory-of-change*.pen` + `design/deck-photos/` slots (synced via `sync-pencil-photos.mjs` from `design/canon-resolved.json`); image picks in the brief name canon subjects and slot paths.
3. Record/ship the three SIH deliverables (promo video brief PDF is on Jay Boolkin's 13 Jul email).
4. LOI tracker + first signature chase (SEFA / Snow / Centrecorp) — remember EOI-level engagement already helps the application score, so don't wait for fully-signed LOIs before talking to SIH about progress.
5. Image ingestion when Ben supplies more: Lightroom/Canon full shoots (ledger holds export subsets only), 342 placeholder-story photos to promote into EL media_assets, 349 archived photo-wrapper stories. EL totals: 4,801 images (Goods project links 320; 1,129 unlinked, 198 Palm Island = other-community, default-deny).

### Decisions
- Gallery organised around `design/image-canon.json` (Ben-owned, green/red consent classes) — never ad-hoc curation.
- Public visibility in EL ≠ consent; every identifiable person needs the human pass before external use.
- generated-images/* = AI scratch, never canonical (canon policy).
- Videos embedded as 300px compressed previews (originals 1.7GB in EL + v2/public/video); clips >45s trimmed and badged.

### Open questions
- UNCONFIRMED: whether the v6 cost-model package (2026-06-10) was ever sent to Matt Allen.
- **OPEN ACTION (not just a question) — entity mismatch not yet raised with SIH.** See "Next" above. Full detail: memory `qbe-stage2-program-terms.md`.
- CLOSED 2026-07-14: SIH "letter to funders" and signed Enterprise Agreement both read; content folded into "State of the raise" above and pushed into both live artifacts. Source PDFs: `~/Downloads/Recents/Catalysing Impact - Letter to Funders - A Curious Tractor.pdf` and `~/Downloads/AI Library/Documents/Catalysing Impact - Enterprise Agreement - A Curious Tractor - Signed-1.pdf`. Don't re-read these or retry the Zoho WorkDrive link (its embedded viewer iframe carries an auth token; browser-automation privacy guards correctly block reading it — go straight to `~/Downloads` if this ever needs re-verifying).
