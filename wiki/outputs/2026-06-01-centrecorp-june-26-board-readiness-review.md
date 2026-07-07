> Review of the Centrecorp email thread, Notion setup, GHL alignment needs, and current impact-report builds for the 26 June 2026 Centrecorp Foundation board push. The live path is the deferred beds request, not a broad three-part ask.

# Centrecorp June 26 Board Readiness Review

Created: 2026-06-01

## Source Scope

Verified sources used:

- Gmail thread: `Tennant Creek Bed Funding`, especially Randle Walker's 2026-05-29 email.
- Gmail thread: `Centrecorp Social Impact`, for the earlier reporting and application pattern.
- Notion: `Centrecorp Foundation Reporting`.
- Notion: `Centrecorp Foundation` in the Grants & Capital Pipeline.
- Local report builds and public surfaces in `v2/`.
- HighLevel connector check: attempted, but connector returned `401: Reauthentication required`.

## Latest Centrecorp Decision

Verified from Randle's 2026-05-29 email:

- Washing machine design, engineering and testing request for `$61,050` was declined.
- Production facility request for `$97,900` was declined.
- `130 beds for Tennant Creek and Mparntwe` for `$106,150` was deferred for more information.
- Centrecorp asked whether Goods can present to the `26 June 2026` board meeting.
- Board questions for the deferred beds ask:
  - How are areas, communities and towns being prioritised for beds?
  - Recent flooding has affected upper Barkly and further north, so why Mparntwe?
  - What community employment and training is planned with these beds?
  - Who are the partners assisting with delivery and installation?
  - What has community feedback been so far on the new beds?
- Randle also said some additional information was forwarded but not seen by all board members, so the next attempt needs one complete package.
- Randle gave blunt feedback that the format, content and style of the applications need improving.

## Earlier Feedback That Still Matters

Verified from the same Gmail thread:

- 2026-02-05: The board was unlikely to fund V1 beds again after seeing the improved current bed.
- 2026-02-05: The board is very hesitant to fund work that has already occurred. Retrospective framing should be avoided.
- 2026-02-13: One application per community and letters or emails from the community strengthen the application.
- 2026-02-13: Too many applications in one month can cause all of them to fail. The board may support staged requests over time.
- 2026-04-13: Reports, photos and letters of support would add weight to a donation application.
- 2026-05-18: The board asked for reporting from prior Centrecorp funding: photos, community feedback, and community involvement in construction, delivery or maintenance.
- 2026-05-18: Public recognition was missing. Randle specifically noted that Google did not connect A Curious Tractor and Centrecorp.
- 2026-05-18: Invoices at application stage sent the wrong signal. Use application forms, quotes and costed scopes until approval.

## Notion Setup Review

Current strengths:

- The Notion Funder Reporting Hub exists and has a Centrecorp reporting page.
- The Centrecorp page has the correct warning that the `$265,100` invoices were voided and should not be chased.
- The Grants & Capital Pipeline has a Centrecorp record and records the paid `$123,332`.

Changes made 2026-06-01:

- Updated `Centrecorp Foundation Reporting` summary and notes so it now names the live June 26 board path: the deferred `$106,150` beds request, not the old `$265,100` cashflow chase.
- Updated the Grants & Capital Pipeline `Centrecorp Foundation` notes with the May 29 outcome: washers and production plant declined, beds deferred, one board package needed.

Remaining Notion risks:

- Some older Notion and generated-report content still treats Centrecorp as a cashflow chase or a broad relationship commitment, rather than a specific deferred board ask.
- Reporting schedule is still not fully captured. For Centrecorp, the next reporting milestone should be anchored to the 26 June board package and a proposed post-delivery reporting cadence.
- Internal records still contain old product language such as `Weave Bed`. External material should say `Stretch Bed`. If invoice reconciliation requires old labels, put them in internal source notes only.

## HighLevel Setup Review

Verified:

- The HighLevel connector returned `401: Reauthentication required`, so the live pipeline could not be checked or modified in this pass.

Expected HighLevel alignment after reauth:

- Centrecorp should sit in `Goods Supporter Journey`, not the buyer pipeline, for the June 26 grant ask.
- The live opportunity should be the deferred beds ask:
  - Name: `Centrecorp Foundation - 130 Stretch Beds - June 26 board`
  - Value: `$106,150`
  - Stage: `Ask made` or closest equivalent until the board decision
  - Funding type: `Grant` or `Philanthropic`
  - Amount basis: `Quote`
  - Capital status: `Ask made`
  - Match eligible: `TBC` unless confirmed for QBE
  - Xero invoice: blank until approved and invoiced
- The declined washer and production plant asks should be closed, parked or marked declined so they do not pollute the June campaign.
- Add tasks:
  - Board package draft ready internally.
  - Send single package to Randle and Jodie before the board pack deadline.
  - Prepare 26 June presentation.
  - Follow up after board decision.

## Current Impact-Report Build Audit

### Public Centrecorp partnership page

Location: `v2/src/app/partners/centrecorp/page.tsx`

Verdict: useful and should stay.

Why:

- It answers Randle's public recognition concern.
- It gives Google an indexed link connecting Goods, A Curious Tractor and Centrecorp.
- It is mostly positioned as recognition, not a live grant ask.

Watch:

- The page still leans toward Utopia. The June 26 ask needs Tennant Creek and Mparntwe-specific prioritisation.
- It should not be used as the only board evidence. It is a public recognition asset, not a full board application.

### Live outcomes snapshot

Location: `v2/src/app/partners/[slug]/outcomes/page.tsx` and `v2/src/lib/data/partners.ts`

Verdict: strong format, not yet enough for the June 26 decision.

Why:

- The one-page landscape layout is close to what the board needs.
- It includes metrics, photos, voice themes and measurement rows.

Gaps:

- It is still framed around Utopia Homelands, not the deferred 130-bed Tennant Creek and Mparntwe ask.
- It does not answer the board's prioritisation question.
- It does not name delivery or installation partners for the deferred ask.
- It does not include an employment and training plan.

### PDF one-pager

Location: `v2/public/docs/partners/centrecorp/utopia-outcomes-one-pager.pdf`

Verdict: do not send as-is.

Specific risks:

- It says `107 beds delivered` in the May 2026 Central Australia deployment.
- It says Centrecorp backs the six-month production plant trial, but the 2026-05-29 email says the production plant request was declined.
- It frames Centrecorp as a partner on the May deployment with Snow Foundation, but the board now wants a clearer single package for the deferred beds ask.

### Partner asset kit

Location: `v2/src/app/kit/page.tsx`

Verdict: needs copy correction before sharing again.

Specific risk:

- The Centrecorp copy says Centrecorp funded the materials for the trip and that 107 beds were delivered into Utopia homes. This conflicts with the latest board outcome and should be replaced with a safer historical-recognition line.

### Funder report generator

Location: `v2/src/lib/funders/configs/centrecorp.ts`

Verdict: stale.

Specific risks:

- It says `$292,700` total commitment, `$208,000` paid and `$84,700` to be paid.
- Current verified internal position is `$123,332` paid, with the live June 26 ask at `$106,150`.
- Any generated Centrecorp deck from this config will carry old numbers unless fixed.

### Legacy Centrecorp deck

Location: `wiki/outputs/2026-05-22-centrecorp-impact-deck.md`

Verdict: do not use as-is.

Specific risks:

- It says `79 of 109 Centrecorp-funded Utopia beds delivered`.
- It contains unverified placeholder quotes.
- It says one more batch closes the 109-bed commitment, which is not the current board question.

### Generic impact report templates

Locations:

- `v2/src/components/reports/impact-report.tsx`
- `v2/src/lib/data/report-templates.ts`
- `v2/src/app/admin/reports/impact/[templateId]/page.tsx`

Verdict: useful for broad funder stewardship, but not enough for this board decision.

Why:

- The generic funder-impact report is a good stewardship proof surface.
- It does not answer the specific questions Randle listed.
- For this moment, the Centrecorp board package needs a custom application appendix and presentation, not just a generic impact report.

## Recommended June 26 Board Package

Use one package, one ask, one narrative.

Working title:

`130 Stretch Beds for Tennant Creek and Mparntwe - June 26 Centrecorp Foundation Board Package`

Sections:

1. Decision requested
   - Ask: `$106,150 incl. GST`.
   - What it funds: 130 current Stretch Beds plus workshops, delivery, installation and reporting.
   - What it does not fund: washers, production plant, retrospective V1 beds.

2. Trust deed fit
   - Actual benefit for Aboriginal peoples of Central Australia.
   - Where the beds go.
   - Who receives benefit.
   - Why the benefit is not speculative.

3. Prior funding report
   - August 2025 and January 2026 Centrecorp-funded work.
   - Photos.
   - Community feedback.
   - Community involvement in construction, delivery and maintenance.
   - Current status of the beds.

4. Why these places
   - Prioritisation matrix for Tennant Creek, Mparntwe and any alternatives.
   - Criteria: community request, overcrowding, flood response relevance, partner readiness, delivery feasibility, Elders and children, installation capacity.
   - Directly answer: why Mparntwe when Barkly and further north had recent flooding?

5. Partners and delivery
   - Who will identify households.
   - Who will assist delivery.
   - Who will assist installation.
   - Who will hold post-delivery follow-up.
   - Attach letters or emails of support.

6. Community employment and training
   - Build workshops.
   - Local assembly roles.
   - Youth or community training hours.
   - Maintenance and repair pathway.
   - What is paid, voluntary, training-only or future pathway.

7. New-bed feedback
   - Feedback on the current Stretch Bed, not V1.
   - Comfort, setup, washing, durability, missing parts, maintenance and requested changes.
   - Use consent-checked quotes only.

8. Measurement and reporting
   - Asset IDs and QR records.
   - Delivery register.
   - Photos and consent status.
   - 30-day and 90-day check-ins.
   - One-page post-delivery board update.

9. Recognition
   - Link to `https://www.goodsoncountry.com/partners/centrecorp`.
   - Confirm Centrecorp's preferred logo and wording.
   - Show the board that recognition is now live and indexed.

10. Attachments
   - Donation application form.
   - Quote, not invoice.
   - Letters or emails of support.
   - Prior funding report.
   - Public recognition link.
   - Delivery and reporting schedule.

## Immediate Fix List

Before any June package is sent:

- Replace or regenerate the stale Centrecorp PDF one-pager.
- Update `v2/src/lib/funders/configs/centrecorp.ts` so generated reports no longer use `$292,700`, `$208,000 paid` or `$84,700 to be paid`.
- Update `v2/src/app/kit/page.tsx` Centrecorp copy so it does not claim Centrecorp funded the May trip materials or the declined production plant.
- Either rewrite or archive `wiki/outputs/2026-05-22-centrecorp-impact-deck.md` so it cannot be used accidentally.
- Build a board-specific one-page snapshot for `130 Stretch Beds for Tennant Creek and Mparntwe`.
- Reauthenticate HighLevel and update the Centrecorp opportunity to the single deferred beds ask.

## Suggested Reply Frame To Randle

Hi Randle,

Thank you for the direct feedback. We hear the board's decision clearly.

We will not continue the washer or production plant asks for the June meeting. We will focus the June 26 package on the deferred 130-bed request and present it as one complete application pack.

The revised package will directly answer the board's questions: how communities are prioritised, why Tennant Creek and Mparntwe, who the delivery and installation partners are, what employment and training is planned, and what feedback has come back from the current Stretch Beds and prior Centrecorp-funded work.

We will also include the recognition work now live at:
https://www.goodsoncountry.com/partners/centrecorp

We appreciate the blunt steer on the application quality. We are rebuilding this as a single board-ready package with the evidence, quote and supporting letters together rather than sending information across multiple emails.

Thanks again for keeping the door open for the beds request.

## Bottom Line

The June 26 opportunity is still alive, but only if Goods stops treating this as a broad relationship update and turns it into a tight board decision package. The application should be one ask only: 130 current Stretch Beds for Central Australia, backed by prior reporting, public recognition, partner letters, a delivery plan, and clear answers to Randle's five board questions.
