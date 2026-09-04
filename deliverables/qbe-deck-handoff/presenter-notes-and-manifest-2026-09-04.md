# QBE deck — twelve slides, presenter notes and manifest

Built 4 September 2026. The sequence and the wording of each conclusion come from `deck-plan.ts`;
every figure is read from the guarded modules (`raise-stack.ts`, `bed-ratio.ts`, `community-loop.ts`,
`qbe-story.ts`, `canon.ts`), not typed here.

**This is a draft for a human content pass, not a finished submission.** Ben's instruction on 4 Sep
was to see every slide against its content and strike anything that does not mean something real.
These notes are written so that pass can happen line by line. Slide 1 has already been through it
and carries Ben's ruling; slides 2 to 12 have not.

---

## Where everything is

| What | Path |
|---|---|
| Pencil source | `v2/public/strategy/Goods Final Deck.pen`, new band at y=30000, frames `QBE 01 …` to `QBE 12 …` |
| Slide PNGs, 3840x2160 | `v2/public/strategy/exports/slide-01.png` … `slide-12.png` |
| Deck PDF, 12 pages | `v2/public/strategy/exports/goods-qbe-deck-2026-09-04.pdf` |
| The pre-existing frames, for comparison | `v2/public/strategy/exports/live-01-QiRll.png` … `live-12-o35by.png` |
| Those as a PDF | `v2/public/strategy/exports/goods-qbe-deck-LIVE-frames-2026-09-04.pdf` |
| Drawings, whole figure and body-only | `v2/public/strategy/diagrams/*.png` |
| Render scripts | `deliverables/qbe-deck-handoff/scripts/render-all.sh` |

`v2/public/strategy/` is gitignored (`.gitignore:219`), so the images live on disk only. The render
scripts are the part that belongs in git: they reproduce every drawing from the modules.

```
deliverables/qbe-deck-handoff/scripts/render-all.sh \
  /Users/benknight/Code/goods-story-wt/v2 \
  "/Users/benknight/Code/Goods Asset Register/v2/public/strategy/diagrams"
```

No dev server and no investors gate: `jiti` imports the TypeScript modules directly. Headless Chrome
rasterises at 3x so Playfair Display and Inter match the app.

---

## Frame ids

| Slide | Pencil frame | Export | Existing frame it replaces |
|---|---|---|---|
| 01 Cover | `S1VrCQ` | `slide-01.png` | `QiRll` |
| 02 Problem | `Cduac` | `slide-02.png` | `Yzth3` |
| 03 Road | `L4AgY` | `slide-03.png` | `tWgC6` |
| 04 Buyers | `p7GoP` | `slide-04.png` | `F9P5e` |
| 05 Making | `FF0af` | `slide-05.png` | `mvrUQ` |
| 06 One bed | `J9I3PO` | `slide-06.png` | `mX9er` |
| 07 The loop | `tkDpX` | `slide-07.png` | `JCreO` |
| 08 Evidence | `M3ppb` | `slide-08.png` | `qD5SQ` |
| 09 Governance | `GVjkm` | `slide-09.png` | `LhlJr` |
| 10 Capital | `w3NJ6L` | `slide-10.png` | `Lnlxh` |
| 11 Catalytic | `fs7ub` | `slide-11.png` | none, new |
| 12 Ask | `y61Ux` | `slide-12.png` | `o35by` |

Nothing existing was edited or deleted. `xGh8k` at y=36400 is a build shell, not a slide; it is
labelled "do not present".

---

## Slide 01 — A bed off the ground. *(Ben ruled 4 Sep)*

**On the slide.** The object first. Then what it is, then the proof, then the crux. No dollar figure.

- Eyebrow: GOODS ON COUNTRY
- Headline: A bed off the ground.
- What: Canvas stretched between two recycled-plastic legs. Designed in community. Five minutes to
  put together.
- Proof: 540 beds delivered across eleven communities.
- Crux: The first money buys beds for a community. The community sells them, and the money stays
  there to build the next thing.

**Rules this slide is holding.** Ruling E: never open with a dollar figure; the ask lives on slide 12
only. Open with a person, place or object, never a claim. Our name comes first on our own cover, so
QBE moves to the footer.

**The precision that nearly went wrong.** The recycled-plastic sentence describes the **Stretch Bed
only**. Canon: 540 beds deployed = 177 Stretch + 363 Basket, and the Basket Bed has no recycled-HDPE
legs. Keep the "what it is" sentence and the "540" sentence separate; never let the plastic clause
modify the 540.

**Photograph.** `community/maningrida/whole-run-at-sunset.jpg`. **Lockup.**
`goods-on-country-grounded-mono-ink`, the approved funder lockup.

---

## Slide 02 — Remote communities import the goods and export the value.

**On the slide.** Four sourced figures: 51.3% crowding, 3.1% business ownership, 38.1% employment,
275,190 t to landfill. Conclusion: the current system delivers products, it does little to build
local ownership.

**Notes.** This is the starting point communities described: freight, price, products that fail, no
local repair. Sources are named on the slide; exact report references travel with the application,
not on its face. The enterprise figure is a proxy for the ownership gap and is labelled as one.

**Answers.** Q6. **Photograph.** `community/kalgoorlie/camp-visit.jpg`.

---

## Slide 03 — Delivery was the easy part.

**On the slide.** Three photographs and the seven stops of the road, each with the person and what
that place taught. The statement: eleven communities, two years, nobody owns the making.

**Notes.** Voices lead each stop, because each stop is a person saying something. Money is not a
section: it enters at Palm Island and lands at Maningrida. Two years, never nine.

**Answers.** Q10.

**Deviation to rule on.** Built from `road-spine.ts` (seven stops) rather than the six steps on the
existing frame `tWgC6`. That sidesteps the unresolved spelling of Dr Bo Reményi's name and how to
describe her role, both of which `deck-plan.ts` flags as unfixed. If she returns to the slide, the
spelling and the description need a source first.

---

## Slide 04 — Buyers are already paying.

**On the slide.** 540 beds across eleven communities. The buyers we can name with their status, the
three ways to back the work, and who sells the pool.

**Notes.** Four organisations have bought beds on invoices. Two towns hold more than 200 requests
each, and requests are not orders. These purchases support the buyer case; they do not prove every
proposed pool will sell. Do not add ALIVE's purchase to signed investment: it is revenue and demand
evidence, not a commitment.

**Answers.** Q10, Q14 context, Q19. **Drawing.** `who-buys`.

**Deviation to rule on.** The invoice-level buying story (Mala'la INV-0283 Oct 2025; Centrecorp
INV-0291 Nov 2025; Homeland School Company INV-0303 May 2026; Centrecorp QU-0014 May 2026; ALIVE
INV-0342 Aug 2026) is **not on the slide** — it would not stay legible. It belongs in an appendix,
which is not built. `deck-plan.ts` asks for it on slide 4; this is the one place the build departs
from the plan for legibility.

---

## Slide 05 — The making already works.

**On the slide.** The plant at Witta and build day at Gamardi. $426 against $685, labelled modelled.
The measured run and what it counts.

**Notes.** We pressed and routed components at the farm and young people assembled forty beds with
Homeland School Company. That proves the process. Sustained cost and throughput are not measured.
The next fifty record plastic, power, press time, CNC time, operator hours, scrap and freight. A
higher measured cost changes the model; it does not get hidden. Never say zero beds have been
pressed in-house — forty have.

**Answers.** Q19, Q6.

---

## Slide 06 — One bed, four things, any amount.

**On the slide.** The unit card and the scale table: $150,000 / $250,000 / $400,000 / $750,000.

**Notes.** Every dollar buys beds at $750, so any amount reads the same way, and the flexibility on
the thousand is one table rather than a negotiation. 20kg of HDPE a bed is a design figure, weighed
per batch in the measured run. About 6.5 hours of local work is modelled and only applies to beds
made locally: do not apply it to bought-kit assembly. "Up to $750 that stays local" is gross sales on
a sold bed, not profit, and not income until the rules are agreed.

**Answers.** Q5, Q6, Q7. **Drawing.** `the-unit`.

---

## Slide 07 — One catalyst starts five loops a community controls.

**On the slide.** The catalyst row, one loop shown once and run five times, the return arrow, and the
four gates.

**Notes.** The funder acts once; after that the money goes round inside the community. Five pools of
200 is the working design, not a commitment: no named partner is attached to a priced pool until it
has seen and agreed its role, allocation and sales rules. The four gates are the honest answer to
"when is this real in a place": a named buyer, signed rules, a paid operator and place, and a
measured cost.

**Answers.** Q6, Q8. **Drawing.** `the-loop`.

---

## Slide 08 — Numbers prove scale. Voices prove meaning.

**On the slide.** Four outcomes with how each is counted, four instruments, and the two rules.

**Notes.** The register tracks units and service history. Consented stories explain what the products
mean in daily life. Measure actual hours and roles rather than promising job counts. At month six ask
who holds the keys, who runs payroll, who invoices, and whether half of production is local; partial
counts as no. Scabies and rheumatic heart disease are the reason the hardware matters, never an
outcome we claim.

**Answers.** Q10, Q11. Q12 on the supplied form is missing governance documents, not impact; that
belongs with slide 9 and the application, and the mapping on the website is wrong.

---

## Slide 09 — One home for the work. Local decisions stay local.

**On the slide.** Three layers — the board governs, Goods on Country holds, each community partner
decides — the month-six test, and the entity strip.

**Notes.** Directors of The Butterfly Movement Ltd: Kristy Bloomfield, Audrey Deemal, Jeremy Donovan.
The advisory committee advises and must never be called the board. Community ownership is a pathway,
not a completed claim.

**Answers.** Q1, Q2, Q3, Q4, Q19, Q22.

**Open, and said on the slide.** The applicant footer says "subject to confirmation with Social
Impact Hub" because that is still true. The application needs the complete current director register
across every related entity, which this slide does not carry.

---

## Slide 10 — Three kinds of money, and who has said yes so far.

**On the slide.** Bed money, organisation money, plant money. Every line by name with its status, and
$0 signed today.

**Notes.** Names are appropriate here: Q14 and Q16 ask for them. QBE $400,000 ask made; BMDF $100,000
invited; Snow $100,000 ask made; Minderoo $100,000 ask made; Dusseldorp $50,000 target; ALIVE $92,000
paid, which is demand not capital. TFFF $300,000 over three years is an invitation pointed at the
organisation, and the allocation is not settled. SEFA $300,000 and White Box $150,000 are lender
conversations, not both securable — do not count them twice. An invitation to apply is not a
commitment, and the slide says $0 is signed.

**Answers.** Q14, Q15 context, Q16, Q18.

**Open.** Snow's status conflicts across sources — the funding list says ask made, the catalytic
chain references a letter. Resolve what the letter actually commits to before calling it conditional.

---

## Slide 11 — What the first beds start, and what happens without them.

**On the slide.** The chain, with a condition on every link, and Plan B: 565 beds without QBE.

**Notes.** QBE's beds go in first and give the lenders a measured cost, which is what plant finance
waits on. Without QBE the first pool still starts, because ALIVE has already paid for 100 beds; the
measured run happens about a year later; the plants wait. The 565 figure assumes every other bed line
lands, so it is a scenario, not a funded floor. Debt repayment must be tested after costs, interest
and operating obligations.

**Answers.** Q7, Q18. **Drawing.** `the-chain`.

---

## Slide 12 — Back the first pool.

**On the slide.** $400,000 / 533 beds, $250,000 / 333 beds, $750,000 / 1,000 beds. The crux as the
closing line.

**Notes.** Close on community choice and the next practical step, with the remaining conditions
stated plainly. At $750 the whole-bed values are $399,750 and $249,750; how the $250 residual is
handled is unresolved.

**Answers.** Q5, Q6, Q7, Q18.

**Open and important.** The bed budget does not fund a separate proof block. Q6 asks what the money
does, and the honest answer has to say where measurement, agreements, reporting and operating work
are paid for. Today the deck does not answer that, because it is not decided.

---

## What is not built

- **Appendices.** The buying story with dates and invoice numbers (Appendix A, referenced in slide
  4's footer), the entity-and-money drawing, and the snowball. The drawings for the last two are
  rendered and on disk (`entity-and-money-body.png`, `the-snowball-body.png`); no frames were built
  because the priority changed to reviewing what exists.
- **The calendar drawing is deliberately excluded** from the deck and from the render output. It
  names individuals and internal scheduling; it is a working artifact, not a funder surface. The
  render script skips it by name.

## Corrections applied to the drawings

Two strings in the working variant were internal and would have reached a funder. They are patched in
a temp module at render time, and the patch asserts if either moves:

- "Katie Norman named the resilience of organisations as the reason for the invitation. Recommended:
  the organisation, not beds. Ben has not yet ruled." → "The invitation names the resilience of
  organisations as its reason. It points at the organisation rather than at beds; the allocation is
  not settled."
- "ruling X, 28 Aug" → "28 August 2026".

Worth fixing at source in `qbe-diagrams.ts` so the patch can be deleted.

## Unresolved, needing a person

1. **Applicant.** Butterfly as applicant and recipient is not confirmed with Social Impact Hub.
   Slide 9 says so on its face.
2. **Who pays for proof and operations.** The bed budget buys beds. Q6 needs an answer for
   measurement, agreements, reporting and operating cost.
3. **Snow.** Ask made, or a letter in hand, and what it commits to.
4. **TFFF allocation.** $300,000 over three years, invited, pointed at the organisation. First-year
   availability and purpose not settled.
5. **The first pool.** Which community, which operator, and the agreed stock and sales rules. Nobody
   has been promised 200 beds.
6. **The $250 residual** at both ask amounts.
7. **Dr Bo Reményi** — spelling as the registry has it and how to describe her role, if she returns
   to slide 3.
8. **Complete director register** across all related entities, for Q4.
9. **Q13**, legal and regulatory proceedings — an authorised factual declaration, not inferable.

None of these were invented or filled in. Where a slide touches one, it says what is true today.

## Known defects in the pre-existing frames

Worth knowing while comparing the two sets:

- `live-06-mX9er` has an overlapping title: the headline collides with the line beneath it.
- Several frames in the y=0 run reference photographs at `/tmp/goods-slide-*.jpg` that no longer
  exist, so those image fills are dead.
- The document holds roughly seven stacked duplicates of the same slide row at identical coordinates,
  plus a second unrelated deck (LGANT, Darwin 22 Sep). Neither was touched.

## Building in this Pencil document

Freshly `Insert`ed nodes do not paint in this environment after the first batch of a session. Two
methods do work and were used throughout:

- `Copy` a frame that already renders, replacing its content subtree in the same `Copy` call.
- `Update` an existing node, and `Replace` a node with a whole new subtree.

`Export` is the truth for verification, not `TakeScreenshot`, which returns a stale view. Image fills
are cached by path, so a re-rendered PNG needs a new filename before Pencil will pick it up.

## The Pencil file is not saved

There is no save from the MCP and the app cannot be focused from this session. **Ben needs to press
Cmd+S in Pencil** to persist the new frames. The PNG and PDF exports are already on disk and do not
depend on that.
