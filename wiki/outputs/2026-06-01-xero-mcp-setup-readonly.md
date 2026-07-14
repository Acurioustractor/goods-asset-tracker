# Official Xero MCP server — read-only setup (so Claude can search live Xero)

**Created:** 2026-06-01 · **Goal:** give Claude Code live, searchable Xero access (invoices,
bank transactions, contacts, payments, reports) **read-only** — no write/fix ability yet.
**Org to connect:** "Nicholas Marchesi" (`786af1ed-e3ce-42fc-9ea9-ddf3447d79d0`, ABN 21 591 780 066) — the current Goods sole-trader org.
**Package:** `@xeroapi/xero-mcp-server` (official, built by Xero).

## Part 1 — Create a Xero Custom Connection (gets you client_id + secret)
A "Custom Connection" is Xero's machine-to-machine app type. It connects to **exactly one org** and is authorised once by an admin of that org.

1. Go to **https://developer.xero.com/** → sign in → **My Apps → New app**.
2. Choose **Custom connection**. Name it e.g. `Goods – Claude (read only)`.
3. Set the **authorising user** to an admin/advisor on the *Nicholas Marchesi* org.
4. **Select scopes — tick the READ-ONLY ones only** (connection created after 29 Apr 2026 = V2 granular scopes):
   - `accounting.transactions.read`  *(invoices, bills, bank transactions, credit notes)*
   - `accounting.contacts.read`
   - `accounting.settings.read`  *(accounts + tracking/projects like ACT-GD)*
   - `accounting.reports.read`  *(P&L, balance sheet, aged receivables/payables)*
   - `accounting.journals.read`  *(optional)*
   - *(if the granular variants are required instead of the bundled ones above, tick: `accounting.invoices.read`, `accounting.banktransactions.read`, `accounting.payments.read`, `accounting.reports.profitandloss.read`, `accounting.reports.balancesheet.read`, `accounting.reports.aged.read`)*
   - ⛔ **Do NOT tick any non-`.read` scope** — that's what keeps this read-only and me unable to change anything.
5. Create → on the app's **Configuration** tab, copy the **Client id** and generate + copy a **Client secret**. (Secret shows once — store it safely.)

## Part 2 — Add the server to Claude Code (read-only)
Store the secret in your **user** config (local machine, NOT committed to the repo).

**Option A — CLI (recommended):**
```bash
claude mcp add xero --scope user \
  --env XERO_CLIENT_ID=PASTE_CLIENT_ID \
  --env XERO_CLIENT_SECRET=PASTE_CLIENT_SECRET \
  --env "XERO_SCOPES=accounting.transactions.read accounting.contacts.read accounting.settings.read accounting.reports.read accounting.journals.read" \
  -- npx -y @xeroapi/xero-mcp-server@latest
```

**Option B — JSON** (`~/.claude.json` user scope, or a gitignored file — never commit secrets):
```json
{
  "mcpServers": {
    "xero": {
      "command": "npx",
      "args": ["-y", "@xeroapi/xero-mcp-server@latest"],
      "env": {
        "XERO_CLIENT_ID": "PASTE_CLIENT_ID",
        "XERO_CLIENT_SECRET": "PASTE_CLIENT_SECRET",
        "XERO_SCOPES": "accounting.transactions.read accounting.contacts.read accounting.settings.read accounting.reports.read accounting.journals.read"
      }
    }
  }
}
```

## Part 3 — Verify
1. Restart Claude Code (or reload MCP). Run `claude mcp list` (or `/mcp`) → `xero` should show **connected**.
2. First thing to ask next session: *"use the live Xero tools — list bank transactions and invoices for The Funding Network, find the Nov/Dec 2025 deposit."* That closes the TFN hunt against **live** data (the day-old mirror couldn't show unreconciled lines).

## Notes
- **Read-only is safe:** with only `.read` scopes, I literally cannot void/edit/create anything — I can only look. To later let me *draft fixes*, you'd add write scopes (`accounting.transactions`, `accounting.contacts`) — a separate, deliberate step, and Xero writes stay Tier 3 (I propose, you approve each).
- **V1 vs V2 scopes:** the server auto-tries V1 bundled then falls back to V2 granular; if a scope is rejected at connection-create time, use the granular `.read` variants listed in Part 1 step 4.
- **Bearer-token alt:** the server also accepts `XERO_CLIENT_BEARER_TOKEN` (takes precedence) for multi-org — not needed here (single org).
- Meanwhile, the **ACT-infra Supabase Xero mirror** still works for read/reconcile right now (no setup) — used it to find the TFN bills.

**Source:** github.com/XeroAPI/xero-mcp-server (README).
