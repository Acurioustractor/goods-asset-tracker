# Website forms: where they go, GHL, and email

> **Date:** 2026-05-26. Verified from the live code (`src/app/api/*`).
> **Short version:** every lead form creates a **GHL contact** (deduped by email), tagged by source/type. Some also write a **Supabase row**. **No form sends an email today** (Resend key not set, and the form routes don't call the email sender). Email is best added as a step in a GHL tag-triggered workflow.

## The forms and where they land

| Form (on the site) | Endpoint | GHL contact + tags | Supabase row | Note added |
|---|---|---|---|---|
| **Newsletter / capture** — footer signup, `/get-involved`, `/the-work`, `/canberra`, field-notes capture | `/api/newsletter` | `addToNewsletter`: tags `goods-newsletter` + `goods-src-{source}` (e.g. `goods-src-getinvolved`, `goods-src-thework`, `goods-src-fieldnote-utopia`, `goods-src-canberra-airport-2026`) | none | no |
| **Partnership** — `/partner` (two-stage) | `/api/partnership` | `createPartnershipContact`: tagged by segment + type | `partnership_inquiries` (Stage 2 PATCH enriches the same row) | yes |
| **Washing machine interest** | `/api/partnership` (type `washer-interest`) | `createInquiryContact`: tag `goods-washer-interest` | `partnership_inquiries` | yes (org, phone, message) |
| **Contact** — `/contact`, press, media | `/api/contact` | media-pack → `createPartnershipContact` (`goods-media`); else `createInquiryContact` (`goods-{subject}`, e.g. `goods-partnership-inquiry`, `goods-bulk-order`, `goods-media-pack-request`, `goods-inquiry`) **and** also added to newsletter (`goods-src-contact-form`) | none | no |
| **Support request** — `/support` | `/api/support` | `createSupportTicketContact` | `tickets` (+ `checkins` / `alerts`) | via ticket |
| **Feedback widget** | `/api/feedback` | `createInquiryContact`: tag `goods-feedback` | none | yes (the feedback text) |
| **Buy / Sponsor a bed** — `/shop/stretch-bed-single`, `/sponsor` | `/api/checkout` → Stripe → `/api/webhooks/stripe` | on payment: `createOrderContact` (order/recipient tags) | order records | yes |

Not lead forms: `/api/chat` (Ask Goods), `/api/products` (data), `/api/checkout` itself (payment).

## How to engage with them in GHL

1. **Everything is a Contact.** Each submission upserts a GHL contact by email and applies the tag(s) above. Go to **GHL → Contacts**, filter by tag to see each stream:
   - `goods-newsletter` = the catch-all for every signup (don't action on this alone, it's everyone).
   - `goods-src-*` = which surface they came from (the useful segment).
   - `goods-partnership-*` / segment tags = funder/buyer/partner leads (also in the `partnership_inquiries` table; admin view shows these).
   - `goods-washer-interest`, `goods-feedback`, `goods-media`, order tags = their own streams.
2. **Detail lives in the Note** (partnership, washer, feedback, support add a note with the message/org/phone) and, for partnership/support/orders, in **Supabase** (admin pages: orders, inquiries, tickets).
3. **To automate engagement, build a GHL Workflow per tag**, triggered by **"Contact Tag Added = <tag>"**. That workflow can: send an acknowledgement, send an internal team notification, assign to a pipeline/owner, start a drip. (The Utopia drip sequences are exactly this pattern: tag-triggered workflows.)
   - Note: the code's `fireSmartRouter` is **dormant** (`GHL_WORKFLOW_SMART_ROUTER` env is not set), so don't rely on code to trigger workflows. Use GHL-native **Tag Added** triggers. They fire reliably the moment the tag lands.

## The option to push them to email

Today **no form emails anyone** (the routes only create GHL contacts; the Resend email sender isn't wired to forms, and `RESEND_API_KEY` isn't set, so even code-side email is logged-only). Two ways to add it:

### Option A (recommended, no code): email from the GHL workflow
In the same tag-triggered workflow, add:
- an **Internal Notification → Email** step to the team (e.g. ben@goodsoncountry.com) so you get pinged on every submission, and
- a **Send Email** step to the contact as an acknowledgement ("thanks, we'll be in touch").
GHL sends these itself: no Resend key, no code change. This is the cleanest path and keeps the whole funnel in one place.

### Option B (code): app-side notification emails
The app has an email sender (`src/lib/email/send.ts`, Resend-backed). To use it:
1. Set **`RESEND_API_KEY`** in env (currently missing, so all code email is disabled). Optionally `EMAIL_FROM` / `EMAIL_REPLY_TO` (defaults: `hello@` / `ben@goodsoncountry.com`).
2. Add a `sendEmail({...})` call in each form's API route (one line after the GHL call) to notify the team and/or acknowledge the submitter.
Use this only if you want emails independent of GHL (e.g. order receipts, or a guaranteed app-side notification). For lead acknowledgement + team alerts, Option A is simpler.

## Two setup gaps to close
- **`RESEND_API_KEY` not set** → any code-side email is logged-only, not sent.
- **`GHL_WORKFLOW_SMART_ROUTER` not set** → use GHL-native Tag-Added triggers (not code-triggered routing).
