---
title: Washing Machine Master Ledger — Bought, Built, Distributed, Tracked
date: 2026-05-14
status: live
audience: Ben, Nic; share with Snow Foundation / Bawinanga for cross-check
---

# Washing Machine Master Ledger

Cross-references the v2 asset register (`public.assets`), v2 telemetry (`public.usage_logs`), Xero (`tednluwflfhxyucgwigh.xero_invoices`), and Gmail thread history through 14 May 2026.

Supersedes (and pairs with) [2026-05-14-washing-machine-reconciliation.md](./2026-05-14-washing-machine-reconciliation.md).

## The headline numbers — and their gap

| Source of truth | Count | Confidence |
|---|---:|---|
| **Xero ACCPAY from 1300 Washer** (Speed Queen) | **14 machines** | High (4 paid invoices, see below) |
| Xero SpeedQueen rebate claims (VOIDED) | up to **25 machines** | Low — invoices were voided, may indicate over-claim |
| Existing BHAC Speed Queens we **upgraded** (not bought) | **4 machines** | Medium (per INV-0240 line items: "Upgrade up to 4 BHAC Speed Queen…") |
| Asset register `product = Washing Machine` rows | **41 records** | High but inflated (1 duplicate already known, 3 orphans, batch placeholders) |
| Distinct devices in telemetry ever | **13** | High |
| Devices reporting in last 7 days | **3** | High |

**The reconciliation gap.** Asset register says 41. Confirmed Xero purchases say 14 (+ 4 upgrades = 18). Telemetry has only seen 13 ever. Even if we add the 25 rebate-claimed machines and the 4 BHAC upgrades, we top out at 29 — still 12 short of the 41 in the register.

The 12-machine gap is either:
- **Phantom batch entries** — the 9 `GB0-154-*` rows currently labelled "Pending Assignment" may be aspirational rows entered for a planned batch but never physically delivered, OR
- **Centrecorp-funded purchases** outside the Xero data we have visibility on (Centrecorp has delivered ~2,500 machines across Central Australia themselves since COVID — they may have funded some of ours), OR
- **The 3 orphan coreids** representing physical devices we don't yet have purchase records for.

A short follow-up email to Craig at Speed Queen Laundry asking for an order history would close this conclusively.

## Supply chain (who builds, who funds, who installs)

```
  Winnings (RAP partner)              Snow Foundation         Centrecorp Foundation
   Alice Kuepper · James Moore           Sally G-B               Randle Walker
            │                              │                          │
            │ recommends Speed Queen       │ funds Goods builds       │ funds beds (mostly) + some WMs
            ▼                              │                          │
  Speed Queen Laundry (direct)            │                          │
   Craig (retail@) · Jordan (sales@)      │                          │
   AWNA 62 Black, $2,995 ex GST           │                          │
            │                              │                          │
            │ 1300 Washer invoices         │                          │
            ▼                              ▼                          ▼
        Defy Design ──► Goods re-skin ──► Communities (Goods Indestructible WM v1)
        Botany NSW                          BHAC (Maningrida) · Julalikari (TC) · OCS (TC) · Snow direct
```

## Purchases — Xero ACCPAY (4 invoices, $41,930 total)

| Date | Xero # | Vendor | $ | Machines (inferred) | Destination |
|---|---|---|---:|---:|---|
| 2025-05-12 | I0014374 | 1300 Washer | $2,995 | 1 | sample / pilot |
| 2025-05-12 | I0014375 | 1300 Washer | $14,975 | 5 | Snow grant build (R&D + first deploy) |
| 2025-05-29 | I0014517 | 1300 Washer | $14,975 | 5 | TC + BHAC build (refit prep) |
| 2025-07-14 | I0014891 | 1300 Washer | $8,985 | 3 | Snow add-on (delivered to Defy Botany) |
| **Sum** | | | **$41,930** | **14 base machines** | |

Unit price reconciles: $2,995 × 14 = $41,930. Rebate basis (24%) = $719 × 14 = $10,066, but the VOIDED rebate invoices total $17,940 worth (25 machines × $720 line). Gap on rebate basis = 11 machines.

### VOIDED rebate invoices — interpret carefully

| Date | Xero # | Type | Status | Qty | Notes |
|---|---|---|---|---:|---|
| 2025-06-11 | INV-0236 | ACCREC | **VOIDED** | 11 | "SpeedQueen Rebate 11 machines of 24%" |
| 2025-06-17 | INV-0237 | ACCREC | **VOIDED** | 11 | duplicate of INV-0236 |
| 2025-07-17 | INV-0244 | ACCREC | **VOIDED** | 3 | rebate for the 3 of I0014891 |

INV-0236 and INV-0237 look like the same 11 machines invoiced twice (one was a correction). INV-0244 matches the 3 in I0014891. So the rebate basis is consistent with **11 + 3 = 14 machines** — matches the ACCPAY count exactly. Rebate path is internally consistent; the asset register is the outlier.

## Outflows — Xero ACCREC (what was sold/granted to communities)

| Date | Xero # | Recipient | $ | Status | WMs | Other lines |
|---|---|---|---:|---|---:|---|
| 2025-05-01 | INV-0227 | Snow Foundation | $110,000 | PAID grant | (R&D) | Q2 2025 program funding — WM V1 design + field tests |
| 2025-06-29 | INV-0240 | Snow Foundation | $16,600 | **PAID** | 2 new + 4 upgrades + 4 dryers | BHAC laundromat refit (Maningrida) |
| 2025-07-08 | INV-0241 | Bawinanga (Maningrida) | $16,600 | **VOIDED** | 2 + 4 upgrades + 4 dryers | Re-issued via Snow above |
| 2025-10-21 | INV-0282 | Julalikari (TC) | $19,800 | **PAID** | 4 | + delivery |
| 2026-01-20 | INV-0308 | Our Community Shed (TC) | $6,765 | PAID | 1 | + delivery |
| 2026-05-18 | INV-0303 | Homeland School Co. | $40,000 | AUTHORISED | 2 | bundled with 40 beds (Stretch) |

**Total delivered to communities (paid + authorised): 9 new machines + 4 BHAC upgrades + 4 dryers** =
- Maningrida: 2 new + 4 upgrades (BHAC owns the upgraded units) → 6 in our register (✓ matches GB0-150-1..6)
- Tennant Creek: 4 (Julalikari) + 1 (OCS) = 5
- Homeland School Co. (Bawinanga affiliate?): 2 pending
- TBD: another 5-7 machines from the 14 bought are not explicitly accounted for in outflows — they may be the named TC devices (Norman, Nicole, Barkley Arts, DSS, Red Dust, 8D1) deployed directly without a sale invoice.

## Communities — current allocation and who knows

| Community | Asset register count | Funded by | What we actually know |
|---|---:|---|---|
| **Tennant Creek** | 19 | Mix: Julalikari (4 paid), OCS (1), Wilya Janta direct (5-6 named devices), Snow (some) | 3 active telemetry · 6 named devices died 2026-03-09 · 10 "Pending Assignment" need physical verification |
| **Maningrida (BHAC)** | 6 | Snow Foundation INV-0240 ($16,600) | 2 new + 4 existing BHAC machines we upgraded · ALL silent · physical install confirmed Oct 2025 by Phillip Allan, BHAC |
| **Palm Island** | 10 named + 3 orphans = 13 | Unknown — predates current funding records | 0 active telemetry · site fully dark · need PICC site visit |
| **Alice Springs (Oonchiumpa)** | 3 (currently mis-tagged as Palm Island) | Unknown | Verify on this trip |
| **Total deployed** | **41** | | |

## Telemetry — only 13 devices ever, 3 active

Same 13 devices identified in `wiki/outputs/2026-05-14-washing-machine-reconciliation.md`. Three actively reporting (F25, 4E5, 507 — all TC). Six "named" devices (Norms House, Nicoles House, Barkley Arts, Dian Stokes Sons House, Red Dust, 8D1) all stopped reporting on **2026-03-09** — a backend pipeline change date.

## QR codes — coverage status

| State | Count | Notes |
|---|---:|---|
| Asset has `qr_url` ending `/bed/{unique_id}` | **38 of 41** | Standard QR landing page |
| Missing `qr_url` | **3** | The 3 Palm Island orphans (`GB0-WM-ORPHAN-*`) |
| Need physical sticker generated + applied | TBD | The 3 orphans + any newly-imported machines |

To generate QR stickers for the 3 orphans (once we know what they physically are), use the same script pattern as batch 156 — adapt `scripts/generate_batch_156.py` constants.

## Action items, in priority order

### P0 — In Supabase right now (mechanical, reversible)
1. **Retire `GB0-WM-PARTICLE-01`** — confirmed dup of `GB0-WM-4E5`. Set `status=retired`, note the merge.
2. **Re-tag `GB0-136-1/2/3` to `community='Alice Springs'`** — currently say PI but place is Alice Springs (Oonchiumpa).
3. **Re-tag the 3 orphans to `community='Tennant Creek'`** pending physical confirmation (their coreid pool matches TC, not PI).

### P1 — On the Alice + Utopia trip (week of 2026-05-19)
4. **Walk every TC machine** with the printable `/admin/assets` filtered to `community=Tennant Creek, product=Washing Machine`. Tick each one off. Update `name`, `place`, `gps` as we go.
5. **Visit Oonchiumpa** — physically confirm the 3 GB0-136 machines and update place.
6. **Investigate the 2026-03-09 telemetry pipeline break** — that's when 6 named devices went silent on the same day. Whoever owns the Openfields integration needs to look. Refer to `INV-0008` Openfields Solutions $5,800 paid 2025-08-21.

### P2 — Email follow-ups (someone non-Ben should send)
7. **Email Craig @ Speed Queen Laundry** asking for our complete order history through 2025–2026. Reconcile against the 14 invoices. Resolve the rebate-vs-purchase discrepancy.
8. **Email Sally @ Snow Foundation** confirming where the 2 INV-0240 Bawinanga machines and 2 INV-0303 Homeland School machines should be tagged in our register.
9. **Email Bawinanga (Phillip Allan + Robynne Collier)** for the current physical condition of the 6 BHAC laundromat machines — none have reported telemetry; cellular gateway likely never commissioned.
10. **Email Centrecorp (Randle Walker)** for any record of Centrecorp-funded WM purchases under the Goods program — could close the 12-machine gap.

### P3 — Wider fixes
11. **Re-commission cellular gateways** on Maningrida (6) and Palm Island (10) installs. Without telemetry these are unaccountable. Probably needs a kit pack sent with someone going to each site.
12. **Add a "Tracking" badge to the /admin/assets view** showing which machines have a verified physical+telemetry+QR triangle vs which are partial. (Telemetry column is live; missing pieces: physical-confirmation date, QR-printed flag.)

## Final reconciled count (best current estimate)

| Category | Count |
|---|---:|
| Machines Goods has bought (Xero) | **14** |
| Machines Goods has upgraded (BHAC's own) | **4** |
| Total Goods-controlled WM hardware | **18** |
| Asset register rows we're confident map to real machines | **~26** (14 bought + 4 upgrades + ~8 unaccounted) |
| Asset register rows that need physical verification | **15** (10 PI named + 5 of GB0-154 batch) |
| Phantom/duplicate rows | **1 confirmed** (PARTICLE-01) + likely more in the 15 above |
| Actively monitored via telemetry | **3** |

After this trip's physical sweep + the supplier emails, we should be able to converge on a single number that matches reality. The 41-record register is currently a superset; the truth is somewhere between 18 (verified Xero) and 30 (asset register minus likely phantoms).
