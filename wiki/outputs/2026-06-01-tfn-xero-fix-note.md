# TFN grant — Xero bookkeeping fix note (for the bookkeeper)

**Org:** Nicholas Marchesi (Xero, `786af1ed-e3ce-42fc-9ea9-ddf3447d79d0`) · **Prepared:** 2026-06-01

## What happened (1 paragraph)
The Funding Network (TFN) paid us **$144,558 of grant income** — donations raised at our *Healthy People Healthy Planet* pitch event (2 Sep 2025), across two grant letters. Dext scanned the two TFN **grant-receipt letters** (`The-Funding-Network-receipt.pdf`) and auto-created them as **ACCPAY bills** (money we owe), the wrong direction, tagged to the wrong project (ACT-CE). Net result: ~$144.5k of expenses + ~$144.5k of liabilities that don't exist, and ~$144.5k of grant income never recognised. Fix = void the two bills and book the income.

## ⚠️ How to action this — one sitting, in this order
These bills were auto-created by the **Dext → "Farmhand AI" → Xero** pipeline. Void them while that rule still runs and they can **re-import**. So do all of this together:
1. **First fix the rule** (Step 5) — stop Dext auto-billing TFN receipts.
2. **Then void** the two bills (Step 1).
3. **Then rebook** the income against the actual bank deposit (Steps 2–3).
The TFN bills are dated Nov/Dec 2025 — *after* the 30-Sep-2025 period lock — so they **are** editable (the 2024 AMP grants are not).

## Step 1 — VOID these two bills (they are grant receipts, not bills)
Business → Bills to pay → Awaiting Payment:

| Bill | Amount | Date | Dext ref | Xero Invoice ID | Currently coded |
|---|---|---|---|---|---|
| #1 | **$89,361** | 27 Nov 2025 | `auto-pushed dext_import 72a62854` | `a23c77b7-5c83-4939-b9ba-a03de5074d20` | acct 429 "Operations" / ACT-CE |
| #2 | **$55,197** | 17 Dec 2025 | `auto-pushed dext_import 89583e52` | `0115a78d-518c-47f5-99ce-4002846c763c` | acct 429 "Operations" / ACT-CE |

Open each → **Bill Options → Void**. Both have the grant letter attached as `The-Funding-Network-receipt.pdf` — **download/keep those PDFs** and re-attach them to the income entries in Step 2.

## Step 2 — BOOK the grant income (the cash actually received)
Two grants from **The Funding Network Australia Limited** (ABN 75 166 134 774), net of TFN's 10% fee:

| Grant | Gross raised | TFN 10% fee | **Net received** | Letter date |
|---|---|---|---|---|
| Tranche 1 | $99,290 | $9,929 | **$89,361** | 28 Nov 2025 |
| Tranche 2 | $61,330 | $6,133 | **$55,197** | 18 Dec 2025 |
| **Total** | **$160,620** | **$16,062** | **$144,558** | |

Book each as **grant income**:
- **Contact:** The Funding Network Australia Limited
- **Account:** a grant / donation **revenue** account (NOT acct 429)
- **Project / tracking:** **ACT-GD (Goods)** — confirmed by Ben 2026-06-01
- Method: reconcile the actual bank deposit(s) as **Receive Money** coded to the above; or raise an ACCREC invoice and mark it paid against the deposit.

## Step 3 — Match the bank deposits
TFN states it distributes "within two working days" of each letter → look for **incoming** bank deposits ~**late Nov 2025 (~$89,361)** and ~**late Dec 2025 (~$55,197)** from The Funding Network. Reconcile them to the Step-2 income. If a deposit is sitting **unreconciled**, this clears it; if it was coded to "Other Revenue" with no contact, just **retag to ACT-GD + TFN contact** (don't double-book).

> **Checked live in Xero 2026-06-01:** NO reconciled bank transaction matches $89,361 / $55,197 / $144,558 (or the gross $99,290 / $61,330). So the deposit is almost certainly **unreconciled in the live bank feed** (not visible via API) or in an unsynced account — **this step must be done in the Xero bank-rec UI**, not via API. ⚠️ Before booking, also check a **cluster of Nov-2025 RECEIVE deposits coded to the generic "Nicholas Marchesi" contact** (~$84k across 17–24 Nov: $30k, $15k, $10k, $6,295.93, 2×$6k, $5.5k, $5k) — verify against bank-statement narration whether any of these is the TFN money, to avoid double-counting.

## Step 4 — Keep the fee
The two **PAID** Sept bills ($6,000 + $500 = **$6,500**, acct 417, 3 Sep 2025) are TFN's real **event/participation fee** — leave as expense (optionally retag ACT-CE → ACT-GD).

## Step 5 — Stop it recurring
- **Dext:** route `The-Funding-Network-receipt.pdf` (and TFN remittances) to **review**, not auto-create-as-bill.
- **Xero vendor rule:** remove/adjust the rule auto-tagging The Funding Network → **ACT-CE**.

## Net effect once done
Expenses **−$144,558**, liabilities **−$144,558**, income **+$144,558** → net equity improves up to **~$289K**, and the $144,558 grant is correctly recognised.

## ✅ Attribution resolved (Ben, 2026-06-01)
Both the TFN grant ($144,558) and the AMP Tomorrow Makers SPARK grant ($21,900) are attributed to **Goods (ACT-GD)** → tag both ACT-GD; both count toward the QBE match.

**Related — AMP (separate):** AMP's 5 income invoices (`TMSPARKGRANT1-4` + `0629828`, contact "AMP", 2024) are correctly booked as income and attributed to Goods. **They CANNOT be re-tracked in Xero** — they're dated before the **period-lock date (30-Sep-2025)** and we will NOT unlock closed books to add a label (attempted 2026-06-01, Xero refused, nothing changed). Instead: count AMP's $21,900 as Goods in the match tally directly, and do the ledger tagging in **act-infra's Supabase `project_code` layer** (these 2024 invoices aren't in the mirror — an act-infra finance follow-up), never via a Xero period-unlock.
