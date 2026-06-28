# GHL operating guide — tags, moving people, and the email process

> Stages are the linear journey (one per person). **Tags are the filters that build your work lists** across stages. Used together, you stop scrolling 50 funders and instead pull "the 6 I work this week" in one click.

## The tag taxonomy (5 families)

Keep tags in families with a consistent prefix so they group and you never invent duplicates.

| Family | Tags | Pick | Purpose |
|---|---|---|---|
| **Class** (exists) | `goods-capital-target`, `goods-buyer-target`, `goods-partner-target` | one | What kind of relationship. Already in use. |
| **Type** | `repayable-lender`, `philanthropic`, `catalytic`, `grant-program` | one | Which proof bundle they get (drives the artifact match). |
| **Signal** | `warm`, `stalled`, `gated`, `monitor` | one | Warmth / why-not-now. `gated` = blocked (e.g. IBA ownership gate). |
| **Action** | `ready-to-send`, `ask-out`, `awaiting-reply`, `needs-followup` | one | What this person needs *now*. This is the one you filter on weekly. |
| **Theme** | `nt-plant`, `beds`, `washers`, `first-nations`, `central-australia` | many | What they'd fund. Lets you pull "everyone who could fund the NT plant". |

The payoff: a smart-list filter like `repayable-lender` + `ready-to-send` = your send list this week. `philanthropic` + `stalled` = your chase list. `gated` = park until the entity changes. The stage tells you the journey; the Action tag tells you the task.

## Moving people through, linked to the email + process

Every move is the same four steps, and a tag marks each:

1. **Draft** the touch (the artifact match says what to attach). Tag `ready-to-send`.
2. **Send** it (founder, from the Notion data-room link). Re-tag `ask-out` (or `awaiting-reply`), and move the stage.
3. **Remind:** a GHL task fires the follow-up (e.g. +7 days). If no reply, tag `needs-followup`.
4. **React:** reply/meeting/yes → move one stage, drop the action tag, set the next.

Email lives in GHL as **templates/snippets** (the drafted touches), so the content is one click away, but the **warm asks are sent by the founder** in their own voice, never auto-blasted. The only safe automation is **task creation** (a workflow that adds a +7-day follow-up task when `ask-out` is added) — that's a reminder, not an outbound send. Keep nurture-email automation to the cold/Identified tier only, and even then review the template first.

## The weekly loop, in GHL terms
1. Filter the board by Action tag `needs-followup` and `ready-to-send` → that's your list (not all 50).
2. For each: the artifact matcher says what to send; you send; re-tag + move stage.
3. Anything `stalled` 2+ follow-ups with no reply → mark **lost**.
4. Money happens Ask made → Delivering: agreement → invoice in Xero → paid → Stewarding.

## How it shows up in Notion
The **Funder Pipeline** database (in the data room) mirrors this for review: each funder as a row with Stage, Type, Action, Amount, Next action and Artifact-to-send, viewable as a **board grouped by Stage** (looks like the GHL board) or **filtered by Type/Action** (your work lists). GHL stays the system of record; Notion is the clear, shareable review surface, refreshed each weekly run. One writer per layer.
