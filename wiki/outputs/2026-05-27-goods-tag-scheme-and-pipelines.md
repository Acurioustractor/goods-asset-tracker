# Clean tag scheme + pipeline design (Goods / ACT)

> **Date:** 2026-05-27. The forward-looking convention so tags map cleanly to website actions and pipelines route correctly. Companion to the audit: `2026-05-27-goods-ghl-tag-audit.md`.

## The one principle
**Pipelines trigger on ACTION tags only.** Everything else (lifecycle, segment, scoring, import) is for *filtering and downstream logic*, never for pipeline entry. Mixing them is what caused the `goods-inquiry` mess.

## The tag families (clean scheme)

| Family | Purpose | Examples | Use for |
|---|---|---|---|
| **Action / source** | What the person *did* on the site | `act-inquiry` (+ `project-goods`), `goods-washer-interest`, `goods-feedback`, `goods-support-request`, `goods-src-{source}`, `goods-partner-lead` | **Pipeline triggers** |
| **Lifecycle** | What they *became* | `goods-customer`, `goods-sponsor`, `goods-recipient`, `goods-bed-owner`, `goods-washer-owner`, `goods-asset-{id}` | Stage automation, suppression |
| **Segment** | Who they *are* (manual/CRM) | `goods-funder`, `goods-partner`, `goods-community`, `goods-supporter`, `goods-state-nt`, `goods-segment-foundation` | Filters, list-building |
| **Scoring** | Engagement (set by crons) | `goods-tier-{aware\|engaged\|active\|champion}`, `goods-hot`, `goods-warm`, `goods-key-partner` | Prioritisation, not entry |
| **Import / provenance** | Where they came from | `goods-gmail-*`, `goods-linkedin-*`, `goods-parliament-house-*` | Provenance only |
| **Broad / legacy** | Too generic to act on | `goods-inquiry`, `goods-newsletter`, `goods` | **Never trigger on these** |

### Naming convention going forward
`{namespace}-{type}-{detail}`, lowercase, hyphenated.
- `act-*` = cross-ACT universal (e.g. `act-inquiry`)
- `project-{name}` = which project (`project-goods`, `project-harvest`)
- `goods-*` = Goods-specific
- One **clean action tag per website function**; never reuse a broad base tag for routing.

### What each website form applies (canonical)
- Contact form → `act-inquiry` + `project-goods` + `goods-{subject}-inquiry` (+ broad `goods-inquiry`). **Route on `act-inquiry`.** ✅ live
- Washer interest → `goods-washer-interest`
- Feedback → `goods-feedback`
- Support → `goods-support-request`
- Newsletter/capture → `goods-src-{source}` (+ catch-all `goods-newsletter`)
- Partnership → `goods-partner-lead` + `goods-segment-*` + `goods-tier-*` + `goods-timeline-*`

## Universal Inquiry pipeline — set up right

Your stages (New Inquiry → Needs Assessment → Routed to Project → Out of Scope) are a good **triage front door**. Make it functional:

1. **Entry workflow:** trigger on `act-inquiry` → Create Opportunity in **New Inquiry**. (Every ACT project's contact form applies `act-inquiry`, so this one pipeline is the shared front door.)
2. **Stage definitions** (write them on the stages so the team is consistent):
   - **New Inquiry** — just arrived, untouched. SLA: triage within 1 business day.
   - **Needs Assessment** — being read/clarified, deciding where it goes.
   - **Routed to Project** — handed to the owning project. *This is where `project-goods` / `project-{x}` matters: filter here to route.*
   - **Out of Scope** — no action / closed (use a lost reason).
3. **Automations on the pipeline:**
   - On entry → Internal Notification email to **hi@act.place** + auto-acknowledge the sender.
   - SLA reminder if a card sits in New Inquiry > 1 day.
   - On move to Routed to Project → notify that project's owner.
4. **Filter by project:** Advanced Filters → Contact Tag = `project-goods` for the Goods view.

## Making the pipelines more functional (the bigger picture)

- **Universal Inquiry = front door only.** It triages and *routes out* to each project's own downstream pipeline. Don't try to run delivery/sales inside it.
- **Separate pipelines by purpose:**
  - **Universal Inquiry** — all inbound contact-form inquiries (ACT-wide), triaged + routed.
  - **Goods Sales / Sponsor** — orders + sponsorships (`goods-customer`, `goods-sponsor`).
  - **Goods Partnership / Funder** — partnership + funder leads (`goods-partner-lead`, segment/tier).
  - Washer interest can be a stage or a small pipeline.
- **Member signups don't belong in Universal Inquiry.** Right now Harvest "Member Signup" cards sit in Needs Assessment (11 of them). Membership is a different flow from an inquiry: split it into a Harvest membership pipeline/list so Universal Inquiry stays a true inquiry triage.
- **Tag hygiene:** trigger on action tags; filter on segment/lifecycle; retire dead tags (`goods-src-*-smoke`, `goods-src-sweep-test`, anything unused). Keep `goods-inquiry`/`goods-newsletter` as broad labels but never as triggers.
- **One convention, all projects:** every ACT project's forms apply `act-inquiry` + `project-{name}`. Universal Inquiry becomes the single, reliable ACT front door, and each project owns its downstream pipeline.

## Immediate next steps
1. Point the Universal Inquiry entry workflow at **`act-inquiry`** (live now on every contact submission).
2. Write the four stage definitions + add the entry/SLA/route automations.
3. Split Harvest member signups out of Universal Inquiry.
4. (Optional) retire the smoke/test tags.
