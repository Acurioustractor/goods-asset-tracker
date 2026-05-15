# Canberra Airport Reconciliation Week — Goods Installation Brief

**Date:** 26 May – 2 June 2026 (Reconciliation Week + Parliament sitting week)
**Venue:** Canberra Airport, location TBC with CAG
**Artefacts on display:** 2 Stretch Beds (already in Canberra) + companion graphic board
**Optional addition:** 1 example washing machine if logistics allow
**Designed by:** Capital Airport Group design team
**Companion landing page:** `goodsoncountry.com/canberra` (live)
**QR target on the board:** `goodsoncountry.com/canberra`

---

## Brand essentials for the board

### Palette (use these exact hex values)

| Role | Name | Hex |
|---|---|---|
| Background | Cream | `#FDF8F3` |
| Headline / body type | Charcoal | `#2E2E2E` |
| Accent / CTA / divider | Rust | `#C45C3E` |
| Secondary accent / stat-strip background | Sage | `#8B9D77` |

Source of truth: `v2/src/lib/data/content.ts` mediaPack.brandColors.

### Typography

- **Display:** Georgia (or a close serif equivalent — Caslon, Lyon Text, Source Serif). Bold weight. Used for the headline and statistic numbers.
- **Body:** A clean grotesque. Helvetica Neue, Inter, or system sans. Regular for body, semibold for short labels.
- **No script fonts. No condensed display faces. No drop shadows.**

### Voice rules

- **Tone:** Earned, grounded, warm. Mirror how Indigenous community members talk about their work, not how charities talk about giving.
- **Capitalise "On-Country" and "On Country"** — Country is a proper noun.
- **Never use em dashes** (`—`). Use colons, periods, or parentheses.
- **Avoid:** "charity", "help them", "give back", "less fortunate", "Indigenous Australians" (use "First Nations" / specific Nation names / "communities").
- **Lead with object and place,** not pitch or pity.

---

## Board content

### Headline (display)

> **Made by community.**
> **Made for community.**

(Set both lines flush left, Georgia bold, charcoal on cream. Sized to be readable from 3m back.)

### Subhead (1 line, body weight)

> Beds, washing machines, and a manufacturing model that stays with the communities it serves.

### Hero image

Big — at least 60% of the board area. One photograph, not a collage.

- **Primary:** Washing machine on red dirt, Country in frame. Nic's shared shot:
  https://photos.google.com/u/2/share/AF1QipMdyno_o9__XZDox8U2n22FKzYhXJgMHzUDH9M2txRez4sIOJmtIcekBH6cOLUbRQ
- **Fallback:** Any single high-resolution image showing object + place + skin. Avoid stock photography, group shots that look posed, and anything backlit/airport-coloured.

### Caption under the image (small, italic optional)

> Pakkimjalki Kari · named in Warumungu by Elder Dianne Stokes · Tennant Creek, 2025.

### Statistics strip

Four numbers in a row, equal weight, big numerals. Pulled live from the asset register at the time of print:

- **520+** beds across Australia
- **28** washing machines deployed
- **8** communities
- **20kg** of plastic diverted per bed

(Confirm exact numbers with Ben the week of print — these tick up.)

### QR block

Right-aligned on the board, ~15% of the area. Inside the QR block:

- The QR itself, charcoal modules on cream
- Above the QR, in caps tracking 0.2em: **Scan to follow one bed.**
- Below the QR, one line: `goodsoncountry.com/canberra`

The landing page is purpose-built — it picks a random deployed bed and invites the viewer to follow it from "recycled plastic" to "remote home". Tagged for follow-up under `canberra-airport-2026`.

### Community list (foot of board, single line)

> Tennant Creek · Palm Island · Maningrida · Utopia Homelands · Mutitjulu · Alice Springs · Darwin · Mount Isa · Kalgoorlie

### Partner lockup (bottom strip, charcoal background, cream text)

Logos, left to right:
**Goods on Country · A Curious Tractor · The Snow Foundation · Capital Airport Group**

Followed by, in small caps tracking 0.25em:
> Reconciliation Week · Canberra Airport · May 2026

---

## Production notes

- **Material:** Matte board (CAG suggested "sturdier than a banner"). Avoid gloss — airport overhead lighting is harsh and will reflect.
- **Sizing:** Whatever fits CAG's standard install footprint. Design should hold up at A2 (60 × 42cm) up to 1.2m × 1.6m. Keep the QR no smaller than 12cm × 12cm at the smallest size.
- **Bleed / safe zone:** 5mm bleed, 10mm safe zone inside trim.
- **Print spec:** 300dpi, CMYK, embedded fonts. PDF/X-1a or PDF/X-4 for press.
- **One side only.** No back-side content.

---

## On the washing machine question

Sally asked: real machine, example, photos, or banner?

**Recommendation:** lead with the **photograph on the board** as the primary answer. It's the lowest-risk option, requires no logistics, and the bed is the physical artefact people can sit on.

**Upside option:** if CAG can warehouse a single example unit during the install week, ship one Speed Queen prototype (unplumbed display only). This gives the installation two physical objects to ground the story. Decision needed by ~21 May to allow freight time.

---

## What's live and ready

- **`goodsoncountry.com/canberra`** — companion landing page, mobile-first, brand-aligned. Picks a random deployed bed, invites the visitor to "follow one bed", captures email/SMS for follow-up tagged `canberra-airport-2026`.
- The page renders on cream with the same Georgia/charcoal/rust system the board should use, so the scan-to-screen transition feels continuous.
- All form submissions go through the existing `/api/contact` + `/api/newsletter` pipeline, which already feeds into GHL for follow-up.

---

## Open decisions for Sally + Ben + Nic

1. **Confirm dates** with CAG (board install + remove, beds delivery, machine if shipping)
2. **Confirm sign-off chain** (Ben + Nic for Goods, Snow for funding partner, CAG for venue)
3. **Photograph approval** — Ben to confirm Nic's shared shot is the strongest, or pull an alternative from the Goods media library
4. **Final headline** — lock "Made by community. Made for community." or substitute. Brief currently anchors on it.
5. **Live stat numbers** — Ben to refresh the exact counts the week of print (script: query `assets` table grouped by product/status)
6. **Reconciliation Week messaging guardrails** — light-touch acknowledgement, not centred on RW. The installation can mark the week without being a Reconciliation Week piece per se.
