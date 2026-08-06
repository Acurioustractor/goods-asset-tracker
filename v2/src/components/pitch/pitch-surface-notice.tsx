/**
 * Signposting for the pitch surfaces.
 *
 * The problem this solved (2026-07-25): there were eleven /pitch/* routes plus /deck, and none of
 * them said which one to send to a funder. Every route reads from canon.ts so none of them are
 * WRONG, which is exactly why the sprawl was hard to notice. The fix is a pointer, not a warning.
 *
 * ---------------------------------------------------------------------------
 * THE CORRECTION, 2026-08-04
 * ---------------------------------------------------------------------------
 * This file used to hardcode `/pitch/funder-pathways` as the canonical funder surface. By then
 * three other places said otherwise and agreed with each other: ruling R named `/pitch/road` THE
 * deck, `audience.ts` set `funder.frontDoor` to `/pitch/road`, and `next.config` redirected seven
 * pitch routes there. So the supporting surfaces were signposting funders AWAY from the front
 * door, which is the exact failure the component was written to prevent.
 *
 * It now reads the front door out of `audience.ts` instead of restating it. A hardcoded constant
 * is what drifted; a lookup cannot. If the funder front door ever moves, it moves in one place and
 * every notice follows.
 *
 * The three surviving supporting surfaces are APPENDICES to the deck, not alternatives to it:
 *   /pitch/funder-pathways   how a request becomes a priced pathway
 *   /pitch/community-narrative  the storyteller cut
 *   /pitch/document          the long-form written version
 * Each answers a question the deck raises. None of them is a front door.
 */

import { audience } from '@/lib/data/audience';

/** Never restated here. `audience.ts` is where a front door is decided. */
const FUNDER_FRONT_DOOR = audience('funder').frontDoor ?? '/pitch/road';

export function CanonicalPitchNotice() {
  return <OtherPitchSurfaceNotice note="This is the funder pathways appendix." />;
}

export function OtherPitchSurfaceNotice({ note }: { note?: string }) {
  return (
    <div className="border-b border-goods-sand bg-[#efe8dc] px-5 py-2.5 text-center">
      <p className="text-xs leading-5 text-[#6b5f4c]">
        {note ? `${note} ` : 'This is a supporting pitch surface. '}
        It is an appendix to the deck. The one to send a funder is{' '}
        <a
          href={FUNDER_FRONT_DOOR}
          className="font-semibold underline decoration-goods-clay underline-offset-2"
        >
          {FUNDER_FRONT_DOOR}
        </a>
        .
      </p>
    </div>
  );
}
