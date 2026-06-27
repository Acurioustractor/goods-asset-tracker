# Archived: legacy Netlify config (2026-06-16)

## Why this was archived
This repo was connected to **two** deploy providers at once:

- **Vercel** — builds the active `v2/` Next.js app and hosts production
  (`goodsoncountry.com` / `www.goodsoncountry.com`, `server: Vercel`). This is
  the real host. Production branch = `main`; every other branch/PR gets its own
  SSO-protected `*.vercel.app` preview.
- **Netlify** — a leftover integration from the old static site. The root
  `netlify.toml` set `publish = "deploy"` with no build command, so Netlify only
  re-published the legacy static `deploy/` folder (`public-home.html`,
  `support.html`, `admin.html`). It built a `deploy-preview-NNN--goodsoncountry.netlify.app`
  on every PR and posted GitHub checks — double builds, and a "goodsoncountry"
  preview URL that showed the **old** site, not the v2 app. It never touched
  production (prod DNS points at Vercel).

To remove that confusion, the Netlify config was archived and the Netlify→GitHub
integration is being disconnected (dashboard step, see below).

## What was moved here
| Archived file | Original path |
|---|---|
| `netlify.toml` | `/netlify.toml` (repo root — the config the linked Netlify site used) |
| `deploy-netlify.toml` | `/deploy/netlify.toml` (nested, unused leftover) |

Also removed locally (gitignored, not part of any commit): `.netlify/` — the
Netlify CLI link-state for this checkout (siteId `e0b445f0-6781-4375-aba6-f22c61c1d3ba`).

## The Netlify-side disconnect (dashboard — only the account owner can do this)
Archiving the config does **not** stop Netlify from building; the linked site
keeps building from GitHub until the repo is unlinked. To finish the disconnect:

1. Netlify dashboard → site **goodsoncountry** (id `e0b445f0-6781-4375-aba6-f22c61c1d3ba`).
2. **Site configuration → Build & deploy → Continuous deployment → Manage repository → Unlink**
   (stops auto-builds + PR deploy-preview checks). Or **Stop builds**. Or delete
   the site entirely if the legacy static site is no longer wanted.
3. Optional: GitHub repo → Settings → Integrations / the Netlify GitHub App →
   remove this repo from its access list.

## How to fully restore (if ever needed)
```bash
git mv _archive/2026-06-16-netlify-legacy/netlify.toml netlify.toml
git mv _archive/2026-06-16-netlify-legacy/deploy-netlify.toml deploy/netlify.toml
# then re-link in the Netlify dashboard (or: netlify login && netlify link)
```
