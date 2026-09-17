# The right message to the right person, with a real next step

**17 September 2026.** Seven branches for "Goods Inquiry → Acknowledge", which is **published** and
currently sends one generic reply to everybody.

Every tag below was **verified on live production**, not assumed: five test submissions through
goodsoncountry.com, tags read back from the GHL API.

**Decisions (Ben, 17 Sep):** Ben signs · replies to `hi@act.place` · **two business days** · media
pack is `https://www.goodsoncountry.com/press` · phone `0422 883 943`.

---

## Branch order is the logic, and it is not obvious

**Support and "Bring this to my community" both carry `role:community`.** Branch on role and a
person with a broken bed gets the same letter as a community asking to start a conversation.

So branch on `interest:` first, which is specific, and fall back to `role:`, which is broad. First
match wins.

| # | Contact tag is | Branch | Evidence |
|---|---|---|---|
| 1 | `interest:support` | Something is broken | live test |
| 2 | `interest:bulk-order` | Ordering beds | live test |
| 3 | `interest:capital` | Funding a facility | mapped in canonical-tags |
| 4 | `interest:community` | Bring this to my community | mapped in canonical-tags |
| 5 | `role:media` | Media | existing, 15 contacts |
| 6 | `role:partner` | Partnership | mapped in canonical-tags |
| 7 | (else) | General | catch-all |

Trigger stays **Contact Tag added: `project-goods`** with the 1 minute wait. That is what fires
today, and it covers the contact form, the partnership form, support and feedback.

---

## 1. Something is broken · `interest:support`

The one that was silent until today, and the only one where the person already owns a Goods product.

**Subject:** We've got it, and here's what happens now

> Thanks for telling us.
>
> Here is what happens next. We check the bed or machine against its record, work out whether it
> needs a part, a repair or a replacement, and come back to you within two business days with which
> one it is and when.
>
> If it is not safe to use right now, ring Ben on 0422 883 943 and do not wait for the email.
>
> Ben

---

## 2. Ordering beds · `interest:bulk-order`

**Subject:** Your bed order, and what we need to quote it

> Thanks for getting in touch about beds.
>
> To give you a real number we need three things: how many, which community, and when you want them
> there. If you have those, reply with them and it speeds this up by days.
>
> Freight moves the price more than anything else, so we quote the beds and the freight to your
> place as one figure. No surprises at the end.
>
> I will come back within two business days with that quote. Orders are invoiced by A Curious
> Tractor Pty Ltd. If you need the charity instead, for a donation or a grant, that is Goods on
> Country Ltd and I will point you the right way.
>
> Ben

---

## 3. Funding a facility · `interest:capital`

**Subject:** Backing a facility

> Thanks for writing.
>
> A facility is a plant in a community that presses beds from recycled plastic, employs local
> people, and moves toward that community owning it. Capital comes in as a grant or as something
> recoverable, and both are real conversations here.
>
> Within two business days I will send you the numbers: what a facility costs to stand up, what it
> produces, and what the community ends up holding. If you would rather talk it through than read
> it, say so and we will find a time this week.
>
> Ben

---

## 4. Bring this to my community · `interest:community`

**Subject:** Thanks for putting your community forward

> Thanks for getting in touch.
>
> Nothing gets made for a community until that community has decided it wants it, who gets paid and
> what gets made next. So the first step is a conversation, and it happens on the phone rather than
> over email.
>
> I will ring you within two business days. If there is someone else who should be on that call,
> reply with their name and I will make sure they are.
>
> Ben

---

## 5. Media · `role:media`

Send the thing and get out of the way. No two-day promise, because what they asked for is in the
email.

**Subject:** The Goods media pack

> Thanks for getting in touch.
>
> Everything is here: https://www.goodsoncountry.com/press
>
> The photos on that page are cleared for use. The people in them consented to those specific
> images, so please use what is there rather than pulling images off the rest of the site.
>
> If you want to talk to someone in community rather than to me, tell me what the story is and I
> will ask. That is their call, and it takes a bit of time, so give me more than a day if you can.
>
> Ben

---

## 6. Partnership · `role:partner`

The broad one. It has to work for a community org, a supplier and a funder without guessing wrong,
so it asks which one they mean.

**Subject:** We've got your message

> Thanks for writing.
>
> Partnership means a few things here: a community deciding what gets made and who gets paid, an
> organisation selling beds into its own place, someone putting capital behind a facility, or a
> supplier who can move plastic, steel or canvas.
>
> Reply with which one is closest and I will come back within two business days with the right
> information instead of a general answer. If it is easier to talk than type, say so and we will
> ring you.
>
> Ben

---

## 7. General · everything else

**Subject:** We've got your message

> Thanks for writing. I read these myself and will come back to you within two business days.
>
> If it is urgent, ring Ben on 0422 883 943.
>
> Ben

---

## What makes these different from the one running now

The published reply says *"someone will get back to you, usually within a couple of business
days"*. It is warm and honest and it tells the reader nothing.

Each of these names **what happens next and who does it**. Four of the seven **ask for the one thing
that unblocks the next step**: the three numbers for a quote, who else should be on the call, which
kind of partnership, what the story is. That turns an acknowledgement into the first half of the
real conversation instead of a receipt.

Two deliberately break the two-day pattern. **Media** gets the pack immediately, because what they
asked for is a link. **Support** offers the phone, because a bed that is not safe to sleep on is not
a two-day problem.

## How to roll it out

The generic reply is live and it is better than nothing. Build these **around** it, one at a
time:

1. Add branch 1 (support) and branch 2 (bulk order). Everything else keeps falling through to the
   existing general reply.
2. Watch a week of real enquiries.
3. Add the rest.

Seven new emails published at once is seven untested emails in front of funders and communities.
