# GHL setup: ACT Inquiries pipeline + form notifications (click-by-click)

> **Goal:** every ACT contact form lands in one **Inquiries** pipeline, tagged by project, with the message readable, the team notified, and a clear triage flow. Built for Goods first; the same pipeline serves all ACT projects.
> **Code side (done, pending deploy):** the Goods contact form now tags `act-inquiry` + `project-goods` and writes the message as a contact **Note**. Other ACT projects' forms should apply the same `act-inquiry` + `project-<name>` convention.

## The design in one line
Form submit → GHL contact tagged `act-inquiry` + `project-goods` + message saved as a Note → a workflow creates an Opportunity in "ACT Inquiries", emails hi@act.place, and acknowledges the sender → you triage the board, filtered by project.

---

## Part 1 — Use the existing "Universal Inquiry" pipeline

ACT already has the right board: **Opportunities → Universal Inquiry** (stages: **New Inquiry → Needs Assessment → Routed to Project → Out of Scope**). Harvest, Shop and website contact forms already flow in. **Do not build a new pipeline** — route Goods contact forms into this one. The `project-goods` tag (below) is what feeds the "Routed to Project" decision.

## Part 2 — The inquiry workflow (notify + route)

1. Left nav → **Automation** → **Workflows** → **+ Create Workflow** → **Start from Scratch**.
2. Name it **ACT Inquiry · notify + route**.
3. **Add Trigger** → **Contact Tag** (a.k.a. "Tag Added"):
   - Tag **is** `act-inquiry`.
   - (Optional, to catch every form: click **+ Add filters / Add another trigger** for `goods-washer-interest`, `goods-feedback`, partnership tags. Multiple triggers are ORed.)
4. **+ Add Action** → **Create / Update Opportunity**:
   - Pipeline: **Universal Inquiry**, Stage: **New Inquiry**.
   - Opportunity name: e.g. `{{contact.first_name}} — Inquiry`.
   - Source: `Goods Website Contact Form` (reads like the existing cards).
   - Assign owner if you want a default triager.
   - *If a workflow already creates the "Website Contact Form" opportunities, just add `act-inquiry` to that workflow's trigger instead of making a new one.*
5. **+ Add Action** → **Internal Notification** → **Email**:
   - To: **hi@act.place** (add more recipients if needed).
   - Subject: `New ACT inquiry — {{contact.first_name}} ({{contact.tags}})`.
   - Body: include `{{contact.name}}`, `{{contact.email}}`, `{{contact.phone}}`, and a line pointing to the contact's Notes for the full message.
6. *(Optional)* **+ Add Action** → **Send Email** (to the contact) → a short acknowledgement: "Thanks, we've got your message and will be in touch."
7. Top right → **Save**, then toggle **Publish** on.

That's the whole loop: you get pinged at hi@act.place, the lead is on the board, and the sender gets a courteous reply.

## Part 3 — Triage by project

- Open **Opportunities → Universal Inquiry**. You see every inquiry as a card moving through the stages.
- **Filter by project:** use **Advanced Filters** → Contact Tag = `project-goods` to see only Goods (add `project-<x>` as other ACT projects come online).
- **Read the message:** click a card → open the linked **Contact** → **Notes** tab → the full submission is there (subject, org, phone, message, timestamp).
- Work each card New → Triaging → Assigned → Awaiting reply → Closed. Nothing slips.

## Part 4 — Make it ACT-wide
For every other ACT project's contact form, apply the same two tags on submit: **`act-inquiry`** (universal) + **`project-<name>`** (e.g. `project-justicehub`). They then flow into this same pipeline automatically, filterable by project. No new workflow per project.

## Notes
- Workflow triggers on a **tag**, which is reliable and immediate (the code's `fireSmartRouter` is dormant, so don't depend on it).
- If you want the email to *also* come from the app (independent of GHL), set `RESEND_API_KEY` and the `/api/contact` route already emails hi@act.place. The GHL internal notification above needs no key.
- Menu labels can vary slightly by GHL plan/version, but the flow (Pipelines, Automation → Workflows, Trigger = Tag, Actions = Create Opportunity + Internal Notification) is standard.
