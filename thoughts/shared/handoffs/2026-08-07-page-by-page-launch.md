# Handoff: page-by-page alignment → launch

**Written 2026-08-07 (end of the site-alignment marathon). Paste the prompt at the bottom
to start the next session.**

## Where everything stands

**Four PRs OPEN, none merged, production untouched.** Ben has the previews open; verdicts
not yet given. Merge order: #212, #213 (any order) → #214 → #215 (stacked on #214).
Vercel deploys main ~90s after each merge.

| PR | Carries | Risk |
|---|---|---|
| #212 | EL stories gated behind reviewed-ids list (empty) + hero autoplay fix (two-video pattern) | low |
| #213 | /onepagers family: goods overview, stretch-bed sheet ($750 allowlisted), facility, shelf | low |
| #214 | **Homepage A** (four doors, guarded home.ts) + /invest (ENTITY_DOORS) + rebuilt header with full-screen mobile menu + sitemap derived from route-audience (17→59 URLs) | HIGH — replaces front page; the #173 revert lesson |
| #215 | Brand tokens registered in Tailwind theme; 1,060 hexes codemodded; terracotta-light minted; Goods dark mode; /brand "The system, live" + "How we show up"; 13 broken links fixed; DoorsBand closes /story /stories /gallery /storytellers | medium, 60+ files |

Preview URLs are in the PR comments (gh pr view N). Local branches = pushed state.
`feat/pitch-readability` is fully merged, safe to delete. Worktrees goods-road-tight /
goods-centrecorp still unpruned (/land step 7).

## The next session: page-by-page launch alignment

Go route by route (route-audience.ts is the map, 220 routes; public open ones first),
against: right lead for its audience · closing CTA (DoorsBand or better) · canonical
tokens (no drift; `grep -rEo '\-\[#[0-9a-fA-F]{6}\]'` should only hit the two sanctioned
sub-themes: community-narrative green + dark elevation greys) · consent (names/faces
cleared) · money (one-money-surface) · SEO (indexed iff in derived sitemap).

**Known open items, in priority order:**
1. PR verdicts + merges (Ben's call, /land flow).
2. The 8 `rewrite` verdicts still open: /portal family (never names the nine modules),
   /process + /shop/washing-machine + /story leads. Homepage `/` was fixed by #214.
3. /sponsor renders EMPTY server-side (client-only) — homepage door + sitemap point at it.
4. Communities map embed on /communities (maps/views/deployed is importable, unused publicly).
5. Public impact page (canon + verified flags; /impact is gated, supporters have nothing).
6. Empathy Ledger storyteller feed returns ZERO slugs → /storytellers index empty, profile
   pages don't generate (deep links were 404ing; now routed around on /stories). Same EL API
   smell as the `insights` 404 in every build. EL-side session: fix feed + build the explicit
   "syndicate to Goods" flag so the signal contract is real. The contract (stated 2026-08-06):
   EL public+consented+syndication-gate = THE signal; Goods adds only cleared-voices.ts
   (named-voice prose) and the homepage reviewed-ids editorial gate.
7. Contact page: no audience routing (buying/community/press/investing links).
8. Footer: still links gated /impact; "Back the work→/partner" vs header "Invest→/invest"
   disagree; add /news.
9. From the 2026-08-06 pitch handoff, still unbuilt: Oonchiumpa community one-pager
   (brought-to-the-yarn), partner pack v1, funder-pack PDF eyeball, slide-mode polish.
10. Remaining ~425 arbitrary hexes = the two sanctioned sub-themes only (documented on /brand).
11. `check:audience` reports: 14 noindexed-with-audience contradictions to resolve one by one.

**Design decisions made this session (don't relitigate):** terracotta #C45C3E; display =
Playfair (Georgia is fallback only); wordmark = outlined-Archivo artwork, never live type;
white text on terracotta/teal, ink on sage/gold; tokens.css matches globals.css (what ships
wins); dark mode = Goods palette inverted.

---

## Paste this to open the next session

> Launch alignment. Read `thoughts/shared/handoffs/2026-08-07-page-by-page-launch.md`.
> First: check the four PRs (#212–#215) — take my verdicts and land what I approve via
> /land. Then go page by page through every open public route (route-audience.ts order)
> and align each for launch: lead, closing CTA, tokens, consent, money, SEO. Fix as you
> go, one branch per coherent chunk, show me previews. Start with /sponsor (renders
> empty), the footer, and /contact routing.
