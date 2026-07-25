# Phase 0 consent and CRM reconciliation

**Completed:** 24 July 2026  
**Scope:** Goods newsletter consent flow and the targeted Our Community Shed, Dusseldorp, ALIVE and Victoria Palmer HighLevel records.

## Completed changes

### Website newsletter flow

- Added a required, default-off consent checkbox to every direct `/api/newsletter` surface:
  - footer;
  - shared newsletter component;
  - field-note capture;
  - Canberra follow form;
  - sponsor interest form; and
  - checkout already used the shared consented component.
- Added a privacy link beside each checkbox.
- `/api/newsletter` now rejects requests without explicit consent.
- The endpoint reports `subscribed` only after a confirmed HighLevel contact write.
- HighLevel errors, disabled mode and simulated writes now return an error instead of a false subscription success.
- Added four route tests covering missing consent, confirmed success, provider failure and simulated mode.

### HighLevel reconciliation

Ten exact email records were reconciled. No contacts were deleted or merged.

- Converted the generic Shed chair record into **Michelle Bates**, preserving its HighLevel ID and history.
- Added Michelle's verified Shed phone and organisation details from the existing email signature.
- Added `role:community`, `lane:community` and `place:tennant-creek` to the Shed chair, secretary, treasurer and coordinator records.
- Removed unsupported automated-send and newsletter-stream tags from:
  - four Our Community Shed role contacts;
  - Scarlett Steven;
  - Jessica Wilson / Duffy;
  - Margot Beach;
  - Rachel Fyfe;
  - Teya Dusseldorp; and
  - Victoria Palmer.
- Removed the incorrect funder and philanthropy classification from the Shed coordinator.
- Set Newsletter Consent to `No` pending a fresh purpose-specific opt-in.
- Added a consent-audit source and a permanent note to each changed contact.
- Preserved project, relationship, organisation and engagement history.

ALIVE required no consent cleanup. It already had only project, source and partner identity tags.

### Urapuntja extension

- Created a verified operational relationship record for **Jane Wilson**, Community Programs Manager at Urapuntja Aboriginal Corporation, using the role address confirmed in the 27 May 2026 email.
- Classified Jane as a Goods community partner in Utopia with local-production and youth-pathways interests.
- Set newsletter consent to `No` and did not add any automated communication tags.
- Retained the existing Urapuntja deputy CEO and reception role accounts.
- Removed unsupported Goods, ACT and supporter newsletter/drip enrolments from both role accounts.
- Added community-partner, community-lane and Utopia place tags to both role accounts.
- Added a permanent consent-audit note to all three records.

## Post-write verification

- All ten targeted records were found after the write.
- All ten now have zero `goods-newsletter`, `comms:*`, `newsletter-stream:*` or `campaign-stage:*` enrolment tags.
- All four Shed relationship records carry `lane:community`.
- All ten targeted records show Newsletter Consent `No`.
- Michelle's first name, last name, organisation and phone are set.
- Jane Wilson and both Urapuntja role accounts show Newsletter Consent `No`.
- All three Urapuntja records carry `lane:community` and `place:utopia`.
- The Urapuntja records have zero `comms:*` or campaign-stage enrolment tags.

## Intentionally unresolved

### Tennant Creek Youth Centre

Ben identified the manager as Ade Rizer on 24 July 2026. A wider evidence sweep corrected the surname to **Ade Rizal**. Barkly Regional Council records name Ade Rizal as Youthlinx Coordinator in 2022 and Youth Centre Coordinator in 2024. The existing Empathy Ledger archive contains the same person under the misspelling `Ade Rizer`; the interview transcript records the surname being spelled R-I-Z-A-L.

The connected Gmail account did not return an email matching `Ade Rizal`, `Ade Rizer`, `Rizal` or `Rizer`, and the HighLevel search did not return a reliable matching contact. The public Barkly Regional Council reception contact is not a substitute for Ade's direct or preferred contact. No speculative CRM contact was created.

Important media constraint: the archived storyteller profile says general consent was given, but the interview source is marked `private`, `storyteller_approved: false`, with analysis and story-creation permissions set to false. Treat the transcript as internal evidence only until Ade reconfirms the intended use. The separate bed-building photos and video still need their own asset-level permission evidence.

Required next input:

- Ade's direct email or confirmed preferred Council address;
- phone if appropriate;
- confirmation that the existing photo and video follow-up occurred, ideally by locating the original thread in the correct mailbox; and
- whether Ade wants operational updates, with the purpose and channel recorded.

### Shed role accounts

Secretary, treasurer and coordinator remain role-based records because the current people holding those roles were not fully verified. They are now safe from automated sends and can be resolved without losing history.

### Quarantined Xero organisation record

The contact named `Our Community Shed Incorporated` remains quarantined and untouched. It has no person-level details and should later be linked to the canonical organisation layer, not merged into Michelle.

### Notion duplicates

No Notion pages were deleted or merged. The duplicate pages contain historical evidence and need to be linked from a single pathway workspace after Phase 1 creates the canonical Goods pathway ID.

## Validation

- Newsletter route tests: 4 passed.
- Targeted ESLint: passed.
- Production build: passed.
- Build emitted pre-existing Empathy Ledger 404 fallback warnings, but completed successfully.

## Reconciliation tool

`v2/scripts/phase0-ghl-reconcile.mjs`

The script is dry-run by default and requires `--apply` for writes. It uses exact email and expected-organisation checks and never deletes or merges contacts.
