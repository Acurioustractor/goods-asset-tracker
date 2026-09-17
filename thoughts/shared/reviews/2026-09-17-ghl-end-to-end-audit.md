# Is it 100% built right? Every entry point, tag and workflow, traced

**17 September 2026, after "Goods Inquiry → Acknowledge" was published.**

The question: does every conversation land in GHL, reach `hi@act.place`, carry the right contact
tags, and open a card on the right pipeline. Traced in code, checked against the live account.

**Short answer: one of eight entry points is complete. The acknowledgement you just published covers
three of them.**

---

## 1. What the published workflow actually covers

It triggers on the tag `project-goods`. Only three entry points stamp that tag.

| Entry point | Acknowledgement fires |
|---|---|
| Contact form (all five subjects, including the three new doors) | **yes** |
| Partnership form | **yes** |
| Feedback widget | **yes** |
| Support ticket | no |
| Bed story | no |
| Newsletter signup | no |
| Stripe order | no |
| Portal request / message | no |

Two of those silences are correct. A newsletter subscriber is not waiting on a reply, and has its
own draft workflow. A Stripe order has **New Order Notification**, which is fully built and still
switched off.

**One is a real hole: support.** Somebody reports a broken bed, and they get no acknowledgement and
nobody is emailed. See §2.

**One is arguable: feedback.** A drive-by feedback widget now promises a reply within two business
days. Fine if you mean it, over-promising if you do not.

---

## 2. The end-to-end matrix

What each entry point does today. `hi@act.place` means the team inbox email actually fires.

| Entry point | GHL contact | Canonical tags | Conversation thread | hi@act.place | Pipeline card | Reply to them |
|---|---|---|---|---|---|---|
| **Contact form** | yes | yes | yes | yes | **yes** | yes |
| Partnership form | yes | yes | yes | yes | **no** | yes |
| Feedback widget | yes | yes | yes | **no** | no | yes |
| **Support ticket** | yes | **no** | **no** | **no** | no | **no** |
| Bed story | yes | **no** | **no** | **no** | no | **no** |
| Newsletter | yes | internal only | no | n/a | no | draft workflow |
| Stripe order | yes | **no** | **no** | **no** | no | draft workflow |
| Portal request / message | yes | yes | no | no | no | task on a human, by design |

Only the contact form is complete, and only because it was rebuilt today.

### The support ticket, in detail

`POST /api/support` writes a Supabase `tickets` row, an `alerts` row, and a GHL contact through
`createSupportTicketContact`. It does **not** call `addTags(['act-inquiry','project-goods'])`, does
not thread the message into Conversations, and does not email the team inbox.

So a person with a broken bed writes to you, and the only trace a human sees is a row in a table.
This is the same shape as the portal defect fixed this morning, and it is the worst remaining one,
because the people using it are the people already holding a Goods product.

### The partnership card

Partnership inquiries tag correctly and get an acknowledgement, but open **no card**. The contact
form now routes every subject to a board through `lib/ghl/inquiry-routing`. The partnership route
never calls it.

---

## 3. Workflows

32 in the account. The Goods folder holds five.

| Workflow | Status | What it does |
|---|---|---|
| Goods Inquiry → Acknowledge | **published today** | `project-goods` → one email to everyone |
| New Order Notification | draft | `goods-customer` → Email, SMS, Internal Notification. **Fully built.** `GHL_WORKFLOW_NEW_ORDER` already points at it in production |
| Goods media form submission | draft | Internal Notification only. **Sends the journalist nothing.** Triggers on *Contact Created*, so a journalist already in the database never fires it |
| Grant Deadline 7 Day Reminder | draft | Internal only, unrelated |
| Newsletter Signup | draft | The 164 have never been written to, and Ben ruled they wait |

**There is still no Smart Router**, which the code is built around. `GHL_WORKFLOW_SMART_ROUTER` is
unset in both environments.

---

## 4. Tags: 712, and what is wrong with them

| Finding | Count |
|---|---|
| Total tags | 712 |
| Flat, no namespace | 300 |
| Flat `goods-*` | 121 |
| Flat `goods-*` that shadow an existing namespaced tag | **33** |
| Malformed, a space after the colon | 8 |
| True duplicate pairs, same meaning two spellings | 2 |

**The 8 malformed.** A space after the colon breaks the namespace, so these do not group or filter
with their family:

```
access: open registration (public)     event type: public launch (50-150)
event: witta gathering - 2026-06-20    route: /
source: footer                         tier: active
tier: aware                            tier: engaged
```

**The 2 real duplicates**, where the same contact set is split across two spellings:

```
"source: footer"  and  "source:footer"
"tier: active"    and  "tier:active"
```

**The 33 shadows.** Twenty of them are `goods-community-<place>` duplicating
`place:community:<place>` for the same place. They are why a place-based filter never returns
everyone.

Nothing here is urgent. It is why the account feels messy, and it is the argument for the Community
custom object: a place belongs in one record, where twenty tags sit today.

---

## 5. What to do, in order

**1. Fix support.** Stamp `act-inquiry` + `project-goods`, thread the message into Conversations,
email the team inbox. Three lines, and the acknowledgement you already published then covers it for
free. This is the one with a person waiting at the other end.

**2. Publish New Order Notification.** It is finished and switched off. Read the SMS node first: it
costs money per send and lands on a phone. Until then a buyer pays and hears nothing.

**3. Give partnership a pipeline card.** One call to `ghl.createInquiryOpportunity`, the same as the
contact route. `role:partner` already routes to GOODS - Community at Invitation.

**4. Fix the media workflow, or delete it.** It is named for something it does not do. Either it
replies to the journalist, or the media branch of the acknowledgement covers it and this one becomes
an internal notification with an honest name.

**5. Bed story: acknowledge it.** Somebody sharing a story about their bed should hear back. It is a
class-2 service message, so it is allowed on the community line.

**6. Tag hygiene.** Merge the 2 duplicate pairs, fix the 8 malformed, then plan the 33 shadows around
the Community custom object instead of editing them one at a time.

**7. Feedback.** Decide whether a two-day promise belongs on a drive-by widget.

Items 1, 3 and 5 are code and I can do them. Items 2 and 4 are dashboard. Item 6 is a GHL data job
that should wait for the object decision.
