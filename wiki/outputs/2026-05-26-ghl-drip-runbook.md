# GHL drip runbook — Utopia funnels

> **Date:** 2026-05-26
> **Goal:** Stand up the two Utopia drip workflows in the GHL console. Email copy is in `wiki/outputs/2026-05-26-utopia-drip-sequences.md`. This is console work (GHL does not build workflows via API), so it is a click-through guide.

## Pre-flight (verified from code, 2026-05-26)
- GHL integration is **live** (`GHL_ENABLED="true"`, v2 API, location connected).
- Capture forms post to `/api/newsletter`, which applies these tags to the contact:
  - `goods-newsletter` (every signup, the catch-all)
  - `goods-src-getinvolved` (from `/get-involved`)
  - `goods-src-thework` (from `/the-work`)
  - `goods-src-fieldnote-utopia` (from the field-notes capture block)
- `fireSmartRouter` is dormant (`GHL_WORKFLOW_SMART_ROUTER` env is unset). Not needed: we trigger the drips on the tags natively in GHL.

## Heads-up: the existing "Newsletter Signup" workflow
There is already a published workflow called **"Newsletter Signup"** (`0c61347a-b59b-4de5-ae90-32a59c8e4805`). It very likely fires for every newsletter signup (the `goods-newsletter` tag). Before building the drips:
- Open it and check its trigger + what it sends.
- If it already sends a generic "thanks for subscribing" welcome, that is fine. Our drip C1/N1 are trip-specific first emails, not a generic welcome, so the overlap is small. Just avoid two "you're subscribed" emails landing together.
- Do NOT trigger the new drips on `goods-newsletter` (that is the catch-all and would enrol everyone). Trigger on the specific `goods-src-*` tags below.

---

## Workflow 1 — "Utopia Converter Drip"
**Trigger(s):** Contact Tag Added. Add TWO triggers (GHL ORs multiple triggers):
- Tag added is `goods-src-getinvolved`
- Tag added is `goods-src-fieldnote-utopia`

**Steps** (copy each email from the drip doc, sections C1 to C6):
1. Email **C1** (send immediately)
2. Wait **3 days** → Email **C2**
3. Wait **4 days** → Email **C3**
4. Wait **4 days** → Email **C4**
5. Wait **4 days** → Email **C5**
6. Wait **6 days** → Email **C6**

**Exit / goal conditions** (remove from this workflow if any happen):
- Contact tag added: `goods-customer` (a purchase) OR a partnership tag (a partner inquiry) → they have converted, stop selling.
- Unsubscribed.

## Workflow 2 — "Utopia Nurture Drip"
**Trigger:** Contact Tag Added is `goods-src-thework`.

**Steps** (copy from drip doc, sections N1 to N5):
1. Email **N1** (send immediately)
2. Wait **4 days** → Email **N2**
3. Wait **5 days** → Email **N3**
4. Wait **5 days** → Email **N4**
5. Wait **6 days** → Email **N5**

**Exit / goal:** contact tag `goods-src-getinvolved` added (they stepped up to the converter track) OR unsubscribed.

---

## Settings for both
- **From:** a real person (Ben or the Goods team), reply-to a monitored inbox.
- **Send as:** plain-text feel even if HTML. One idea per email. Subjects are in the drip doc.
- **Links:** use `www.goodsoncountry.com` (already in the copy).
- **Window:** consider a sending window (e.g. 8am to 6pm AEST) so emails do not land at 3am.

## Test before going live
1. Submit `/get-involved` with a test email you control → check the contact in GHL has `goods-src-getinvolved` + `goods-newsletter`, and that "Utopia Converter Drip" enrolled it.
2. Repeat for `/the-work` (→ `goods-src-thework`, Nurture drip) and the field-notes capture (→ `goods-src-fieldnote-utopia`, Converter drip).
3. Watch the first email actually send. Then remove your test contact.

## Optional, later: the code-side Smart Router
If you ever want inquiries routed to pipelines by the documented code path: create a "Smart Router" workflow, set `GHL_WORKFLOW_SMART_ROUTER` to its id in env, redeploy. Not required for these drips.
