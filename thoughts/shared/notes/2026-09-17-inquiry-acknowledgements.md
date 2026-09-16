# Goods Inquiry → Acknowledge: the five branches

Paste-ready copy for the GHL workflow that is currently sitting in draft. Five branches, one per
contact-form subject. Nobody who writes to Goods gets a reply today, so this is the gap being closed.

**How the workflow branches.** The contact route tags every submission and stamps the subject into
the Message custom field. Branch on the tag. Message text is unreliable. The tags are applied by
`v2/src/app/api/contact/route.ts` through the canonical map, so `role:media` means a media request,
`interest:bulk-order` means a buyer, and so on.

**Rules that apply to all five.**

- Sent from a person, with a reply-to that a person reads. Not `noreply@`.
- No bed price for a bulk order. Ben, 16 September 2026: it is quoted per community, freight
  included. The $750 on the shop is the single-bed retail price and stays there.
- No lead time until somebody fills in the blank below. I do not have a sourced one and will not
  invent one.
- Nothing here goes to a `lane:community` contact as an automated send. If a community-line contact
  comes through the form, the acknowledgement is the class-1 answer they are owed, and the branch
  stops there. No follow-up sequence.

---

## 1. Bulk Order Inquiry

**Tag** `interest:bulk-order` · **Also do** create an opportunity in GOODS - Buyers at Outreach
Queued, and raise a task on the owner.

> **Subject:** Your bed order, and what happens next
>
> Thanks for getting in touch about beds.
>
> Here is what we need to give you a real number: how many, which community, and when you want them
> there. Freight is the part that moves the price most, so we quote the beds and the freight to your
> place together, in one figure. No surprises at the end.
>
> [NAME] will come back to you within [X business days] with that quote.
>
> Orders are invoiced by A Curious Tractor Pty Ltd. If you need the charity for a donation or a
> grant instead, that is Goods on Country Ltd, and we can point you to the right one.
>
> [NAME]

---

## 2. Partnership Inquiry

**Tag** `role:partner` · **Also do** create an opportunity in GOODS - Community at Invitation if the
message names a community, otherwise leave it for the owner to route.

This is the broadest subject and the one the pitch page points at, so it has to work for a community
org, a funder and a supplier without guessing wrong.

> **Subject:** We got your message
>
> Thanks for writing.
>
> Partnership means a few different things here: a community deciding what gets made and who gets
> paid, an organisation selling beds into its own place, someone putting capital behind a facility,
> or a supplier who can move plastic, steel or canvas.
>
> [NAME] will read your message properly and come back within [X business days]. If it is easier to
> talk than type, say so and we will ring you.
>
> [NAME]

---

## 3. Media Pack Request

**Tag** `role:media` · **Also do** nothing else. Send the pack and get out of the way.

> **Subject:** The Goods media pack
>
> Here is the pack: [LINK, confirm the real URL before this goes live]
>
> Photos in there are cleared for use. The people in them have given consent for those specific
> images, so please use what is in the pack rather than pulling images off the site.
>
> If you want to talk to someone in community rather than to us, tell us what the story is and we
> will ask. That is their call, not ours, and it takes a bit of time.
>
> [NAME]

---

## 4. LGANT 2026: place put forward

**Tag** the LGANT source tag · **Also do** create an opportunity in GOODS - Demand at Signal, with
the place named.

Someone at the local government conference has named a community. Treat it as a signal about a place. The person is
incidental.

> **Subject:** [PLACE], noted
>
> Thanks for putting [PLACE] forward.
>
> We have written it down. What happens next is slow on purpose: nothing gets made for a community
> until that community has decided it wants it, who gets paid and what gets made next.
>
> If you are the right person to have that conversation there, say so and we will ring you. If
> somebody else is, tell us who.
>
> [NAME]

---

## 5. General Inquiry

**Tag** `project:act-gd` with no more specific interest · **Also do** raise a task on the owner.

The catch-all. Short, because we do not know what they want yet.

> **Subject:** We got your message
>
> Thanks for writing. [NAME] will come back to you within [X business days].
>
> If it is urgent, ring [PHONE].
>
> [NAME]

---

## Blanks to fill before this goes live

1. **[NAME]** and the reply-to address. One person, the same person, across all five.
2. **[X business days]**. There is no sourced lead time or response time anywhere in the repo. Pick
   one you will actually hit. A promise of two days that takes ten is worse than saying five.
3. **The media pack URL.** There are cleared images under `v2/public/images/media-pack/`, and I
   could not confirm a public pack page. Confirm the real link.
4. **[PHONE]** on the general branch, or cut that line.

## What this does not cover

The Stripe order confirmation. That is the "New Order Notification" workflow, also in draft, with
`GHL_WORKFLOW_NEW_ORDER` already pointing at it in production. Publishing it is a separate job and a
one-click one.
