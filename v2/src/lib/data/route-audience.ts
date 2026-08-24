/**
 * ROUTE AUDIENCE - who every route is for, what it actually leads with, and whether it should exist.
 *
 * `audience.ts` was written on 2026-07-26 and describes six (now eight) readers and what each one
 * came for. Until this file existed it had never been applied to a single route, so the rule it
 * states - lead with the thing that audience came for - was a rule nothing obeyed. Its own header
 * names the failure: EVERY DEAD ARTIFACT WE HAVE BUILT LED WITH THE WRONG THING FOR ITS READER.
 *
 * Every decision encoded below was made in the wayfinding map
 * https://github.com/Acurioustractor/goods-asset-tracker/issues/177 and each is recorded on the
 * ticket that resolved it. Nothing here was invented while writing the file.
 *
 * ---------------------------------------------------------------------------
 * EXACTLY ONE AUDIENCE PER ROUTE
 * ---------------------------------------------------------------------------
 * There is no primary/secondary and no escape hatch except `plumbing`. A route that genuinely
 * serves two readers is a route that has not been split yet, and saying so is the point: `/pathways`
 * claimed both community and partner, and those two want opposite things from it - community must
 * lead with a yarn and never see a facility proposal, partner must lead with which of the nine
 * modules is theirs, which is close to a facility proposal. One page cannot do both without failing
 * one of them.
 *
 * ---------------------------------------------------------------------------
 * `verdict` AND `access` ARE DIFFERENT AXES
 * ---------------------------------------------------------------------------
 * `access` is who may see it. `verdict` is whether it should exist and whether it leads right.
 * A route can be `keep` and gated at once: `/funders/[slug]` is a good page for a real audience
 * behind a password. Collapsing them would lose information, which is why the `disposition` field
 * from the retired `route-review.ts` became `access` here rather than folding into `verdict`.
 *
 * ---------------------------------------------------------------------------
 * `rewrite` IS THE FINDING
 * ---------------------------------------------------------------------------
 * `keep` and `retire` describe existence. The failure this exists to catch is a LIVE page leading
 * with the wrong thing, and `rewrite` is the only verdict that records it. The count of `rewrite`
 * is the number this whole effort reports.
 *
 * ---------------------------------------------------------------------------
 * `leadsWithNow` IS EVIDENCE, NOT ASPIRATION
 * ---------------------------------------------------------------------------
 * Read from PRODUCTION by `scripts/read-route-leads.mjs`, heading-first, with the eyebrow kept
 * separately - an earlier DOM-first pass returned a `<p>` eyebrow as the lead for `/pathways` and
 * produced a false finding. Because it reads production it is only true of `main` while production
 * is current with `main`.
 *
 * `null` means the lead could not be read (gated, client-rendered, or a dynamic route with no
 * nameable instance) and `whyUnread` says which. `check:audience` SKIPS the keep-versus-rewrite
 * comparison for those and reports the count, so an unread route is never silently scored `keep`.
 *
 * What `shouldLeadWith` is, is NOT a field here: it is derived from `audience.ts`, so changing
 * `buyer.leadWith` moves every buyer route's target at once. See `shouldLeadWith()` below.
 *
 * Invariants: `scripts/check-audience.mjs`, in both `check:drift` and `check:drift:ci`.
 */

import { AUDIENCES, audience, type AudienceId } from './audience';

/**
 * `keep`     - right reader, and it already leads with what they came for.
 * `rewrite`  - right reader, WRONG lead. The finding.
 * `redirect` - stops existing, sends its traffic somewhere. Carries a `target`.
 * `retire`   - stops existing. Must be EARNED: zero inbound links AND never shared externally,
 *              with `why` recording which test it passed. When unsure, redirect.
 * `plumbing` - serves no reader at all. The single exemption from one-audience-per-route, and it
 *              is pattern-bound in the guard so it cannot become where awkward routes go to die.
 */
export type Verdict = 'keep' | 'rewrite' | 'redirect' | 'retire' | 'plumbing';

/** Who may see it. Orthogonal to whether it should exist. Derived from `src/proxy.ts` by the guard. */
export type Access = 'open' | 'gated' | 'admin';

export interface RouteLead {
  /** The first <h1> inside <main>, or the first <h2> where no <h1> exists. */
  heading: string;
  /** Any <p> above that heading. The first text a reader's eye meets, and not the same thing. */
  eyebrow?: string;
  /** The first paragraph of 25+ characters below the heading. */
  body?: string;
}

export interface RouteAudience {
  route: string;
  /** Exactly one. Null ONLY when `verdict` is 'plumbing'; the guard checks the biconditional. */
  audience: AudienceId | null;
  access: Access;
  /** What the surface actually leads with today. Null when it could not be read. */
  leadsWithNow: RouteLead | null;
  /** Required when `leadsWithNow` is null. */
  whyUnread?: string;
  verdict: Verdict;
  /** Required when `verdict` is 'redirect'. */
  target?: string;
  /** Required when `verdict` is 'plumbing' or 'retire'. */
  why?: string;
  /** Carried over from the retired route-review.ts: what the page is for, one line. */
  job?: string;
  /** Carried over from route-review.ts: where its content comes from. */
  dataSources?: string;
}

export const ROUTE_AUDIENCES: RouteAudience[] = [
  {
    route: '/',
    audience: 'supporter',
    access: 'open',
    // 2026-08-06: Homepage A revived (six-front-doors #171, reverted unseen #173, regrafted
    // for the wayfinding review). Renders entirely from home.ts (guarded); ends on FOUR
    // doors, one per audience next-action, so buyer/community/funder each find their front
    // door from here without the supporter lead serving them first.
    leadsWithNow: {
      heading: 'A bed made on Country, from the plastic that was already here.',
      body: 'Beds donated to remote communities kept disappearing. So communities started making their own.',
    },
    verdict: 'keep',
  },
  {
    route: '/about',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: {
      heading: 'Made by community.',
      eyebrow: 'About Goods on Country',
      body: 'Goods on Country is a social enterprise designing, manufacturing, and transferring essential health hardware to remote First Nations communities across Australia. Beds. Washing machines. A manufacturing model that stays with the communities it serves.',
    },
    verdict: 'redirect',
    target: '/story',
  },
  {
    route: '/admin',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/alice-fill',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/announcements',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/ask',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/impact-cycles',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/impact-cycles/[cycleId]',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/impact-system',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/assets',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/assets/[unique_id]',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/assets/batch/[batch]',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/atlas',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/bed-preflight',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/bed-signals',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/brand',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/canon',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/communities',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/communities/[id]',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/community-stories',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/compassion',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/consent',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/cost-model',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/dashboard-images',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/deals',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/deck',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/deck-builder',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/deck-photo-review',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/el-stories',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/el-stories/[id]/edit',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/el-stories/new',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/el-storytellers',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/el-storytellers/new',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/facility',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/field-notes',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/field-notes/[slug]',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/field-notes/library',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/fleet',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/fleet/[machine_id]',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/funders',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/funders/[slug]/video-brief',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/funders/new',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/install-bulk',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/install-checklist',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/investor-lab',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/library',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/login',
    audience: null,
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'plumbing',
    why: 'a per-surface password gate',
  },
  {
    route: '/admin/loi-tracker',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/maps/ask',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/maps/deployed',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/maps/need',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/media-gaps',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/media-library',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/messages',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/miro-board',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/operating-systems',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/orders',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/orders/[id]',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/orders/launch-checklist',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/pathways',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/pathways/[id]',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/people',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/photo-align',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/photo-review',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/photos',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/photos-browser',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/pipeline',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/pitch-cockpit',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/pitch-workshop',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/production',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/products',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'redirect',
    target: '/admin',
  },
  {
    route: '/admin/products/[slug]',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/products/story',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/quote-cards',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/quotes',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/reach-out',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/reports',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/reports/impact',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/reports/impact/[templateId]',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/requests',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/roadmap',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/route-review',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/scans',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/site-content',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/stories',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/story-atlas',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/storytellers',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/system-visuals',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/team',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/today',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/trip-receipts',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/unauthorized',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/voice-impact',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/voices',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/admin/xero-reconciliation',
    audience: 'internal',
    access: 'admin',
    leadsWithNow: null,
    whyUnread: 'admin surface, client-rendered behind the admin gate',
    verdict: 'keep',
  },
  {
    route: '/auth/phone-login',
    audience: null,
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'no server-rendered heading inside <main> (client-rendered)',
    verdict: 'plumbing',
    why: 'phone OTP sign-in flow',
  },
  {
    route: '/auth/verify-otp',
    audience: null,
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'no server-rendered heading inside <main> (client-rendered)',
    verdict: 'plumbing',
    why: 'phone OTP sign-in flow',
  },
  {
    route: '/basket-bed-plans',
    audience: 'buyer',
    access: 'open',
    leadsWithNow: {
      heading: 'Basket Bed Plans',
      eyebrow: 'Open Source',
      body: 'The Basket Bed was our first prototype — collapsible baskets with zip ties and foam toppers. It served hundreds of families and taught us everything we needed to build the Stretch Bed. Now we\'re making the plans free for anyone to use.',
    },
    verdict: 'keep',
  },
  {
    route: '/bed/[id]',
    audience: 'community',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'keep',
  },
  {
    route: '/brand',
    audience: 'press',
    access: 'open',
    leadsWithNow: {
      heading: 'The making belongs on Country.',
      eyebrow: 'Goods on Country identity',
      body: 'The canonical logo system, colour, typography and usage rules for Goods and Goods on Country. Use the supplied files. Do not rebuild the mark.',
    },
    verdict: 'keep',
  },
  {
    route: '/canberra',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: {
      heading: 'A child in remote Australia is more likely to die of a preventable heart condition than almost anywhere else in the developed world.',
      eyebrow: 'You just scanned a bed at the airport',
      body: 'Here is why, and what a bed and a washing machine can do about it.',
    },
    verdict: 'keep',
  },
  {
    route: '/checkout',
    audience: null,
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'no server-rendered heading inside <main> (client-rendered)',
    verdict: 'plumbing',
    why: 'Stripe checkout handoff',
  },
  {
    route: '/checkout/success',
    audience: null,
    access: 'open',
    leadsWithNow: {
      heading: 'Shop Beds',
      eyebrow: 'Our Products',
      body: 'Every purchase supports remote First Nations communities across Australia. Each bed diverts',
    },
    verdict: 'plumbing',
    why: 'Stripe return URL',
  },
  {
    route: '/claim/[asset_id]',
    audience: 'community',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'keep',
  },
  {
    route: '/communities',
    audience: 'community',
    access: 'open',
    leadsWithNow: {
      heading: 'Communities',
      eyebrow: 'Where the beds have gone',
      body: 'Every community where Goods on Country beds and washing machines are in homes.',
    },
    verdict: 'keep',
  },
  {
    route: '/communities/[slug]',
    audience: 'community',
    access: 'open',
    leadsWithNow: {
      heading: 'Maningrida',
      body: 'Maningrida sits on the banks of the Liverpool River in Arnhem Land. This diverse community of over 2,500 people from multiple language groups is a hub for Yolŋu and other First Nations art and culture. Goods partners with local organisations to deliver beds to families across the region.',
    },
    verdict: 'keep',
  },
  {
    route: '/community',
    audience: 'community',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/community/ideas',
    audience: 'community',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/community/ideas/new',
    audience: 'community',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/contact',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: {
      heading: 'Contact Us',
      eyebrow: 'Get in Touch',
      body: 'Have a question, partnership idea, or just want to say hello? We\'d love to hear from you.',
    },
    verdict: 'keep',
  },
  // /cost-story RETIRED 2026-08-06 (one-money-surface rule): it was a second full public
  // telling of the cost model. 307s to /pitch/road; archived at _archive/2026-08-06-cost-story.
  {
    route: '/dashboard',
    audience: 'community',
    // Gated 2026-08-06 (Ben: live revenue charts were on an open route). Investors cookie.
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'no server-rendered heading inside <main> (client-rendered)',
    verdict: 'keep',
  },
  {
    route: '/dashboard/feedback',
    audience: 'community',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'no server-rendered heading inside <main> (client-rendered)',
    verdict: 'keep',
  },
  {
    route: '/deck',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'The goal was never a bigger Goods.',
      eyebrow: 'The road to ownership · Updated',
      body: 'It is a community that can collect the plastic, make the goods, and come to own the making.',
    },
    verdict: 'redirect',
    target: '/pitch/road',
  },
  {
    route: '/design',
    audience: 'internal',
    access: 'open',
    leadsWithNow: {
      heading: '404',
    },
    verdict: 'retire',
    why: 'homepage mock, already 404s in production',
  },
  {
    route: '/design/community-voices',
    audience: 'internal',
    access: 'open',
    leadsWithNow: {
      heading: '404',
    },
    verdict: 'retire',
    why: 'homepage mock, already 404s in production',
  },
  {
    route: '/design/country-first',
    audience: 'internal',
    access: 'open',
    leadsWithNow: {
      heading: '404',
    },
    verdict: 'retire',
    why: 'homepage mock, already 404s in production',
  },
  {
    route: '/design/mission-forward',
    audience: 'internal',
    access: 'open',
    leadsWithNow: {
      heading: '404',
    },
    verdict: 'retire',
    why: 'homepage mock, already 404s in production',
  },
  {
    route: '/export/leave-behind',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'The goal was never a bigger Goods. It is a community that can collect the plastic, make the goods, and come to own the making.',
      body: 'Not a product company with a distribution problem. A menu a community picks from, and a route by which the making moves into their hands.',
    },
    verdict: 'keep',
  },
  {
    route: '/export/map/ask',
    audience: null,
    access: 'open',
    leadsWithNow: {
      heading: 'Who has asked for a plant of their own',
      body: 'Communities and organisations that have asked us about running their own production facility. This is interest voiced to us, not signed agreements and not orders.',
    },
    verdict: 'plumbing',
    why: 'chrome-free 1280x720 render target for deck screenshots',
  },
  {
    route: '/export/map/deployed',
    audience: null,
    access: 'open',
    leadsWithNow: {
      heading: 'Where the beds are',
      body: 'Every bed and every washing machine sitting in a community today, counted off the register.',
    },
    verdict: 'plumbing',
    why: 'chrome-free 1280x720 render target for deck screenshots',
  },
  {
    route: '/export/map/need',
    audience: null,
    access: 'open',
    leadsWithNow: {
      heading: 'What has been asked for, and what it would take',
      body: 'The beds communities have told us they want, with a ring on the places that also asked for a plant of their own. Recorded requests, never orders. Reference figures are Modelled.',
    },
    verdict: 'plumbing',
    why: 'chrome-free 1280x720 render target for deck screenshots',
  },
  {
    route: '/field-notes',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: {
      heading: 'Field notes',
      body: 'Stories from the road, with the communities we work alongside.',
    },
    verdict: 'keep',
  },
  {
    route: '/field-notes/[slug]',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'keep',
  },
  {
    route: '/funders/[slug]',
    audience: 'funder',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'keep',
  },
  {
    route: '/funders/[slug]/communities',
    audience: 'funder',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'keep',
  },
  {
    route: '/funders/[slug]/login',
    audience: null,
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'plumbing',
    why: 'a per-surface password gate',
  },
  {
    route: '/gallery',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: {
      heading: 'From Country',
      eyebrow: 'Gallery',
      body: 'Photos, stories, and videos from communities across Australia. Every image is shared with the storyteller\'s permission.',
    },
    verdict: 'keep',
  },
  {
    route: '/get-involved',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: {
      heading: 'Beds in homes.',
      eyebrow: 'Back the work',
      body: 'On the May 2026 Utopia trip we delivered 87 Stretch Beds in a single run. That is what backing this work looks like: a washable bed off the ground today, and the making of the next ones moving On Country tomorrow.',
    },
    verdict: 'keep',
  },
  {
    route: '/impact',
    audience: 'funder',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/impact/login',
    audience: null,
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'plumbing',
    why: 'a per-surface password gate',
  },
  {
    route: '/insiders',
    audience: 'funder',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/insiders/[...slug]',
    audience: 'funder',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/insiders/login',
    audience: null,
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'plumbing',
    why: 'a per-surface password gate',
  },
  {
    route: '/insights',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'Community Insights',
      eyebrow: 'Thematic Analysis',
      body: 'Understanding what communities are telling us, organised by theme. Every data point represents a real voice.',
    },
    verdict: 'keep',
  },
  {
    route: '/investors',
    audience: 'funder',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/investors/login',
    audience: null,
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'plumbing',
    why: 'a per-surface password gate',
  },
  {
    route: '/invest',
    audience: 'funder',
    access: 'open',
    // 2026-08-06 (Ben): the structural page /partner never was — the three entities as three
    // doors (ENTITY_DOORS, import-locked), which giver fits which door, and the levels the
    // work supports. Figures stay on /pitch/road; this page routes, /partner converses.
    leadsWithNow: {
      heading: 'Support communities where they are at. The bed is the entry point, never the whole point.',
      eyebrow: 'Back the work',
      body: 'One piece of work touches health, enterprise, young people and learning at once.',
    },
    verdict: 'keep',
  },
  {
    route: '/kit',
    audience: 'press',
    access: 'open',
    leadsWithNow: {
      heading: 'Grab what you need.',
      eyebrow: 'Partner asset kit',
      body: 'The May 2026 Utopia trip, repackaged into tools you can use for your own work: grant applications, board meetings, socials, and photos back to families. Pick a section, grab the asset, and put it to work.',
    },
    verdict: 'keep',
  },
  {
    route: '/login',
    audience: null,
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'no server-rendered heading inside <main> (client-rendered)',
    verdict: 'plumbing',
    why: 'the Supabase sign-in page',
  },
  {
    route: '/media',
    audience: 'press',
    access: 'open',
    leadsWithNow: {
      heading: 'Wordmark, voice, photos, voices, and links. Everything you need to write about the work.',
      eyebrow: 'Press & Brand',
      body: 'A good bed is health hardware, not furniture.',
    },
    verdict: 'retire',
    why: 'shadowed by the next.config /media -> /press rule and unreachable; open sweep item since ruling S',
  },
  {
    route: '/mission',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: {
      heading: 'Built with communities, not for them.',
      eyebrow: 'A good bed is health hardware, not furniture.',
      body: 'Beds, washing machines, and essential goods designed with remote Indigenous communities. Manufactured sustainably, eventually owned by them.',
    },
    verdict: 'redirect',
    target: '/story',
  },
  {
    route: '/my-items',
    audience: 'community',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/partner',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'Capital for beds now, washing machines next, and production moving to Country.',
      eyebrow: 'Back the work',
      body: 'Goods on Country builds essential health hardware with remote First Nations communities. The Stretch Bed is in market. Pakkimjalki Kari is in prototype. The next phase is the bridge from product proof to On-Country production and community ownership.',
    },
    verdict: 'keep',
  },
  {
    route: '/partners',
    audience: 'partner',
    access: 'open',
    leadsWithNow: {
      heading: 'Nine modules. You take the ones that are yours.',
      eyebrow: 'For delivery partners',
      body: 'Every pathway begins with what is already strong. The modules, pace, partners and ownership destination are decided with each community.',
    },
    verdict: 'keep',
  },
  {
    route: '/partners/[slug]/dashboard',
    audience: 'partner',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'keep',
  },
  {
    route: '/partners/[slug]/login',
    audience: null,
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'plumbing',
    why: 'a per-surface password gate',
  },
  {
    route: '/partners/[slug]/outcomes',
    audience: 'partner',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'keep',
  },
  {
    route: '/partners/centrecorp',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'The young people built the beds. One of them wanted to keep building.',
      body: 'Two days on Anmatyerr and Alyawarr Country, supported by Oonchiumpa and the Centrecorp Foundation. A delivery, and the start of something longer.',
    },
    verdict: 'keep',
  },
  {
    route: '/partners/oonchiumpa',
    audience: 'partner',
    access: 'open',
    leadsWithNow: {
      heading: 'Grounded by Oonchiumpa.',
      eyebrow: 'A long partnership',
      body: 'Oonchiumpa Consultancy is a 100% Aboriginal-owned business led by the Bloomfield family. The partnership has helped Goods work in the right way in Central Australia: with cultural advice, local relationships, young people involved in the build and a practical pathway into Utopia Homelands.',
    },
    verdict: 'keep',
  },
  {
    route: '/pathways',
    audience: 'community',
    access: 'open',
    leadsWithNow: {
      heading: 'Start with what a community wants. Build only what helps.',
      eyebrow: 'Community pathway workspace',
      body: 'One shared pathway for listening, choosing support, approving ownership, finding funding and learning together. Communities can choose one module, the complete facility, or nothing yet.',
    },
    verdict: 'keep',
  },
  {
    route: '/pathways/[id]',
    audience: 'community',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'keep',
  },
  {
    route: '/pathways/[id]/numbers',
    audience: 'community',
    // Gated 2026-08-06 (Ben): per-community cost numbers sit next to the rule that no
    // community reads its own price on a public page before seeing it in person.
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'keep',
  },
  {
    route: '/pitch',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'Beds off the ground, plastic out of landfill, manufacturing moving On Country.',
      eyebrow: 'Goods on Country',
      body: 'People are asking for beds that work in heat, dust, freight, and crowded houses.',
    },
    verdict: 'redirect',
    target: '/pitch/road',
  },
  {
    route: '/pitch/community-narrative',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'A bed off the ground is the first proof of a bigger transfer.',
      eyebrow: 'This is the community-narrative cut.',
      body: 'Goods is proving that community knowledge can become durable health hardware, local making, and production capability that moves closer to community ownership over time.',
    },
    verdict: 'keep',
  },
  {
    route: '/pitch/control-room',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'The whole story, told straight.',
      eyebrow: 'The pitch',
      body: 'Ten turns, told in the first person, the way it gets told in the room. Every voice is a real person, recorded on Country with their permission, and each quote says when. The photographs are from the deliveries and builds they show. Every number audits back to the public register. Updated',
    },
    verdict: 'redirect',
    target: '/pitch/road',
  },
  {
    route: '/pitch/deck',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'The whole story, told straight.',
      eyebrow: 'The pitch',
      body: 'Ten turns, told in the first person, the way it gets told in the room. Every voice is a real person, recorded on Country with their permission, and each quote says when. The photographs are from the deliveries and builds they show. Every number audits back to the public register. Updated',
    },
    verdict: 'redirect',
    target: '/pitch/road',
  },
  {
    route: '/news',
    audience: 'supporter',
    access: 'open',
    // 2026-08-06: the monthly letter, assembled ONLY from already-cleared, already-public
    // artifacts (news.ts). The email version is this page sent, so they cannot diverge.
    leadsWithNow: {
      heading: 'The making is proven',
      eyebrow: 'The letter',
      body: 'What happened in community, who is stepping up, and where the road to ownership is.',
    },
    verdict: 'keep',
  },
  {
    route: '/case-studies',
    audience: 'partner',
    access: 'open',
    // 2026-08-21: the index the [slug] route never had. Added once a SECOND proven run
    // (Alice Springs) published, because the comparison is the argument: Maningrida proves
    // the making, Alice proves the work. Same two readers as the packs. Counts derive from
    // COMMUNITY_BED_CANON; no dollar figures.
    leadsWithNow: {
      heading: 'How the runs actually worked',
      eyebrow: 'Case studies',
      body: 'One pack per proven run, told so another community can follow it.',
    },
    verdict: 'keep',
  },
  {
    route: '/case-studies/[slug]',
    audience: 'partner',
    access: 'open',
    // 2026-08-06: "how we did it" packs, one per PROVEN run (Maningrida first). Written for a
    // community/org asking "how would this work for us" and a funder asking "did this happen".
    // Counts derive from the register; quotes from cleared registry tiers; no dollar figures.
    leadsWithNow: {
      heading: 'Forty beds, pressed at the farm, assembled in community',
      eyebrow: 'Case study',
      body: 'A community-controlled organisation asked for beds and washing machines for homeland families.',
    },
    verdict: 'keep',
  },
  {
    route: '/pitch/onepager',
    audience: 'funder',
    access: 'open',
    // 2026-08-06: the sendable/printable one-page cut of the deck. Writes nothing new;
    // renders from canon, ask-surface and road-ending, so it cannot drift from /pitch/road.
    leadsWithNow: {
      heading: 'Goods on Country — one page',
      eyebrow: 'The road to ownership · one page',
      body: 'The numbers, the facility, the three ways in, on one printable page.',
    },
    verdict: 'keep',
  },
  {
    route: '/onepagers',
    audience: 'partner',
    access: 'open',
    // 2026-08-06 (Ben): the printable one-pager shelf. Screen chrome suppressed; each sheet
    // lands on one A4 page. Investor money stays with /pitch/onepager, linked not duplicated.
    leadsWithNow: {
      heading: 'One-pagers',
      eyebrow: 'Print and go',
      body: 'Each of these lands on a single A4 page from your browser’s print dialog (Cmd+P).',
    },
    verdict: 'keep',
  },
  {
    route: '/onepagers/goods',
    audience: 'partner',
    access: 'open',
    leadsWithNow: {
      heading: 'Plastic in, beds out, and the making moving On Country.',
      eyebrow: 'How it works · one page',
      body: 'Goods builds essential health hardware with remote First Nations communities.',
    },
    verdict: 'keep',
  },
  {
    route: '/onepagers/stretch-bed',
    audience: 'buyer',
    access: 'open',
    leadsWithNow: {
      heading: 'The Stretch Bed',
      eyebrow: 'The Stretch Bed · one page',
      body: 'A flat-packable, washable bed made from recycled plastic, heavy-duty canvas, and galvanised steel.',
    },
    verdict: 'keep',
  },
  {
    route: '/onepagers/facility',
    audience: 'partner',
    access: 'open',
    leadsWithNow: {
      heading: 'A factory that fits in shipping containers.',
      eyebrow: 'The production facility · one page',
      body: 'Waste plastic goes in one end, bed legs come out the other.',
    },
    verdict: 'keep',
  },
  {
    route: '/pitch/document',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'Beds off the ground, plastic out of landfill, manufacturing moving On Country.',
      eyebrow: 'Catalysing Impact, powered by Social Impact Hub, in partnership with QBE Foundation',
      body: 'People are asking for beds that work in heat, dust, freight, and crowded houses.',
    },
    verdict: 'keep',
  },
  {
    route: '/pitch/funder-pathways',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'Start with what a community says it needs.',
      eyebrow: 'Community chooses. We build the pathway.',
      body: 'Goods on Country turns a community request into a visible, priced pathway. Funders and customers resource it. Capability, assets, evidence and control stay with—or move toward—the community.',
    },
    verdict: 'keep',
  },
  {
    route: '/pitch/investor-lab',
    audience: 'internal',
    access: 'open',
    leadsWithNow: {
      heading: 'Brainstorm the pitch through story, place, proof, and investor belief.',
      body: 'Goods is proving a practical transfer: community knowledge becomes products that work, young people make them, and the plant can move closer to community ownership over time.',
    },
    verdict: 'redirect',
    target: '/admin/investor-lab',
  },
  {
    route: '/pitch/miro-board',
    audience: 'internal',
    access: 'open',
    leadsWithNow: {
      heading: 'Goods turns community knowledge into health hardware, local work, and production that communities can own.',
      eyebrow: 'Goods on Country',
      body: 'This line holds the whole pitch together: the bed, the plant, the young maker pathway, the plastic loop, and the ownership path.',
    },
    verdict: 'redirect',
    target: '/admin/miro-board',
  },
  {
    route: '/pitch/photo-review',
    audience: 'internal',
    access: 'open',
    leadsWithNow: {
      heading: 'A simple board for choosing the real photos and voices in the funder deck.',
      eyebrow: 'Deck photo and voice review',
      body: 'Use this to decide which images carry production, delivery, young makers, and community voice. The final check stays in Empathy Ledger or the canon board before the deck goes out.',
    },
    verdict: 'redirect',
    target: '/admin/deck-photo-review',
  },
  {
    route: '/pitch/road',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'The goal was never a bigger Goods.',
      eyebrow: 'The road to ownership · Updated',
      body: 'It is a community that can collect the plastic, make the goods, and come to own the making.',
    },
    verdict: 'keep',
  },
  {
    route: '/pitch/workshop',
    audience: 'internal',
    access: 'open',
    leadsWithNow: {
      heading: 'Build the pitch around community knowledge, proof, and the path to ownership.',
      eyebrow: 'Pitch workshop',
      body: 'Goods turns community knowledge into health hardware, local work, and production that communities can own.',
    },
    verdict: 'redirect',
    target: '/admin/pitch-workshop',
  },
  {
    route: '/portal',
    audience: 'partner',
    access: 'open',
    leadsWithNow: {
      heading: 'G\'day, partner',
      body: 'Your enterprise support system. What do you need?',
    },
    verdict: 'rewrite',
    why: 'partner.leadWith is "which of the nine modules is theirs, and which is ours". Leads "G\'day, partner / Your enterprise support system. What do you need?" The modules are never named.',
  },
  {
    route: '/portal/ask-goods',
    audience: 'partner',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'no server-rendered heading inside <main> (client-rendered)',
    verdict: 'keep',
  },
  {
    route: '/portal/goals',
    audience: 'partner',
    access: 'open',
    leadsWithNow: {
      heading: 'Where We\'re Heading',
      body: 'Your community\'s goals and aspirations',
    },
    verdict: 'rewrite',
    why: 'Partner surface that never names which of the nine modules is theirs.',
  },
  {
    route: '/portal/our-story',
    audience: 'partner',
    access: 'open',
    leadsWithNow: {
      heading: 'Our Story',
      body: 'Build your enterprise report',
    },
    verdict: 'rewrite',
    why: 'Partner surface that never names which of the nine modules is theirs.',
  },
  {
    route: '/portal/projects',
    audience: 'partner',
    access: 'open',
    leadsWithNow: {
      heading: 'Walk Together',
      body: 'Your enterprise projects and milestones',
    },
    verdict: 'rewrite',
    why: 'Partner surface that never names which of the nine modules is theirs.',
  },
  {
    route: '/press',
    audience: 'press',
    access: 'open',
    leadsWithNow: {
      heading: 'Wordmark, voice, photos, voices, and links. Everything you need to write about the work.',
      eyebrow: 'Press & Brand',
      body: 'A good bed is health hardware, not furniture.',
    },
    verdict: 'keep',
  },
  {
    route: '/privacy',
    audience: null,
    access: 'open',
    leadsWithNow: {
      heading: 'Privacy',
      eyebrow: 'Goods on Country',
      body: 'When you buy a bed, sign up for updates, contact us, or scan a Goods QR code, we collect what you give us: your name, email, phone number (if you share it), shipping address (if you order), and any message you send.',
    },
    verdict: 'plumbing',
    why: 'legal boilerplate',
  },
  {
    route: '/process',
    audience: 'buyer',
    access: 'open',
    leadsWithNow: {
      heading: 'From recycled plastic to a bed in a remote home.',
      eyebrow: 'How it’s made',
      body: 'Plastic gathered on Country. Pressed and cut inside a shipping-container factory. Built in five minutes by the family who’ll sleep on it.',
    },
    verdict: 'rewrite',
    why: 'Buyer surface leading with the making story rather than the specification.',
  },
  {
    route: '/data',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'Every number, with its status and its source.',
      eyebrow: 'The data',
      body: 'Register-verified delivered totals, measured ABS overcrowding beside each community served, and the recycled-plastic supply, each figure carrying its solidity label and primary source.',
    },
    verdict: 'keep',
  },
  {
    route: '/production',
    audience: 'operator',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/production/inventory',
    audience: 'operator',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/production/journal',
    audience: 'operator',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/production/progress',
    audience: 'operator',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/site',
    audience: 'operator',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/site/[siteId]',
    audience: 'operator',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/site/[siteId]/equipment',
    audience: 'operator',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/register',
    audience: 'funder',
    access: 'open',
    leadsWithNow: {
      heading: 'Every number we use in public, audited in the open.',
      eyebrow: 'The Register',
      body: 'This page is the register behind every claim Goods on Country makes to funders and the public: what each number is based on, whether it is measured or modelled, what it does',
    },
    verdict: 'keep',
  },
  {
    route: '/shop',
    audience: 'buyer',
    access: 'open',
    leadsWithNow: {
      heading: 'The straight answers, before the buy button.',
      eyebrow: 'The Stretch Bed',
      body: '188 × 92 × 25cm, 26kg, supports 200kg. Recycled HDPE X-trestle legs, two galvanised steel poles',
    },
    verdict: 'keep',
    why: 'Leads with the spec, per buyer.leadWith. PR #194 changed the heading to "The straight answers, before the buy button" over SHOP_ANSWERS in the ruled order. The re-read on 2026-08-02 found that INCOMPLETE and the verdict stayed rewrite one more round: the heading was right but the impact paragraph still sat between it and the answers, so production still served the impact story ahead of the spec, which is buyer.mustNeverSee verbatim. That paragraph moved below the answers in the same change as this flip. It is not deleted; the buyer still reads it, one screen after the lead time. VERIFY AFTER DEPLOY: re-run scripts/read-route-leads.mjs and confirm the body is the spec answer, because leadsWithNow is production truth and this record was written from the branch.',
  },
  {
    route: '/shop/[slug]',
    audience: 'buyer',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'retire',
    why: 'queries Supabase while products.ts is canon, and resolves nothing: zero inbound links, never shared',
  },
  {
    route: '/shop/stretch-bed-single',
    audience: 'buyer',
    access: 'open',
    leadsWithNow: {
      heading: 'The Stretch Bed',
      body: 'A flat-packable, washable bed designed for remote Australia. Made from recycled plastic, galvanised steel, and heavy-duty canvas.',
    },
    verdict: 'keep',
  },
  {
    route: '/shop/washing-machine',
    audience: 'buyer',
    access: 'open',
    leadsWithNow: {
      heading: 'Pakkimjalki Kari',
      body: 'Named in Warumungu language by Elder Dianne Stokes',
    },
    verdict: 'rewrite',
    why: 'Buyer surface leading with naming provenance rather than spec, price and lead time. The provenance is right and belongs one element lower.',
  },
  {
    route: '/sites/cost-lab',
    audience: 'internal',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/sites/cost-lab/playbook',
    audience: 'internal',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/sites/qbe',
    audience: 'funder',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/sites/qbe-readiness',
    audience: 'funder',
    access: 'gated',
    leadsWithNow: null,
    whyUnread: 'proxy-gated, the public response is the login page',
    verdict: 'keep',
  },
  {
    route: '/sponsor',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'no server-rendered heading inside <main> (client-rendered)',
    verdict: 'keep',
  },
  {
    route: '/stories',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: {
      heading: 'Community Stories',
      eyebrow: 'Community Voices',
      body: '“We’ve never been asked at what sort of house we’d like to live in.”',
    },
    verdict: 'keep',
  },
  {
    route: '/stories/[id]',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'keep',
  },
  {
    route: '/story',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: {
      heading: 'Built with communities, not for them.',
      eyebrow: 'A good bed is health hardware, not furniture.',
      body: 'Beds, washing machines, and essential goods designed with remote Indigenous communities. Manufactured sustainably, eventually owned by them.',
    },
    verdict: 'rewrite',
    why: 'supporter.mustNeverSee: "Aggregate impact language in place of a person." Leads "Built with communities, not for them / Beds, washing machines, and essential goods designed with remote Indigenous communities." No face, no voice, no place.',
  },
  {
    route: '/story/road',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: {
      heading: 'This is not a story in which Goods on Country arrives carrying the answer.',
      eyebrow: 'The Work That Stays',
      body: 'It is a story about people asking for ordinary things that work, and about a small project learning that a bed can be useful without being the end of the work. A bed can lift a body from the ground. A washing machine can bring the blanket home. A factory can turn discarded plastic into something a family needs.',
    },
    verdict: 'redirect',
    target: '/story',
  },
  {
    route: '/storytellers',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: {
      heading: 'Storytellers',
      eyebrow: 'Voices that shaped the work',
      body: 'Every storyteller whose voice shapes Goods on Country. Each profile holds their words, their stories, and where they appear across the project.',
    },
    verdict: 'keep',
  },
  {
    route: '/storytellers/[slug]',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'dynamic route with no nameable representative instance',
    verdict: 'keep',
  },
  {
    route: '/stretch-bed',
    audience: 'buyer',
    access: 'open',
    leadsWithNow: {
      heading: 'The Stretch Bed',
      body: 'A flat-packable, washable bed made from recycled plastic, heavy-duty canvas, and galvanised steel.',
    },
    verdict: 'keep',
  },
  {
    route: '/support',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'no server-rendered heading inside <main> (client-rendered)',
    verdict: 'keep',
  },
  {
    route: '/terms',
    audience: null,
    access: 'open',
    leadsWithNow: {
      heading: 'Terms',
      eyebrow: 'Goods on Country',
      body: 'Goods. is a social enterprise operated by A Curious Tractor Pty Ltd, which is the seller of record for anything you buy here. Goods on Country is a registered business name of The Butterfly Movement Ltd, the ACNC-registered charity that carries eligible giving. They are different legal entities. When this page says “we” or “us” it means us. When it says “you” it means you, the visitor or customer.',
    },
    verdict: 'plumbing',
    why: 'legal boilerplate',
  },
  {
    route: '/the-work',
    audience: 'supporter',
    access: 'open',
    leadsWithNow: {
      heading: 'Led by community.',
      eyebrow: 'The work',
      body: 'Community plastic waste is shredded, melted, and pressed into the legs. Recycled HDPE plastic, galvanised steel poles, and heavy-duty Australian canvas. 26kg, 200kg capacity, assembled in about five minutes with no tools.',
    },
    verdict: 'redirect',
    target: '/story',
  },
  {
    route: '/unauthorized',
    audience: null,
    access: 'open',
    leadsWithNow: null,
    whyUnread: 'no server-rendered heading inside <main> (client-rendered)',
    verdict: 'plumbing',
    why: 'access-denied page',
  },
  {
    route: '/wiki',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Goods Wiki & Knowledge Base',
      body: 'Everything you need to know about Goods on Country — from operating recycling plants to product guides, community support, and the full story.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/community/partner-guide',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Partner Guide',
      body: 'Everything you need to know about partnering with Goods on Country to deliver quality goods to remote communities.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/community/tracking-model',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Community Goods Tracking Model',
      body: 'How we track essential goods through their full lifecycle — from deployment to replacement — so communities get better products and less money leaks out.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/guides/operations',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Operations Handbook',
      body: 'Daily operations guide for managing orders, production, fleet, and community support.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/guides/recipient-handover',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Recipient handover script',
      body: 'What to say + do when handing a bed to the person who\'ll sleep on it. Tested language, not a corporate script. Adapt to the relationship + community.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/guides/story-templates',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Story Templates',
      body: 'Templates for creating impact stories in Empathy Ledger. All stories require consent from community members.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/manufacturing/facility-manual',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Travelling On-Country Plastic Re-Production Facility',
      eyebrow: 'v2.0 · March 2026',
      body: 'Operations, Safety & Training Manual',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/manufacturing/machine-specs',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Machine Specifications',
      body: 'Technical specs, operating parameters, safety notes, and maintenance schedules for every machine in the travelling production facility.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/manufacturing/plastic-processing',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Plastic Processing Guide',
      body: 'From collection to finished sheet — everything you need to know about processing recycled HDPE plastic in the on-country production facility.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/manufacturing/safety-briefing',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Plant safety briefing',
      body: 'What new operators read before stepping onto the production floor. Hazards, PPE, emergency response, daily checks.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/manufacturing/throughput',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'How Throughput Works',
      body: 'The one number that drives every cost, margin, and capacity decision.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/products',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Products',
      body: 'Complete guides for all Goods on Country products. Each guide includes specifications, assembly instructions, maintenance procedures, and troubleshooting.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/products/stretch-bed',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'The Stretch Bed',
      body: 'A washable, flat-packable bed made from recycled plastic, heavy-duty canvas, and galvanised steel. Designed with communities for extreme durability.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/products/washing-machine',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Pakkimjalki Kari',
      body: 'Commercial-grade Speed Queen in recycled plastic housing. Named in Warumungu language by Elder Dianne Stokes.',
    },
    verdict: 'keep',
  },
  {
    route: '/wiki/support/faq',
    audience: 'operator',
    access: 'open',
    leadsWithNow: {
      heading: 'Frequently Asked Questions',
      body: 'Common questions about Goods on Country products, ordering, and community support.',
    },
    verdict: 'keep',
  },
];

// ---------------------------------------------------------------------------
// Derived. None of this is a field, so none of it can drift from the model.
// ---------------------------------------------------------------------------

/**
 * What this route SHOULD lead with. There is one lead per audience and it lives in `audience.ts`,
 * so changing `buyer.leadWith` moves every buyer route at once and the audience model stays
 * load-bearing rather than decorative. Null for plumbing, which serves no reader.
 */
export function shouldLeadWith(r: RouteAudience): string | null {
  return r.audience === null ? null : audience(r.audience).leadWith;
}

/** Every route serving an audience. Replaces the hand-authored `servedBy` that drifted. */
export function servedByRoutes(id: AudienceId): RouteAudience[] {
  return ROUTE_AUDIENCES.filter((r) => r.audience === id);
}

export function routeAudience(route: string): RouteAudience | undefined {
  return ROUTE_AUDIENCES.find((r) => r.route === route);
}

/** The headline number: live pages serving the right reader and leading with the wrong thing. */
export function rewrites(): RouteAudience[] {
  return ROUTE_AUDIENCES.filter((r) => r.verdict === 'rewrite');
}

/** Routes whose lead could not be read, and are therefore exempt from the comparison. */
export function unread(): RouteAudience[] {
  return ROUTE_AUDIENCES.filter((r) => r.leadsWithNow === null && r.verdict !== 'plumbing');
}

/** Audiences with nowhere to send anyone. Counted on every run so a known gap stays visible. */
export function audiencesWithoutFrontDoor(): AudienceId[] {
  return AUDIENCES.filter((a) => a.frontDoor === null).map((a) => a.id);
}
