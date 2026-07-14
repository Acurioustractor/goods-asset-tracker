# Archived superseded workbooks — 2026-05-30

These six model workbooks were **moved (not deleted)** out of the parent sweep folder so an advisor opens only the current pair: **`Goods-Playable-Model-v2.1.xlsx`** (THE model) + **`Goods-3-Statement-Model-v0.3.xlsx`** (audited companion). This implements the "designate ONE canonical workbook, archive the rest" fix from `03-world-class-model-review-and-build-spec.md` (P2-5).

| Archived file | What it was | Superseded by |
|---|---|---|
| `Goods-Playable-Model-v2.xlsx` | The world-class playable build (30 May 00:38). | `v2.1` — same model + wired capital injections + drift note + QBE-cap label + gate tab. |
| `Goods-Financial-Model.xlsx` | The 29 May "live model" the bundle README named; annual (not monthly re-flowing) statements. | `v2.1` (the playable monthly 3-statement). |
| `Goods-3-Statement-Model-v0.1.xlsx` | First 3-statement cut (carried the superseded "squeeze"). | `v0.3`. |
| `Goods-3-Statement-Model-v0.2.xlsx` | Second cut; basis for v0.3. | `v0.3`. |
| `Goods-Playable-Model-v1.xlsx` | First playable build (per the 11-tab spec); see `../../Goods-Playable-Model-v1-BUILD-NOTE.md`. | `v2.1`. |
| `Goods-Bed-Cost-Model-v6-Idiot-Index.xlsx` | v6 cost model in spreadsheet form. | Content now lives in `v2.1`'s Cost Ladder / Unit Cost tabs. |

## To restore any file
```bash
mv "Goods-Financial-Model.xlsx" "../../"   # from inside this dir; adjust filename
```
All files are unchanged from their pre-archive state. They were untracked in git at archive time, so this was a plain filesystem move with no history rewrite.

## Note
`Goods-Financial-Model.xlsx` had a copy uploaded as a Google Sheet to the **hi@act.place** Drive. If Matt is expecting that Drive sheet, replace it with **`Goods-Playable-Model-v2.1.xlsx`** rather than restoring this file.
