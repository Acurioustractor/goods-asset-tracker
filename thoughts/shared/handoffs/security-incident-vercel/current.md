# Security incident — Vercel deployment deleted — RESOLVED

_Opened 2026-06-28. **RESOLVED 2026-07-01.** Site restored + verified. Restore side closed; provider-key rotations remain (human, non-blocking)._
**Live:** https://www.goodsoncountry.com — www + apex 200, TLS ok, DB pages 200, zero runtime errors.

## What happened
Attacker (leaked Vercel token — source was NOT this repo's git history) deleted the `goods-on-country` Vercel project. `origin/main` was always clean → **redeploy, not rebuild.** Containment (Vercel + GitHub password/2FA/token revoke) done by Ben before any redeploy. DNS was not repointed.

## New infra facts (resume here)
- New Vercel project: `goods-on-country` `prj_9XDLD6G1yMhvYdJXtS6jYm62q2dc`, team `team_3aAWFPdRQ92RkkJ2LehJ209u` (Benjamin Knight's projects).
- Deployed from `v2/` via **CLI** (`vercel --prod --yes`). Latest prod alias: `goods-on-country.vercel.app`.
- Custom domains attached via `vercel alias set <deployment> <domain>` (NOT project production domains) → **must re-alias on every new prod deploy** until `vercel git connect` restores GitHub push-to-main.
- "Vercel Authentication" deployment protection defaulted ON on the new project (gated the domain behind vercel.com/login); Ben turned it OFF. To re-disable if it returns: dashboard Settings → Deployment Protection, or API `PATCH /v9/projects/{id}` `{"ssoProtection":null}` (classifier guards this — needs explicit user auth).
- Env: 47 prod vars set via CLI loop. Source of truth = `v2/.env.local` (gitignored). Curated prod set deliberately EXCLUDED leaked Stripe/GHL/EL/MiniMax keys; `GHL_ENABLED=false` + `ENABLE_EMPATHY_LEDGER=false` self-disable those features.

## Keys — VALUES NOT IN THIS FILE (git-tracked). Values are in Vercel env + v2/.env.local
- cwsy `cwsyhpiuepvdjtxaozwf` (main DB): migrated to new `sb_publishable_`/`sb_secret_`; legacy `eyJ` keys DISABLED; old leaked service-role confirmed dead (401 "Legacy API keys are disabled").
- tednlu `tednluwflfhxyucgwigh` (ACT_INFRA read-only; only table used = `xero_invoices`): `ACT_INFRA_SUPABASE_KEY` = new `sb_publishable_`.
- Internal secrets regenerated: CRON_SECRET, ADMIN_API_KEY, SCAN_IP_HASH_SALT, OPENFIELDS_WEBHOOK_SECRET, GRANTSCOPE_SYNC_SECRET, GOODS_GRANTSCOPE_SYNC_SECRET.
- Gate passwords set fresh (IMPACT_PASSWORD / INSIDERS_PASSWORD / INVESTORS_PASSWORD) — fixes `src/proxy.ts` fail-open to hardcoded `goods2026`. Shared with Ben in chat 2026-06-30 + in Vercel env.

## Verification (2026-06-30)
- www/apex 200; /stretch-bed, /shop/stretch-bed-single, /stories all 200.
- Gates: /impact + /investors 307→login; leaked `goods2026` → 401; new IMPACT pw → 200.
- MCP `get_runtime_errors` → none.

## OUTSTANDING (human, non-blocking)
1. **Rotate still-live leaked provider keys** at source, then add to Vercel + flip flags true + redeploy: EL Supabase service-role (yvnu, TOP), EL API key, Stripe (secret+webhook+publishable), GHL (API+agency+OAuth secret), MiniMax.
2. **GitHub repo secret `SUPABASE_SERVICE_ROLE_KEY`** → new `sb_secret` (CI asset-drift check; currently a dead key).
3. **`vercel git connect`** to restore push-to-main auto-deploy (currently CLI-only; manual re-alias each deploy).
4. **Scrub dead legacy anon keys** in public repo (`deploy/*.html`, `frontend/*.html`, `cli/goods_tracker.py`, `scripts/qr_audit.py`) — now inert but ugly.
5. (Optional) apex→www canonical redirect; add gate passwords to `v2/.env.local` for local-dev parity.

## Cleared / non-issues
- Vercel projects `temp-exfil-func` + `contained-tv-site` = **Ben's own**, NOT attacker artifacts (cleared 2026-07-01).
- DNS NOT repointed (still Vercel). `.env*` gitignored + never committed (only repo-resident secrets = the dead legacy anon keys in item 4).

## Resume check
`curl -sS -o /dev/null -w "%{http_code}\n" https://www.goodsoncountry.com/`  → expect 200

## Cross-refs
- Deploy mechanics + hosts: memory `[[goods-deploy-vercel-netlify]]`.
- Supabase project map: memory `[[goods-supabase-projects]]`, `wiki/canon/SOURCES.md`.
