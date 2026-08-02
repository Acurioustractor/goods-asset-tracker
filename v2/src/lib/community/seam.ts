/**
 * The community identity seam. One place, two databases, one map.
 *
 * Goods owns facilities, assets, operators, shifts, production, inventory and
 * maintenance. Empathy Ledger owns people, consent, stories, themes and the
 * relationship stage. Neither reaches into the other's tables. This file is the
 * only thing that says "this Goods community and that EL community are the same
 * place", and `npm run check:community-seam` asserts every row still resolves
 * on both sides.
 *
 * WHY IT IS WRITTEN OUT RATHER THAN JOINED ON SLUG:
 * EL's Goods seed named two of the seven 'kalgoorlie-community' and
 * 'tennant-creek-community'. Goods calls them 'kalgoorlie' and 'tennant-creek'.
 * A slug join matches five, drops two, and reports nothing. Verified against
 * both live databases 2026-08-02.
 *
 * Mirrored in migration 20260802120000_community_el_link.sql. The guard reads
 * BOTH and fails if they disagree, so neither can drift alone.
 */

export interface CommunitySeamEntry {
  /** Goods communities.id (slug PK). */
  goodsId: string;
  /** Empathy Ledger public.communities.id (uuid PK). */
  elCommunityId: string;
  /** EL's display name, kept here only so the guard can report a mismatch legibly. */
  elName: string;
  /** Why this pairing is safe to assert. */
  note?: string;
}

export const COMMUNITY_SEAM: readonly CommunitySeamEntry[] = [
  {
    goodsId: 'alice-springs',
    elCommunityId: 'c0a10001-0000-0000-0000-000000000001',
    elName: 'Alice Springs',
  },
  {
    goodsId: 'palm-island',
    elCommunityId: 'c0a20002-0000-0000-0000-000000000001',
    elName: 'Palm Island',
  },
  {
    goodsId: 'utopia',
    elCommunityId: 'a1461377-945d-40ba-861e-2ed358e560da',
    elName: 'Utopia',
    note: 'Goods calls it "Utopia Homelands", EL calls it "Utopia". Same place; the names differ, which is exactly why the map is by id.',
  },
  {
    goodsId: 'tennant-creek',
    elCommunityId: 'e92ffa29-b0c1-496e-9ba1-4299b72ade05',
    elName: 'Tennant Creek',
    note: 'EL slug is "tennant-creek-community". A slug join would silently drop this row.',
  },
  {
    goodsId: 'maningrida',
    elCommunityId: '4a96d728-422b-4811-ba4f-912b49cf9eaf',
    elName: 'Maningrida',
  },
  {
    goodsId: 'kalgoorlie',
    elCommunityId: '4bd1b241-8def-4c71-af77-6f87ab76360c',
    elName: 'Kalgoorlie',
    note: 'EL slug is "kalgoorlie-community". A slug join would silently drop this row.',
  },
  {
    goodsId: 'darwin',
    elCommunityId: 'eee42a8b-54c5-4140-a50e-309e9847bf7e',
    elName: 'Darwin',
    note: 'Goods holds Darwin as administrative, EL as exploring. Mapped so the ids stay tied; neither status is overwritten by the other.',
  },
] as const;

/** The Goods organisation as EL knows it. Scopes every relationship lookup. */
export const EL_GOODS_ORGANIZATION_ID = 'c312323e-02d4-493c-8b5f-9f9b15e2b46a';

/**
 * The EL service Goods offers a community. EL renders Goods underneath this;
 * Goods never renders it. Empty until the service record exists in EL.
 */
export const EL_GOODS_SERVICE_NAME = 'Production Facility Support';

const byGoodsId = new Map(COMMUNITY_SEAM.map((e) => [e.goodsId, e]));
const byElId = new Map(COMMUNITY_SEAM.map((e) => [e.elCommunityId, e]));

export function elIdForCommunity(goodsId: string): string | undefined {
  return byGoodsId.get(goodsId)?.elCommunityId;
}

export function communityIdForEl(elCommunityId: string): string | undefined {
  return byElId.get(elCommunityId)?.goodsId;
}

/**
 * Relationship stages as EL defines them, in order. Goods reads these; it never
 * writes them, because the stage is a statement about a relationship EL governs.
 */
export const EL_RELATIONSHIP_STAGES = [
  'exploring',
  'invited',
  'active',
  'established',
  'community_led',
  'paused',
  'ended',
] as const;

export type ElRelationshipStage = (typeof EL_RELATIONSHIP_STAGES)[number];
