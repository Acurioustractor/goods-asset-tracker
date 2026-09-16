# The Goods campaign machine

**17 September 2026.** What exists, what is broken, and the funnel plan that makes GoHighLevel the
spine instead of a fifth place to look.

Every number below was read live from the GHL API, the Supabase v2 project or the repo on this date.
Nothing here is estimated. Where a thing could not be verified it says so.

Companion work, do not duplicate: `thoughts/shared/handoffs/procurement-model/current.md` (who is
allowed to buy a bed, per jurisdiction) and `thoughts/shared/handoffs/oonchiumpa-real-operating-model/current.md`.

---

## 1. The review

### The account

One GHL sub-account, "A Curious Tractor" (`agzsSZWgovjwgpcoASWG`), shared by Goods, Harvest,
JusticeHub and CONTAINED. **3,715 contacts. 580 carry `project:act-gd`.**

Four Goods pipelines, and they are in good shape:

| Pipeline | Open | Value | Read |
|---|---|---|---|
| GOODS - Buyers | 19 | $181,721 | The commercial board. Twelve stages, Outreach Queued to Paid. |
| GOODS - Funding | 68 | $3,659,247 | The funder relationship board. Ten stages. |
| GOODS - Demand | 75 | $0 | Upstream signal. Value deliberately unset. |
| GOODS - Community | 15 | $0 | Invitation to Operating. The relationship pathway. |
| Grants (adjacent) | 32 | $2,210,000 | Program intake. |

The structure is right. The tags are largely right: 712 tags, of which about 412 sit on the
namespaced contract (`place:`, `role:`, `interest:`, `source:`, `comms:`, `relationship:`,
`project:`) that `wiki/concepts/ghl-crm-taxonomy.md` defines. 75 custom fields, including a
`Goods · LinkedIn Tags` multi-select already carrying 40+ values, and a `Newsletter Consent` field.

### Then it stops

**Every Goods workflow in the account is a draft.** All 32 workflows were listed. These five are
Goods, and none is published:

- Goods Inquiry → Acknowledge
- Goods media form submission
- New Order Notification
- Newsletter Signup
- ACT Core — Newsletter Signup

The published workflows are all Harvest, JusticeHub, CONTAINED, two Supabase syncs, and one
"Contact Form to Universal Inquiry" that drops Goods enquiries into the ACT-wide Universal Inquiry
pipeline. No Goods board receives them.

**Eleven email campaigns have ever been created in this account. Zero are Goods.** The completed
sends are Harvest member notes (June 2026), a Harvest gathering series (March) and the CONTAINED
launch (March). Goods has never sent an email campaign.

**164 people carry `comms:goods-newsletter`.** That tag is the send-trigger, granted only behind the
explicit Spam Act consent gate in `v2/src/lib/ghl/canonical-tags.ts`. One hundred and sixty four
people ticked a box asking to hear from Goods, and have received nothing.

### The seam that broke

The code segments on the old flat vocabulary. The account has moved to the namespaced one. Nobody
repointed the code. Live counts, every audience defined in `v2/src/lib/ghl/smart-lists.ts`:

| Defined in code | Tag it queries | Live contacts | The real tag | Live |
|---|---|---|---|---|
| Supporters & donors | `goods-newsletter` | **8** | `comms:goods-newsletter` | **164** |
| Funders (active + prospect) | `audience-funder` | **0** | `role:funder` | **99** |
| Suppliers | `goods-supplier` | **0** | (none applied) | 0 |
| Vendors | `goods-vendor` | **0** | (none applied) | 0 |
| Bed recipients consented | `goods-consent-to-contact` | **0** | `interest:story-followup` | 0 |
| Bed owners claimed | `goods-claimed-bed` | **0** | | |
| Washer owners | `goods-claimed-washer` | **0** | | |
| Story submitters | `goods-story-submitter` | **0** | | |
| Washer prospects | `goods-washer-interest` | **1** | | |
| Bed buyers | `goods-bed-owner` | **1** | | |
| Support contacts | `goods-support-request` | **1** | | |

Thirteen audience definitions. Every one resolves to between zero and nine people. The admin
reach-out tool and the segment picker are working correctly against a vocabulary nobody uses.

### Three more things that are wired to nothing

**The Smart Router does not exist.** `v2/src/lib/ghl/index.ts` is built around one workflow that
branches on the contact's tag, documented as "new event = new tag + new branch, zero code change,
zero deploy". There is no such workflow in the account, and `GHL_WORKFLOW_SMART_ROUTER` is unset in
`.env.local` and in Vercel production. `GHL_WORKFLOW_NEW_ORDER` is set in production and points at
a workflow that is in draft, so a Stripe bed purchase triggers nothing.

**Consent is captured and then not written down.** The newsletter route correctly fails closed
without an explicit tick. It then tries to stamp `GHL_FIELD_NEWSLETTER_CONSENT`, which is unset in
both environments, so the value is dropped. The `Newsletter Consent` field exists in GHL and is
empty, and `consent:newsletter-explicit` is on **0** contacts. The consent is real, the evidence
trail is not.

**There are two sending systems and the wrong one is sending.** `smart-lists.ts` records the ruling
"GHL owns the send; code only defines the segments". But `api/cron/campaign/pipeline-followup`
sends email through Resend (configured in production), and `api/cron/sms-dispatch` sends SMS from
the app. So the system holding consent state is the system not sending, and the system sending does
not hold it.

### The other three places

- **Notion.** "Goods Pipeline Command Centre" holds a hand-typed snapshot of the GHL boards, dated
  9 August, reading "17 open opportunities" where the live figure is 19. Funders & Opportunities
  remains the funder system of record by your ruling, which is fine; the Command Centre is a stale
  copy of something GHL already knows.
- **Supabase v2** (`cwsyhpiuepvdjtxaozwf`). `crm_contacts` holds 135 rows against GHL's 3,715.
  `crm_notes` holds **0**. A third contact store at 4% coverage that nothing writes to.
- **The website.** Every audience on every page funnels into one form with five subjects
  (General Inquiry, Partnership Inquiry, Bulk Order Inquiry, Media Pack Request, LGANT). The pitch
  at `/pitch`, the piece of work most likely to move six figures, has exactly one call to action,
  repeated three times: "Talk to us" / "Send a message", subject `Partnership Inquiry`. A
  procurement officer with a Tier 1 delegation and a philanthropist with a chequebook press the
  same button and receive the same nothing.

### The diagnosis, in one line

The machine identifies and tags people correctly, and then stops. Everything downstream of "contact
created" is draft, empty, or pointed at a tag that nobody applies.

This is good news. The expensive half is built.

---

## 2. The rule that shapes the design

I had this too strict on the first pass. The ruling in `canonical-tags.ts` does not say communities
hear nothing. It says:

> `lane:community` ... Out of the machine, not out of communication.

The line is not between contacting a community and leaving them alone. It runs between three kinds
of message, and only one of them is banned.

**1. Answers.** They wrote to us. A reply is owed, fast, in the channel they used, with a person's
name on it. Withholding this is neglect dressed up as protection.

**2. Service.** About a thing they already hold. The bed shipped. The part is on the truck. Here are
the plans you asked for. Factual, tied to an object, refusable per object.

**3. Broadcast.** We decided to tell a group something. Off by default on the community line. It
happens only with that person's own explicit choice, human-confirmed, and never because somebody
built a segment that swept them in.

The strip-guard already implements exactly this. It removes `comms:*`, which is class 3, and touches
nothing else. The code was right and my first pass at the prose was wrong.

So the two halves are not "sends" and "does not send". They are:

**The campaign half.** Goods decides who hears what, inside consent.
**The relationship half.** The community decides who hears what, and Goods keeps the promises.

### The automation points inward

Every automation on the community line has a Goods staff member as its recipient. The machine nags
us. It reminds a named person that Tennant Creek has not been called in six weeks, that a part was
promised on the 3rd, that a request has been open for two days. It reminds a community of nothing.

### What "best experience" means, and why it is not built yet

The channel already exists, and it suits remote better than email does:

- `/my-items`, with items, messages and requests, behind a phone-number login with OTP. No email
  address required.
- `/admin/messages` and `/admin/requests` on the staff side. Two-way, with read receipts.
- `/claim/[asset_id]`, the QR on the bed itself.
- `/partners/[slug]/dashboard`, reading the live asset register.
- `/portal`, nine modules and Ask Goods.

It has never been used. Live counts in the v2 project on this date: **0 messages, 0 requests,
0 claimed assets, 7 profiles.** Against 86 contacts carrying `lane:community`.

And if somebody did use it, `POST /api/user/requests` inserts a row and notifies nobody. No email,
no SMS, no GHL task. A community member asking for a replacement part is filing it into a table that
no human watches.

So the community work is four things, and none of them is a funnel.

**1. Make silence impossible.** Every inbound (message, request, claim, form, SMS reply) raises a
task in GHL against a named person with a clock on it. This is the highest-value change on this
side of the machine and it is small.

**2. Send the invitation.** The QR on the bed is the door, and it fits the place: scan, phone
number, no email, no app. Nobody has been walked through it.

**3. Give the named person a reason to be there.** One relationship holder per community, their name
visible to the community, their list in front of them each week.

**4. Make it theirs.** Their place, their beds, their own stories from Empathy Ledger, what was
promised and whether it happened.

### The promise ledger

What we said we would do, by when, and whether we did it. This is what builds trust in these
relationships and it is the first thing lost between sessions and staff. It belongs on the Community
record, visible to the community, and it is the list Goods should be judged against.

### Cultural protocol as a field

GHL already carries `cultural_protocols` (long text) and `protocol:cultural-authority`. Two things
need to become states any staff member can set and everyone can see: **who speaks for this place**,
and **pause all contact** for sorry business. A pause has to stop everything including the internal
reminders, and it should be one switch.

The procurement work already showed why none of this can be a sequence. Its open question is "do our
partner organisations want to be sellers? None has agreed to anything." A phone call answers that.

---

## 3. The funnel: six doors

For each door: who, what we actually want from them, where they land, and what happens within
24 hours. The last column is the part that does not exist today.

### Door 1. Buy beds

Orgs with budget now: health services, land councils, stores, shires, corporates.
**CTA** "Order beds for your community" → `/beds` → Bulk Order Inquiry.
**Lands** GOODS - Buyers, stage Outreach Queued. `role:buyer`, `interest:bulk-order`, `place:*`.
**Within 24h** an acknowledgement that answers the four questions a buyer actually has: price per
bed, lead time, freight to their place, and who invoices (A Curious Tractor Pty Ltd, for now).

### Door 2. The procurement route

Not a website door. Named-person outreach against the instruments the procurement session found:
WA uncapped (Rule C4.2), SA 733 beds (SAIPP s3.7/s4.6), NT 66 beds (Tier 1). Doors already named and
none yet approached: Tom Harris (NT Procurement Champion), John Chapman OAM (SA Industry Advocate),
Morrgul (Kimberley), the Industry Capability Network for the unresolved WA board-test question.
**Lands** GOODS - Buyers, with a new `instrument:` field on the opportunity so the board can be read
as "which rule lets this one through".
**Within 24h** nothing automated. This is a person writing to a person.

### Door 3. Sell beds in your community

A community organisation holding stock and becoming the supplier. `/sell-beds` exists.
This is the door the procurement session says has no tooling anywhere: *"a price, a lead time, an
invoice, a delivery. That is the step between holding stock and being a supplier and no tooling in
either repo touches it."*
**Lands** GOODS - Community. Human-paced.
**Within 24h** a task against a named person with a clock on it, and that person makes contact. Then
the missing thing the procurement session named: a one-page seller pack, with a price, a lead time
and an invoice, that a community org can put in front of their own buyer.

### Door 4. Recycling connections

**There is no campaign here yet, because there is no data.** `est_plastic_waste_tpa` is null in all
1,543 rows of `goods_communities`. The first move is not outreach, it is finding who holds the waste
and resource-recovery contract in each of the places we are already in. That is a research task with
a named output per place, It belongs beside the procurement research.

### Door 5. Fund it

GOODS - Funding already holds 68 opportunities worth $3.66M. The gap is not lead generation. It is
that nothing happens between "Committed" and the next ask: no stewardship cadence, no impact note,
no renewal trigger. 99 contacts carry `role:funder` and none of them is on a list.

### Door 6. Follow along

The 164. This is the biggest single unopened door in the account, and it needs care.
These people consented up to nine months ago and have never heard from Goods. The first send is a
re-introduction that gives them an easy way out, from a warmed domain. Sending a cold 164 from a
cold domain is how you start in spam and stay there.

---

## 4. Who owns what

The fragmentation ends when each system has one job and the others stop doing it.

| System | Owns | Stops doing |
|---|---|---|
| **GHL** | Every person and org. Consent state. All sending, email and SMS. Pipelines as the single board. Social scheduling. | Nothing; it takes work back. |
| **The Next.js app** | Forms (they carry the consent gate, keep them), the public story, the admin surfaces, products, assets, the ledger. Identify-and-tag into GHL. | Sending. Retire the Resend follow-up cron and the in-app SMS blast, or make them GHL calls. |
| **Notion** | Judgement. Applications, drafts, rulings, funder briefs. | Copying pipeline state. Delete the Command Centre snapshot or replace it with a link. |
| **Supabase** | Assets, register, production, Empathy Ledger, community research data. | Being a third CRM. Either backfill `crm_contacts` from GHL as a read-only mirror or drop it. |

---

## 5. What in GHL does the work

Verified against current HighLevel documentation, September 2026.

**Custom Objects with Associations.** The most important one. A community is not a contact and a
buyer organisation is not a contact, and modelling them as contacts is why the tag list has 120
`goods-*` entries including 20 `goods-community-<place>` tags duplicating `place:community:<place>`.
Custom Objects give real `Community` and `Organisation` records with many-to-many associations and
up to 10 relationship labels between object types. Available on all plans. **Caution: the limit is
10 custom objects per sub-account and this sub-account is shared with three other projects.** Budget
two, Community and Organisation, and agree it with the other projects first.

**Workflows.** Publish the five drafts. Then build the one Smart Router the code already expects,
set `GHL_WORKFLOW_SMART_ROUTER`, and every future event is a new branch in the dashboard with no
deploy. That design was right; it was just never finished.

**LC Email plus a dedicated sending domain.** `send.goodsoncountry.com` with its own SPF, DKIM and
DMARC, warmed before the 164. Door 6 cannot open until this is done.

**Social Planner.** Supports LinkedIn company pages and personal profiles, plus Instagram, Facebook,
Google Business Profile, TikTok and X. The `Goods · LinkedIn Tags` field with its 40 values is
already half of a LinkedIn segmentation model. One place to post, scheduled, with the post's
audience tied back to the tag it targets.

**Attribution and UTM.** GHL records session source, medium and campaign at first and last touch on
every contact. Today Goods has 50 `source:` tags doing this by hand. Put UTMs on the LinkedIn posts,
the pitch links and the QR codes, and the question "which door did this buyer come through" answers
itself. The Forecast tab (added April 2026) gives probability-weighted pipeline value, which is the
number the raise keeps needing.

**Conversation AI and Voice AI.** Useful on the buyer and supporter lines. **Do not put them on any
`lane:community` contact.** An AI answering an Elder is the exact failure the OCAP rule exists to
prevent.

**Communities and Client Portal.** Skip. The app already has `/portal`, `/partners/[slug]/dashboard`
and `/funders/[slug]`. Do not build a second portal.

**Forms.** Keep them in the app. They carry the consent gate and the honeypot, and GHL's form builder
would lose both.

---

## 6. Sequence

**Repairs first. None of these is a new feature, and together they are most of the value.**

1. **Notify a named human on every community inbound.** `POST /api/user/requests` and the portal
   message path currently write a row and tell nobody. Raise a GHL task with a clock. Small change,
   and until it is made the whole community side is a room with no one in it.
2. Repoint `smart-lists.ts` and `AUDIENCE_SEGMENTS` at the namespaced tags. Thirteen dead
   definitions become thirteen live audiences. The flat tags were kept only because "the live Smart
   Router branches on them", and there is no Smart Router, so the reason has evaporated.
3. Set `GHL_FIELD_NEWSLETTER_CONSENT` in both environments. Consent starts being recorded.
4. Publish "Goods Inquiry → Acknowledge" and give each of the five form subjects its own branch and
   its own useful reply. Nobody contacts Goods into silence after this.
5. Publish "New Order Notification". The env var already points at it.
6. Retire the Notion Command Centre snapshot.

**Then build.**

7. Dedicated sending domain, warmed.
8. The Smart Router workflow, and `GHL_WORKFLOW_SMART_ROUTER` set.
9. One named relationship holder per community, their name visible to the community, their list in
   front of them weekly.
10. The invitation: walk one community through the QR claim on a bed they already have, and watch
    where it breaks before doing it anywhere else.
11. Newsletter number one to the 164, re-introducing and offering the exit.
12. Custom Objects: Community and Organisation, after agreeing the budget with the other projects.
    The Community record carries the promise ledger, who speaks for the place, and the pause switch.
13. UTMs on every outbound link, then read the Forecast tab.
14. Stewardship cadence on the 99 funders.
15. Decide the fate of the Resend cron and `crm_contacts`.

Doors 2 and 4 (procurement, recycling) stay with the other session. Both are research until there is
something true to say.

---

## 7. What I could not settle, and what changes the work

- **The 164.** Nine months is a long silence. Re-introduce and offer an exit, or quietly drop the
  oldest and start from the recent ones? This is a judgement about how it will feel to receive, and
  it is yours.
- **Custom object budget.** Two of the sub-account's ten, on a sub-account Harvest, JusticeHub and
  CONTAINED also draw from. Worth a conversation with them before claiming it.
- **The two sending systems.** Killing the Resend follow-up cron is the clean answer and it removes
  a path that can email someone GHL thinks is unsubscribed. Confirm before I touch it.
- **The pitch CTA.** Right now `/pitch` asks a funder, a buyer and a procurement officer to press the
  same button. I would give it two: "Order beds" and "Fund a facility". That is a public-surface
  change, so it waits for you to see it.
- **`goods_procurement_entities` is still broken as a key** (3,255 of 4,551 links unresolved,
  Palm Island's 17 buyers are Cooktown orgs). Any place-based campaign inherits that until it is
  fixed.

---

## Appendix: how to re-read the live state

The scripts used for this review are throwaway and live in the session scratchpad. The durable ones
already in the repo:

- `v2/scripts/ghl-all-pipelines-audit.mjs`, read-only, every pipeline with a recommendation per board
- `v2/scripts/ghl-people-pull.mjs`, contact pull
- `v2/scripts/ghl-apply-tags.mjs`, tag writes (Tier 2, ask first)

Counts in this document were taken with `POST /contacts/search` filtered on a single tag, and
`GET /opportunities/search` per pipeline, against `GHL_LOCATION_ID` from `v2/.env.local`.
