# Goods Inquiry → Acknowledge: build it in GHL

Final copy for the workflow that is still sitting in draft. Until it is published, an enquiry gets
Ben an email, a contact, a tag and a card on the right board, and **the person who wrote gets
nothing back.**

There is no API for this. GHL exposes `get-workflow` (read) and `add-contact-to-workflow`, and no
operation that creates or publishes one. So this is dashboard work, and everything below is written
to be pasted.

**Decisions, Ben, 17 September 2026**

| Blank | Answer |
|---|---|
| Who signs | Ben |
| Reply-to | `hi@act.place` |
| Response time | **two business days**, the same on every branch |
| Media pack link | `https://www.goodsoncountry.com/press` (the page already has one-tap downloads) |
| Phone on the General branch | **0422 883 943** (Ben, 17 Sep). Already public on `/site`. |

---

## Build it

1. GHL → **Automation** → open **Goods Inquiry → Acknowledge** (it exists, in draft).
2. Trigger: **Contact Tag** added, tag `act-inquiry`. Every website enquiry gets that tag at the
   chokepoint, so one trigger catches all five doors.
3. Add a **Wait** of 1 minute. The contact's tags are written in a second call after creation, so a
   branch that reads them immediately can read them before they land.
4. Add **If/Else** with five branches on contact tag, in this order. First match wins, so the
   specific ones come before the catch-all.

| Branch | Condition, contact tag is | Send |
|---|---|---|
| 1 | `interest:bulk-order` | Bulk order reply |
| 2 | `role:funder` | Facility funding reply |
| 3 | `role:community` | Community reply |
| 4 | `role:media` | Media reply |
| 5 | (else) | General reply |

5. In each branch add **Send Email**. From: Ben. Reply-to: `hi@act.place`.
6. Publish.

**Why those tags and not the `goods-*` ones.** The contact form maps every subject onto the
canonical contract (`lib/ghl/canonical-tags`), so `Bulk Order Inquiry` now arrives carrying
`role:buyer` and `interest:bulk-order` as well as the flat slug. Branch on the canonical tag: it is the
one the audiences and smart lists use, and it is the one that will still be there after the flat
tags are retired.

**The Partnership subject** also lands on `role:partner` and opens a card on GOODS - Community. It
falls through to the General reply unless you want a sixth branch, and the General reply is written
to work for it.

---

## 1. Bulk order · `interest:bulk-order`

**Subject:** Your bed order, and what happens next

> Thanks for getting in touch about beds.
>
> Here is what we need to give you a real number: how many, which community, and when you want them
> there. Freight is the part that moves the price most, so we quote the beds and the freight to your
> place together, in one figure. No surprises at the end.
>
> I will come back to you within two business days with that quote.
>
> Orders are invoiced by A Curious Tractor Pty Ltd. If you need the charity instead, for a donation
> or a grant, that is Goods on Country Ltd and I can point you to the right one.
>
> Ben

---

## 2. Fund a facility · `role:funder`

**Subject:** Backing a facility

> Thanks for writing.
>
> The short version: a facility is a plant in a community that presses beds from recycled plastic,
> employs local people, and moves toward that community owning it. Capital can come in as a grant or
> as something recoverable, and both are real conversations.
>
> I will come back to you within two business days. If it is easier to talk it through than read a
> deck, say so and we will find a time.
>
> Ben

---

## 3. Bring this to my community · `role:community`

**Subject:** Thanks for reaching out

> Thanks for getting in touch.
>
> Nothing gets made for a community until that community has decided it wants it, who gets paid and
> what gets made next. So the first step is a conversation, not a proposal.
>
> I will come back to you within two business days. If there is someone else who should be in that
> conversation, tell me who and I will make sure they are.
>
> Ben

---

## 4. Media · `role:media`

**Subject:** The Goods media pack

> Thanks for getting in touch.
>
> Everything is here: https://www.goodsoncountry.com/press
>
> Photos on that page are cleared for use. The people in them have given consent for those specific
> images, so please use what is there rather than pulling images off the rest of the site.
>
> If you want to talk to someone in community rather than to me, tell me what the story is and I
> will ask. That is their call, and it takes a bit of time.
>
> Ben

---

## 5. General · everything else

**Subject:** We got your message

> Thanks for writing. I will come back to you within two business days.
>
> If it is urgent, ring Ben on 0422 883 943.
>
> Ben

---

## Nothing outstanding

All four blanks are filled. The workflow can be built and published from the steps above.

The placeholder `+61 400 000 000` on the three portal pages was replaced with the same real number
in this commit.

## Not covered here

The Stripe order confirmation. That is **New Order Notification**, also in draft, with
`GHL_WORKFLOW_NEW_ORDER` already pointing at it in production. Publishing it is one click and needs
no copy from anyone.
