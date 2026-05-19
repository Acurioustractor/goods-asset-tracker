# GHL Workflow Alignment Playbook — May 2026

**Goal.** Build ONE Smart Router workflow that handles every Goods event (sponsor thank-you, claim SMS, support ack, partnership reply, etc.) with internal branching, instead of maintaining 8 separate workflows.

**Why Smart Router.** Fewer moving parts. One trigger config, one place to edit copy, one workflow ID to wire in Vercel. The router branches internally by tag.

**Status when this doc was written.**
- 7 GHL custom fields live (4 pre-existing + 3 new: Asset ID, Sponsor Dedication, Project Designation = "Goods")
- 7 Vercel env vars set (all GHL_FIELD_* across all 3 scopes)
- Every Goods contact-creation path stamps `Project Designation = "Goods"`
- 2 workflows wired and live: `newOrder` (retail orders) + `parliamentHouse` (newsletter event)
- 1 workflow ambiguous: `newPartnership` — **resolved below** by folding into the Smart Router
- 6 workflows missing — **all handled by the Smart Router**

---

## Architecture decision

The code triggers workflows via `triggerWorkflow(workflowId, contactId)` where each `workflowId` comes from a different env var (`GHL_WORKFLOW_NEW_SPONSOR`, `GHL_WORKFLOW_SUPPORT_TICKET`, etc.). For the Smart Router pattern:

- **Keep** the existing `GHL_WORKFLOW_NEW_ORDER` pointing at "New Order Notification" — retail orders already work
- **Point every other env var at the same Smart Router ID** — sponsor, support, claim, message, request, partnership all hit the same workflow
- **The Smart Router branches internally** based on the contact's most-recently-added `goods-*` tag

This means **6 env vars share one workflow ID** rather than 6 different IDs. Less to maintain, easier to reason about.

---

## Field merge tags you'll use

| Field | Merge tag |
|---|---|
| Order number | `{{contact.order_number}}` |
| Order total | `{{contact.order_total}}` |
| Product type | `{{contact.product_type}}` |
| Community | `{{contact.community}}` |
| Goods · Asset ID | `{{contact.goods__asset_id}}` |
| Goods · Sponsor Dedication | `{{contact.goods__sponsor_dedication}}` |
| Project Designation | `{{contact.project_designation}}` |
| First name | `{{contact.first_name}}` |
| Email | `{{contact.email}}` |
| Phone | `{{contact.phone}}` |

---

## Step 1. Build the Smart Router (one workflow, ~25 minutes)

**In the GHL dashboard:**

- [ ] Workflows → New Workflow → Start from scratch
- [ ] Name: `Goods - Smart Router`
- [ ] Trigger: **Inbound Webhook** (the code's `triggerWorkflow` call hits this)
- [ ] Action 1: **Wait 30 seconds** (lets custom fields propagate after the contact create/update)
- [ ] Add the 6 branches below in order — each is "If/Else if" matching a specific tag

The branching logic uses GHL's "If/Else" workflow action. For each branch, condition is **"Contact has tag = `goods-<tag>`"**. First match wins — order matters.

### Branch 1 — Sponsor thank-you (tag: `goods-sponsor`)

- [ ] **Send Email**
  - **Subject:** `Thank you for sponsoring a bed for {{contact.community}}`
  - **Body:**
    ```
    Hi {{contact.first_name}},

    Thank you for sponsoring a Stretch Bed for {{contact.community}}.

    Here's what happens next:

    1. Your order ({{contact.order_number}}) is logged. Total: ${{contact.order_total}}.
    2. We allocate one Stretch Bed from the next production run, tag it under your
       name, and prepare it for delivery to {{contact.community}}.
    3. Once the bed reaches its home, we email you the QR-code link so you can see
       exactly where it landed.

    {{#if contact.goods__sponsor_dedication}}
    Your message will travel with the bed:

    "{{contact.goods__sponsor_dedication}}"
    {{/if}}

    A bed is more than furniture. In remote Country, clean bedding is part of the
    chain that prevents Rheumatic Heart Disease — a condition that kills children
    but is entirely preventable with the basics in place. You're part of getting
    those basics to where they need to be.

    Yapa nyaa,
    Ben & Nic
    Goods on Country
    goodsoncountry.com
    ```
- [ ] (Optional) **Internal SMS** to Ben + Nic: `New sponsorship ${{contact.order_total}} → {{contact.community}} from {{contact.first_name}}`

### Branch 2 — Recipient claim (tag: `goods-recipient`)

- [ ] **Send SMS** (recipients are usually phone-only)
  - **Body:** `Yapa nyaa {{contact.first_name}} — your Goods bed ({{contact.goods__asset_id}}) is now linked to you. Need anything? Reply to this number. — Goods on Country`
- [ ] **Add internal note** to the contact timeline (workflow action "Add Note"): `Recipient claimed {{contact.goods__asset_id}} ({{contact.product_type}}) in {{contact.community}}`

### Branch 3 — Support request (tag: `goods-support-request`)

- [ ] **Send acknowledgement email** to the reporter
  - **Subject:** `We got your message about {{contact.goods__asset_id}}`
  - **Body:**
    ```
    Hi {{contact.first_name}},

    We got your message about {{contact.goods__asset_id}} ({{contact.product_type}})
    in {{contact.community}}.

    What you told us:
    "{{contact.message}}"

    Someone from Goods will be in touch within 48 hours. If it's urgent, call us
    on [phone].

    Goods on Country
    ```
- [ ] **Internal Slack/SMS** to Ben + Nic: `New support ticket — {{contact.goods__asset_id}} in {{contact.community}} from {{contact.first_name}}: {{contact.message}}`
- [ ] **Nested branch** for urgent priority: if the contact has tag `goods-urgent` (the code adds this when `data.priority === 'Urgent'`), send an **immediate SMS** to the on-call number instead of/as well as the standard notification

### Branch 4 — Partnership / Media inquiry (tags: `goods-partner-lead` OR `goods-media`)

- [ ] **Send acknowledgement email**
  - **Subject:** `We received your {{#if contact.tag includes "goods-media"}}media pack{{else}}partnership{{/if}} inquiry`
  - **Body:**
    ```
    Hi {{contact.first_name}},

    Thanks for reaching out about {{#if contact.tag includes "goods-media"}}the Goods media pack{{else}}working with Goods on Country{{/if}}.

    We'll be in touch within 2 business days from ben@goodsoncountry.com.

    In the meantime: goodsoncountry.com/story has our background, and the wiki at
    goodsoncountry.com/wiki has deeper detail on how the Stretch Bed and washing
    machine work.

    Talk soon,
    Ben & Nic
    ```
- [ ] **Internal notification** to Ben: `New {{#if contact.tag includes "goods-media"}}media{{else}}partnership{{/if}} inquiry from {{contact.first_name}}: {{contact.message}}`

### Branch 5 — User message (tag: `goods-bed-scan` or similar in-app)

- [ ] **Internal notification** to Ben + Nic: `Message from {{contact.first_name}} about {{contact.goods__asset_id}}: {{contact.message}}`
- [ ] No automatic reply — let the team respond personally

### Branch 6 — User request (tag added when recipient requests blanket/pillow/parts)

- [ ] **Internal notification** to fulfilment: `Request from {{contact.first_name}} ({{contact.community}}) — see contact notes for type + details`
- [ ] **SMS acknowledgement** to recipient: `Got your request — we'll get it sorted. — Goods`

### Final action

- [ ] **Publish** the Smart Router (must be Published, not Draft, for the API to trigger it)
- [ ] **Copy the workflow ID** — it's in the URL bar after publishing, looks like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

## Step 2. Wire the ID into Vercel (one command)

Once you have the Smart Router workflow ID, paste it in place of `WF_ID` below and run **from the v2 directory**:

```bash
WF_ID="paste-the-router-id-here"
cd v2  # or the project root with vercel.json

for env in production preview development; do
  echo "$WF_ID" | vercel env add GHL_WORKFLOW_NEW_SPONSOR $env
  echo "$WF_ID" | vercel env add GHL_WORKFLOW_NEW_PARTNERSHIP $env
  echo "$WF_ID" | vercel env add GHL_WORKFLOW_SUPPORT_TICKET $env
  echo "$WF_ID" | vercel env add GHL_WORKFLOW_HIGH_PRIORITY $env
  echo "$WF_ID" | vercel env add GHL_WORKFLOW_NEW_CLAIM $env
  echo "$WF_ID" | vercel env add GHL_WORKFLOW_USER_MESSAGE $env
  echo "$WF_ID" | vercel env add GHL_WORKFLOW_USER_REQUEST $env
done
```

That sets 21 env-var values (7 slots × 3 environments) in one shot. Paste the router ID back to me and I'll run it for you, or run it yourself.

Then redeploy production so the code picks up the new env vars:

```bash
vercel --prod
```

---

## Step 3. End-to-end test

Pick the highest-impact path first — sponsor thank-you, since that's the Canberra Airport launch dependency.

- [ ] Open `/sponsor` in incognito
- [ ] Pick Utopia Homelands, qty 1, leave a test dedication
- [ ] Pay with a real card ($600) OR use a $1 Stripe test coupon if available
- [ ] Within 60 seconds, the sponsor email should arrive in the address you used at checkout
- [ ] Open the GHL contact for that email — confirm:
  - `goods-sponsor` tag is set
  - `Project Designation` = "Goods"
  - `Community` = "Utopia Homelands"
  - `Goods · Sponsor Dedication` carries your test message
  - The Smart Router shows as triggered in the contact's "Workflows" timeline

If the email doesn't arrive, the usual suspects in order:
1. Workflow is in **Draft**, not Published (most common cause)
2. `Wait 30 seconds` is too short for field propagation — try 1 minute
3. The "If/Else" tag condition uses the wrong tag string (case-sensitive; should be `goods-sponsor` lower-case)
4. The merge field in the email is misspelled (look for literal `{{contact.foo}}` in the received email)

---

## Step 4. Verify Smart Lists for tracking

Once a real transaction has run through, build these GHL Smart Lists for ongoing tracking:

- [ ] `All Goods contacts` — filter: Project Designation = "Goods". Should match the union of all `goods-*` tags.
- [ ] `Goods Sponsors` — filter: Tag is `goods-sponsor`
- [ ] `Goods Recipients` — filter: Tag is `goods-recipient`
- [ ] `Open Support Tickets` — filter: Tag is `goods-support-request` AND created in last 30 days
- [ ] `Sponsorships with Dedications` — filter: Tag is `goods-sponsor` AND `Goods · Sponsor Dedication` is not empty

---

## What's already done by me (no action needed)

- ✅ 2 new GHL custom fields created via API: `Goods · Asset ID`, `Goods · Sponsor Dedication`
- ✅ "Goods" added to the Project Designation dropdown
- ✅ 4 new Vercel env vars set across all 3 environments: `GHL_FIELD_ASSET_ID`, `GHL_FIELD_MESSAGE`, `GHL_FIELD_PROJECT_DESIGNATION`, `GHL_WORKFLOW_PARLIAMENT_HOUSE`
- ✅ `GHL_FIELD_COMMUNITY` extended to Preview + Development (was only Production)
- ✅ `withGoodsProject()` helper added at 11 contact-creation paths in code
- ✅ Type-checked and build-clean

## What's outstanding (yours to do, ~25 min in GHL + 2 min in Vercel)

1. Build the Smart Router in GHL dashboard (Step 1 above)
2. Paste the workflow ID back to me — I'll run the env-var commands
3. Redeploy production
4. Run one end-to-end test (Step 3)

The Canberra Airport launch dependency is **Branch 1 (Sponsor thank-you)**. Everything else can be filled in iteratively after that.
