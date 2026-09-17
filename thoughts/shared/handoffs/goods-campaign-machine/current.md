---
date: 2026-09-17T18:05:00+10:00
session_name: goods-campaign-machine
branch: main
status: active
---

# Work Stream: goods-campaign-machine

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-17T18:05:00+10:00
**Goal:** Turn Goods into a campaign machine: right message to right person through GHL, with
pathways per audience, and a repeatable way to run the newsletter and ongoing comms for every group.
**Branch:** none. Everything below is merged to `main` and live on goodsoncountry.com.
Working tree for this stream is `../goods-campaign-wt`.
**Test:** `cd v2 && npx vitest run && npm run build && npm run check:drift:ci`

### Now
[->] **ONE job left and it is Ben's, in GHL, not in code: publish the newsletter welcome.**
Automation → Workflows. Two drafts, `Newsletter Signup` and `ACT Core — Newsletter Signup`.
Publish ONE, trigger it on **`comms:goods-newsletter`** (164 contacts; the flat `goods-newsletter`
has only 8). Copy is rendered at `/admin/campaign` under "Somebody just subscribed". A tag-added
trigger fires on the event, so the existing 164 do NOT receive it, which matches Ben's hold.
Optional second job: the funder opt-out alarm (trigger on DND or unsubscribe, filter `role:funder`,
action a task on Ben, no email).

### This Session (17 September, the whole day)
- [x] **Nine PRs merged and verified live.** #283 delivery stamp · #284 the eight lanes and the
      messages · #289 duplicate contact · #290 the dead order workflow call · #291 the watch list ·
      #292 ledger · #293 the three open ends · #295 door tags · #296 receipts. Tests **914 → 1246**.
- [x] **Eight audience pathways typed** in `lib/ghl/audience-pathways.ts` with 18 guards: buyer,
      procurement, funder, community, recycler, supplier, media, supporter. Owners ruled by Ben.
- [x] **Seventeen campaigns** in `lib/ghl/campaigns.ts`, and **thirteen messages** in `lib/comms/`,
      all sent from code through GHL Conversations. Every CTA now gets its own written reply except
      LGANT, which keeps the generic letter on purpose.
- [x] **The alignment layer.** One `facts.ts`, one catalogue, one guard that reads all thirteen
      together: same sign off, one phone number, one response window, no unknown entity, no
      unsubscribe on anything transactional.
- [x] **Every public form swept.** 42 files, 15 public. Two wrote into silence: `/community/ideas`
      and the bed QR claim. Both raise a task now. A derived guard walks the filesystem, so a new
      form that answers nobody cannot ship.
- [x] **Proved live once, end to end**, and that test found a production defect on its first
      attempt: a duplicate phone made GHL refuse the create and the whole CRM side failed silently.
- [x] **Every door leaves a durable receipt.** Newsletter and feedback wrote nothing that survives
      an outage; feedback answered 500 and lost the message when GitHub was unreachable.
- [x] **GHL cleanup with Ben:** New Order Notification and Goods media form submission deleted, the
      dead call and its two second wait removed, the test data cleared, the Wash Test row from
      1 June removed. GOODS - Buyers back to 18 opportunities, $181,721.

### Next
- [ ] **The campaign per lane.** Blocked on a consent decision, not on code. See Open Questions.
- [ ] **The newsletter and ongoing comms system** for every group, after the welcome is published.
- [ ] Walk one community through the QR claim on a bed they already have, and watch where it breaks.
- [ ] The funder stewardship cadence: 99 funders, no list, nothing between Committed and the next ask.

### Decisions
- **Transactional replies are sent from code; campaigns go through a GHL workflow.** The GHL API
  can read workflows and nothing else: no create, no update, no publish. Anything sent by workflow
  waits on one person clicking, which is why four sat as drafts for months. A campaign still needs
  the unsubscribe handling only GHL has.
- **A route may stamp the acknowledgement tag OR send its own reply, never both**, and the choice
  is made inside `acknowledgeOrReply` so it cannot happen to one person twice.
- **The support route no longer stamps `project-goods`**, and nor do the other branched subjects.
  `project:act-gd` is what the audiences resolve on, so segmentation is unaffected.
- **Owners, Ben 17 September:** Ben on seven lanes, Nic on supplier.
- **`/admin/campaign` is the audience lanes. `/admin/pathways` is the per-community ladder.**

### Open Questions
- **THE CAMPAIGN BLOCK IS BLOCKED ON A CONSENT DECISION.** `comms:goods-newsletter` is the only
  send-trigger tag this codebase mints. 99 funders, 84 buyers and 36 suppliers carry role tags that
  can never trigger a send. Either they opt in through a path that mints a new `comms:` tag, or a
  person writes to them one at a time. For four real buyers and 36 suppliers, by hand is the right
  answer. For 99 funders a quarterly note probably earns an enrolment. Ben's call.
- UNCONFIRMED: **the Goods From name on a real send.** Replies now set
  `emailFrom: 'Goods on Country <hi@act.place>'` per message, because the sub-account is shared
  with Harvest, JusticeHub and CONTAINED and its location name must stay "A Curious Tractor". If
  GHL refuses the display name the send retries without it, so the worst case is the old behaviour.
  The next real enquiry settles it.
- UNCONFIRMED: **the order promise task**, which raises "send tracking when it ships" on every paid
  order. Nobody has bought a bed since it deployed.
- OPEN: **tracking and the sponsor QR link are promises a person keeps.** Nothing sends either, the
  checkout page has promised both since February, and the task is what makes them keepable.
- Feedback's primary destination is a **GitHub issue**, not GHL. Worth knowing before reading that
  route.

### Workflow State
pattern: sequential
phase: 6
total_phases: 6
retries: 0
max_retries: 3

#### Resolved
- goal: "campaign machine: pathways per audience, campaign per pathway, newsletter + ongoing comms"
- resource_allocation: aggressive

#### Unknowns
- per_lane_comms_enrolment: UNKNOWN, Ben's decision
- goods_from_name_accepted: UNKNOWN until the next real send
- order_promise_task_fires: UNKNOWN until the next bed sale

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
