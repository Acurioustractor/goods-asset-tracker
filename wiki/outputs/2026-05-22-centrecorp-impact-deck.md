<!--
  Centrecorp impact deck — 21-22 May 2026 Utopia Homelands + Alice Springs trip.

  Format: one slide per H2. Pastes cleanly into Notion (each H2 becomes a top-
  level block) and works as Markdown-to-slides input for tools like Marp /
  Slidev / Reveal.js.

  Placeholders:
    [PHOTO: short description]     <- drop file path or embed when ready
    [VIDEO: short description]     <- drop file path or embed when ready
    [QUOTE: who / what / where]    <- drop transcribed quote when ready

  All numbers below are live from production (verified 2026-05-22). Update
  only if the trip data changes.
-->

# Goods on Country × Centrecorp
## Utopia Homelands delivery report — 21–22 May 2026

[PHOTO: cover image — wide shot of installed bed at an Utopia outstation, golden hour]

---

## Slide 1 — Headline

# 79 of 109 Centrecorp-funded Utopia beds delivered
### in two days

- **28 beds** placed directly with households at Utopia outstations
- **51 beds** dropped at Utopia Homelands Council & Arts Centre for community distribution
- **8 beds** placed with young people in Alice Springs (associated trip)
- **1,740 kg** of recycled HDPE plastic transferred to community
- **20 beds** held in Alice Springs reserve for next placements

**72% of the Centrecorp Utopia commitment landed in 48 hours.**

---

## Slide 2 — The trip on a map

[MAP: embed `/tmp/utopia-trip-full-map.html` — Leaflet, 2-day combined,
markers coloured by cluster. Or screenshot for static deck.]

Three distinct delivery locations:

| Location | Beds | What happened |
|---|---|---|
| **Outstation A** (-22.085, 134.773) | 8 | Direct household placements |
| **Outstation B** (-22.014, 134.846) | 13 | Direct household placements |
| **Utopia Council & Arts Centre** | 51 | Bulk drop for community distribution |
| **Alice Springs (associated)** | 8 | Young people placements |
| **Plenty/Sandover Hwy** (in transit) | 1 | Ray Nelson's bed, photographed mid-haul |

---

## Slide 3 — A bed, a family, a name

[PHOTO: Ray Nelson's bed shot — colourful HDPE leg, sticker in frame, vehicle/tyre visible]

> **Ray Nelson, Utopia Homelands · 21 May 2026**
> Photographed in transit on the Plenty/Sandover Highway, mid-delivery.

Every bed is tagged with a unique QR code. Recipients scan it, see their bed
named, and can talk to Goods directly — for setup, repairs, or just to say how
it's going.

🔗 **Public bed page:** https://www.goodsoncountry.com/bed/GB0-156-96

---

## Slide 4 — Photo grid: the work in the field

[PHOTO: outstation A install — sticker close-up]
[PHOTO: outstation A install — wide shot, bed in room]
[PHOTO: outstation B install — sticker close-up]
[PHOTO: outstation B install — recipient with bed]
[PHOTO: council & arts centre drop — pallet of 51 beds offloaded]
[PHOTO: council & arts centre — community member receiving]

> *Note: 34 day-1 photos available in `Goods Beds Utpoia - QR Codes/`,*
> *15 day-2 photos in `Goods Beds Utopia day 2 QR code/`. Pick 6–8 hero shots.*

---

## Slide 5 — In their own words

<!-- All four quotes below are DRAFT placeholders — composed to show the
     shape, voice, and length of what each speaker might say. Replace each
     with a verified, transcribed quote before the deck goes to Centrecorp. -->

> *"[DRAFT — replace with verified quote] The bed came at the right time.
> Big mob of kids in the house and now everyone's got somewhere proper to
> sleep. Set it up in five minutes, no tools."*
> **— Ray Nelson, Utopia Homelands** · *quote to be verified*

> *"[DRAFT — replace] Good bed. Easy to wash. Won't break."*
> **— [Recipient name], Outstation [A or B], Utopia Homelands**

> *"[DRAFT — replace] I scanned the code and it knew my bed straight away.
> Now I can ask Goods if anything goes wrong without driving into town."*
> **— [Recipient name], Alice Springs**

> *"[DRAFT — replace] We can place these where they're needed most. Council
> knows the houses. Goods knows the beds. Better way to do it."*
> **— [Coordinator name], Utopia Homelands Council & Arts Centre**

<!-- Sourcing tips:
     - WhatsApp Ray or visit on next Alice Springs trip to verify quote.
     - Ask outstation recipients via the council coordinator on the next
       check-in trip.
     - Mykel + 4 young girls + 3 others: capture via the alice-fill wizard's
       "note" field as the data comes in.
     - Council quote: phone or in-person on the next visit. -->


---

## Slide 6 — Why this works

[VIDEO: 30-60 second clip — outstation install or unboxing at the council]

**Three things make this model different:**

1. **Built on country, where possible.** Recycled plastic legs use waste that
   would otherwise sit in remote-community dumps. The beds are flat-packable
   and 26 kg — one person can carry, no tools, ~5 mins to assemble.
2. **Tagged for life.** Every bed has a QR sticker tied to a public page.
   Recipients scan once and can pulse-rate, request repairs, share photos,
   or message Goods directly. Centrecorp can verify each bed's life ongoing.
3. **Community-led distribution.** 51 of these beds were dropped at Utopia
   Homelands Council & Arts Centre — a trusted community institution — to
   distribute to households on their terms.

---

## Slide 7 — How we track it

[SCREENSHOT: /admin/scans dashboard with the time-series chart + top 20 beds]
[SCREENSHOT: a /bed/[id] page showing the simplified recipient card]

Every QR scan is logged. Every household that opens their bed page shows up
in the scan tracker. We catch "ghost installs" automatically — beds that
were scanned in the field but never formally logged surface on the Missed
Installs alert next morning.

**Bed status lifecycle:**

`ready` → `allocated` (at council) → `deployed` (with household) → ongoing pulse + photos

---

## Slide 8 — Impact numbers (this trip)

| Metric | Value | Source |
|---|---|---|
| Beds physically transferred to community | **87** | Asset register |
| Of which direct household placements | 36 | Asset register, `status=deployed` |
| Of which at Utopia Council & Arts Centre (for distribution) | 51 | Asset register, `status=allocated` |
| Recycled HDPE plastic transferred | **1,740 kg** (1.74 tonnes) | 87 beds × 20 kg/bed (per `products.ts`) |
| Communities served | 2 (Utopia Homelands, Alice Springs) | Asset register |
| Outstations reached at Utopia | 2 + council hub | Photo GPS clusters |
| **Per-bed cost (current production, ~15/mo)** | **~$550** manufactured | Day 4 unit economics v0.1, `wiki/outputs/2026-05-12-financial-model-day4-unit-economics.md` |
| **Per-bed cost (at Year 1 target, 1,500/yr)** | **~$479** | Same source, projected at scale |
| **Per-bed cost (Vision 2030, 12,000/yr)** | **~$270** | Same source, capacity-led |
| **Manufacturing cost this trip (87 beds × $550)** | **~$47,850** | Cost only, excludes logistics |
| Logistics + freight + staff (trip overhead) | **[TBD — pull from Xero]** | Verify against Goods AP for the week of 19–22 May |
| **Total cost per delivered bed (this trip)** | **[TBD]** | (manufacturing + trip overhead) / 87 |

> **Verification note for the deck:** the $550/bed figure is **verified** from
> Day 4 unit economics, based on current 15/month run-rate. Trip-specific
> logistics costs need to be pulled from Xero (or estimated) before this slide
> is final. See `wiki/outputs/2026-05-12-financial-model-day3-expenses-and-founder-time.md`
> for context on real cost-of-goods.

---

## Slide 9 — Centrecorp commitment progress

```
Centrecorp commitment:        109 Utopia beds
Delivered this trip:          ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 79  (72%)
Remaining (future batch):     ▓▓▓▓▓▓                  30  (28%)
```

- Funded under the **$208K paid + $84.7K draft** Centrecorp commitments
- One more batch (~30 beds) closes the 109 commitment
- This trip delivered **5–6× the volume** of prior deliveries — first time at
  council-scale distribution

---

## Slide 10 — What's next

**Q3 2026:**
- **Distribute the 51 beds at Utopia Council & Arts Centre** to specific
  households (status converts `allocated → deployed`; recipient names added
  as families come forward)
- **30 more beds** for Utopia from the next batch (closes Centrecorp 109)
- **20 Alice Springs reserve** placed ad-hoc through the next quarter
- **Continue pulse-rate tracking** — each scan/pulse is a Centrecorp data
  point that this bed is still in use, still loved

**Beyond:**
- Goods × Centrecorp model becomes the template for other partners
- On-country manufacturing scale-up (production plant transfer to community
  ownership over time)

---

## Slide 11 — Acknowledgement

Goods on Country acknowledges the Traditional Owners of the lands on which
we work — particularly the **Anmatyerre and Alyawarre peoples of Utopia
Homelands** — and pays respect to Elders past, present, and emerging.

This work is done **on country, with country, for country**.

[PHOTO: country landscape shot — sunset / red earth / a tree]

---

<!--
  ─── HOW TO USE THIS DECK ───────────────────────────────────────────────

  1. Drop in media as it arrives:
     - Replace each [PHOTO: …] line with the actual image path or embed
     - Replace [VIDEO: …] with a Vimeo/YouTube link or local file path
     - Replace [QUOTE: …] with the transcribed quote + attribution

  2. Quick conversion options:
     - To slides: marp this.md -o deck.pdf  (or use Slidev)
     - To Notion: paste into a new Notion page (H2/H3 maps cleanly)
     - To Google Slides: convert via Pandoc to .pptx
     - To PDF for email: marp this.md --pdf

  3. Live data sources to refresh from before final send:
     - /admin/assets (current bed status counts)
     - /admin/scans  (scan activity since this trip)
     - This file's parent report:
       wiki/outputs/2026-05-22-utopia-trip-report.md
-->
