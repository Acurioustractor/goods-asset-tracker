# Provenance — Goods funding refresh 2026-07-23

Every dated/status claim below cites the live source and the date checked (2026-07-23). Verification
method per HARD RULE 1: a date is only OPEN/actionable if confirmed on a live funder/portal page.
Gov pages that returned HTTP 403 were handled per fallback (two agreeing syndications, else UNVERIFIED).

## Verified on a live page (2026-07-23)
- **NT Advanced Manufacturing Ecosystem Fund = CLOSED.** business.gov.au program page read "Closed" to
  applications, no reopen date. Amount "$25,000 and $500,000" matched, "Small to medium manufacturing
  enterprises", no Indigenous-ownership requirement stated. Source: https://business.gov.au/grants-and-programs/advanced-manufacturing-ecosystem-fund-nt
- **Paul Ramsay First Nations Targeted Grant Round = CLOSED + GATED.** Funder page: EOIs opened
  "March 12, 2025", deadline "April 7, 2025 5:00 PM AEST"; "exclusively to First Nations-led
  organisations"; grants "up to $500,000". Source: https://www.paulramsayfoundation.org.au/news-resources/first-nations-targeted-grant-round
- **IBA Start-Up Finance Package = GATED.** Requires "at least 50% Indigenous ownership or membership";
  loan up to $150,000, up to 30% as grant, 7-yr term. Sources (search + funder): https://www.iba.gov.au/business/finance/start-finance-package/
- **First Australians Capital = GATED.** "majority First Nations-led, controlled and owned"; up to $1M.
  Source: https://firstaustralianscapital.org/for-first-nations-business/
- **QLD Regional and Remote Recycling Modernisation Fund = CLOSED.** Live qld.gov.au page: "Applications
  ... are now closed"; up to $500,000; eligible applicants "Local governments, and their industry
  partners" in regional/remote QLD. Source: https://www.qld.gov.au/environment/waste-reduction-recycling/funding-grants/regional-and-remote-recycling-modernisation-fund
- **Aboriginal Investment NT grants page = NO DATES.** Live page listed programs (Business Start-Up up
  to $100k, Business Growth up to $150k, Community Impact $300k–$1M, Quick Response up to $20k) but
  showed no open/close dates → dates UNVERIFIED. Source: https://www.aboriginalinvestment.org.au/grants
- **Westpac Foundation Inclusive Employment Grants** = "$50,000 over two years", next round "open in
  2026", no published date → UPCOMING/UNVERIFIED date. Source: https://www.westpacfoundation.com.au/our-grants/inclusive-employment-grants/

## UNVERIFIED (date not confirmable on a live page) and why
- **SEDI First Nations Social Enterprise Grants — open date 22 Jul 2026 is from the OFFICIAL Community
  Grants Hub news page (communitygrants.gov.au) via search snippet, but a direct WebFetch of that page
  returned HTTP 403.** The minister's media release (tanyaplibersek.com) only said "Later this year …
  a further $2.52 million … for First Nations social enterprises" with no date. So the 22 Jul 2026 open
  date rests on one official-domain snippet + one syndication (Mirage News) — treated as OPEN but the
  exact close date ("assessed until funds exhausted") and, critically, the OWNERSHIP eligibility are
  UNVERIFIED. The grantd.com.au page conflates this with the older general SEDI round ("Submit by 30 Sep
  2025", $120,000) — that stale date was NOT used. Source: https://www.communitygrants.gov.au/news/social-enterprise-dev-initiative
- **Indigenous Advancement Strategy (IAS)** — NIAA page states "Applications may be made at any time" and
  that many opportunities are NIAA-invitation-only; no specific dated open round for a manufacturing/
  enterprise fit was confirmed → UNVERIFIED. Source: https://www.niaa.gov.au/our-work/grants-and-funding/indigenous-advancement-strategy
- **Hermannsburg Aboriginal Charitable Trust NT Enterprise** — no live program page located (DB row had
  no URL); could not verify existence of an open call → UNVERIFIED.
- **SEDI Capability Building Grant (general, no-gate)** — DB says rolling to 2027-06-30; not re-confirmed
  on a live page this pass → carried as UNVERIFIED (do not treat DB date as live-confirmed).
- **Federal/state RMF Round 6** — "$4 million … applications closing 1 July 2026" from DCCEEW-adjacent
  search results; that date is in the past relative to 2026-07-23, so recorded as CLOSED, not open.
  Source: https://www.dcceew.gov.au/environment/protection/waste/how-we-manage-waste/recycling-modernisation-fund

## Established (not freshly fetched) — flagged as such
- **Supply Nation Certification** requires 50%+ Indigenous ownership (their core certification criterion,
  widely established; not re-fetched today). Recorded GATED on that established basis. Source: https://supplynation.org.au/

## Note on the ownership gate (drives most NO verdicts)
Goods = A Curious Tractor Pty Ltd t/a Goods, a for-profit NOT yet 50%+ First Nations owned. That gates
IBA, First Australians Capital, Supply Nation, the Paul Ramsay First Nations round, ABA business grants,
and (pending confirmation) SEDI First Nations. The no-gate mission-fit programs (NT AMEF, RMF) are both
between rounds. Per HARD RULE 4, no-gate repayable finance (SEFA / Invest NT / CommBank/NAB/Metro green
equipment / LendForGood — already tracked) remains the real near-term path for the plant.
