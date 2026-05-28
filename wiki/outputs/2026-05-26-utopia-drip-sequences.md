# Utopia drip sequences (B2) — ready-to-send copy

> **Date:** 2026-05-26
> **Purpose:** Answers Benjamin's "feed the story strategically through a number of communications, drip-fed" and "warm them up for a launch." Less content per touch, the trip told one beat at a time.
> **Architecture:** Drip lives in GHL workflows (the code only tags; see [[ghl-smart-router-pattern]]). Each track is triggered by the capture tag the funnels already fire. No code change to ship these. Paste each email into a GHL workflow step.
> **Voice:** warm, grounded, community-first. Lead with impact not charity. "On Country" capitalised. No em dashes. No "co-design".

---

## How the two tracks map to tags

All capture forms post to `/api/newsletter`, which stores the source as
`goods-src-{tag}` and also applies `goods-newsletter`. So the GHL tags to
trigger on are below (note the `goods-src-` prefix the code adds).

| Track | Enrol trigger (GHL tag) | Where the tag fires | Goal |
|---|---|---|---|
| **CONVERTER** | `goods-src-getinvolved` OR `goods-src-fieldnote-utopia` | `/get-involved` capture + the field-notes capture block | Warm to an ask: sponsor / fund / partner |
| **NURTURE** | `goods-src-thework` | `/the-work` capture | Educate + belong: join the journey, soft get-involved |

Every signup also gets `goods-newsletter`, so do NOT trigger drips on that
tag alone (it is the catch-all). Trigger on the specific `goods-src-*` tag.

Exit both tracks on: a partnership inquiry submitted, a sponsorship/purchase completed, or unsubscribe.
A converter who acts mid-sequence drops out and moves to the customer/partner track.

Sender: a real person (Ben or the Goods team), reply-to monitored. Short. One idea per email.

---

# CONVERTER TRACK (6 emails, ~3 weeks)

The trip, one beat at a time, building to a single clear ask. Each email earns the next.

### C1 · Day 0 · "You just met the young people who built them"
**Subject:** The beds were built by the young people who needed them

Thanks for following along.

Last month, young people in Alice Springs spent two days building Stretch Beds with Oonchiumpa. Every young person who built one kept one. The rest got loaded into a truck for the run out to the Utopia homelands.

That is where this starts. Not with a donation. With a build, led by the people it is for.

Over the next couple of weeks I will send you the rest of the trip, one piece at a time. No noise.

If you would rather see it all now, the full field notes are here: [the trip](https://www.goodsoncountry.com/field-notes/utopia-may-2026).

### C2 · Day 3 · "The demand was already there"
**Subject:** We drove out the next morning. Households we had not met asked for two or three each.

The morning after the build, we drove the truck out to the homelands.

We did not have to convince anyone. Households we had not met asked for two or three beds each. Most people out there are sleeping on a thin mattress on a concrete floor, or a door taken off its hinges and laid flat.

107 beds went out on this trip. It was not enough. It never is yet.

### C3 · Day 7 · "Four beds, two Elders, one quiet morning"
**Subject:** You don't turn up loud to Country. You turn up listening.

Four of the beds went to two senior Alyawarr brothers at Ampilatwatja.

We sat with them. Getting up and down off the ground is hard when you are old, and a bed off the floor is not a small thing for an Elder. It is dignity, and it is health: less time on cold concrete, fewer of the skin and chest problems that come with it.

This is the part that does not photograph well and matters most.

### C4 · Day 11 · "It is not a giveaway"
**Subject:** Why we make the beds On Country (and what happens next)

Here is the part most people miss.

The Stretch Bed is built from recycled plastic that communities collect, galvanised steel, and heavy-duty Australian canvas. The plan was never to truck beds in forever. It is to move the making On Country: collect the plastic, shred it, press it into bed parts, build them locally, and hand the plant to community ownership.

The work happens in community, with community, for community. Goods supports the build and the realising. That is the difference between this and a charity drop-off.

### C5 · Day 15 · "Three ways to be part of it"
**Subject:** If you have read this far, here is how you come in

One piece of work, three ways in:

- **Put a bed in a home.** Sponsor a Stretch Bed from $750. You choose the community, we send a photo of where it landed. [Sponsor a bed](https://www.goodsoncountry.com/sponsor)
- **Move the making to Country.** The containerised plant is about 85% built. The next round closes the gap and starts local jobs. [Back the plant](https://www.goodsoncountry.com/partner)
- **Build it in your community.** Bring the work to your homelands, community-owned. [Start a conversation](https://www.goodsoncountry.com/partner)

No pressure to pick today. I just wanted you to know the door is open.

### C6 · Day 21 · "One bed, one home"
**Subject:** The simplest way to be part of this

A bed is a small thing. Asking what the home needs is the larger one.

If you have been waiting for the right moment, this is a good one: [put a bed in a home](https://www.goodsoncountry.com/sponsor). $750, you choose the community, we send the photo.

And if you would rather just talk it through, reply to this email. A real person reads every one.

Thank you for caring about this.

---

# NURTURE TRACK (5 emails, ~3 weeks)

Softer. Context and belonging, not conversion. For the "I want to learn more" audience.

### N1 · Day 0 · "Welcome. Here is what we are actually doing."
**Subject:** Welcome. This is community-led, and that is the whole point.

Thanks for joining the journey.

Goods on Country makes quality furniture for remote Indigenous communities, starting with the Stretch Bed: a washable, flat-packable bed that replaces a mattress on a concrete floor.

The thing to know first is that this is community-led. The work happens in community, with community, for community. We will show you what that looks like over the next few weeks.

### N2 · Day 4 · "How a bed becomes a trade"
**Subject:** Recycled plastic, two steel poles, and a plan to make it On Country

The Stretch Bed is deliberately simple. Two galvanised steel poles thread through sleeves in heavy-duty canvas. Four legs, pressed from recycled plastic that communities collect, click on. 26kg, holds 200kg, assembles in about five minutes with no tools.

But the bed is not really the point. The point is the making. We are moving production On Country so the plastic, the build, and eventually the plant itself belong to community. Waste into rest. A morning into a trade.

### N3 · Day 9 · "Not a charity drop-off"
**Subject:** Why we don't just hand things out

There is a version of this work that is a truck rolling in, dropping off, and leaving. That is not this.

The design happens in community with the people who will use it. Communities choose where the beds go. The goal is community ownership of the plant and the jobs. Goods supports the build and the realising, then steps back.

It is slower. It is the only version worth doing.

### N4 · Day 14 · "In their own words"
**Subject:** "Most of our people are just on a blanket on the ground"

We try to let community voices carry this, not us.

From an Oonchiumpa worker in Alice Springs: "Most of our people in community are just on a blanket on the ground. These beds will come in handy. Mainly for the old Elders. Getting up and down off the ground is very hard."

That is the need, plainly. Everything we build answers to it.

### N5 · Day 20 · "Where it is going, and how to come closer"
**Subject:** 400+ beds so far. Here is how to stay close, or step in.

Since 2023, more than 400 Stretch Beds have gone into homes across the country. The last Utopia trip added 107.

If you want to keep following the build, you already are: I will keep sending the story as it unfolds.

And if at some point you want to do more than watch, the door is open here: [be part of it](https://www.goodsoncountry.com/get-involved). No rush. Glad to have you along.

---

## GHL setup notes (for whoever builds the workflows)

- Two workflows, each triggered by the tag(s) in the table above. The converter workflow triggers on EITHER `goods-src-getinvolved` or `goods-src-fieldnote-utopia`.
- Use the day offsets as wait steps. Tune to taste, but keep the order.
- Set exit/goal conditions: tag `goods-customer` / `goods-partner-inquiry` or unsubscribe ends the sequence.
- Personalise the from-name to a real person. Keep plain-text feel even if sent as HTML.
- Hyperlinks above use the production domain `www.goodsoncountry.com`.
- If you would rather run these as code (via `src/lib/email/send.ts` + a cron) instead of GHL workflows, the copy ports directly into template functions. GHL is the lower-maintenance path and matches the Smart Router architecture.
