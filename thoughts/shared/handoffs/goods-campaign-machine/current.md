---
date: 2026-09-17T12:25:00+10:00
session_name: goods-campaign-machine
branch: feat/audience-pathways
status: active
---

# Work Stream: goods-campaign-machine

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-17T12:25:00+10:00
**Goal:** Turn Goods into a campaign machine: right message to right person through GHL, with pathways per audience, and a repeatable way to run the newsletter and ongoing comms for every group.
**Branch:** `feat/audience-pathways` in `../goods-campaign-wt`, PR #284 open, CI green.
`fix/stamp-delivery-status` is MERGED (#283, main `c0fefb7`, production deploy succeeded).
**Test:** `cd v2 && npx vitest run && npm run build`

### Now
[->] **The pathways are mapped and typed. Next is the campaign per lane, then the newsletter.**
The eight lanes live in `v2/src/lib/ghl/audience-pathways.ts` with 18 guards and read at
`/admin/campaign`. Build the campaign ON them: each lane's `steps[].advance` is the trigger a
campaign attaches to, and each `gap` is a thing that has to exist before a campaign can fire.

### This Session (pathways block, 17 Sep afternoon)
- [x] **The eight lanes typed**: buyer, procurement, funder, community, recycler, supplier, media,
      supporter. Each carries its doors, its steps, what the person gets at each one, what moves
      them on, and a named owner. PR #284.
- [x] **Ben ruled the owners**: himself on seven lanes, Nic on supply.
- [x] **18 guards** so it cannot drift: every segment and SMS list owned by exactly one lane, every
      door points at a handler that exists on disk, board ids must be real Goods boards, every
      routed subject lands on a lane, tags must be namespaced, no lane may be ownerless, any step
      that is not live must say why. R9 enforced: a community-line lane cannot carry a broadcast
      step or a `comms:` tag, and must owe an answer with a clock.
- [x] **PR #283 MERGED and live** (main `c0fefb7`): the delivery-status stamp, the reply-to fix, and
      the guard that any route calling `sendSubmissionToInbox` also calls `updateContactSubmission`.
- [x] Rebased onto the admin rebuild (#282) mid-flight. Two of its new guards caught the new route:
      `ADMIN_ROUTE_DIRECTORY` and `route-audience.ts`. Both declared.

### This Session (morning)
- [x] **Nine PRs merged and verified live.** #276 admin auth, #272 plan + community inbound task, #273 audiences repointed, #274 three doors on /pitch, #278 six endpoints guarded, #279 board routing, #280 real phone + guard, #281 entry-point gaps. Tests **798 → 914**.
- [x] **The acknowledgement workflow is PUBLISHED** (Ben did it in GHL). One generic reply to everybody, triggered on `project-goods`.
- [x] **Proved the whole chain live**, 7 real submissions through goodsoncountry.com: contact → canonical tags → conversation thread → card on the right board → acknowledgement to the person → notification to `hi@act.place`.
- [x] **GHL Internal Notification step added** by Ben, so the team email now comes from GHL as well as Resend (running both for ~a week on purpose).
- [x] **Test data deleted** with Ben's explicit verb: 7 contacts, 6 cards. GOODS - Buyers back to 19 opps / $181,721.
- [x] Seven branch messages written, each with a real next step: `thoughts/shared/notes/2026-09-17-inquiry-acknowledgements.md`

### Next
- [ ] **Campaign per lane**, built on `audience-pathways.ts`: attach a campaign to each
      `steps[].advance` trigger, starting with the lanes whose leads already exist (funder
      stewardship, buyer re-order).
- [ ] **Newsletter + ongoing comms system** for every group. The 164 `comms:goods-newsletter` consenters are still ON HOLD by Ben's ruling ("wait until there is something worth sending").
- [ ] **`api/claim/[asset_id]` raises no task.** It creates the recipient contact and stops, while
      `api/user/requests` and `api/user/messages` both raise one with a 24 hour clock. Somebody
      scans a bed QR and no human is told. Same three lines, and it is the last community inbound
      that is silent.
- [ ] **The acknowledgement carries an unsubscribe link.** A funder who clicks it stops receiving
      Goods email entirely and nothing records it.
- [ ] Roll out the 7 branches: support + bulk order FIRST, watch a week, then the rest.
- [ ] Publish **New Order Notification** in GHL (built, switched off, a buyer pays and hears nothing).
- [ ] Fix or rename **Goods media form submission** (sends the journalist nothing; triggers on Contact Created so a known journalist never fires it).

### Decisions
- **Owners, Ben 17 September**: Ben on buyer, procurement, funder, community, recycler, media and
  supporter. Nic on supplier.
- **The pathways go in CODE, not a document.** A markdown map of the lanes would have been stale
  within a week; the guards are the point.
- **`/admin/campaign` is the audience lanes. `/admin/pathways` is the per-community ladder.**
  Different objects: one is a lane and its promises, the other is a place and its next phase.
- **Ben signs, replies to `hi@act.place`, two business days, media pack = /press, phone 0422 883 943.**
- **Branch on `interest:` BEFORE `role:`**: support and community-interest BOTH produce `role:community`, so role-first gives a broken bed the same letter as a community putting its hand up.
- **Communities are not a funnel, but they are not silent either.** R9 = "out of the machine, not out of communication". Three classes: answers (owed), service (allowed), broadcast (off by default). Automation points INWARD, nagging Goods not the community.
- **GHL owns every send.** Resend's `pipeline-followup` cron removed. `sms-dispatch` STAYS (already GHL Conversations) and `contact-delivery` STAYS (writes to our own inbox).
- **Pipeline ids hardcoded in `lib/ghl/inquiry-routing.ts`, not env-driven** — three env vars had drifted to the same value for months without anyone noticing.
- **The 164 newsletter consenters WAIT** until there is something worth sending.
- Test data deletion needed Ben's explicit verb and got it.

### Open Questions
- One `contact_submissions` row from 10 September has `ghl_status=failed` and has been retrying the
  GHL write every ten minutes for a week. It does NOT re-email (the retry short-circuits when
  `inbox_status` is delivered), so it is noise rather than the loop Ben was hit by, but nothing
  gives up or tells anybody.
- The pathways record what is true today. Nothing in them has been walked with a real person on any
  lane except buyer and community, so the `advance` triggers are reasoned, not observed.
- UNCONFIRMED: does anything still send through **SendGrid** on act.place? Records exist (`s1/s2._domainkey`, `em4341`, `url6009`, account `54476132`), no live code found in any ACT repo, but `www.act.place` is **Webflow** and Webflow forms commonly use SendGrid. Do NOT delete the DNS until the account is checked: `url6009` is the click-tracking domain and removing it breaks links in already-sent email.
- UNCONFIRMED: whether the two GHL notifications (GHL + Resend) should stay permanently or Resend gets retired after the trial week.
- OPEN: the acknowledgement carries an **unsubscribe link**. If a funder clicks it they stop receiving Goods email entirely.
- OPEN: `api/admin/campaign/send-email` still sends outside GHL and bypasses suppression.

### Workflow State
pattern: sequential
phase: 4
total_phases: 6
retries: 0
max_retries: 3

#### Resolved
- goal: "campaign machine: pathways per audience, campaign per pathway, newsletter + ongoing comms for all groups"
- resource_allocation: aggressive

#### Unknowns
- sendgrid_still_in_use: UNKNOWN
- resend_retire_date: UNKNOWN

#### Last Failure
(none)

---

## Context

### Where the day started
Ben's read was that GHL was "fragmented across code, Notion and Supabase". It was not fragmented. **It was switched off.** Every Goods workflow was a draft, no Goods email had ever been sent, and all thirteen audience definitions in `smart-lists.ts` resolved to 0-9 contacts because the code segmented on flat `goods-*` tags while the account had moved to the namespaced contract.

### The live account
`agzsSZWgovjwgpcoASWG` ("A Curious Tractor"), shared with Harvest, JusticeHub, CONTAINED.
3,715 contacts, 580 `project:act-gd`. Boards: **GOODS - Buyers** `FjMyJM3YzWQFmKqR9fur` (19 opps, $181,721), **GOODS - Funding** `JvBFYpVpyKsw899lkFgj` (68, $3,659,247), **GOODS - Demand** `UQsrmuqzxMSdCTklxEcG` (75), **GOODS - Community** `0m9teeEQFiq6I7GB5xiP` (15).

### Door → board routing (live, `lib/ghl/inquiry-routing.ts`)
| Door | Board | Stage |
|---|---|---|
| Order beds | GOODS - Buyers | Outreach Queued `e5220eb2-…` |
| Fund a facility | GOODS - Funding | Identified `cf8d31d2-…` |
| Bring this to my community | GOODS - Community | Invitation `8ac0d9af-…` |
| Partnership | GOODS - Community | Invitation |

### Verified tags per door (read back from the API, not assumed)
- Bulk order → `role:buyer`, `interest:bulk-order`, `act-inquiry`, `project-goods`, `project:act-gd`, `source:website`
- Support → `role:community`, `interest:support`, **`lane:community`**, `act-inquiry`, `project-goods`

### Email, the part that cost the most time
- GHL sends via **`ghl.act.place`** (dedicated domain, SPF + DKIM `krs._domainkey` + Mailgun MX, all correct and long-standing).
- The Gmail "someone might be impersonating your account" banner is a **Workspace self-send heuristic**, NOT an auth failure. `mailed-by: ghl.act.place` proves SPF is checked against the subdomain, which always passed. **No external recipient can see that banner.**
- Ben added `include:spf.leadconnectorhq.com include:mailgun.org` to act.place's root SPF. Harmless and mildly useful; it was never the cause.
- `goodsoncountry.com` is deliberately locked with `v=spf1 -all` and `p=reject`. It **cannot** send. Do not try.
- Resend still sends the team notification from `goods@empathyledger.com` (properly authenticated, no banner).

### Repo gotchas
- `npm run build` runs `wiki:sync`, which deletes `v2/.wiki-content/governance/community-members.md` every time. Restore before committing.
- `tools/check-ai-tells.mjs` lives ONLY in `../goods-finance-wt` (unmerged branch). Run it from there.
- `dig +short` gave false-empty answers twice today. **Cross-check with `@1.1.1.1` before asserting a DNS record is absent.**
- Squash merges auto-close stacked PRs and GitHub will not reopen them once the base branch is deleted. Rebase with `--onto` and open a replacement.

### Guards added this session (they fail loudly, trust them)
- `npm run audit:audiences` — every audience's live count, exits 1 if a `live` one is empty
- `src/lib/ghl/entry-points.test.ts` — per route: acknowledgement tags, inbox delivery, durable receipt, **and that anything calling `sendSubmissionToInbox` also calls `updateContactSubmission`**
- `src/lib/ghl/inquiry-routing.test.ts` — doors cannot collapse onto one board
- `src/lib/auth/admin-routes.test.ts` — one `requireAdmin` per handler
- `src/lib/forms/honeypot.test.ts` — every form renders AND sends the honeypot
- `src/lib/forms/phone-links.test.ts` — no placeholder phone numbers

### Key documents
- `thoughts/shared/plans/2026-09-17-goods-campaign-machine.md` — the plan, six doors, who owns what, GHL feature map
- `thoughts/shared/reviews/2026-09-17-ghl-end-to-end-audit.md` — all eight entry points traced, tag hygiene (712 tags, 8 malformed, 33 shadows)
- `thoughts/shared/notes/2026-09-17-inquiry-acknowledgements.md` — the seven branch messages
- `thoughts/shared/notes/2026-09-17-custom-objects-request.md` — draft note to the other ACT projects, NOT sent
