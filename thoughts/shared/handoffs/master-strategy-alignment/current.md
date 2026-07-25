# Master strategy alignment — handoff

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume. Keep it short. -->
**Updated:** 2026-07-25. Full-day strategy alignment. **16 questions, 14 rulings + 1 direction, all in `/DECISIONS.md`** (new, append-only, root of repo). **PR #159 open and mergeable against main** (corrections; hermetic CI green in 42s). Feature branch `claude/investment-deck-alignment-y3qc43` at `d28c501`, clean.

**▶ READ `/DECISIONS.md` FIRST. It supersedes prose in `CONTEXT.md`, the canonical map, and this ledger's predecessors.**

**▶ Matt's six model inputs are now PREPPED, not open-ended:
`wiki/outputs/2026-07-25-matt-model-inputs-session-pack.md`.** Five carry a recommended position
ready to confirm. Item 4 (capital stack) is blocked on the CRM rebuild and on Jay. **Item 5, the
honest denominator, is COMPUTED for the first time: bare production block $79,333/yr, $129,333 with
a half-time line supervisor**, against the DEWR lines split production-vs-program. A seventh item
(modules, not build paths) is proposed there. Take the pack to the session, not the old §7 list.

---

## The one-paragraph version

The figures problem was solved structurally on 2026-07-24 (canon in code, guards in CI). This
session found that **the strategy had no equivalent**, and the damage was proportional: five
competing narrative spines live at once, a north star whose object contradicted the operating
model, a handover threshold divided by a rent line, a trading name registered to the wrong
entity, and a QBE must-win marked DONE that was not done. **Three of the four corrections in
PR #159 were found by opening an external register or a set of board minutes, not a file in
this repo.** Prose has no drift check. That is the whole diagnosis.

## The rulings, in one line each

Full text, reasoning and sweep lists in `/DECISIONS.md`.

| | Ruling |
|---|---|
| A | "Our job is to become unnecessary" is retired. Weak. |
| B/E | North star: **"The goal was never a bigger Goods. It is a community that can collect the plastic, make the goods, and come to own the making."** |
| C | **The spine is the road.** The model is what the road produces and arrives near the end. Voices lead each stop. Supersedes all five prior narrative spines. |
| D | The object is **infrastructure**, not "a plant". |
| F | **Seven stops and the gap.** Kalgoorlie (Gloria) · Tennant Creek, who gets asked · the machine with a name (Dianne) · Palm Island (Alfred), money enters · Utopia, arrival is not the ending · Maningrida and the farm (Fred on Xavier), economics land · Oonchiumpa · the gap. **Money never gets its own section again.** |
| G/H | The carve-out is **NOT accountant-signed**. Keep $713,827, correct the word. **Supersedes the 2026-07-24 ruling** that said cite $741,111 instead. |
| I | **"75 to 100 beds a year" is retired as a public claim.** It divided $329/bed into a rent line. Internal estimate only. |
| J | Butterfly is **executing, not blocking**. AGM 14 Sep. Two Aboriginal directors already registered. Chair will be an Aboriginal director (Ben's read: Kristy Bloomfield). **51% decoupled from the AGM.** |
| K | **"Goods on Country" is the charity.** Goods. is the maker and seller. Verified on ABN Lookup. |
| L | One SIH message from Ben and Nic jointly, first half of August. Raises everything. |
| M | SEFA live but stalled. **Jay first.** The "three signed LOIs" gate had no source and is struck. |
| DIRECTION | The 51% answer to test: **the community entity sells, Goods. supplies it.** NOT a decision. Oonchiumpa has not been asked. |

## The distinction that must not blur

**Aboriginal directors on the charity is NOT 51% First Nations ownership of the entity that
sells.** Supply Nation, IPP, IBA and First Australians Capital all test the supplier. If that
ever reaches a funder document as though the charity's board satisfies the ownership test, it
ends the relationship. Written into `wiki/canon/qbe-readiness.md` by PR #159.

## Findings logged, not yet ruled on

Full list in `/DECISIONS.md`. The three that matter most:

1. **GHL has no Transfer stage.** The `Goods — Community Pathways` pipeline (created 2026-07-24)
   runs Delivery → Operating → Review. `pathway-stages.ts` closed exactly this gap on 2026-07-25
   and the fix never reached the CRM. Sixth stage model, live, in the tool the team uses.
2. **The live asks do not match the published stack.** **Rebuilt from all 67 rows** (the first-50
   read was wrong twice: SEFA IS in the CRM at Cultivating $300K, and Centrecorp's forward $75K ask
   exists alongside the historical $123,332). 0 rows at Committed, so canon's `signed-lois: 0` is
   right. **Ask made $607.5K** excl. the Oonchiumpa-led REAL $2M (Minderoo $200K, Tim Fairfax $150K,
   Snow $100K, Rotary Eclub $82.5K, Centrecorp $75K). **Repayable column $710K** (SEFA $300K, White
   Box SELF $250K, LendForGood $100K, Metro Finance $60K). Either alone clears the $400K match twice
   over: **short of paper, not of candidates.** Also live and in no document: **First Nations
   Finance, "no ownership gate"**. Detail: session pack §4.
3. **Four things in the meaning layer have no home in code or the deck:** the binary month-6
   ownership test (4 checkpoints, partial counts as NO, "not yet met at any site"); the seven
   proven community-transfer models (Notion §3); "one product, four systems"; and data
   sovereignty counted as an impact metric rather than a gate.

## The next session: Matt's six model inputs

**Worked in full at `wiki/outputs/2026-07-25-matt-model-inputs-session-pack.md`.** What follows is
the original framing; the pack carries the recommended position, the computed denominator and the
seventh item.

**The three things the pack settled or moved:**

- **The honest denominator exists now.** DEWR's bare facility ~$152K split production-vs-program
  gives a **bare production block of $79,333/yr**, and **$129,333** once a half-time line supervisor
  is paid. Break-even 234 to 529 beds/yr. $24,000 understated it (bed sales carried only rent);
  $151,666 overstates it (bed sales carry the program). Both were wrong, in opposite directions.
- **The contribution figure being divided into was the wrong location.** Every published break-even
  divides into $329.26, the community path at the **Sydney** location ($0 inbound freight). On
  Country containerised is **$339.26**; On Country not containerised is **$269.26**.
- **The useful output is a sensitivity, not a payback figure.** At 500 beds/yr, containerised, with a
  half-time supervisor the scenario clears ~$40,297/yr and retires a ~$105K plant in 2.6 years, but
  each of three dials flips it on its own: 250/yr and it cannot cover its own production block, not
  containerised and 2.6 years becomes 19.8, full-time supervisor and it never retires. So the claim
  is only that **Route B (earn-in) is no longer arithmetically dead**, which makes it a thing to
  explore rather than rule out. No bed number and no payback period goes in front of anyone until
  input 6 is measured.

**▶ Frame, per Ben 2026-07-25:** these are **estimates for scenario study, not actuals**. The model
does not lead. It sits in the conversation and the relationship, not as cut-through numbers. With an
investor it arrives after the road and shows we know where our own uncertainty is. With a community
the numbers go in as the questions they came from, and the answers belong to the community. The pack
has a "Where the model sits in a conversation" section that says what is never said in either room.

Original source: `wiki/outputs/2026-07-23-goc-financial-model-pack/assumptions-alignment.md`, §7.

1. **HDPE per-bed mass and rate.** 20kg @ $2.75 (invoice-verified, Defy INV-1731) vs the GoC Q&A's
   "25kg at $1-2/kg". `cost-story.ts` carries this as a live `conflict` row. **It is the input to
   the 3,540kg plastic claim**, so the two have to agree.
2. **Site capex.** Adopt sunk ~$75K / replication ~$105K, retire $30K and $100-150K. Note the
   unreconciled second conflict: `cost-story.ts:248` says **$110,046** already invested, the MVF
   reconciliation says **~$75K**.
3. **Capital ask.** Quote gross $112-222K with sunk as evidence, not netted off. Never "$90-200K".
4. **Capital stack split** and the QBE match ratio. Now also needs rebuilding against the live CRM
   (see finding 2 above).
5. **Community-facility block.** Bare ~$152K / staffed ~$342K / program $300K as three cost centres.
   **Ruling I made this bigger:** the engine's $24K "site bill" is `rentPerYear`
   (`cost-model-scenarios.ts:159`), so there is no real community operating block anywhere, and the
   honest denominator (what bed sales alone should carry) has never been computed. Two-pots says
   most of the $152K is wraparound and must not touch per-bed economics.
6. **Maningrida run actuals.** Were time, diesel and plastic yield captured on the 40-bed run? If
   not, a short measured run converts $425.74 from modelled to measured. **The process is already
   proven; never write "zero beds pressed in-house".**

Also unresolved and feeding the same model: **sustained per-site rate** is 250 / 500 / 1,250 /
1,500 across four sources; Matt uses 500 as a conservative planning figure.

**And the structural one that ruling D created:** `engine.ts` has three build paths (buy-kit,
factory, community) and all three assume a whole site. Utopia wants a shredder, Tennant Creek
wants to work through an existing shed, Palm Island starts with governance. **The cost model
cannot price three of the four live pathways.**

## Open, with owners

| Item | Owner | By |
|---|---|---|
| Merge PR #159 | Ben | explicit word needed |
| Notion business plan sweep (3 corrected claims live on the page being sent) | Ben to authorise | before the next send |
| Who signs the accountant letter, what artifact, by when | Ben | before match paper moves |
| Chair and Secretary; conflicts register if Kristy chairs | Ben + Nic | 3 Aug board meeting |
| Jay: what does SIH accept as match paper? | Ben | early Aug, before the sends |
| SEFA: ask for intent on letterhead, not a facility agreement | Ben + Nic | by 31 Aug |
| Notice of meeting if the company name changes at the AGM | Zandra / board | ~24 Aug |
| Test the 51% direction with MinterEllison and with Kristy | Ben + Nic | same fortnight as the chair talk |
| What the 1 July Supply Nation threshold cost | Ben | unrecorded anywhere |

## Repo state

- **PR #159** `claude/claims-corrections-2026-07-25` → main. Open, mergeable, hermetic CI green.
  Worktree at `scratchpad/goods-fix`; remove it once merged (`git worktree remove`).
- **Feature branch** `claude/investment-deck-alignment-y3qc43` at `d28c501`, clean, carries
  `DECISIONS.md`. Will conflict trivially on that file once #159 lands; resolve to main's copy.
- **Branch plan, moves 2 and 3, not started.** Ship the safe half (`/brand`, `/pathways`, four
  `/export/*`, admin) once #159 lands. **Hold the four `/pitch/*` routes and the deck rebuild** —
  the deck on that branch is spine 4, which ruling C superseded, and it still carries the old
  north star and the V-chipped figure.
- **`CONTEXT.md` is branch-only, not on main.** So the north-star rewording (`:26`), the retirement
  of the 75-to-100 (`:48`) and the Butterfly date all still need doing there. The washer-sweep
  "NOT YET SWEPT INTO CODE" warning at `:83` is also stale; that sweep landed.

## Method note worth keeping

Every claim this session was traced to a path, a line number, a register lookup or a set of
minutes. Memory was wrong three times and caught each time by reading the source: the twelve
"blessed" deck lines were never blessed (`19-the-whole-picture.md:36` says "Ben to bless"), the
revenue ruling had been reversed, and the Butterfly date had slipped seven weeks without any
document recording it.
