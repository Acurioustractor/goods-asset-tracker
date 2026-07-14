# Goods storyteller triage (2026-06-03)

Read-only audit of every Goods storyteller across Empathy Ledger + the local Goods data (3-agent workflow). Routes each to a fix or escalation. Owner: **Ben** = consent/portrait decisions (human-only), **build** = code/data wiring, **EL curator** = EL-side records.

**Counts:** 46 storytellers · 5 cleared+complete · 8 pending-consent · 4 no-portrait · 17 no-profile · 6 EL-only · 2 local-only.

## Top actions (highest leverage)

1. Flip EL publish/syndication for Mykel (verbal consent 2026-06-02 + live blog) and add his local portrait + storytellerProfile + 'rocking up every day' quote — highest-value single voice currently stranded between EL and Goods
2. Run one Ben consent pass on the Utopia trip voices (Karen Liddle, Katrina Bloomfield, Dorrie Jones, Frankie Holmes OAM, Casey Holmes OAM, Charley) then unset published:false/unlisted on the trip story — unlocks 6 pending voices at once
3. Source portraits + add storytellerProfiles for the 4 cleared-but-incomplete voices (Dr Boe Remenyi, Kristy Bloomfield, Xavier, Joey) — Joey already has a portrait at images/process/joey-portrait.jpg, just needs profile + quote + avatarUrl
4. Fix curated-quotes.ts double-space/spelling keys (Alfred  Johnson, Carmelita &  Colette, Daniel  Patrick Noble, Shayne vs Shane Bloomfield) so quotes map to profiles — cheap data hygiene unblocking several cards
5. Backfill storytellerProfiles + /images/people portraits for the ~13 quote-only EL-active voices (Risilda, Annie Morrison, Melissa Jackson, Jimmy Frank, Jason, Walter, Chloe, Tracy, Gloria, Wayne Glenn, Mark, Gary, Daniel Patrick Noble) — they are EL-cleared and just missing the local profile layer
6. Resolve EL needs_content records (Patricia Frank, Clive - CEO Bega) by authoring a story + pulling a quote, then flip status=active
7. Confirm exclusions: keep Ben Knight, Nic/Nicholas Marchesi, Accounts ACT, ACT Production Team filtered from the public grid; keep Georgina Byron AM as a funder testimonial not a community storyteller

## Ben — consent + portraits (11)

| Storyteller | Status | Action |
|---|---|---|
| Mykel | Pending consent | EL: flip syndication_enabled + status=published; Ben: capture portrait decision; build: add storytellerProfile + portrait + curated quote ('rocking up every day') |
| Dr Boe Remenyi | No portrait | Ben: source portrait; build: add storytellerProfile + portrait; EL curator: create EL storyteller record |
| Kristy Bloomfield | No portrait | Ben: source portrait; build: add storytellerProfile + portrait; EL curator: create EL storyteller record |
| Xavier | No portrait | Ben: confirm consent + capture portrait; build: add storytellerProfile + curated quote once cleared |
| Joey | Needs quote | Ben: confirm consent + capture a quote; build: add storytellerProfile, set avatarUrl=images/process/joey-portrait.jpg |
| Karen Liddle | Pending consent | Ben: confirm consent; EL: flip publish + portrait via participant:karen; build: unset published:false on trip story |
| Katrina Bloomfield | Pending consent | Ben: confirm consent; EL curator: create EL storyteller record + portrait; build: add profile once cleared |
| Dorrie Jones | Pending consent | Ben: confirm consent; EL: flip publish; build: add curated quote ('comfy... easy to put together') + profile once cleared |
| Frankie Holmes OAM | Pending consent | Ben: secure Elder consent; EL: flip publish via participant:frankie-holmes; build: add profile once cleared |
| Casey Holmes OAM | Pending consent | Ben: secure Elder consent + capture a quote; EL: flip publish via participant:casey-holmes; build: add profile |
| Charley | Pending consent | Ben: confirm consent; EL: flip publish via participant:charley; build: add profile once cleared |

## Build — data + profiles (29)

| Storyteller | Status | Action |
|---|---|---|
| Dianne Stokes | Cleared + complete | No action; keep published |
| Norman Frank | Cleared + complete | No action; keep published |
| Linda Turner | Cleared + complete | No action; keep published |
| Alfred Johnson | Cleared + complete | Fix double-space key in curated-quotes.ts so quote maps to profile |
| Cliff Plummer | Cleared + complete | No action; keep published |
| Brian Russell | Cleared + complete | No action; keep published |
| Risilda Hogan | No profile | Add storytellerProfile + portrait images/people/risilda-hogan.jpg; set avatarUrl |
| Annie Morrison | No profile | Add storytellerProfile + portrait images/people/annie-morrison.jpg; set avatarUrl |
| Melissa Jackson | No profile | Add storytellerProfile + portrait images/people/melissa-jackson.jpg; set avatarUrl |
| Jimmy Frank | No profile | Add storytellerProfile + portrait images/people/jimmy-frank.jpg; set avatarUrl |
| Daniel Patrick Noble | No profile | Fix double-space key; add storytellerProfile + portrait images/people/daniel-patrick-noble.jpg |
| Carmelita & Colette | No profile | Add joint storytellerProfile + portrait; normalise key spacing |
| Jason | No profile | Add storytellerProfile + portrait images/people/jason.jpg; set avatarUrl |
| Shane Bloomfield | No profile | Reconcile Shane vs Shayne spelling; add storytellerProfile + portrait |
| Fred Campbell | No profile | Confirm Fred Campbell == trip 'Fred'; add storytellerProfile + portrait; replace EL screenshot portrait |
| Walter | No profile | Add storytellerProfile + portrait images/people/walter.jpg; set avatarUrl |
| Chloe | No profile | Add storytellerProfile + portrait images/people/chloe.jpg; set avatarUrl |
| Tracy McCartney | No profile | Add storytellerProfile + portrait images/people/tracy-mccartney.jpg; set avatarUrl |
| Gloria | No profile | Add storytellerProfile (Elder) + portrait images/people/gloria.jpg; set avatarUrl |
| Wayne Glenn | No profile | Add storytellerProfile + portrait images/people/wayne-glenn.jpg; set avatarUrl |
| Mark | No profile | Add storytellerProfile + portrait images/people/mark.jpg; set avatarUrl |
| Gary | No profile | Add storytellerProfile + portrait images/people/gary.jpg; set avatarUrl |
| Nicholas Marchesi | EL-only (not on Goods) | Keep filtered; no public profile |
| Ben Knight | Local-only (not in EL) | Keep filtered; no public profile |
| Nic Marchesi | EL-only (not on Goods) | Keep filtered from public grid; no action |
| Kylie Bloomfield | No profile | Create EL storyteller record + pull quote; build: add storytellerProfile + portrait |
| Shayne Bloomfield | No profile | Reconcile/merge Shayne==Shane; add single storytellerProfile + portrait |
| Georgina Byron AM | Local-only (not in EL) | Keep as funder testimonial; exclude from community storyteller grid |
| Heather Mundo | No profile | Create EL storyteller record + pull quote; build: add storytellerProfile + portrait |

## EL curator — EL-side records (6)

| Storyteller | Status | Action |
|---|---|---|
| Ivy | Needs quote | Pull a quote from EL transcripts into curated-quotes.ts for Ivy |
| Patricia Frank | No profile | EL: author a story so quotes have a home; then flip status=active |
| Ana - Bega | EL-only (not on Goods) | Pull EL quote into curated-quotes.ts + add storytellerProfile, or confirm exclude as partner-org staff |
| Clive - CEO Bega | No profile | EL: author story + pull a quote; then decide if Bega CEO belongs on public grid |
| Accounts ACT | EL-only (not on Goods) | Exclude from public grid; leave EL record as system account |
| ACT Production Team | EL-only (not on Goods) | Exclude from public grid; do not syndicate aggregate |

## Cleared + flowing today

Dianne Stokes, Norman Frank, Linda Turner, Alfred Johnson, Cliff Plummer, Brian Russell
