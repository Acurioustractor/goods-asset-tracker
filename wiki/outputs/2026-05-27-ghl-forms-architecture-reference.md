# Website Forms → GHL: How It All Works (Reference)

> One-page mental model for how every form on every ACT website flows into GoHighLevel.
> Companion to the tag scheme (`2026-05-27-goods-tag-scheme-and-pipelines.md`) and the
> Smart Router pattern (`ghl_smart_router_pattern` memory). Last updated 2026-05-27.

## The one idea

**The website code never sends emails or creates pipeline cards. It just labels people.**
When anyone submits any form, the code creates/updates their contact in GHL and applies
**tags** + a **source** + writes the message. Then **GHL workflows watch for those tags**
and do the work. Code labels; GHL reacts.

## The flow (any form, any site)

```
Someone submits a form
        │
        ▼
[ WEBSITE CODE ]  ── creates the contact + applies labels:
        │            • act-inquiry            ← "this is an inquiry"  (universal trigger)
        │            • project-goods           ← "belongs to Goods"   (which project)
        │            • goods-general-inquiry   ← "which form"          (intent)
        │            • Source: "Website Contact: General Inquiry"
        │            • writes the message to the `message` field + a Note
        │
        ├──────────────────────────────┬──────────────────────────────
        ▼                              ▼
[ UNIVERSAL WORKFLOW ]           [ PROJECT COMMS WORKFLOW ]
 fires on: act-inquiry            fires on: project-goods
 • creates the opportunity        • sends the Goods-branded
   in "Universal Inquiry"           "thanks, we got it" ack
 • emails the team                  to the sender
   (hi@act.place), full details
 → runs for ALL projects          → one of these per project
```

Both workflows fire from the **same submission**, because the code applied both
`act-inquiry` *and* `project-goods`. Different jobs, no conflict.

## The three layers

| Layer | What it is | How many | Triggered by |
|-------|-----------|----------|--------------|
| **1. Websites / forms (code)** | The *labeller*. Identifies the person, tags them, records the message. Sends nothing. | every form | a form submission |
| **2. Universal workflow (GHL)** | The *intake*. Turns every ACT inquiry into a tracked opportunity + pings the central team. Project-agnostic, ACT-branded. | **1, shared** | tag `act-inquiry` |
| **3. Per-project comms (GHL)** | The *branding*. Sends the project-branded reply to the sender. | **1 per project** | tag `project-{slug}` (e.g. `project-goods`) |

## Tag taxonomy (what each label means)

- `act-inquiry` — "this is an inquiry." The single clean marker the Universal Inquiry
  pipeline triggers on. (NOT shared with feedback/imports the way base `goods-inquiry` is.)
- `project-goods` — "belongs to Goods." Routes to the Goods comms workflow; filters the board.
- `goods-{intent}` — which form/subject (`goods-general-inquiry`, `goods-media-request`,
  `goods-feedback`, `goods-washer-interest`, `goods-story-submitter`, …).
- **Source** (contact field) — human-readable origin, shown in the pipeline's Source column.

## To add something new — you almost never touch code

- **New Goods form** (e.g. volunteer): have it apply a new tag like `goods-volunteer` (+ the
  universal `act-inquiry` + `project-goods`). **No workflow changes.** It auto-gets an
  opportunity, a team email, and the Goods ack, and shows its own source + tag in the pipeline.
- **New website / project**: its forms apply `act-inquiry` + `project-{newslug}`. The universal
  workflow already handles the opportunity + team email. **Clone the Goods comms workflow once**
  for branded acks, swap the trigger tag + branding. Done.

So scaling = **add a tag**, not build a workflow.

## In the pipeline, every card shows

`[Goods] Jane Smith` (project + person, via Opportunity Name) · Source
`Website Contact: General Inquiry` (which form) · tags (filter the board to one project or one
form). One pipeline, fully triageable by project and form.

## Important: not every form is an "inquiry"

Only forms that apply `act-inquiry` land in the Universal Inquiry pipeline. Other contact
types have their own handling and their own sources, so you still see where they came from —
they just don't clutter the inquiry pipeline:

| Type | Source | Why separate |
|------|--------|-------------|
| Orders / sponsorships (Stripe) | `Goods Order` / `Goods Sponsorship` | customers — a sales flow |
| Newsletter signups | `Newsletter Signup ({tag})` | subscribers |
| QR bed claims | `QR Code Claim` | recipients |

## Source values by entry point (audit, 2026-05-27)

| Entry point | Source | Pipeline opportunity? |
|-------------|--------|----------------------|
| Contact form — general | `Website Contact: {subject}` | yes |
| Contact form — media pack | `Website Contact: Media Pack Request` | yes (partner path) |
| Partner form (`/partner`) | `Partnership Inquiry` | yes |
| Washer interest | `Washing Machine Interest` | yes |
| Bed story (`/bed/story`) | `Bed Story Submission` * | yes |
| Feedback (`/feedback`) | `Website Feedback` | yes |
| Newsletter | `Newsletter Signup ({tag})` | no (subscriber) |
| Stripe order / sponsorship | `Goods Order` / `Goods Sponsorship` | no (customer) |
| QR claim | `QR Code Claim` | no (recipient) |
| Admin manual order | `Admin Manual Entry` * | yes |

\* Bed-story + admin-order source labels were applied in code but committed separately
(their files carry unrelated in-flight work as of 2026-05-27) — they deploy with that work.

## Email: GHL owns it (not the code)

- Sending domain: dedicated `ghl.act.place`; ACT default header = "A Curious Tractor" /
  `hi@act.place`. Per-workflow From **overrides** that (Goods comms workflow sends as
  "Goods on Country").
- The code path's old Resend `sendEmail()` was removed — `RESEND_API_KEY` was never set in any
  env, so it never sent. **Do not reintroduce a code-side email** for the contact form; it would
  double-send once GHL sending is live.
- Full form contents reach `hi@act.place` because the code writes phone → standard phone,
  organisation → Company, and subject+message → the mergeable `message` field (GHL Notes are
  NOT mergeable, so the email merges those fields instead).

## Key files

- Contact form API: `v2/src/app/api/contact/route.ts`
- GHL client (all contact methods, tags, sources): `v2/src/lib/ghl/index.ts`
- Universal workflow (GHL): "Contact → Universal Inquiry", trigger `act-inquiry`
- Per-project comms (GHL): "Goods Inquiry → Acknowledge" (to build), trigger `project-goods`
