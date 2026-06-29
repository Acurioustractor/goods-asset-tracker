# Security incident — Vercel deployment deleted (suspected compromise)

_Opened 2026-06-28. Status: ACTIVE / not yet contained. Posture: **assume-breach** (treat the Vercel account, and anything whose secret lived in a Vercel env var, as compromised until proven otherwise)._

## What we actually know (verified vs reported)
- **Reported (Ben):** "someone hacked vercel and deleted our vercel deployment." Attribution and method NOT yet verified — could be account compromise, a stolen access token, an accidental/team-member deletion, or a Vercel-side issue. Do not assert "hacked" as fact until the Vercel audit log shows it.
- **Verified — the code is safe.** `origin/main` on GitHub is intact: last 50 commits are only the two trusted authors (`Goods Tracker <hi@act.place>`, `A Curious Tractor <…@users.noreply.github.com>`), newest commit `987443f` (PR #124 merge) 2 days ago. No attacker commit, no force-push signature. **The app is fully restorable from git.**
- **Verified — prod host is Vercel.** prod = www.goodsoncountry.com (apex 307s to www). Netlify retired. So a deleted Vercel deployment = the live site is down until redeployed.
- **Context — EL's separate Vercel project (empathy-ledger-v2.vercel.app) was already observed down earlier this week** ("deployment could not be found on Vercel"). That is a DIFFERENT project from the Goods one. Note it but don't conflate; could be coincidence or could be the same actor across the org — the audit log will tell.

## The exposure is credentials, not code
Because the code is clean in git, the real blast radius is **anything an attacker could read or change while inside Vercel**:
- **Vercel env vars** — every secret stored there must be treated as leaked. For this project that means (confirm the actual list in the Vercel project's Environment Variables, but expect): Supabase **service role key** + anon key (Goods project `cwsyhpiuepvdjtxaozwf`), Stripe secret/publishable keys, GHL API key, Empathy Ledger API key(s), any webhook secrets.
- **Vercel access** — account password, 2FA state, personal/team **access tokens**, Git integration (GitHub connection), domain/DNS config, team members, added integrations/webhooks.
- **Upstream entry points** — GitHub (deploy source) and the **domain registrar/DNS** for goodsoncountry.com. If either was the entry, securing only Vercel is not enough.

---

## RESPONSE PLAN

### Phase 0 — Read-only assessment FIRST (Claude can do; do before any change)
Goal: establish what actually happened before touching anything.
1. **Vercel MCP, read-only:** `mcp__vercel__list_teams` → `list_projects` → `list_deployments` (Goods project) → `get_project`. Determine: does the project still exist, or just the deployments? Any deployments left? Who/what is the latest event?
2. **Vercel audit log (Ben, in dashboard):** Account/Team Settings → check the activity/audit log for the deletion event — **who** did it, **when**, **from what IP / token**. This is the single most important evidence. Screenshot it.
3. **Check the live site:** `curl -sI https://www.goodsoncountry.com` — is it 404/down, or serving a stale/last deployment?

### Phase 1 — Contain (BEN does these himself; Claude cannot and must not)
These are credential/access actions — Claude guides, Ben executes. Do them in this order, fastest-bleed first:
1. **Vercel:** change account password → confirm **2FA is on** → Settings → Tokens: **revoke every access token** you don't recognise (and rotate the ones you do) → Team → Members: remove anyone unexpected → Integrations/Webhooks: remove anything unexpected.
2. **GitHub (Acurioustractor):** it's the deploy source. Change password → confirm 2FA → Settings → Developer settings → **revoke unknown Personal Access Tokens + OAuth apps** → repo Settings → Deploy keys + Webhooks: remove anything unexpected → org Members: review.
3. **Domain/DNS (registrar for goodsoncountry.com):** log in → confirm the **DNS records still point at Vercel** and nothing was repointed (no rogue MX/redirect) → enable registrar 2FA + registrar-lock if available. DNS hijack is the highest-harm scenario, so verify even if it looks fine.

### Phase 2 — Rotate every secret that lived in Vercel (BEN rotates at each provider; Claude updates local files after)
Treat all as leaked. For each: generate a new key at the provider, **revoke the old one**, then Claude updates `.env.local` + the Vercel env var (Vercel env change = Tier 2, confirm each).
- **Supabase (Goods `cwsyhpiuepvdjtxaozwf`):** rotate the **service role key** (highest risk — full DB bypass) and anon key in Project Settings → API. Also check Supabase **Auth logs + new API keys** for unauthorized access while you're there. NOTE: rotating the service role key breaks any script/server using the old one until `.env.local` + Vercel are updated.
- **Stripe:** roll secret + publishable keys (Developers → API keys). **Money risk** — also scan recent charges/payouts/account settings for fraud, and check no new bank account was added.
- **GHL:** rotate the API key/private integration token.
- **Empathy Ledger:** rotate the `X-API-Key` / syndication bearer (note EL's own legacy Supabase keys were already disabled org-wide 2026-06-17).
- Any webhook signing secrets (Stripe webhook, GHL webhook).
- After rotation: `git grep` for any secret accidentally committed (shouldn't be — `.env*` is gitignored, confirmed) and rotate anything found.

### Phase 3 — Restore the deployment (Claude can do; redeploy = Tier 2, confirm first)
The code is safe, so this is straightforward once Phase 1 is done (don't redeploy into a still-open breach).
1. Confirm `origin/main` is the intended prod source (it is, verified clean) and that the prod project deploys from `main`.
2. Re-link / re-create the Vercel project from the GitHub repo if the project itself was deleted (Ben may need to re-authorize the GitHub integration in the dashboard), OR trigger a fresh deployment if only deployments were removed.
3. Re-add env vars **with the NEW rotated values** (Phase 2), not the old ones.
4. Deploy: `mcp__vercel__deploy_to_vercel` (or `git push` if the GitHub→Vercel auto-deploy is reconnected). Reattach the `goodsoncountry.com` + `www` domains.
5. Verify: `curl -sI https://www.goodsoncountry.com` → 200; click through key pages; check gated pages still need their password.

### Phase 4 — Verify & monitor
- Vercel build + runtime logs clean (`get_deployment_build_logs`, `get_runtime_logs`, `get_runtime_errors`).
- Supabase: no unexpected schema changes / new tables / data deletion (read-only check via curl+service key — NOT the Supabase MCP, per project rule).
- Watch the Vercel audit log + Stripe + Supabase auth logs for repeat access over the next few days.
- Write a short post-incident note: root cause (from the audit log), what was rotated, what's still open.

---

## Guardrails for whoever runs this (Claude)
- **Claude does NOT:** enter passwords, change 2FA, revoke/create tokens, modify team membership, modify access controls, or rotate secrets at the provider. All of that is Ben, in each provider's own UI. (Prohibited / Tier 4.)
- **Claude CAN:** read Vercel/Supabase state (read-only MCP / curl), update `.env.local` + Vercel env vars with values Ben provides (Tier 2, confirm each), trigger a redeploy (Tier 2, confirm), verify the site, read logs.
- **Never use the Supabase MCP for Goods data** — it can hit the wrong project. Use curl + service key or psql against `cwsyhpiuepvdjtxaozwf`.
- Do not assert "we were hacked" / a root cause until the **Vercel audit log** shows it. Keep verified vs reported separate.

## First action on resume
Run Phase 0 (read-only Vercel MCP + `curl -sI` the site) to see current state, and ask Ben to pull the **Vercel audit log** for the deletion event. Then drive Phase 1 (contain) before any redeploy.

## Cross-refs
- Deploy mechanics + hosts: memory `[[goods-deploy-vercel-netlify]]`.
- Supabase project map: memory `[[goods-supabase-projects]]`, `wiki/canon/SOURCES.md`.
- Unrelated in-flight work that was saved clean before this incident: `thoughts/shared/handoffs/canon-studio/current.md` (canon studio + artifact loop, all committed + pushed).
