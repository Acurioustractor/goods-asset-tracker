# GHL Smart Router Walkthrough — Resume Entry (paused 2026-05-23)

Picks up the interactive walkthrough started in the 2026-05-22 session. Ben asked me to walk him through Phase A step-by-step, paused at A1.

---

## Current state

**Code:** Option B refactor committed locally on `main` as `e0b5065`. **Not pushed. Not deployed.** Working tree has many other unrelated changes (centrecorp pages, admin, etc.) — leave those for separate commits.

**Files in the e0b5065 commit:**
- `v2/src/lib/ghl/index.ts` — WORKFLOWS 11 slots → 2; `fireSmartRouter()` helper; all event-specific logic stripped from public methods
- `v2/src/app/api/newsletter/route.ts` — accepts email OR phone
- `v2/src/app/canberra/follow-form.tsx` — single POST, no synthetic email
- `v2/src/app/canberra/page.tsx` — full rewrite for cold QR-code audience (health-first sequencing)
- `wiki/outputs/2026-05-18-ghl-workflow-alignment.md` — Option B banner + Branch 7 + simplified env-var setup

**Vercel (unchanged this session):** only `GHL_WORKFLOW_NEW_ORDER` (all envs) and `GHL_WORKFLOW_PARLIAMENT_HOUSE` (production only) are wired. No `GHL_WORKFLOW_SMART_ROUTER` yet.

**GHL location:** 22 workflows exist, none of them is a Smart Router. 4 of them are leftover drafts from the playbook's "delete me" list, still there.

---

## The walkthrough plan

Three phases. Pace: interactive — Ben says "next" between steps in Phase A.

### Phase A — Ben builds minimum-viable Smart Router in GHL dashboard (~10 min)

Goal: one branch only (Canberra Airport) so Reconciliation Week 2026 signups get an automated acknowledgement. Backfill Branches 1-6 later in Phase C, no rush.

- **A1.** Open GHL → Automation → Workflows → + Create Workflow → Start from scratch. **← paused here**
- **A2.** Name `Goods - Smart Router`. Trigger = **Inbound Webhook** (no filters). First action = **Wait 30 seconds**.
- **A3.** Add If/Else action: condition `Contact > Tag > contains > goods-src-canberra-airport-2026`. Inside "If yes":
  - Send Email: subject `Thanks for scanning at Canberra Airport`, body from playbook Branch 7
  - Send SMS: body `Thanks for scanning at Canberra Airport. We will share updates a few times a year. Reply STOP to opt out. - Goods on Country`
  - Add Note: `Canberra Airport scan, Reconciliation Week 2026. Auto-ack sent via Smart Router.`
- **A4.** **Publish** (must be Published, not Draft).
- **A5.** Copy the workflow ID from the URL (`/workflows/builder/<UUID>`), paste it back in chat.

Full copy is in `wiki/outputs/2026-05-18-ghl-workflow-alignment.md` Branch 7.

### Phase B — Claude wires + ships (~5 min, on Ben's say-so)

When Ben pastes the workflow ID:

```bash
WF_ID="<paste>"
for env in production preview development; do
  echo "$WF_ID" | vercel env add GHL_WORKFLOW_SMART_ROUTER $env
done
git push origin main
vercel --prod
```

Each step requires Ben's OK first (Tier 2 push, Tier 3 deploy). Then end-to-end test: submit `/canberra` form with a test email, verify contact tagged correctly + workflow triggered + email received.

### Phase C — Ben backfills Branches 1-6 in GHL dashboard (days/weeks, no rush)

Once Phase B is live, Smart Router is single source of truth. Add more If/Else branches following the same pattern:
1. `goods-sponsor` — sponsor thank-you (highest dollar value, do next)
2. `goods-recipient` — recipient claim SMS
3. `goods-support-request` — support ack (+ nested `goods-urgent` branch for on-call SMS)
4. `goods-partner-lead` OR `goods-media` — partnership/media ack
5. `goods-user-message` — internal notification only
6. `goods-user-request` — internal notification + recipient SMS

Each branch lights up immediately when published. No code, no deploy, no env-var change.

---

## After Phase B is live, optional cleanup

These Vercel env vars are now no-ops in code (the new commit doesn't read them):
- `GHL_WORKFLOW_NEW_SPONSOR`, `_NEW_PARTNERSHIP`, `_SUPPORT_TICKET`, `_HIGH_PRIORITY`, `_NEW_CLAIM`, `_USER_MESSAGE`, `_USER_REQUEST`, `_PARLIAMENT_HOUSE`, `_CANBERRA_AIRPORT`

Only `GHL_WORKFLOW_PARLIAMENT_HOUSE` is actually set in production. Once Smart Router is live + Branch 1-6 backfill is far enough along, delete all 9. The Parliament House workflow itself can stay in GHL or be deleted — code no longer references it.

---

## Restart prompt for next session

"Pick up the GHL Smart Router walkthrough — read `wiki/outputs/2026-05-23-ghl-smart-router-walkthrough-resume.md`. I'm ready for Phase A1. Walk me through it step by step."
