# Send drafts — covering notes + follow-ups (2026-06-28)

> Goods voice: no em dashes, straight quotes, warm and grounded. Personalise the bracketed bits and confirm the contact. Founder sends; these are drafts. After SEFA/Snow/Centrecorp go out, move them in GHL (SEFA Cultivating to Ask made; Snow, Centrecorp Stewarding to Renewing).

---

## 1. SEFA (move: Cultivating to Ask made on send)

The full intro email already exists at `wiki/outputs/funder-reports/sefa/2026-06-27-sefa-intro-email.md`, with the 3-page loan brief beside it. It is ready to send as-is. No new draft needed. On send, run `node v2/scripts/ghl-people-move.mjs "SEFA" "Ask made" --commit`.

---

## 2. Snow Foundation, Round 4 (move: Stewarding to Renewing on send)

**Subject:** Goods on Country, where we're up to and a Round 4 conversation

Hi Sally,

Thank you again for backing this from early on, and for making the trip to Tennant Creek. It mattered to the team and the communities.

A quick update on where we're up to: 496 beds are now in 9 communities, the production side is getting stronger, and we're putting together a blended capital stack to scale, with QBE's Stage 2 sitting alongside repayable finance. Snow has been the anchor that made the rest credible.

I'd love to talk about a Round 4. Two things I'd value your read on: whether Snow can support the next stage, and whether you'd be willing to help validate the blended stack to the other funders, given you've seen the work up close.

Happy to send a short Round 4 note ahead of a call. When suits you?

Warmly,
[Ben]
Goods on Country

---

## 3. Centrecorp Foundation, next round (move: Stewarding to Renewing on send)

**Subject:** Next round of beds for Central Australia

Hi [name],

Thank you for the support so far. The last round put 87 beds into Utopia, and the feedback from community has been the kind you can't manufacture. [Ray Nelson quote, once consent confirmed.]

We're planning the next round of beds for Central Australia and I wanted to come to Centrecorp first, given your Trust is built around exactly this part of the country. I've put together a short brief on what the next round would deliver, the cost per bed, and the communities in line.

Could I send it through and find a time to talk it over?

Thank you,
[Ben]
Goods on Country

*Brief built: `wiki/outputs/funder-reports/centrecorp/2026-06-27-centrecorp-nextround-brief.*`*

---

## 4. The 6 stalled asks, follow-up nudges

> One short follow-up each. If still silent after this, mark lost in GHL so the stage is honest.

**Tim Fairfax Family Foundation** (Queensland, Palm Island fit)
Hi [name], following up gently on [the proposal] from [month]. Since then we've kept delivering, including the Palm Island work, and the production-readiness picture is clearer. No pressure on timing, but if it's useful I can send a short update or jump on a quick call.

**Brian M Davis Charitable Foundation**
Hi [name], a gentle follow-up on [our note] from [month]. Happy to send a short update on where Goods is up to, or to answer anything that would help. If now isn't the right time, just say and I'll check back later in the year.

**The Ian Potter Foundation**
Hi [name], following up on [the proposal] from [month]. I know these take time. We've had good momentum since (496 beds across 9 communities, a blended capital stack forming), so I'm happy to send a short refreshed note if helpful.

**The Bryan Foundation**
Hi [name], a quick follow-up on [our note] from [month]. If it would help I can send a one-page update on the beds and the production work. No pressure on timing at all.

**Rotary Eclub Outback Australia** (washers and beds, remote)
Hi [name], following up on [our request] from [month]. The washers and beds are exactly the remote-community need Rotary knows well, and we'd value your club's support. Happy to send a short update or present to the club if that's useful.

**Rotary Global Grant (washers/beds)**
Hi [name], a follow-up on the Global Grant pathway for the washers and beds. Could we confirm where it sits and what the next step is? Happy to provide whatever paperwork helps move it along.

---

## After sends, the GHL moves
```
node v2/scripts/ghl-people-move.mjs "SEFA" "Ask made" --commit
node v2/scripts/ghl-people-move.mjs "Snow" "Renewing" --commit
node v2/scripts/ghl-people-move.mjs "Centrecorp" "Renewing" --commit
# 6 stalled asks: if no reply after the nudge, --lost each
```
